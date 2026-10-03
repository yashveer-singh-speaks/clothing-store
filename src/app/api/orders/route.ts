import { NextResponse } from 'next/server';
import { getDB, saveDB, getAvailableToPromise, calculateServerQuote } from '@/lib/db';
import { OrderSchema } from '@/lib/validations';
import { OrderRecord } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  const db = getDB();

  if (token) {
    const order = db.orders.find((o) => o.accessToken === token || o.id === token || o.orderNumber === token);
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json(order);
  }

  if (email) {
    const orders = db.orders.filter(
      (o) => o.customer.email.toLowerCase() === email.toLowerCase()
    );
    return NextResponse.json(orders);
  }

  return NextResponse.json(db.orders);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = OrderSchema.parse(body);
    const db = getDB();
    const now = new Date().toISOString();

    // Idempotency protection (Section 7.2 & 26.4)
    if (validated.idempotencyKey) {
      const existing = db.orders.find((o) => o.idempotencyKey === validated.idempotencyKey);
      if (existing) {
        return NextResponse.json(existing);
      }
    }

    // Normalize items (supports both { id, quantity } from legacy tests and { productId, variantId, quantity } from storefront)
    const normalizedItems = validated.items.map((item) => ({
      productId: item.productId || item.id || '',
      variantId: item.variantId,
      quantity: item.quantity,
    }));

    // Step 1: Verify stock availability across all requested items before mutating
    for (const item of normalizedItems) {
      const product = db.products.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 400 }
        );
      }
      const variant =
        (item.variantId && product.variants.find((v) => v.id === item.variantId)) ||
        product.variants[0];
      if (!variant) {
        return NextResponse.json(
          { error: `Variant for ${product.title} not found` },
          { status: 400 }
        );
      }
      const atp = getAvailableToPromise(variant);
      if (atp < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.title} (${variant.color} / ${variant.size}). Available: ${atp}` },
          { status: 400 }
        );
      }
    }

    // Step 2: Calculate authoritative server quote
    const paymentMethod = validated.paymentMethod || 'razorpay';
    const quote = calculateServerQuote(db, {
      items: normalizedItems,
      pincode: validated.shippingAddress?.pincode || '110001',
      couponCode: validated.couponCode || undefined,
      paymentMethod,
    });

    // Step 3: Atomically deduct/allocate stock and record immutable stock movements
    for (const line of quote.lines) {
      const product = db.products.find((p) => p.id === line.productId)!;
      const variant = product.variants.find((v) => v.id === line.variantId)!;

      // Reduce onHand so simple stock checks immediately reflect deduction
      variant.onHand = Math.max(0, variant.onHand - line.quantity);
      db.stockMovements.unshift({
        id: `mov_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        timestamp: now,
        sku: variant.sku,
        productId: product.id,
        variantId: variant.id,
        warehouseId: 'wh_blr_main',
        type: paymentMethod === 'manual_upi' ? 'reservation' : 'allocation',
        qtyDelta: -line.quantity,
        reason: `Order placement (${paymentMethod.toUpperCase()})`,
        actor: validated.customer?.email || 'customer:guest',
      });
    }

    // Increment coupon usage if applied
    if (quote.appliedCoupon) {
      const promo = db.promotions.find((p) => p.code === quote.appliedCoupon);
      if (promo) promo.usedCount += 1;
    }

    const orderSeq = 1000 + db.orders.length + 1;
    const orderId = `ord_${Date.now()}`;
    const orderNumber = `KRG-2026-${orderSeq}`;

    // Determine initial multi-dimensional states by payment method (Section 8 & 9)
    const isManualUpi = paymentMethod === 'manual_upi';
    const isCod = paymentMethod === 'cod';

    const newOrder: OrderRecord = {
      id: orderId,
      orderNumber,
      idempotencyKey: validated.idempotencyKey || `idem_${orderId}`,
      accessToken: `tok_${orderId}_${Math.random().toString(36).slice(2, 10)}`,
      customerId: body.customerId || null,
      isGuest: !body.customerId,
      customer: validated.customer || {
        name: 'Walk-in / Guest Shopper',
        email: 'guest@example.in',
        phone: '+91 98000 00000',
      },
      shippingAddress: validated.shippingAddress
        ? { ...validated.shippingAddress, country: 'India' }
        : {
            recipientName: validated.customer?.name || 'Guest Shopper',
            phone: validated.customer?.phone || '+91 98000 00000',
            line1: 'Inner Circle',
            locality: 'Connaught Place',
            city: 'New Delhi',
            state: 'Delhi',
            pincode: '110001',
            country: 'India',
          },
      paymentMethod,
      acceptanceStatus: isManualUpi ? 'awaiting_review' : 'confirmed',
      paymentStatus: isManualUpi ? 'pending' : isCod ? 'pending' : 'captured',
      manualPaymentStatus: isManualUpi
        ? validated.manualUpiClaim
          ? 'submitted'
          : 'awaiting_submission'
        : 'not_applicable',
      codStatus: isCod ? 'due' : 'not_applicable',
      fulfilmentStatus: isManualUpi ? 'unallocated' : 'allocated',
      shipmentStatus: isManualUpi ? 'not_started' : 'label_pending',
      customerSummaryStatus: isManualUpi
        ? 'Payment submitted — awaiting Finance bank statement verification'
        : isCod
        ? 'Order Confirmed (COD ₹' + quote.grandTotal + ' due on delivery)'
        : 'Payment Verified — Order Confirmed & Queued for Packing',
      currency: 'INR',
      subtotal: quote.subtotal,
      discountTotal: quote.discountTotal,
      couponCode: quote.appliedCoupon,
      shippingCharge: quote.shippingCharge,
      codFee: quote.codFee,
      taxTotal: quote.taxTotal,
      cgstTotal: quote.cgstTotal,
      sgstTotal: quote.sgstTotal,
      igstTotal: quote.igstTotal,
      supplyType: quote.supplyType,
      grandTotal: quote.grandTotal,
      grandTotalMinor: quote.grandTotalMinor,
      refundedTotal: 0,
      pendingRefundTotal: 0,
      razorpayOrderId: paymentMethod === 'razorpay' ? `order_Rzp${Date.now()}` : undefined,
      razorpayPaymentId: paymentMethod === 'razorpay' ? `pay_Rzp${Date.now()}` : undefined,
      manualUpiClaim: validated.manualUpiClaim
        ? {
            utrReference: validated.manualUpiClaim.utrReference,
            paidAtClaimed: validated.manualUpiClaim.paidAtClaimed || now,
            screenshotNote:
              validated.manualUpiClaim.screenshotNote ||
              `UTR ${validated.manualUpiClaim.utrReference} submitted at checkout`,
            submittedAt: now,
          }
        : undefined,
      warehouseId: 'wh_blr_main',
      invoiceNumber: !isManualUpi ? `INV-2627-00${orderSeq - 1000}` : undefined,
      invoiceIssuedAt: !isManualUpi ? now : undefined,
      lines: quote.lines.map((l: any, idx: number) => ({
        lineId: `line_${orderId}_${idx + 1}`,
        productId: l.productId,
        variantId: l.variantId,
        sku: l.sku,
        title: l.title,
        size: l.size,
        color: l.color,
        image: l.image,
        qtyOrdered: l.quantity,
        qtyAllocated: isManualUpi ? 0 : l.quantity,
        qtyPacked: 0,
        qtyShipped: 0,
        qtyCancelled: 0,
        qtyReturned: 0,
        unitPrice: l.unitPrice,
        unitMrp: l.unitMrp,
        unitCost: l.unitCost,
        allocatedDiscount: l.allocatedDiscount,
        taxableValue: l.taxableValue,
        gstRatePercent: l.gstRatePercent,
        cgstAmount: l.cgstAmount,
        sgstAmount: l.sgstAmount,
        igstAmount: l.igstAmount,
        lineTotalPayable: l.lineTotalPayable,
        hsnCode: l.hsnCode,
        categorySnapshot: l.categoryName,
        returnPolicySnapshot: l.returnPolicyClass,
      })),
      timeline: [
        {
          id: `ev_${Date.now()}_1`,
          timestamp: now,
          dimension: 'acceptance',
          fromState: 'draft',
          toState: isManualUpi ? 'awaiting_review' : 'confirmed',
          actor: validated.customer?.email || 'customer:guest',
          reason: `Order placed via ${paymentMethod.toUpperCase()}`,
          source: 'customer',
        },
      ],
      attributedBannerId: body.attributedBannerId || null,
      attributedSectionId: body.attributedSectionId || null,
      createdAt: now,
      updatedAt: now,
    };

    db.orders.unshift(newOrder);
    // Update analytics truth
    db.analytics.businessTruth.orderValuePlaced += newOrder.grandTotal;
    if (!isManualUpi) {
      db.analytics.businessTruth.confirmedMerchandiseSales += newOrder.subtotal - newOrder.discountTotal;
      db.analytics.businessTruth.recognisedRevenueExTax += newOrder.subtotal - newOrder.discountTotal - newOrder.taxTotal;
      db.analytics.businessTruth.taxCollectedGst += newOrder.taxTotal;
      if (paymentMethod === 'razorpay') {
        db.analytics.businessTruth.cashReceiptsVerified += newOrder.grandTotal;
      } else if (isCod) {
        db.analytics.businessTruth.codPendingRemittance += newOrder.grandTotal;
      }
    } else {
      db.analytics.businessTruth.manualUpiAwaitingVerification += newOrder.grandTotal;
    }

    saveDB(db);
    return NextResponse.json(newOrder);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.errors || error?.message || 'Order creation failed' },
      { status: 400 }
    );
  }
}