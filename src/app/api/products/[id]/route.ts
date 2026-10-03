import { NextResponse } from 'next/server';
import { getDB, saveDB, getAvailableToPromise } from '@/lib/db';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const db = getDB();
  const product = db.products.find((p) => p.id === id || p.slug === id);
  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const totalAvailable = product.variants.reduce(
    (sum, v) => sum + getAvailableToPromise(v),
    0
  );
  return NextResponse.json({
    ...product,
    stock: totalAvailable,
  });
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await request.json();
  const db = getDB();
  const index = db.products.findIndex((p) => p.id === id || p.slug === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const existing = db.products[index];
  const now = new Date().toISOString();
  const nextRev = (existing.revision || 1) + 1;

  // If simple stock number was passed, update the first variant's onHand
  let updatedVariants = body.variants || existing.variants;
  if (typeof body.stock === 'number' && !body.variants && updatedVariants.length > 0) {
    updatedVariants = updatedVariants.map((v: any, idx: number) =>
      idx === 0
        ? { ...v, onHand: body.stock + v.reserved + v.allocated + v.unavailable }
        : v
    );
  }

  // If price changed, also sync variants that matched the base price
  const incomingPrice = body.price !== undefined ? body.price : body.sellingPrice;
  const newPrice = incomingPrice !== undefined ? Number(incomingPrice) : existing.price;
  const newMrp = body.mrp !== undefined ? Number(body.mrp) : Math.max(existing.mrp, newPrice);
  if (incomingPrice !== undefined && !body.variants) {
    updatedVariants = updatedVariants.map((v: any) => ({
      ...v,
      price: newPrice,
      mrp: newMrp,
    }));
  }

  const updated = {
    ...existing,
    ...body,
    id: existing.id,
    price: newPrice,
    mrp: newMrp,
    variants: updatedVariants,
    updatedAt: now,
    revision: nextRev,
    history: [
      {
        revision: nextRev,
        actor: 'superadmin@store.com',
        timestamp: now,
        summary: body.changeSummary || `Updated product fields (Revision #${nextRev}).`,
      },
      ...(existing.history || []),
    ],
  };

  db.products[index] = updated;
  db.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    timestamp: now,
    actor: 'superadmin@store.com',
    action: 'product.update',
    entityType: 'product',
    entityId: existing.id,
    summary: `Updated product "${updated.title}" (Rev #${nextRev}).`,
  });
  saveDB(db);

  const totalAvailable = updated.variants.reduce(
    (sum: number, v: any) => sum + getAvailableToPromise(v),
    0
  );
  return NextResponse.json({
    ...updated,
    stock: totalAvailable,
  });
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const db = getDB();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  // Check if product is referenced in historical orders: if so, archive rather than hard delete (Blueprint Section 5.1)
  const isOrdered = db.orders.some((o) =>
    o.lines.some((l) => l.productId === id)
  );
  if (isOrdered) {
    db.products[index].status = 'archived';
    db.products[index].updatedAt = new Date().toISOString();
    saveDB(db);
    return NextResponse.json({
      success: true,
      archivedInsteadOfDeleted: true,
      message: 'Product is linked to historical orders and has been safely archived.',
    });
  }
  db.products = db.products.filter((p) => p.id !== id);
  saveDB(db);
  return NextResponse.json({ success: true });
}