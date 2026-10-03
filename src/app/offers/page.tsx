'use client';

import React, { useEffect, useState } from 'react';
import { Tag, Copy, Check } from 'lucide-react';
import { ProductRecord } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import { useStore } from '@/context/StoreContext';

interface PromotionItem {
  id: string;
  code: string;
  title: string;
  description: string;
  minOrderAmount: number;
  maxDiscountCap?: number | null;
}

export default function OffersPage() {
  const { showToast } = useStore();
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [promotions, setPromotions] = useState<PromotionItem[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/storefront')
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products || []);
        setPromotions(d.promotions || []);
      })
      .catch(() => {});
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopied(code);
    showToast(`Coupon ${code} copied`);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      <div className="space-y-2 border-b border-[#18201B]/12 pb-5">
        <p className="text-xs font-bold uppercase tracking-widest text-[#18201B]/65">
          ACTIVE STORE CAMPAIGNS & COUPONS
        </p>
        <h1 className="font-story text-3xl sm:text-4xl font-bold text-[#18201B]">
          Current Festival Offers & Value Privileges
        </h1>
        <p className="text-xs sm:text-sm text-[#18201B]/75 max-w-2xl">
          Honest, transparent promotions with clear eligibility rules and zero fake countdown timers.
        </p>
      </div>

      {/* Active Coupon Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className="p-6 rounded-[8px] bg-[#18201B] text-[#F8F5ED] border-2 border-[#B28A50] flex flex-col justify-between gap-4"
          >
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase px-2.5 py-0.5 rounded bg-[#B28A50] text-[#18201B]">
                <Tag className="w-3.5 h-3.5" />
                <span>{promo.title}</span>
              </span>
              <p className="text-sm text-[#F8F5ED]/85">{promo.description}</p>
              <p className="text-xs text-[#F8F5ED]/65 price-num">
                Minimum Order: ₹{promo.minOrderAmount.toLocaleString('en-IN')}
                {promo.maxDiscountCap
                  ? ` • Max Savings: ₹${promo.maxDiscountCap}`
                  : ''}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#F8F5ED]/15">
              <span className="font-mono text-base font-bold text-[#B28A50]">
                CODE: {promo.code}
              </span>
              <button
                type="button"
                onClick={() => copyCode(promo.code)}
                className="px-4 py-2 rounded bg-[#B28A50] text-[#18201B] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                {copied === promo.code ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Eligible Products Grid */}
      <div className="space-y-5 pt-4">
        <h2 className="font-story text-2xl sm:text-3xl font-bold">
          Shop Eligible Handloom & Craft Pieces
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
