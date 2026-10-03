import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Award } from 'lucide-react';

export default function StoryPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12">
      <div className="space-y-3 border-b border-[#18201B]/12 pb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-[#18201B]/65">
          OUR ATELIER ORIGIN • OKHLA & CONNAUGHT PLACE, NEW DELHI (EST. 2019)
        </p>
        <h1 className="font-story text-3xl sm:text-5xl font-bold text-[#18201B] leading-tight">
          Handcrafting Real Full-Grain Leather Outerwear for Decades of Wear
        </h1>
        <p className="text-sm sm:text-base text-[#18201B]/80 max-w-3xl leading-relaxed">
          Whole/retail Name was founded in 2019 to liberate leather outerwear and goods from bonded pleather shortcuts, synthetic coatings, and inflated luxury retail markups.
        </p>
      </div>

      <div className="rounded-[8px] overflow-hidden border border-[#18201B]/15 shadow-sm">
        <img
          src="/images/story-workshop.jpg"
          alt="Whole/retail Name leather cutting table and hide inspection atelier"
          className="w-full aspect-[16/9] object-cover"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-sm text-[#18201B]/85 leading-relaxed">
        <div className="md:col-span-7 space-y-4">
          <h2 className="font-story text-2xl font-bold text-[#18201B]">
            1. The Philosophy of Real Leather
          </h2>
          <p>
            For decades, mass-market retail fashion quietly replaced genuine full-grain hides with bonded polyurethane &quot;pleather&quot;—plastics engineered to peel, crack, and end up in landfills within two seasons.
          </p>
          <p>
            Meanwhile, generational tanners and bench shoemakers across Kolhapur, Ranipet, and Dharavi were cut out by fast-fashion conglomerates. We started Whole/retail Name with an uncompromising commitment to pure, uncorrected full-grain lambskin, supple calfskin, and vegetable-tanned cowhides that develop richer patina year after year.
          </p>
          <p>
            Every jacket, coat, skirt, and bag is individually hand-cut on our Okhla cutting benches, sewn with heavy-duty bonded nylon thread at 12–14 precision stitches per inch, fitted with custom solid brass YKK zippers, and inspected by hand at our Connaught Place studio before dispatch.
          </p>
        </div>

        <div className="md:col-span-5 p-6 rounded-[8px] bg-[#18201B] text-[#F8F5ED] space-y-4">
          <p className="text-xs font-bold uppercase tracking-widest text-[#B28A50]">
            OUR ATELIER STANDARDS
          </p>
          <ul className="space-y-3 text-xs sm:text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#B28A50] shrink-0 mt-0.5" />
              <span>100% Full-Grain Hides: Aniline Lambskin, Drum-Dyed Calf, and Vegetable-Tanned Cowhide.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#B28A50] shrink-0 mt-0.5" />
              <span>Heavy-Duty Hardware: Custom antique brass and gunmetal YKK Excella zippers & solid rivets.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#B28A50] shrink-0 mt-0.5" />
              <span>5-Year Atelier Guarantee: Lifetime seam integrity and complimentary leather conditioning.</span>
            </li>
          </ul>
          <div className="pt-2">
            <Link
              href="/team"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-[#B28A50] text-[#18201B] text-xs font-bold hover:bg-[#9c7540] transition-colors"
            >
              <span>Meet Our Master Craftsmen & Team</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="rounded-[8px] overflow-hidden border border-[#18201B]/15">
          <img
            src="/images/story-tannery.jpg"
            alt="Sustainable vegetable tanning and drum dyeing drums"
            className="w-full aspect-[4/3] object-cover"
          />
          <div className="p-4 bg-[#18201B]/[0.03]">
            <h3 className="font-story text-base font-bold text-[#18201B]">Bark & Vegetable Tannery</h3>
            <p className="text-xs text-[#18201B]/75 mt-1">Natural tree bark extracts, mimosa, and chestnut tannins aged for 45 days in wooden drums.</p>
          </div>
        </div>
        <div className="rounded-[8px] overflow-hidden border border-[#18201B]/15">
          <img
            src="/images/story-craft.jpg"
            alt="Master artisan bench-stitching a leather jacket"
            className="w-full aspect-[4/3] object-cover"
          />
          <div className="p-4 bg-[#18201B]/[0.03]">
            <h3 className="font-story text-base font-bold text-[#18201B]">Precision Bench Craft</h3>
            <p className="text-xs text-[#18201B]/75 mt-1">Every panel aligned by hand, edge-beveled, burnished with beeswax, and double-stitched.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
