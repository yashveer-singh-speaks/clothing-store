'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function ContactPage() {
  const { showToast } = useStore();
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    orderNumber: '',
    subject: '',
    message: '',
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create_ticket',
        category: 'other',
        ...form,
      }),
    });
    setSent(true);
    showToast('Your message has been logged with our New Delhi Support Desk');
    setForm({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      orderNumber: '',
      subject: '',
      message: '',
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
      <div className="space-y-2 border-b border-[#18201B]/12 pb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-[#18201B]/65">
          DIRECT HUMAN SUPPORT • NO CHATBOT RUNAROUND
        </p>
        <h1 className="font-story text-3xl sm:text-4xl font-bold text-[#18201B]">
          Contact Our New Delhi Studio & Consumer Grievance Officer
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 space-y-5 text-xs sm:text-sm">
          <div className="p-5 rounded-[8px] border border-[#18201B]/15 space-y-2">
            <h2 className="font-story text-lg font-bold">Customer Support Desk</h2>
            <p>
              <strong>Phone:</strong> +91 11 4123 9876
            </p>
            <p>
              <strong>WhatsApp Support:</strong> +91 98765 43210
            </p>
            <p>
              <strong>Email:</strong> care@karigarstore.in
            </p>
            <p className="text-xs text-[#18201B]/70">
              Hours: Monday to Saturday, 10:00 AM – 7:00 PM IST
            </p>
          </div>

          <div className="p-5 rounded-[8px] border border-[#18201B]/15 bg-[#18201B]/[0.02] space-y-2">
            <h2 className="font-story text-lg font-bold">
              Consumer Protection (E-Commerce) Rules Grievance Officer
            </h2>
            <p>
              <strong>Officer Name:</strong> Rohan Kulkarni
            </p>
            <p>
              <strong>Designation:</strong> Head of Consumer Redressal & Compliance
            </p>
            <p>
              <strong>Email:</strong> grievance@karigarstore.in
            </p>
            <p>
              <strong>Direct Phone:</strong> +91 80 4123 9879
            </p>
            <p className="text-xs text-[#18201B]/70">
              Every grievance is acknowledged with a unique ticket ID within 48 hours and resolved within 30 days as mandated by Indian law.
            </p>
          </div>
        </div>

        <div className="md:col-span-7 p-6 rounded-[8px] border border-[#18201B]/15 space-y-4">
          <h2 className="font-story text-xl font-bold">Send a Direct Message</h2>
          {sent && (
            <div className="p-3 rounded bg-[#B28A50]/25 border border-[#B28A50] text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Ticket created! Our New Delhi support team will reply shortly.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  className="w-full h-11 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">10-Digit Mobile *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={form.customerPhone}
                  onChange={(e) => setForm({ ...form, customerPhone: e.target.value.replace(/\D/g, '') })}
                  className="w-full h-11 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED] font-mono"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={form.customerEmail}
                  onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                  className="w-full h-11 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">
                  Order Number (Optional)
                </label>
                <input
                  type="text"
                  value={form.orderNumber}
                  onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
                  placeholder="KRG-2026-1001"
                  className="w-full h-11 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED] font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1">Subject *</label>
              <input
                type="text"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full h-11 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Message *</label>
              <textarea
                rows={4}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full p-3 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
              />
            </div>
            <button
              type="submit"
              className="w-full min-h-[44px] py-3 rounded-[6px] bg-[#18201B] text-[#F8F5ED] font-semibold cursor-pointer"
            >
              Send Message to New Delhi Studio Desk
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
