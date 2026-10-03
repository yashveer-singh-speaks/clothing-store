'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Star } from 'lucide-react';
import { ProductRecord } from '@/lib/types';
import { useStore } from '@/context/StoreContext';

interface ProductCardProps {
  product: ProductRecord;
  badgeText?: string;
  compact?: boolean;
}

function getShortCardTitle(product: ProductRecord): string {
  if (product.cardTitle && product.cardTitle.trim()) {
    return product.cardTitle.trim();
  }
  return product.title
    .replace(/^Men's\s+/i, '')
    .replace(/^Women's\s+/i, '')
    .replace(/Full-Grain\s+Leather\s+/i, '')
    .replace(/Asymmetric\s+/i, '')
    .replace(/Butter-Soft\s+Leather\s+/i, '')
    .replace(/Tailored\s+Single-Breasted\s+/i, '')
    .replace(/Double-Breasted\s+Belted\s+/i, 'Belted ')
    .trim();
}

export default function ProductCard({ product, badgeText }: ProductCardProps) {
  const { toggleWishlist, wishlistIds } = useStore();

  const price = product.price;
  const mrp = product.mrp;
  const discountPct = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const wishlisted = wishlistIds.includes(product.id);
  const primaryImage = product.images?.[0]?.url || '/images/mens_biker_black.jpg';
  const mobileImage = product.images?.[0]?.mobileUrl || primaryImage;
  const primaryAlt = product.images?.[0]?.alt || product.title;
  const displayTitle = getShortCardTitle(product);

  // Only show verified badges backed by real sales or disclosed limited stock (Fix 12)
  const rawBadge = badgeText || product.badge || '';
  const verifiedBadge =
    rawBadge === 'Bestseller' || rawBadge.startsWith('Limited') ? rawBadge : '';

  const hasVerifiedReviews =
    typeof product.reviewCount === 'number' &&
    product.reviewCount > 0 &&
    typeof product.ratingAverage === 'number' &&
    product.ratingAverage > 0;

  return (
    <article className="group relative h-full flex flex-col bg-[#F8F5ED] border border-[#18201B]/12 rounded-[6px] overflow-hidden transition-colors duration-200 hover:border-[#18201B]/40">
      {/* 4:5 Product Image Area (Visual 03 & Visual 04) */}
      <div className="relative aspect-[4/5] w-full bg-[#ECE7DC] overflow-hidden border-b border-[#18201B]/8">
        <Link
          href={`/product/${product.id}`}
          className="block w-full h-full focus:outline-none"
          aria-label={product.title}
        >
          <picture>
            {mobileImage !== primaryImage && (
              <source
                media="(max-width: 767px)"
                srcSet={mobileImage}
                type={mobileImage.endsWith('.webp') ? 'image/webp' : undefined}
              />
            )}
            <img
              src={primaryImage}
              alt={primaryAlt}
              width={1000}
              height={1250}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith('/images/mens_biker_black.jpg')) {
                  target.src = '/images/mens_biker_black.jpg';
                }
              }}
              className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </picture>
        </Link>

        {/* Top-left badge: only shown when backed by verified sales or disclosed limited stock (Fix 12) */}
        {verifiedBadge && (
          <span className="pointer-events-none absolute top-2.5 left-2.5 bg-[#18201B] text-[#F8F5ED] text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-[4px]">
            {verifiedBadge}
          </span>
        )}

        {/* Top-right Wishlist Button (44x44 touch target per WCAG 2.2 AA) */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id, product.title);
          }}
          aria-label={
            wishlisted
              ? `Remove ${product.title} from wishlist`
              : `Save ${product.title} to wishlist`
          }
          className="absolute top-2 right-2 w-11 h-11 rounded-full bg-[#F8F5ED]/90 border border-[#18201B]/15 flex items-center justify-center text-[#18201B] hover:border-[#18201B]/45 transition-colors cursor-pointer z-10"
        >
          <Heart
            className="w-4 h-4"
            fill={wishlisted ? '#B28A50' : 'none'}
            stroke="#18201B"
          />
        </button>
      </div>

      {/* Card Body: Whole area links to product page; clean hierarchy per Fixes 13, 14, 15, 18, 20 */}
      <Link
        href={`/product/${product.id}`}
        className="flex flex-col flex-1 justify-between p-3 sm:p-4 gap-2 focus:outline-none"
      >
        <div className="space-y-1">
          {/* 1. Short Product Title: max 2 lines, 14.5px/19px mobile, 17px/23px desktop (Fix 13) */}
          <h3 className="text-[14.5px] leading-[19px] sm:text-[17px] sm:leading-[23px] font-medium text-[#18201B] line-clamp-2 group-hover:underline">
            {displayTitle}
          </h3>

          {/* Complete short material line only if accurate and non-truncated (Fix 14) */}
          {product.materialLabel && (
            <p className="text-xs text-[#18201B]/65 leading-snug">
              {product.materialLabel}
            </p>
          )}

          {/* 2. Verified Rating: shown ONLY when real review records exist (Fix 12 & Fix 20) */}
          {hasVerifiedReviews && (
            <div className="inline-flex items-center gap-1 text-xs text-[#18201B] pt-0.5">
              <Star className="w-3.5 h-3.5 fill-[#B28A50] text-[#18201B] shrink-0" />
              <span className="font-semibold price-num">
                {product.ratingAverage.toFixed(1)}
              </span>
              <span className="text-[#18201B]/60 price-num">
                ({product.reviewCount})
              </span>
            </div>
          )}
        </div>

        {/* 3 & 4. Selling Price + Original Price + Quiet Discount (Fix 20) */}
        <div className="pt-0.5 price-num">
          <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5">
            <span className="text-[16px] sm:text-[17px] font-semibold text-[#18201B]">
              ₹{price.toLocaleString('en-IN')}
            </span>
            {mrp > price && (
              <span className="text-[12px] sm:text-[13px] text-[#18201B]/55 line-through">
                ₹{mrp.toLocaleString('en-IN')}
              </span>
            )}
            {discountPct > 0 && (
              <span className="text-[11px] sm:text-[12px] font-normal text-[#18201B]/70">
                ({discountPct}% off)
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
