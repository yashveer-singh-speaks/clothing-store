'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  CheckCircle2,
  Clock,
  FileText,
  Truck,
  MapPin,
  ArrowRight,
  Printer,
} from 'lucide-react';
import { OrderRecord, OrderLineSnapshot } from '@/lib/types';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = String(params?.id || '');
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.id) setOrder(data);
        else if (data?.order) setOrder(data.order);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="font-story text-2xl font-bold">Loading Order Confirmation...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-story text-2xl font-bold">Order Not Found</h1>
        <Link
          href="/track-order"
          className="inline-block px-5 py-2.5 rounded bg-[#18201B] text-[#F8F5ED] text-xs font-semibold"
        >
          Go to Order Tracking
        </Link>
      </div>
    );
  }

  const taxableTotal = Math.max(0, order.subtotal - order.discountTotal - order.taxTotal);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div className="p-6 sm:p-8 rounded-[8px] border-2 border-[#B28A50] bg-[#F8F5ED] space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#18201B] text-[#B28A50] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#18201B]/70">
                ORDER RECEIVED • NEW DELHI STUDIO
              </p>
              <h1 className="font-story text-2xl sm:text-3xl font-bold text-[#18201B]">
                Thank You, {order.customer.name}!
              </h1>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-[#18201B]/70">Order Number</p>
            <p className="font-mono text-base font-bold text-[#18201B]">
              {order.orderNumber}
            </p>
          </div>
        </div>

        {order.manualPaymentStatus === 'submitted' || order.manualPaymentStatus === 'awaiting_submission' ? (
          <div className="p-4 rounded bg-[#B28A50]/20 border border-[#B28A50] text-xs space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>
                Manual UPI Payment Claim Submitted (UTR: {order.manualUpiClaim?.utrReference})
              </span>
            </p>
            <p className="text-[#18201B]/80">
              Your stock is reserved! Our Finance Desk will verify your 12-digit UTR against our bank statement and release your package for dispatch.
            </p>
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-[#18201B]/80">
            We have reserved your items at our Connaught Place, New Delhi studio. Your official GST Invoice ({order.invoiceNumber || 'Pending Verification'}) is ready below.
          </p>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href={`/invoice/${order.id}`}
            className="px-4 py-2.5 rounded-[6px] bg-[#18201B] text-[#F8F5ED] text-xs font-semibold inline-flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-[#B28A50]" />
            <span>View / Print GST Tax Invoice</span>
          </Link>
          <Link
            href={`/track-order?q=${order.orderNumber}`}
            className="px-4 py-2.5 rounded-[6px] border border-[#18201B]/30 text-[#18201B] text-xs font-semibold inline-flex items-center gap-2"
          >
            <Truck className="w-4 h-4 text-[#B28A50]" />
            <span>Track Live Order Status</span>
          </Link>
        </div>
      </div>

      {/* Order Summary & Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-[8px] border border-[#18201B]/15 space-y-3 text-xs">
          <h2 className="font-story text-lg font-bold">Delivery Address</h2>
          <p className="font-semibold">{order.shippingAddress.recipientName}</p>
          <p className="text-[#18201B]/80">
            {order.shippingAddress.line1}, {order.shippingAddress.locality}
            {order.shippingAddress.landmark
              ? ` (Landmark: ${order.shippingAddress.landmark})`
              : ''}
          </p>
          <p className="text-[#18201B]/80">
            {order.shippingAddress.city}, {order.shippingAddress.state} –{' '}
            {order.shippingAddress.pincode}
          </p>
          <p>Phone: {order.shippingAddress.phone}</p>
        </div>

        <div className="p-5 rounded-[8px] border border-[#18201B]/15 space-y-2 text-xs price-num">
          <h2 className="font-story text-lg font-bold font-sans">Payment Breakdown</h2>
          <div className="flex justify-between">
            <span>Payment Method</span>
            <span className="font-bold uppercase">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between">
            <span>Payment Status</span>
            <span className="font-bold uppercase">{order.paymentStatus}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxable Amount</span>
            <span>₹{taxableTotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span>GST Total (CGST/SGST/IGST)</span>
            <span>
              ₹
              {(
                order.cgstTotal +
                order.sgstTotal +
                order.igstTotal
              ).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex justify-between text-base font-bold border-t border-[#18201B]/15 pt-2">
            <span>Grand Total</span>
            <span>₹{order.grandTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="p-5 rounded-[8px] border border-[#18201B]/15 space-y-4">
        <h2 className="font-story text-lg font-bold">Ordered Items</h2>
        <div className="divide-y divide-[#18201B]/10">
          {order.lines.map((item: OrderLineSnapshot, i: number) => (
            <div key={item.lineId || i} className="py-3 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-12 h-14 object-cover rounded border border-[#18201B]/10"
                />
                <div>
                  <p className="font-bold text-sm">{item.title}</p>
                  <p className="text-[#18201B]/70">
                    {item.color} / {item.size} • SKU: {item.sku} • HSN: {item.hsnCode}
                  </p>
                </div>
              </div>
              <div className="text-right price-num">
                <p className="font-bold">
                  ₹{item.lineTotalPayable.toLocaleString('en-IN')}
                </p>
                <p className="text-[#18201B]/65">Qty: {item.qtyOrdered}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
