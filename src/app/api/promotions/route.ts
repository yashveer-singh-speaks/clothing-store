import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';

export async function GET() {
  const db = getDB();
  return NextResponse.json({ promotions: db.promotions });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDB();

    if (body.action === 'create') {
      const rawType = body.type || body.discountType || 'fixed_amount';
      const normalizedType =
        rawType === 'flat' ? 'fixed_amount' : rawType === 'percent' ? 'percentage' : rawType;
      const rawValue = Number(body.value ?? body.discountValue) || 250;
      const rawMinOrder = Number(body.minOrderAmount ?? body.minCartSubtotal) || 1499;
      const newPromo = {
        id: `promo_${Date.now()}`,
        code: (body.code || `SAVE${Date.now().toString().slice(-3)}`).toUpperCase(),
        title: body.title || 'Seasonal Store Offer',
        description: body.description || 'Transparent discount applied at checkout.',
        type: normalizedType as 'percentage' | 'fixed_amount' | 'free_shipping',
        value: rawValue,
        minOrderAmount: rawMinOrder,
        maxDiscountCap: Number(body.maxDiscountCap) || rawValue || 500,
        autoApply: Boolean(body.autoApply),
        stackableWithFreeShipping: true,
        usageLimit: Number(body.usageLimit) || 500,
        usedCount: 0,
        enabled: true,
        startsAt: new Date().toISOString(),
        endsAt: '2026-12-31T23:59:59+05:30',
      };
      db.promotions.unshift(newPromo);
      saveDB(db);
      return NextResponse.json({ success: true, promotions: db.promotions });
    }

    if (body.action === 'toggle') {
      const promo = db.promotions.find((p) => p.id === body.promoId);
      if (!promo) return NextResponse.json({ error: 'Promotion not found' }, { status: 404 });
      promo.enabled = !promo.enabled;
      saveDB(db);
      return NextResponse.json({ success: true, promotions: db.promotions });
    }

    return NextResponse.json({ error: 'Invalid promotion action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Promotion operation failed' }, { status: 500 });
  }
}
