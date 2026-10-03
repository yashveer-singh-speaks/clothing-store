import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Clock, ShieldCheck, Sparkles } from 'lucide-react';

export default function VisitStudioPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
      <div className="space-y-2 border-b border-[#18201B]/12 pb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-[#18201B]/65">
          REGISTERED LEATHER ATELIER & WALK-IN STUDIO
        </p>
        <h1 className="font-story text-3xl sm:text-4xl font-bold text-[#18201B]">
          Visit Our Connaught Place Leather Studio in New Delhi
        </h1>
        <p className="text-xs sm:text-sm text-[#18201B]/75 max-w-2xl">
          We are a brick-and-mortar Indian leather atelier. Walk in Monday through Saturday to experience leather swatches, get personalized shoulder and sleeve fitting, or collect your orders in person.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 rounded-[8px] overflow-hidden border border-[#18201B]/15 shadow-sm">
          <img
            src="/images/story-studio.jpg"
            alt="Whole/retail Name Connaught Place New Delhi Leather Studio"
            className="w-full aspect-[16/10] object-cover"
          />
        </div>

        <div className="lg:col-span-5 p-6 rounded-[8px] border border-[#18201B]/20 bg-[#F8F5ED] space-y-4 text-xs sm:text-sm">
          <h2 className="font-story text-2xl font-bold text-[#18201B]">
            Whole/retail Name Pvt. Ltd.
          </h2>
          <p className="flex items-start gap-2 text-[#18201B]/85">
            <MapPin className="w-4 h-4 text-[#B28A50] shrink-0 mt-1" />
            <span>
              123, Inner Circle, Connaught Place, Connaught Place, New Delhi, Delhi – 110001
            </span>
          </p>
          <p className="flex items-center gap-2 text-[#18201B]/85">
            <Phone className="w-4 h-4 text-[#B28A50] shrink-0" />
            <span>Landline: +91 11 4123 9876 • WhatsApp: +91 98765 43210</span>
          </p>
          <p className="flex items-center gap-2 text-[#18201B]/85">
            <Clock className="w-4 h-4 text-[#B28A50] shrink-0" />
            <span>Monday to Saturday: 10:00 AM – 7:00 PM IST</span>
          </p>
          <div className="p-3 rounded bg-[#18201B]/[0.04] font-mono text-xs space-y-1 text-[#18201B]/90">
            <p>GSTIN: 07AABCK4829L1Z5</p>
            <p>CIN: U18101KA2019PTC124890</p>
          </div>
          <Link
            href="/contact"
            className="block w-full py-3 rounded-[6px] bg-[#18201B] text-[#F8F5ED] text-center text-xs font-semibold hover:bg-[#25322b] transition-colors"
          >
            Book a Personal Fitting or Message Studio Desk
          </Link>
        </div>
      </div>
    </div>
  );
}
