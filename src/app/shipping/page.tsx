import React from 'react';

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-6 text-xs sm:text-sm leading-relaxed">
      <div className="border-b border-[#18201B]/12 pb-5">
        <h1 className="font-story text-3xl sm:text-4xl font-bold text-[#18201B]">
          Shipping, PIN Serviceability & Cash on Delivery Policy
        </h1>
      </div>

      <div className="space-y-4">
        <p>
          • <strong>Dispatch Origin:</strong> All orders are packed and dispatched from our main studio and dispatch warehouse at 123, Inner Circle, Connaught Place, Connaught Place, New Delhi, Delhi – 110001, or our Mumbai Regional Studio.
        </p>
        <p>
          • <strong>Free Shipping Threshold:</strong> Orders of ₹999 and above qualify for FREE Insured Delivery across all serviceable Indian PIN codes. Orders below ₹999 carry a flat ₹79 shipping charge.
        </p>
        <p>
          • <strong>Estimated Transit Times:</strong> New Delhi & Delhi: 1–2 business days. Metro cities (Mumbai, Delhi NCR, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad, Jaipur): 2–4 business days. Rest of India: 4–6 business days.
        </p>
        <p>
          • <strong>Cash on Delivery (COD):</strong> Available on serviceable PIN codes for orders up to ₹10,000 with a ₹40 COD handling fee.
        </p>
      </div>
    </div>
  );
}
