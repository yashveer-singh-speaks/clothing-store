'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Truck, Package, CheckCircle2, Clock, FileText } from 'lucide-react';
import { OrderRecord } from '@/lib/types';

export default function TrackOrderPage() {
  const [query, setQuery] = useState('KRG-2026-1001');
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [matchedOrder, setMatchedOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qParam = params.get('q');
    if (qParam) setQuery(qParam);

    fetch('/api/orders')
      .then((r) => r.json())
      .then((data) => {
        const list: OrderRecord[] = Array.isArray(data) ? data : data.orders || [];
        setOrders(list);
        const searchTarget = (qParam || 'KRG-2026-1001').trim().toLowerCase();
        const found = list.find(
          (o) =>
            o.orderNumber.toLowerCase() === searchTarget ||
            o.id.toLowerCase() === searchTarget ||
            o.customer.phone.includes(searchTarget) ||
            (o.shipment?.awbNumber && o.shipment.awbNumber.toLowerCase().includes(searchTarget))
        );
        setMatchedOrder(found || (qParam ? null : list[0] || null));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    if (!q) {
      setMatchedOrder(null);
      return;
    }
    const found = orders.find(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        o.customer.phone.includes(q) ||
        (o.shipment?.awbNumber && o.shipment.awbNumber.toLowerCase().includes(q))
    );
    setMatchedOrder(found || null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div className="space-y-2 border-b border-[#18201B]/12 pb-5">
        <p className="text-xs font-bold uppercase tracking-widest text-[#18201B]/65">
          REAL-TIME SHIPMENT & ORDER TRACKER
        </p>
        <h1 className="font-story text-3xl sm:text-4xl font-bold text-[#18201B]">
          Track Your Order
        </h1>
        <p className="text-xs sm:text-sm text-[#18201B]/75">
          Enter your Order Number (e.g., KRG-2026-1001, KRG-2026-1002, KRG-2026-1003), AWB Number, or 10-digit Phone Number.
        </p>
      </div>

      <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Order No (KRG-2026-1001) or Mobile Number"
          className="flex-1 h-11 px-4 rounded-[6px] border border-[#18201B]/30 bg-[#F8F5ED] text-sm font-mono"
        />
        <button
          type="submit"
          className="h-11 px-6 rounded-[6px] bg-[#18201B] text-[#F8F5ED] text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
        >
          <Search className="w-4 h-4 text-[#B28A50]" />
          <span>Track Order</span>
        </button>
      </form>

      {/* Quick Sample Orders Selector */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[#18201B]/65 font-semibold">Quick Select Order:</span>
        {orders.slice(0, 5).map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => {
              setQuery(o.orderNumber);
              setMatchedOrder(o);
            }}
            className={`px-2.5 py-1 rounded border font-mono ${
              matchedOrder?.id === o.id
                ? 'bg-[#18201B] text-[#F8F5ED] border-[#18201B]'
                : 'border-[#18201B]/20 hover:border-[#B28A50]'
            }`}
          >
            {o.orderNumber} ({o.acceptanceStatus})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-8 rounded-[8px] border border-[#18201B]/15 text-center text-xs text-[#18201B]/70">
          Fetching real-time shipment status...
        </div>
      ) : matchedOrder ? (
        <div className="p-6 rounded-[8px] border border-[#18201B]/20 bg-[#F8F5ED] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#18201B]/12 pb-4">
            <div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#B28A50]/25">
                {matchedOrder.orderNumber}
              </span>
              <h2 className="font-story text-2xl font-bold mt-2">
                {matchedOrder.customerSummaryStatus}
              </h2>
              <p className="text-xs text-[#18201B]/75 mt-0.5">
                Recipient: {matchedOrder.customer.name} • {matchedOrder.shippingAddress.city},{' '}
                {matchedOrder.shippingAddress.state} ({matchedOrder.shippingAddress.pincode})
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/invoice/${matchedOrder.id}`}
                className="px-3.5 py-2 rounded border border-[#18201B]/25 text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-[#B28A50]" />
                <span>GST Invoice</span>
              </Link>
              <Link
                href="/returns"
                className="px-3.5 py-2 rounded bg-[#18201B] text-[#F8F5ED] text-xs font-semibold"
              >
                Request Return / Exchange
              </Link>
            </div>
          </div>

          {/* Multi-Dimensional Status Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded bg-[#18201B]/[0.03] border border-[#18201B]/10">
              <span className="text-[#18201B]/60 block">Payment Status</span>
              <strong className="uppercase">{matchedOrder.paymentStatus}</strong>
            </div>
            <div className="p-3 rounded bg-[#18201B]/[0.03] border border-[#18201B]/10">
              <span className="text-[#18201B]/60 block">Fulfilment</span>
              <strong className="uppercase">{matchedOrder.fulfilmentStatus}</strong>
            </div>
            <div className="p-3 rounded bg-[#18201B]/[0.03] border border-[#18201B]/10">
              <span className="text-[#18201B]/60 block">Shipment / Courier</span>
              <strong className="uppercase">{matchedOrder.shipmentStatus}</strong>
            </div>
            <div className="p-3 rounded bg-[#18201B]/[0.03] border border-[#18201B]/10">
              <span className="text-[#18201B]/60 block">AWB Tracking</span>
              <strong className="font-mono">
                {matchedOrder.shipment?.awbNumber || 'Pending Dispatch'}
              </strong>
            </div>
          </div>

          {/* Chronological Timeline */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#18201B]/70">
              Shipment & Fulfilment Timeline
            </h3>
            <div className="space-y-3 border-l-2 border-[#B28A50] pl-4 ml-2">
              {matchedOrder.timeline.map((ev) => (
                <div key={ev.id} className="text-xs space-y-0.5">
                  <p className="font-bold text-[#18201B]">
                    [{ev.dimension.toUpperCase()}] {ev.fromState} → {ev.toState}
                  </p>
                  <p className="text-[#18201B]/80">{ev.reason}</p>
                  <p className="text-[11px] text-[#18201B]/55">
                    {new Date(ev.timestamp).toLocaleString('en-IN')} • {ev.actor}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-[8px] border border-[#18201B]/15 text-center text-xs">
          No order found matching &ldquo;{query}&rdquo;. Try KRG-2026-1001 or KRG-2026-1002.
        </div>
      )}
    </div>
  );
}
