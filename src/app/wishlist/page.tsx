'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { ProductRecord } from '@/lib/types';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/ProductCard';

export default function WishlistPage() {
  const { wishlistIds } = useStore();
  const [products, setProducts] = useState<ProductRecord[]>([]);

  useEffect(() => {
    fetch('/api/storefront')
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => {});
  }, []);

  const savedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      <div className="border-b border-[#18201B]/12 pb-4">
        <h1 className="font-story text-3xl font-bold flex items-center gap-2">
          <Heart className="w-6 h-6 text-[#B28A50]" />
          <span>Your Saved Wishlist ({savedProducts.length})</span>
        </h1>
      </div>

      {savedProducts.length === 0 ? (
        <div className="p-12 rounded-[8px] border border-[#18201B]/15 text-center space-y-3">
          <p className="font-story text-xl font-bold">Your wishlist is empty</p>
          <Link
            href="/products"
            className="inline-block px-5 py-2.5 rounded bg-[#18201B] text-[#F8F5ED] text-xs font-semibold"
          >
            Browse Handloom Collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {savedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
