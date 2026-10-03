'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CategoryRecord, CollectionRecord } from '@/lib/types';
import { useStore } from '@/context/StoreContext';

export default function CategoriesIndexPage() {
  const { categories: storeCats, collections: storeCols } = useStore();
  const [categories, setCategories] = useState<CategoryRecord[]>(storeCats);
  const [collections, setCollections] = useState<CollectionRecord[]>(storeCols);

  useEffect(() => {
    if (storeCats.length > 0) setCategories(storeCats);
    if (storeCols.length > 0) setCollections(storeCols);
  }, [storeCats, storeCols]);

  useEffect(() => {
    fetch('/api/storefront')
      .then((r) => r.json())
      .then((data) => {
        setCategories(data.categories || []);
        setCollections(data.collections || []);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      <div className="space-y-2 border-b border-[#18201B]/12 pb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-[#18201B]/65">
          STORE DEPARTMENTS
        </p>
        <h1 className="font-story text-3xl sm:text-4xl font-bold text-[#18201B]">
          Shop by Craft & Department
        </h1>
        <p className="text-xs sm:text-sm text-[#18201B]/75 max-w-2xl">
          Browse our leather atelier departments and seasonal curations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="group flex flex-col rounded-[8px] border border-[#18201B]/15 bg-[#F8F5ED] overflow-hidden hover:border-[#B28A50] transition-colors"
          >
            <div className="aspect-[4/5] bg-[#18201B]/5 overflow-hidden border-b border-[#18201B]/10">
              <img
                src={cat.image}
                alt={cat.imageAlt || cat.name}
                onError={(e) => {
                  const t = e.currentTarget;
                  if (!t.src.endsWith('/images/cat-jackets.jpg')) {
                    t.src = '/images/cat-jackets.jpg';
                  }
                }}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h2 className="font-story text-xl font-bold text-[#18201B] group-hover:underline">
                  {cat.name}
                </h2>
                <p className="text-xs sm:text-sm text-[#18201B]/75 mt-1 leading-relaxed">
                  {cat.description}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#18201B]">
                <span>Explore Department</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B28A50]" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {collections.length > 0 && (
        <div className="space-y-5 pt-6 border-t border-[#18201B]/12">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#18201B]/65">
              CURATED EDITS
            </p>
            <h2 className="font-story text-2xl sm:text-3xl font-bold text-[#18201B] mt-1">
              Shop by Seasonal & Story Collection
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map((col) => (
              <Link
                key={col.id}
                href={`/collection/${col.slug}`}
                className="p-5 rounded-[6px] border border-[#18201B]/15 bg-[#18201B]/[0.02] hover:border-[#B28A50] flex flex-col justify-between gap-3"
              >
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[#B28A50]/25 text-[#18201B]">
                    {col.mode === 'automatic' ? 'Dynamic Rule Collection' : 'Curated Edit'}
                  </span>
                  <h3 className="font-story text-xl font-bold text-[#18201B] mt-2">
                    {col.title}
                  </h3>
                  <p className="text-xs text-[#18201B]/75 mt-1">{col.description}</p>
                </div>
                <span className="text-xs font-semibold inline-flex items-center gap-1">
                  <span>View Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#B28A50]" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
