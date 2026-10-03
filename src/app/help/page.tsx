import React from 'react';
import Link from 'next/link';

export default function HelpPage() {
  const faqs = [
    {
      q: 'Do natural indigo and vegetable-dyed garments bleed in the first wash?',
      a: 'Natural indigo (Fermented Vat Dye) has a surface pigment bloom that may release slight blue tint during the first 1–2 cold hand washes. Wash separately in cold water with mild liquid soap and dry in shade.',
    },
    {
      q: 'How do I verify my Manual UPI QR payment using the 12-digit UTR number?',
      a: 'When you pay via our verified merchant UPI QR at checkout, your UPI app (GPay, PhonePe, Paytm, BHIM) generates a 12-digit UPI Reference / UTR number. Enter that number at checkout; our Finance Desk verifies it against our bank statement and updates your order status.',
    },
    {
      q: 'What is your size exchange and return policy?',
      a: 'We offer a 7-day doorstep reverse pickup for size exchanges and returns on all unused items with original handloom tags intact.',
    },
    {
      q: 'Do you provide a GST Tax Invoice for business purchases?',
      a: 'Yes! Every order includes a downloadable GST-compliant tax invoice with HSN codes and CGST/SGST or IGST breakdown. You can also enter your Buyer GSTIN at checkout.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      <div className="border-b border-[#18201B]/12 pb-5">
        <p className="text-xs font-bold uppercase tracking-widest text-[#18201B]/65">
          CUSTOMER HELP CENTER & GARMENT CARE
        </p>
        <h1 className="font-story text-3xl sm:text-4xl font-bold text-[#18201B] mt-1">
          Frequently Asked Questions
        </h1>
      </div>

      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div
            key={i}
            className="p-5 rounded-[8px] border border-[#18201B]/15 bg-[#F8F5ED] space-y-2"
          >
            <h2 className="font-story text-lg font-bold text-[#18201B]">{f.q}</h2>
            <p className="text-xs sm:text-sm text-[#18201B]/80 leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <Link
          href="/track-order"
          className="px-4 py-2.5 rounded bg-[#18201B] text-[#F8F5ED] text-xs font-semibold"
        >
          Track an Order
        </Link>
        <Link
          href="/returns"
          className="px-4 py-2.5 rounded border border-[#18201B]/30 text-xs font-semibold"
        >
          Start a Return / Exchange
        </Link>
        <Link
          href="/contact"
          className="px-4 py-2.5 rounded border border-[#18201B]/30 text-xs font-semibold"
        >
          Contact Human Support
        </Link>
      </div>
    </div>
  );
}
