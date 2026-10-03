import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const db = getDB();
  const order = db.orders.find(
    (o) => o.id === id || o.orderNumber === id || o.accessToken === id
  );
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
  return NextResponse.json(order);
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await request.json();
  const db = getDB();
  const order = db.orders.find((o) => o.id === id || o.orderNumber === id);
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  const now = new Date().toISOString();
  const { command, actor = 'superadmin@store.com', reason = '' } = body;

  if (command === 'verify_manual_upi') {
    order.manualPaymentStatus = 'verified';
    order.paymentStatus = 'captured';
    order.acceptanceStatus = 'confirmed';
    order.fulfilmentStatus = 'allocated';
    order.shipmentStatus = 'label_pending';
    order.customerSummaryStatus = 'Payment Verified — Order Confirmed & Allocated for Packing';
    order.invoiceNumber = order.invoiceNumber || `INV-2627-${order.orderNumber.slice(-4)}`;
    order.invoiceIssuedAt = now;
    if (order.manualUpiClaim) {
      order.manualUpiClaim.verifiedBy = actor;
      order.manualUpiClaim.verifiedAt = now;
      order.manualUpiClaim.verificationNote = body.verificationNote || 'Matched against HDFC Merchant Bank Statement';
      order.manualUpiClaim.bankStatementMatchId = body.bankStatementMatchId || `STMT-${Date.now().toString().slice(-6)}`;
    }
    order.lines.forEach((l) => {
      l.qtyAllocated = l.qtyOrdered - l.qtyCancelled;
    });
    order.timeline.unshift({
      id: `ev_${Date.now()}`,
      timestamp: now,
      dimension: 'manual_payment',
      fromState: 'submitted',
      toState: 'verified',
      actor,
      reason: reason || `Verified UPI UTR ${order.manualUpiClaim?.utrReference} against bank statement.`,
      source: 'admin',
    });
    db.analytics.businessTruth.manualUpiAwaitingVerification = Math.max(
      0,
      db.analytics.businessTruth.manualUpiAwaitingVerification - order.grandTotal
    );
    db.analytics.businessTruth.cashReceiptsVerified += order.grandTotal;
    db.analytics.businessTruth.confirmedMerchandiseSales += order.subtotal - order.discountTotal;
  } else if (command === 'reject_manual_upi') {
    order.manualPaymentStatus = body.mismatch ? 'amount_mismatch' : 'rejected';
    order.acceptanceStatus = 'on_hold';
    order.customerSummaryStatus = body.mismatch
      ? 'Payment on hold: Amount mismatch detected — Support team notified'
      : 'UPI reference could not be verified — please check UTR or contact support';
    order.timeline.unshift({
      id: `ev_${Date.now()}`,
      timestamp: now,
      dimension: 'manual_payment',
      fromState: 'submitted',
      toState: order.manualPaymentStatus,
      actor,
      reason: reason || 'UTR not found in bank statement credit entries.',
      source: 'admin',
    });
  } else if (command === 'pack_order') {
    order.fulfilmentStatus = 'packed';
    order.shipmentStatus = 'label_pending';
    order.invoiceNumber = order.invoiceNumber || `INV-2627-${order.orderNumber.slice(-4)}`;
    order.invoiceIssuedAt = order.invoiceIssuedAt || now;
    order.lines.forEach((l) => {
      l.qtyPacked = l.qtyOrdered - l.qtyCancelled;
    });
    order.customerSummaryStatus = 'Packed & Inspected at New Delhi Studio — Awaiting Courier Handover';
    order.timeline.unshift({
      id: `ev_${Date.now()}`,
      timestamp: now,
      dimension: 'fulfilment',
      fromState: 'allocated',
      toState: 'packed',
      actor,
      reason: reason || 'Scanned SKUs, packed in reusable cloth tote, printed GST invoice.',
      source: 'admin',
    });
  } else if (command === 'book_shipment') {
    const carrierName = body.carrierName || 'BlueDart Priority';
    const awbNumber = body.awbNumber || `BD${Date.now().toString().slice(-8)}IN`;
    order.fulfilmentStatus = 'fulfilled';
    order.shipmentStatus = 'in_transit';
    order.lines.forEach((l) => {
      l.qtyShipped = l.qtyOrdered - l.qtyCancelled;
    });
    order.shipment = {
      carrierName,
      awbNumber,
      trackingUrl:
        body.trackingUrl || `https://www.bluedart.com/tracking?awb=${awbNumber}`,
      bookedAt: now,
      pickedUpAt: now,
      estimatedDelivery: body.estimatedDelivery || 'In 2–4 business days',
      weightGrams: Number(body.weightGrams) || 450,
      actualCarrierCost: Number(body.actualCarrierCost) || 85,
    };
    order.customerSummaryStatus = `Shipped via ${carrierName} (AWB: ${awbNumber})`;
    order.timeline.unshift({
      id: `ev_${Date.now()}`,
      timestamp: now,
      dimension: 'shipment',
      fromState: 'label_pending',
      toState: 'in_transit',
      actor,
      reason: `Dispatched with ${carrierName}, AWB ${awbNumber}`,
      source: 'admin',
    });
  } else if (command === 'mark_delivered') {
    order.shipmentStatus = 'delivered';
    if (order.shipment) {
      order.shipment.deliveredAt = now;
    }
    if (order.paymentMethod === 'cod') {
      order.codStatus = 'collected';
    }
    order.customerSummaryStatus = `Delivered on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    order.timeline.unshift({
      id: `ev_${Date.now()}`,
      timestamp: now,
      dimension: 'shipment',
      fromState: 'in_transit',
      toState: 'delivered',
      actor,
      reason: reason || 'Delivery confirmed by courier POD.',
      source: 'admin',
    });
  } else if (command === 'remit_cod') {
    order.codStatus = 'remitted';
    order.paymentStatus = 'captured';
    order.timeline.unshift({
      id: `ev_${Date.now()}`,
      timestamp: now,
      dimension: 'cod_settlement',
      fromState: 'collected',
      toState: 'remitted',
      actor,
      reason: reason || 'COD cash remitted by courier to merchant bank account.',
      source: 'admin',
    });
    db.analytics.businessTruth.codPendingRemittance = Math.max(
      0,
      db.analytics.businessTruth.codPendingRemittance - order.grandTotal
    );
    db.analytics.businessTruth.cashReceiptsVerified += order.grandTotal;
  } else if (command === 'flag_ndr') {
    order.shipmentStatus = 'delivery_failed';
    if (order.shipment) {
      order.shipment.ndrReason = body.ndrReason || 'Customer unreachable on phone / premises locked';
    }
    order.customerSummaryStatus = 'Delivery Attempt Failed (NDR) — Please confirm address/reattempt window';
    order.timeline.unshift({
      id: `ev_${Date.now()}`,
      timestamp: now,
      dimension: 'shipment',
      fromState: 'out_for_delivery',
      toState: 'delivery_failed',
      actor,
      reason: body.ndrReason || 'NDR exception logged from courier feed.',
      source: 'admin',
    });
  } else if (command === 'cancel_order') {
    if (order.shipmentStatus === 'delivered' || order.shipmentStatus === 'in_transit') {
      return NextResponse.json(
        { error: 'Cannot cancel an order that has already been shipped or delivered. Use Returns/RTO workflow.' },
        { status: 400 }
      );
    }
    order.acceptanceStatus = 'cancelled';
    order.fulfilmentStatus = 'cancelled';
    order.shipmentStatus = 'cancelled';
    order.customerSummaryStatus = 'Order Cancelled — Stock released to inventory';
    // Restore stock for unshipped items
    for (const line of order.lines) {
      const rem = line.qtyOrdered - line.qtyShipped - line.qtyCancelled;
      if (rem > 0) {
        line.qtyCancelled += rem;
        const prod = db.products.find((p) => p.id === line.productId);
        const variant = prod?.variants.find((v) => v.id === line.variantId);
        if (variant) {
          variant.onHand += rem;
        }
      }
    }
    order.timeline.unshift({
      id: `ev_${Date.now()}`,
      timestamp: now,
      dimension: 'acceptance',
      fromState: 'confirmed',
      toState: 'cancelled',
      actor,
      reason: reason || 'Cancelled prior to shipment handoff.',
      source: body.source || 'customer',
    });
  }

  order.updatedAt = now;
  db.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    timestamp: now,
    actor,
    action: `order.${command}`,
    entityType: 'order',
    entityId: order.id,
    summary: `Executed ${command} on Order ${order.orderNumber}.`,
  });

  saveDB(db);
  return NextResponse.json(order);
}
