import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-6 text-xs sm:text-sm leading-relaxed">
      <div className="border-b border-[#18201B]/12 pb-5">
        <h1 className="font-story text-3xl sm:text-4xl font-bold text-[#18201B]">
          Privacy Policy & DPDP Act 2023 Compliance
        </h1>
      </div>

      <div className="space-y-4">
        <p>
          Whole/retail Name Pvt. Ltd. processes customer personal data strictly in accordance with India&apos;s Digital Personal Data Protection (DPDP) Act, 2023.
        </p>
        <p>
          • <strong>Purpose Limitation:</strong> Your name, mobile number, email, and shipping address are collected solely to fulfil your orders, issue statutory GST invoices, and provide shipment tracking and return support.
        </p>
        <p>
          • <strong>Self-Service Data Rights:</strong> You may export a machine-readable JSON archive of your data or request erasure of your profile at any time from our{' '}
          <Link href="/account?tab=privacy" className="underline font-semibold">
            DPDP Privacy Controls
          </Link>{' '}
          page.
        </p>
        <p>
          • <strong>Statutory Tax Retention:</strong> Under the Central Goods and Services Tax (CGST) Act, tax invoices must be retained for 8 years for audit compliance even after marketing profile deletion.
        </p>
      </div>
    </div>
  );
}
