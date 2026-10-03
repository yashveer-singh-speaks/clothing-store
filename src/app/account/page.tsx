'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  User,
  Package,
  Heart,
  MessageSquare,
  ShieldCheck,
  Download,
  Trash2,
  FileText,
  Truck,
} from 'lucide-react';
import { OrderRecord, ProductRecord, OrderLineSnapshot } from '@/lib/types';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/ProductCard';

interface SupportTicketItem {
  id: string;
  ticketNumber: string;
  subject: string;
  status: string;
  messages: {
    id: string;
    author?: string;
    senderName?: string;
    body: string;
    isInternalNote?: boolean;
  }[];
}

export default function AccountPage() {
  const { wishlistIds, analyticsConsent, setAnalyticsConsent, showToast } = useStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'tickets' | 'privacy'>('orders');
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [tickets, setTickets] = useState<SupportTicketItem[]>([]);
  const [exportedData, setExportedData] = useState<string | null>(null);
  const [marketingConsent, setMarketingConsent] = useState<boolean>(true);
  const [whatsappUpdatesConsent, setWhatsappUpdatesConsent] = useState<boolean>(true);
  const [confirmErasure, setConfirmErasure] = useState<boolean>(false);
  const [confirmCancelOrderId, setConfirmCancelOrderId] = useState<string | null>(null);

  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'delivery_delay',
    message: '',
  });

  const loadAccountData = () => {
    fetch('/api/orders')
      .then((r) => r.json())
      .then((d) => setOrders(Array.isArray(d) ? d : d.orders || []))
      .catch(() => {});
    fetch('/api/storefront')
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => {});
    fetch('/api/customers')
      .then((r) => r.json())
      .then((d) => {
        setTickets(d.tickets || []);
        const cust = (d.customers || [])[0];
        if (cust) {
          setMarketingConsent(Boolean(cust.marketingConsent));
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'wishlist' || tab === 'tickets' || tab === 'privacy') {
      setActiveTab(tab);
    }
    loadAccountData();
  }, []);

  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketForm.subject || !ticketForm.message) return;
    await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create_ticket',
        customerName: 'Rahul Mehta',
        customerEmail: 'rahul.mehta@example.in',
        customerPhone: '9845011223',
        orderNumber: orders[0]?.orderNumber || 'KRG-2026-1001',
        ...ticketForm,
      }),
    });
    showToast('Support ticket created. Our New Delhi desk will respond within 4 business hours.');
    setTicketForm({ subject: '', category: 'delivery_delay', message: '' });
    loadAccountData();
  };

  const handleUpdateConsent = async (nextMarketing: boolean, nextAnalytics: boolean) => {
    setMarketingConsent(nextMarketing);
    setAnalyticsConsent(nextAnalytics);
    await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_consent',
        customerId: 'cust_1',
        marketingConsent: nextMarketing,
        analyticsConsent: nextAnalytics,
      }),
    });
    showToast('Your DPDP Act 2023 privacy and consent preferences have been saved.');
  };

  const handleDpdpExport = async () => {
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'dpdp_export', customerId: 'cust_1' }),
    });
    const data = await res.json();
    setExportedData(JSON.stringify(data.exportBundle || data, null, 2));
    showToast('DPDP Personal Data Export generated.');
  };

  const handleDpdpDelete = async () => {
    await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'dpdp_delete', customerId: 'cust_1' }),
    });
    setConfirmErasure(false);
    showToast('DPDP Erasure Request recorded. Marketing & profile PII scheduled for anonymization.');
    loadAccountData();
  };

  const handleCancelOrder = async (orderId: string) => {
    const res = await fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        action: 'cancel_order',
        reason: 'Customer requested cancellation prior to dispatch',
      }),
    });
    if (res.ok) {
      setConfirmCancelOrderId(null);
      showToast('Order cancelled and reserved stock released.');
      loadAccountData();
    }
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#18201B]/12 pb-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#18201B]/65">
            CUSTOMER ACCOUNT & SELF-SERVICE
          </p>
          <h1 className="font-story text-3xl sm:text-4xl font-bold text-[#18201B]">
            Namaste, Rahul Mehta
          </h1>
          <p className="text-xs text-[#18201B]/75 mt-0.5">
            rahul.mehta@example.in • +91 98450 11223 • New Delhi, Delhi
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: 'orders', label: `Orders (${orders.length})`, icon: Package },
            { id: 'wishlist', label: `Wishlist (${wishlistedProducts.length})`, icon: Heart },
            { id: 'tickets', label: `Support Tickets (${tickets.length})`, icon: MessageSquare },
            { id: 'privacy', label: 'DPDP Privacy & Data', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-[6px] text-xs font-semibold inline-flex items-center gap-2 border cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#18201B] text-[#F8F5ED] border-[#18201B]'
                    : 'border-[#18201B]/20 hover:border-[#B28A50]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-[#B28A50]" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-5 rounded-[8px] border border-[#18201B]/15 bg-[#F8F5ED] space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#18201B]/10 pb-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm">{order.orderNumber}</span>
                  <span className="px-2.5 py-0.5 rounded bg-[#B28A50]/25 font-bold uppercase">
                    {order.acceptanceStatus}
                  </span>
                  <span className="text-[#18201B]/65">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/invoice/${order.id}`}
                    className="underline font-semibold inline-flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#B28A50]" />
                    <span>GST Invoice ({order.invoiceNumber || 'Ready'})</span>
                  </Link>
                  <Link
                    href={`/track-order?q=${order.orderNumber}`}
                    className="px-3 py-1.5 rounded bg-[#18201B] text-[#F8F5ED] font-semibold inline-flex items-center gap-1"
                  >
                    <Truck className="w-3.5 h-3.5 text-[#B28A50]" />
                    <span>Track</span>
                  </Link>
                  {order.acceptanceStatus !== 'cancelled' &&
                    (order.fulfilmentStatus === 'unallocated' ||
                      order.fulfilmentStatus === 'allocated') &&
                    order.shipmentStatus === 'not_started' && (
                      confirmCancelOrderId === order.id ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleCancelOrder(order.id)}
                            className="px-2.5 py-1.5 rounded bg-[#18201B] text-[#F8F5ED] font-semibold cursor-pointer"
                          >
                            Confirm Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmCancelOrderId(null)}
                            className="px-2.5 py-1.5 rounded border border-[#18201B]/25 font-semibold cursor-pointer"
                          >
                            Keep Order
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmCancelOrderId(order.id)}
                          className="px-2.5 py-1.5 rounded border border-[#18201B]/25 hover:border-[#B28A50] font-semibold cursor-pointer"
                        >
                          Cancel Order
                        </button>
                      )
                    )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  {order.lines.map((item: OrderLineSnapshot, i: number) => (
                    <p key={item.lineId || i} className="font-medium">
                      • {item.title} ({item.color} / {item.size}) × {item.qtyOrdered}
                    </p>
                  ))}
                </div>
                <div className="text-right price-num">
                  <p className="text-sm font-bold">
                    Total: ₹{order.grandTotal.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-[#18201B]/65 uppercase">
                    {order.paymentMethod} • {order.paymentStatus}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: WISHLIST */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistedProducts.length === 0 ? (
            <div className="p-10 rounded-[8px] border border-[#18201B]/15 text-center space-y-3">
              <p className="font-story text-xl font-bold">No Saved Wishlist Items Yet</p>
              <p className="text-xs text-[#18201B]/70">
                Tap the heart icon on any shirt, kurta, or footwear to save it here.
              </p>
              <Link
                href="/products"
                className="inline-block px-5 py-2.5 rounded bg-[#18201B] text-[#F8F5ED] text-xs font-semibold"
              >
                Explore Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {wishlistedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SUPPORT TICKETS */}
      {activeTab === 'tickets' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="font-story text-xl font-bold">Your Support Conversations</h2>
            {tickets.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-[6px] border border-[#18201B]/15 space-y-2 text-xs"
              >
                <div className="flex justify-between font-bold">
                  <span>
                    {t.ticketNumber} — {t.subject}
                  </span>
                  <span className="uppercase px-2 py-0.5 rounded bg-[#B28A50]/25">
                    {t.status}
                  </span>
                </div>
                {(t.messages || [])
                  .filter((m) => !m.isInternalNote)
                  .map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded bg-[#18201B]/[0.03] text-[#18201B]/85"
                    >
                      <strong>{m.author || m.senderName}:</strong> {m.body}
                    </div>
                  ))}
              </div>
            ))}
          </div>

          <div className="lg:col-span-5 p-5 rounded-[8px] border border-[#18201B]/15 space-y-4">
            <h3 className="font-story text-lg font-bold">Raise a Support Ticket</h3>
            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Issue Category</label>
                <select
                  value={ticketForm.category}
                  onChange={(e) =>
                    setTicketForm({ ...ticketForm, category: e.target.value })
                  }
                  className="w-full h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                >
                  <option value="delivery_delay">Delivery / Courier Tracking</option>
                  <option value="return_refund">Size Exchange / Refund</option>
                  <option value="payment_issue">UPI / Payment Verification</option>
                  <option value="product_question">Fabric / Sizing Question</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  value={ticketForm.subject}
                  onChange={(e) =>
                    setTicketForm({ ...ticketForm, subject: e.target.value })
                  }
                  placeholder="e.g. Need size L instead of M on Order KRG-2026-1001"
                  className="w-full h-9 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Message *</label>
                <textarea
                  rows={3}
                  required
                  value={ticketForm.message}
                  onChange={(e) =>
                    setTicketForm({ ...ticketForm, message: e.target.value })
                  }
                  className="w-full p-3 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded bg-[#18201B] text-[#F8F5ED] font-semibold cursor-pointer"
              >
                Submit Support Ticket
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 4: DPDP ACT 2023 PRIVACY CONTROLS */}
      {activeTab === 'privacy' && (
        <div className="p-6 rounded-[8px] border border-[#18201B]/15 space-y-6 text-xs sm:text-sm">
          <div className="space-y-1">
            <h2 className="font-story text-2xl font-bold">
              Digital Personal Data Protection (DPDP Act, 2023) Controls
            </h2>
            <p className="text-[#18201B]/75">
              You have complete control over your personal data and consent preferences stored with Karigar Everyday Apparel & Goods Pvt. Ltd.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="p-4 rounded-[6px] border border-[#18201B]/15 bg-[#F8F5ED] flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={analyticsConsent}
                onChange={(e) => handleUpdateConsent(marketingConsent, e.target.checked)}
                className="mt-0.5 accent-[#18201B]"
              />
              <div>
                <p className="font-bold text-[#18201B]">Storefront Analytics Consent</p>
                <p className="text-xs text-[#18201B]/75 mt-0.5">
                  Allow anonymized first-party event telemetry to improve PIN delivery and search accuracy.
                </p>
              </div>
            </label>

            <label className="p-4 rounded-[6px] border border-[#18201B]/15 bg-[#F8F5ED] flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => handleUpdateConsent(e.target.checked, analyticsConsent)}
                className="mt-0.5 accent-[#18201B]"
              />
              <div>
                <p className="font-bold text-[#18201B]">New Loom Batch & Offer Emails</p>
                <p className="text-xs text-[#18201B]/75 mt-0.5">
                  Receive occasional updates when new handloom batches or seasonal edits arrive.
                </p>
              </div>
            </label>

            <label className="p-4 rounded-[6px] border border-[#18201B]/15 bg-[#F8F5ED] flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={whatsappUpdatesConsent}
                onChange={(e) => {
                  setWhatsappUpdatesConsent(e.target.checked);
                  showToast('WhatsApp transactional dispatch notification preference updated.');
                }}
                className="mt-0.5 accent-[#18201B]"
              />
              <div>
                <p className="font-bold text-[#18201B]">WhatsApp Dispatch & AWB Alerts</p>
                <p className="text-xs text-[#18201B]/75 mt-0.5">
                  Receive live courier tracking and doorstep delivery updates on WhatsApp.
                </p>
              </div>
            </label>
          </div>

          <div className="flex flex-wrap gap-3 pt-2 border-t border-[#18201B]/10">
            <button
              type="button"
              onClick={handleDpdpExport}
              className="px-4 py-2.5 rounded-[6px] bg-[#18201B] text-[#F8F5ED] text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#B28A50]" />
              <span>Export My Personal Data (JSON)</span>
            </button>

            {confirmErasure ? (
              <div className="inline-flex flex-wrap items-center gap-2 p-2 rounded border border-[#B28A50] bg-[#B28A50]/15">
                <span className="text-xs font-bold">
                  Confirm permanent anonymization of profile & marketing PII?
                </span>
                <button
                  type="button"
                  onClick={handleDpdpDelete}
                  className="px-3 py-1.5 rounded bg-[#18201B] text-[#F8F5ED] text-xs font-semibold cursor-pointer"
                >
                  Yes, Confirm Erasure
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmErasure(false)}
                  className="px-3 py-1.5 rounded border border-[#18201B]/25 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmErasure(true)}
                className="px-4 py-2.5 rounded-[6px] border border-[#18201B]/30 text-[#18201B] text-xs font-semibold inline-flex items-center gap-2 hover:border-[#B28A50] cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-[#B28A50]" />
                <span>Request Account & PII Erasure</span>
              </button>
            )}
          </div>

          {exportedData && (
            <pre className="p-4 rounded bg-[#18201B] text-[#F8F5ED] font-mono text-[11px] overflow-x-auto max-h-72">
              {exportedData}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
