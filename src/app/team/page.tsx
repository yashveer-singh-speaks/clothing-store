import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function TeamPage() {
  const people = [
    {
      name: 'Amit Deshmukh',
      role: 'Founder & Leather Sourcing Director',
      location: 'New Delhi & Mumbai',
      bio: 'Visits generational tanneries in Kolhapur, Ranipet, and Tuscany to hand-select unblemished full-grain lambskin, cowhide, and vegetable-tanned hides for every seasonal atelier drop.',
    },
    {
      name: 'Rohan Kulkarni',
      role: 'Head of Atelier Operations & Consumer Grievance Officer',
      location: 'Connaught Place, New Delhi',
      bio: 'Oversees our 18-point leather outerwear inspection bench, temperature-controlled vault storage, and statutory Consumer Protection redressal desk.',
    },
    {
      name: 'Mahesh Jadhav',
      role: 'Master Pattern Cutter & Leather Guild Artisan (32 Years Experience)',
      location: 'Okhla, New Delhi',
      bio: 'Commands our hand-cutting benches, ensuring natural grain lines, collar balance, and ergonomic rider articulation across all café racer and trench silhouettes.',
    },
    {
      name: 'Gajanan Patil',
      role: 'Master Shoemaker & Goodyear-Welt Specialist',
      location: 'Kolhapur, Maharashtra',
      bio: 'Heads the Kolhapur Leather Guild crafting our box calf Chelsea boots on solid wooden lasts with hand-stitched Goodyear welts and stacked leather soles.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
      <div className="space-y-2 border-b border-[#18201B]/12 pb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-[#18201B]/65">
          THE ARTISANS BEHIND THE BENCH & ATELIER
        </p>
        <h1 className="font-story text-3xl sm:text-4xl font-bold text-[#18201B]">
          Named Founder, Master Pattern Cutters & New Delhi Studio Team
        </h1>
        <p className="text-xs sm:text-sm text-[#18201B]/75 max-w-2xl">
          Every leather jacket, coat, skirt, boot, and bag is hand-cut, skived, stitched, inspected, and packed by dedicated craftsmen whose names and standards we proudly stand behind.
        </p>
      </div>

      <div className="rounded-[8px] overflow-hidden border border-[#18201B]/15 shadow-sm">
        <img
          src="/images/story-founder.jpg"
          alt="Founder Amit Deshmukh and master leather artisans of Whole/retail Name"
          className="w-full aspect-[16/9] object-cover"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {people.map((p, i) => (
          <div
            key={i}
            className="p-6 rounded-[8px] border border-[#18201B]/15 bg-[#F8F5ED] space-y-2"
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="font-story text-xl font-bold">{p.name}</h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-[#B28A50]/25">
                {p.location}
              </span>
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#18201B]/70">
              {p.role}
            </p>
            <p className="text-xs sm:text-sm text-[#18201B]/80 leading-relaxed">
              {p.bio}
            </p>
          </div>
        ))}
      </div>

      <div className="pt-4">
        <Link
          href="/visit"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-[6px] bg-[#18201B] text-[#F8F5ED] text-xs sm:text-sm font-semibold hover:bg-[#25322b] transition-colors"
        >
          <span>Visit Our Connaught Place, New Delhi Studio</span>
          <ArrowRight className="w-4 h-4 text-[#B28A50]" />
        </Link>
      </div>
    </div>
  );
}
