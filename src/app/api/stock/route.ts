import { NextResponse } from 'next/server';
import { getDB, saveDB, getAvailableToPromise } from '@/lib/db';

export async function GET() {
  const db = getDB();
  const variantRows: any[] = [];

  for (const product of db.products) {
    for (const v of product.variants) {
      const atp = getAvailableToPromise(v);
      variantRows.push({
        productId: product.id,
        productTitle: product.title,
        productStatus: product.status,
        variantId: v.id,
        sku: v.sku,
        size: v.size,
        color: v.color,
        price: v.price,
        costPrice: v.costPrice,
        onHand: v.onHand,
        reserved: v.reserved,
        allocated: v.allocated,
        unavailable: v.unavailable,
        incoming: v.incoming,
        availableToPromise: atp,
        available: atp,
        lowStockThreshold: v.lowStockThreshold,
        reorderPoint: v.lowStockThreshold,
        damaged: v.unavailable,
        qcHold: 0,
        isLowStock: atp <= v.lowStockThreshold,
      });
    }
  }

  return NextResponse.json({
    variants: variantRows,
    warehouses: db.warehouses,
    suppliers: db.suppliers,
    purchaseOrders: db.purchaseOrders,
    stockMovements: db.stockMovements.slice(0, 60),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDB();
    const now = new Date().toISOString();

    if (body.action === 'adjust_stock') {
      const {
        productId,
        variantId,
        sku,
        adjustmentType,
        type,
        qtyDelta,
        deltaQty,
        reason,
        warehouseId = 'wh_blr_main',
      } = body;
      if (!reason || reason.trim().length < 3) {
        return NextResponse.json(
          { error: 'An explicit audit reason is required for all stock adjustments.' },
          { status: 400 }
        );
      }

      let product = productId ? db.products.find((p) => p.id === productId) : undefined;
      let variant = product?.variants.find((v) => v.id === variantId || v.sku === sku);
      if (!product || !variant) {
        for (const p of db.products) {
          const foundV = p.variants.find(
            (v) =>
              (sku && v.sku.toLowerCase() === String(sku).trim().toLowerCase()) ||
              (variantId && v.id === variantId)
          );
          if (foundV) {
            product = p;
            variant = foundV;
            break;
          }
        }
      }

      if (!product || !variant) {
        return NextResponse.json({ error: 'Variant / SKU not found' }, { status: 404 });
      }

      const adjType = adjustmentType || type || 'count_correction';
      const delta = Number(qtyDelta ?? deltaQty) || 0;
      if (adjType === 'damage' || adjType === 'return_quarantine' || adjType === 'qc_hold') {
        variant.unavailable = Math.max(0, variant.unavailable + Math.abs(delta));
      } else if (adjType === 'restock_from_quarantine') {
        const releaseQty = Math.min(variant.unavailable, Math.abs(delta));
        variant.unavailable -= releaseQty;
      } else {
        variant.onHand = Math.max(0, variant.onHand + delta);
      }

      db.stockMovements.unshift({
        id: `mov_${Date.now()}`,
        timestamp: now,
        sku: variant.sku,
        productId: product.id,
        variantId: variant.id,
        warehouseId,
        type: adjType as any,
        qtyDelta: delta,
        reason,
        actor: 'superadmin@store.com',
      });

      db.auditLogs.unshift({
        id: `aud_${Date.now()}`,
        timestamp: now,
        actor: 'superadmin@store.com',
        action: 'stock.adjust',
        entityType: 'variant',
        entityId: variant.sku,
        summary: `Stock ${adjType} (${delta > 0 ? '+' : ''}${delta}) on ${variant.sku}: ${reason}`,
      });

      saveDB(db);
      return NextResponse.json({ success: true });
    }

    if (body.action === 'transfer_stock') {
      const { sku, fromWarehouseId = 'wh_blr_main', toWarehouseId = 'wh_mum_studio', qty = 5, reason = 'Inter-warehouse replenishment transfer' } = body;
      let targetProduct = db.products[0];
      let targetVariant = targetProduct.variants[0];
      for (const p of db.products) {
        const v = p.variants.find((vr) => vr.sku.toLowerCase() === String(sku || '').trim().toLowerCase());
        if (v) {
          targetProduct = p;
          targetVariant = v;
          break;
        }
      }
      const transferQty = Math.max(1, Number(qty) || 5);
      db.stockMovements.unshift({
        id: `mov_${Date.now()}_xfer`,
        timestamp: now,
        sku: targetVariant.sku,
        productId: targetProduct.id,
        variantId: targetVariant.id,
        warehouseId: `${fromWarehouseId} -> ${toWarehouseId}`,
        type: 'transfer',
        qtyDelta: transferQty,
        reason: `${reason} (${fromWarehouseId} → ${toWarehouseId})`,
        actor: 'superadmin@store.com',
      });
      db.auditLogs.unshift({
        id: `aud_${Date.now()}`,
        timestamp: now,
        actor: 'superadmin@store.com',
        action: 'stock.transfer',
        entityType: 'variant',
        entityId: targetVariant.sku,
        summary: `Transferred ${transferQty} units of ${targetVariant.sku} from ${fromWarehouseId} to ${toWarehouseId}.`,
      });
      saveDB(db);
      return NextResponse.json({ success: true, stockMovements: db.stockMovements.slice(0, 60) });
    }

    if (body.action === 'create_po') {
      const sup = db.suppliers.find((s) => s.id === body.supplierId) || db.suppliers[0];
      const newPo = {
        id: `po_${Date.now()}`,
        poNumber: `PO-2026-${100 + db.purchaseOrders.length}`,
        supplierId: sup.id,
        supplierName: sup.name,
        warehouseId: body.warehouseId || 'wh_blr_main',
        status: 'ordered',
        expectedDate: body.expectedDate || '2026-10-12',
        items: [
          {
            sku: body.sku || 'KRG-SH-MLC-CH-M',
            title: body.itemTitle || 'Malabar Linen-Cotton Shirt',
            orderedQty: Number(body.orderedQty) || 25,
            receivedQty: 0,
            damagedQty: 0,
            unitCost: Number(body.unitCost) || 640,
          },
        ],
        totalCost: (Number(body.orderedQty) || 25) * (Number(body.unitCost) || 640),
        createdAt: now,
      };
      db.purchaseOrders.unshift(newPo);
      saveDB(db);
      return NextResponse.json({ success: true, purchaseOrders: db.purchaseOrders });
    }

    if (body.action === 'receive_po') {
      const po = db.purchaseOrders.find((p) => p.id === body.poId);
      if (!po) return NextResponse.json({ error: 'PO not found' }, { status: 404 });
      po.status = 'received';
      for (const item of po.items) {
        const addQty = item.orderedQty - item.receivedQty;
        item.receivedQty = item.orderedQty;
        // Find matching SKU across products and add to onHand
        for (const prod of db.products) {
          const v = prod.variants.find((vr) => vr.sku === item.sku);
          if (v && addQty > 0) {
            v.onHand += addQty;
            v.incoming = Math.max(0, v.incoming - addQty);
            db.stockMovements.unshift({
              id: `mov_${Date.now()}_${item.sku}`,
              timestamp: now,
              sku: v.sku,
              productId: prod.id,
              variantId: v.id,
              warehouseId: po.warehouseId,
              type: 'receipt',
              qtyDelta: addQty,
              reason: `Received against Purchase Order ${po.poNumber}`,
              actor: 'warehouse.del@karigarstore.in',
            });
          }
        }
      }
      saveDB(db);
      return NextResponse.json({ success: true, purchaseOrders: db.purchaseOrders });
    }

    return NextResponse.json({ error: 'Invalid stock action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Stock operation failed' }, { status: 500 });
  }
}
