'use client';

import React, { useEffect, useState } from 'react';
import { RotateCcw, CheckCircle2, ShieldCheck } from 'lucide-react';
import { OrderRecord } from '@/lib/types';
import { useStore } from '@/context/StoreContext';

interface ReturnRequestItem {
  id: string;
  returnNumber: string;
  orderNumber: string;
  productTitle: string;
  preferredRemedy: string;
  status: string;
}

export default function ReturnsPage() {
  const { showToast } = useStore();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [returnsList, setReturnsList] = useState<ReturnRequestItem[]>([]);
  const [selectedOrderNumber, setSelectedOrderNumber] = useState('KRG-2026-1001');
  const [type, setType] = useState<'refund' | 'exchange'>('exchange');
  const [reason, setReason] = useState('size_too_small');
  const [exchangeSize, setExchangeSize] = useState('L');
  const [customerNotes, setCustomerNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const loadData = () => {
    fetch('/api/orders')
      .then((r) => r.json())
      .then((d) => setOrders(Array.isArray(d) ? d : d.orders || []))
      .catch(() => {});
    fetch('/api/returns')
      .then((r) => r.json())
      .then((d) => setReturnsList(Array.isArray(d) ? d : d.returns || []))
      .catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectedOrder = orders.find((o) => o.orderNumber === selectedOrderNumber) || orders[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    const item = selectedOrder.lines[0];
    if (!item) return;
    const res = await fetch('/api/returns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: selectedOrder.id,
        lineId: item.lineId,
        qty: 1,
        reason: `${reason}${customerNotes ? ` — ${customerNotes}` : ''}`,
        preferredRemedy: type,
        replacementVariantSku: type === 'exchange' ? `Size ${exchangeSize}` : undefined,
        pickupMethod: 'reverse_pickup',
      }),
    });
    if (res.ok) {
      setSubmitted(true);
      showToast('Return / Exchange request registered with reverse pickup scheduled');
      loadData();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      <div className="space-y-2 border-b border-[#18201B]/12 pb-5">
        <p className="text-xs font-bold uppercase tracking-widest text-[#18201B]/65">
          7-DAY DOORSTEP REVERSE PICKUP
        </p>
        <h1 className="font-story text-3xl sm:text-4xl font-bold text-[#18201B]">
          Returns, Size Exchanges & Refunds
        </h1>
        <p className="text-xs sm:text-sm text-[#18201B]/75 leading-relaxed">
          Unused garments and footwear with original tags intact are eligible for free 7-day doorstep size exchange or full refund.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-7 p-6 rounded-[8px] border border-[#18201B]/15 bg-[#F8F5ED] space-y-4">
          <h2 className="font-story text-xl font-bold">
            Initiate a Return or Size Exchange
          </h2>

          {submitted && (
            <div className="p-4 rounded bg-[#B28A50]/25 border border-[#B28A50] text-xs space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Reverse Pickup Request Registered</span>
              </p>
              <p>
                Our courier partner will pick up your package within 24–48 hours. Once inspected at our New Delhi studio, your replacement or refund is processed immediately.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">Select Order</label>
              <select
                value={selectedOrderNumber}
                onChange={(e) => setSelectedOrderNumber(e.target.value)}
                className="w-full h-10 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
              >
                {orders.map((o) => (
                  <option key={o.id} value={o.orderNumber}>
                    {o.orderNumber} — {o.lines[0]?.title} (₹{o.grandTotal})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Request Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType('exchange')}
                  className={`py-2.5 rounded border font-semibold ${
                    type === 'exchange'
                      ? 'bg-[#18201B] text-[#F8F5ED] border-[#18201B]'
                      : 'border-[#18201B]/25'
                  }`}
                >
                  Free Size Exchange
                </button>
                <button
                  type="button"
                  onClick={() => setType('refund')}
                  className={`py-2.5 rounded border font-semibold ${
                    type === 'refund'
                      ? 'bg-[#18201B] text-[#F8F5ED] border-[#18201B]'
                      : 'border-[#18201B]/25'
                  }`}
                >
                  Return for Refund
                </button>
              </div>
            </div>

            {type === 'exchange' && (
              <div>
                <label className="block font-semibold mb-1">Preferred Replacement Size</label>
                <select
                  value={exchangeSize}
                  onChange={(e) => setExchangeSize(e.target.value)}
                  className="w-full h-10 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                >
                  {['S', 'M', 'L', 'XL', 'UK 7', 'UK 8', 'UK 9'].map((s) => (
                    <option key={s} value={s}>
                      Size {s}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block font-semibold mb-1">Reason *</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full h-10 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
              >
                <option value="size_too_small">Size fits smaller than expected</option>
                <option value="size_too_large">Size fits larger than expected</option>
                <option value="changed_mind">Changed mind / Prefer another style</option>
                <option value="defective_or_damaged">Transit damage or defect</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Pickup Notes</label>
              <textarea
                rows={2}
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="Preferred pickup time or instructions..."
                className="w-full p-3 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-[6px] bg-[#18201B] text-[#F8F5ED] font-semibold cursor-pointer"
            >
              Submit Return / Exchange Request
            </button>
          </form>
        </div>

        <div className="md:col-span-5 space-y-4">
          <div className="p-5 rounded-[8px] border border-[#18201B]/15 bg-[#18201B]/[0.02] space-y-3 text-xs">
            <h3 className="font-story text-lg font-bold">Plain-Language Return Rules</h3>
            <p>• 7-day window from the date of delivery.</p>
            <p>• Free reverse courier pickup on all serviceable PIN codes.</p>
            <p>• Refunds are issued within 24 hours of QC check at our New Delhi studio.</p>
            <p>• GST Credit Notes are automatically generated for every refunded item.</p>
          </div>

          {returnsList.length > 0 && (
            <div className="p-5 rounded-[8px] border border-[#18201B]/15 space-y-3 text-xs">
              <h3 className="font-story text-lg font-bold">Recent Return Requests</h3>
              {returnsList.map((r) => (
                <div
                  key={r.id}
                  className="p-3 rounded border border-[#18201B]/12 space-y-1"
                >
                  <div className="flex justify-between font-bold">
                    <span>{r.returnNumber}</span>
                    <span className="uppercase text-[10px] px-2 py-0.5 rounded bg-[#B28A50]/25">
                      {r.status}
                    </span>
                  </div>
                  <p>{r.productTitle}</p>
                  <p className="text-[#18201B]/65">
                    Order: {r.orderNumber} • Remedy: {r.preferredRemedy?.toUpperCase()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
