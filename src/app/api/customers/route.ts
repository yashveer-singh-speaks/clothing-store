import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';

export async function GET() {
  const db = getDB();
  return NextResponse.json({
    customers: db.customers,
    tickets: db.tickets,
    reviews: db.reviews,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getDB();
    const now = new Date().toISOString();

    if (body.action === 'create_ticket') {
      const newTkt = {
        id: `tkt_${Date.now()}`,
        ticketNumber: `SUP-2026-${500 + db.tickets.length + 1}`,
        orderId: body.orderId || 'ord_1001',
        orderNumber: body.orderNumber || 'KRG-2026-1001',
        customerName: body.customerName || 'Shopper',
        customerEmail: body.customerEmail || 'customer@example.in',
        subject: body.subject || 'Order / Product Support Inquiry',
        category: body.category || 'Order & Delivery',
        priority: body.priority || 'medium',
        status: 'waiting_for_staff',
        assignedTo: 'Support & Grievance Team',
        slaDueAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
        messages: [
          {
            id: `msg_${Date.now()}`,
            sender: 'customer',
            author: body.customerName || 'Customer',
            timestamp: now,
            body: body.message || 'Need assistance with my order.',
            isInternalNote: false,
          },
        ],
        createdAt: now,
      };
      db.tickets.unshift(newTkt);
      saveDB(db);
      return NextResponse.json({ success: true, ticket: newTkt, tickets: db.tickets });
    }

    if (body.action === 'reply_ticket') {
      const tkt = db.tickets.find((t) => t.id === body.ticketId);
      if (!tkt) return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
      tkt.messages.push({
        id: `msg_${Date.now()}`,
        sender: 'staff',
        author: 'superadmin@store.com',
        timestamp: now,
        body: body.message,
        isInternalNote: Boolean(body.isInternalNote),
      });
      if (!body.isInternalNote) {
        tkt.status = body.markResolved ? 'resolved' : 'waiting_for_customer';
      }
      saveDB(db);
      return NextResponse.json({ success: true, tickets: db.tickets });
    }

    if (body.action === 'submit_review') {
      const product = db.products.find((p) => p.id === body.productId);
      // Verify if email has a delivered order for this product
      const hasDeliveredOrder = db.orders.some(
        (o) =>
          o.customer.email.toLowerCase() === (body.email || '').toLowerCase() &&
          o.lines.some((l) => l.productId === body.productId)
      );
      const newRev = {
        id: `rev_${Date.now()}`,
        productId: body.productId,
        productTitle: product?.title || 'Whole/retail Name Product',
        orderId: hasDeliveredOrder ? 'verified_order' : 'guest_submission',
        customerName: body.customerName || 'Verified Shopper',
        city: body.city || 'New Delhi',
        rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
        title: body.title || 'Great everyday quality',
        body: body.body || body.comment || 'Comfortable fabric and solid stitching.',
        verifiedPurchase: hasDeliveredOrder,
        helpfulCount: 1,
        status: 'published',
        fitFeedback: body.fitFeedback || 'True to size',
        staffReply: '',
        createdAt: now,
      };
      db.reviews.unshift(newRev);
      if (product) {
        product.reviewCount += 1;
        product.ratingCount += 1;
      }
      saveDB(db);
      return NextResponse.json({ success: true, review: newRev, reviews: db.reviews });
    }

    if (body.action === 'moderate_review') {
      const rev = db.reviews.find((r) => r.id === body.reviewId);
      if (!rev) return NextResponse.json({ error: 'Review not found' }, { status: 404 });
      if (body.status) rev.status = body.status;
      if (body.staffReply !== undefined) rev.staffReply = body.staffReply;
      saveDB(db);
      return NextResponse.json({ success: true, reviews: db.reviews });
    }

    if (
      body.action === 'privacy_request' ||
      body.action === 'dpdp_export' ||
      body.action === 'dpdp_delete'
    ) {
      const cust =
        db.customers.find(
          (c) => c.email.toLowerCase() === (body.email || '').toLowerCase()
        ) || db.customers[0];
      const reqType: 'data_export' | 'account_deletion' =
        body.action === 'dpdp_delete' || body.requestType === 'account_deletion'
          ? 'account_deletion'
          : 'data_export';
      const reqRecord = {
        id: `dpdp_${Date.now()}`,
        type: reqType,
        status: 'completed_statutory_invoices_retained' as const,
        createdAt: now,
      };
      cust.privacyRequests.unshift(reqRecord);
      saveDB(db);
      return NextResponse.json({
        success: true,
        request: reqRecord,
        exportedData:
          reqType === 'data_export'
            ? {
                profile: cust,
                orders: db.orders.filter(
                  (o) => o.customer.email.toLowerCase() === cust.email.toLowerCase()
                ),
                dpdpNoticeVersion: 'privacy_v3_2026',
              }
            : null,
      });
    }

    if (body.action === 'update_consent') {
      const cust =
        db.customers.find(
          (c) =>
            c.id === body.customerId ||
            c.email.toLowerCase() === (body.email || '').toLowerCase()
        ) || db.customers[0];
      if (cust) {
        if (body.analyticsConsent !== undefined || body.analyticsOptIn !== undefined) {
          cust.analyticsConsent = Boolean(body.analyticsConsent ?? body.analyticsOptIn);
        }
        if (body.marketingConsent !== undefined || body.marketingOptIn !== undefined) {
          cust.marketingConsent = Boolean(body.marketingConsent ?? body.marketingOptIn);
        }
        saveDB(db);
      }
      return NextResponse.json({ success: true, customer: cust, customers: db.customers });
    }

    return NextResponse.json({ error: 'Invalid customer/support action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Customer operation failed' }, { status: 500 });
  }
}
