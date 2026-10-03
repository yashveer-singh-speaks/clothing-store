'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  Star,
  Copy,
  Check,
  RotateCw,
  Eye,
} from 'lucide-react';
import {
  CMSSection,
  ProductRecord,
  CategoryRecord,
  CollectionRecord,
  GlobalCMSSettings,
} from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import { useStore } from '@/context/StoreContext';

interface StorefrontPayload {
  previewMode: boolean;
  sections: CMSSection[];
  globalSettings: GlobalCMSSettings;
  products: ProductRecord[];
  categories: CategoryRecord[];
  collections: CollectionRecord[];
  reviews: any[];
}

export default function HomePage() {
  const {
    recentlyViewedIds,
    clearRecentlyViewed,
    showToast,
    trackEvent,
    setPinModalOpen,
  } = useStore();
  const [data, setData] = useState<StorefrontPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isDraftPreview, setIsDraftPreview] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const preview = params.get('preview') === 'draft';
    setIsDraftPreview(preview);

    fetch(`/api/storefront${preview ? '?preview=draft' : ''}`)
      .then((r) => r.json())
      .then((payload) => {
        setData(payload);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const resolveProductsForSection = (section: CMSSection): ProductRecord[] => {
    if (!data) return [];

    if (section.productIds && section.productIds.length > 0) {
      const mapped = section.productIds
        .map((id) => data.products.find((p) => p.id === id))
        .filter(Boolean) as ProductRecord[];
      if (mapped.length > 0) return mapped.slice(0, 4);
    }

    if (section.collectionId) {
      const col = data.collections.find(
        (c) => c.id === section.collectionId || c.slug === section.collectionId
      );
      if (col && col.manualProductIds?.length > 0) {
        const mapped = col.manualProductIds
          .map((id) => data.products.find((p) => p.id === id))
          .filter(Boolean) as ProductRecord[];
        if (mapped.length > 0) return mapped.slice(0, 4);
      }
    }

    return data.products.slice(0, 4);
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    showToast(`Coupon code ${code} copied to clipboard`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading || !data) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8 space-y-10">
        <div className="w-full aspect-[5/4] md:aspect-[3/2] max-h-[560px] rounded-[8px] bg-[#E9E2D4] animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="aspect-[4/5] rounded-[6px] bg-[#E9E2D4] animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  const enabledSections = [...data.sections]
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  const recentlyViewedProducts = recentlyViewedIds
    .map((id) => data.products.find((p) => p.id === id))
    .filter(Boolean) as ProductRecord[];

  const recommendedProducts =
    recentlyViewedProducts.length > 0
      ? recentlyViewedProducts.slice(0, 4)
      : data.products.slice(0, 4);

  const lowestJacketPrice = data.products
    .filter((p) => p.productType === 'jacket')
    .reduce((min, p) => (p.price < min ? p.price : min), 16999);

  return (
    <div className="space-y-0">
      {/* Super Admin Draft Preview Banner */}
      {isDraftPreview && (
        <div className="bg-[#B28A50] text-[#18201B] px-4 py-2.5 text-xs sm:text-sm font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>
              CMS Draft Preview Mode — Viewing unpublished homepage section order & content.
            </span>
          </div>
          <Link
            href="/admin?tab=cms"
            className="px-3 py-1 rounded bg-[#18201B] text-[#F8F5ED] text-xs font-semibold"
          >
            Back to Super Admin CMS Editor
          </Link>
        </div>
      )}

      {enabledSections.map((section) => {
        switch (section.type) {
          /* =================================================================
           * SECTION 1: HERO CAMPAIGN (Fixes 01–05, 10, 11, 15, 16 & Visuals 01–03)
           * Mobile order: Eyebrow -> Headline -> Description -> CTAs -> Reassurance -> Image (5:4)
           * Desktop: Text left (~42%), Photography right (~58%, 3:2)
           * ================================================================= */
          case 'hero_campaign':
            return (
              <section
                key={section.id}
                aria-label={section.heading || 'Leather for Everyday Living'}
                onClick={() => trackEvent('section_click', { sectionId: section.id })}
                className="border-b border-[#18201B]/12 bg-[#F8F5ED]"
              >
                <div className="max-w-[1440px] mx-auto px-4 lg:px-8 pt-5 pb-7 lg:py-10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-center">
                    {/* Text & Actions Column: First on Mobile (order-1), Left ~42% on Desktop (lg:col-span-5) */}
                    <div className="lg:col-span-5 order-1">
                      {section.eyebrow && (
                        <p className="inline-flex items-center text-xs lg:text-[13px] font-medium uppercase tracking-[0.06em] text-[#18201B] bg-[#B28A50]/20 px-2.5 py-1 rounded-[4px]">
                          <span>{section.eyebrow}</span>
                        </p>
                      )}

                      <h1 className="mt-2.5 font-story text-[32px] leading-[36px] sm:text-4xl lg:text-[56px] lg:leading-[1.08] font-bold text-[#18201B] max-w-[520px]">
                        {section.heading || 'Leather for Everyday Living'}
                      </h1>

                      {(section.subheading || section.description) && (
                        <p className="mt-3 text-base leading-6 lg:text-[18px] lg:leading-[28px] text-[#18201B]/85 max-w-[48ch]">
                          {section.description || section.subheading}
                        </p>
                      )}

                      {/* Two Equally Clear Filled Dark Green Shopping Buttons (Fix 16) */}
                      <div className="mt-4 grid grid-cols-2 sm:inline-grid lg:flex lg:flex-wrap items-center gap-3">
                        <Link
                          href={section.primaryCtaHref || '/category/men-leather'}
                          className="min-h-[48px] lg:min-h-[50px] px-4 lg:px-6 rounded-[6px] bg-[#18201B] text-[#F8F5ED] text-[15px] font-medium inline-flex items-center justify-center gap-2 hover:bg-[#18201B]/90 transition-colors whitespace-nowrap"
                        >
                          <span>{section.primaryCtaLabel || 'Shop Men'}</span>
                          <ArrowRight className="w-4 h-4 text-[#B28A50] shrink-0" />
                        </Link>

                        <Link
                          href={section.secondaryCtaHref || '/category/women-leather'}
                          className="min-h-[48px] lg:min-h-[50px] px-4 lg:px-6 rounded-[6px] bg-[#18201B] text-[#F8F5ED] text-[15px] font-medium inline-flex items-center justify-center gap-2 hover:bg-[#18201B]/90 transition-colors whitespace-nowrap"
                        >
                          <span>{section.secondaryCtaLabel || 'Shop Women'}</span>
                          <ArrowRight className="w-4 h-4 text-[#B28A50] shrink-0" />
                        </Link>
                      </div>

                      {/* Concise Factual Reassurance Below Hero Buttons (Fix 15) */}
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] lg:text-[13px] text-[#18201B]/80">
                        <span className="inline-flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#B28A50] shrink-0" />
                          <span>Size exchange within 7 days</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#B28A50] shrink-0" />
                          <span>Prices include GST</span>
                        </span>
                        <span className="hidden sm:inline-flex items-center gap-1.5 price-num">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#B28A50] shrink-0" />
                          <span>
                            Jackets from ₹{lowestJacketPrice.toLocaleString('en-IN')}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Photography Column: Below Text on Mobile (order-2, 20px top spacing via grid gap-5), Right ~58% on Desktop (lg:col-span-7) */}
                    <div className="lg:col-span-7 order-2">
                      <div className="relative w-full aspect-[5/4] md:aspect-[3/2] rounded-[8px] overflow-hidden border border-[#18201B]/12 bg-[#E9E2D4]">
                        <picture>
                          <source
                            media="(max-width: 767px)"
                            srcSet="/images/hero-mobile-500.webp 500w, /images/hero-mobile-750.webp 750w, /images/hero-mobile-1250.webp 1250w"
                            sizes="(max-width: 767px) calc(100vw - 32px)"
                            type="image/webp"
                          />
                          <source
                            media="(min-width: 768px)"
                            srcSet="/images/hero-desktop-900.webp 900w, /images/hero-desktop-1200.webp 1200w, /images/hero-desktop-1800.webp 1800w"
                            sizes="(min-width: 1280px) 760px, (min-width: 1024px) 56vw, 92vw"
                            type="image/webp"
                          />
                          <img
                            src={section.desktopImage || '/images/hero-desktop.jpg'}
                            alt={
                              section.imageAlt ||
                              'Two models wearing a black leather biker jacket and a brown leather coat'
                            }
                            width={1800}
                            height={1200}
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                        </picture>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );

          /* =================================================================
           * SECTION 2: SHOP BY CATEGORY (Fix 21: 28px mobile / 40px desktop spacing, no redundant eyebrow)
           * ================================================================= */
          case 'category_shortcuts':
            return (
              <section
                key={section.id}
                aria-label={section.heading || 'Shop by Category'}
                className="pt-7 pb-10 lg:pt-10 lg:pb-14 border-b border-[#18201B]/10"
              >
                <div className="max-w-[1440px] mx-auto px-4 lg:px-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                    <div>
                      <h2 className="font-story text-[28px] lg:text-[34px] font-bold text-[#18201B] leading-tight">
                        {section.heading || 'Shop by Category'}
                      </h2>
                      {section.subheading && (
                        <p className="text-xs sm:text-sm text-[#18201B]/75 mt-1">
                          {section.subheading}
                        </p>
                      )}
                    </div>
                    <Link
                      href={section.primaryCtaHref || '/categories'}
                      className="text-xs sm:text-sm font-semibold text-[#18201B] underline decoration-[#B28A50] underline-offset-4 inline-flex items-center gap-1"
                    >
                      <span>{section.primaryCtaLabel || 'View all categories'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
                    {data.categories.slice(0, 6).map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        className="group flex flex-col rounded-[6px] border border-[#18201B]/12 bg-[#F8F5ED] overflow-hidden hover:border-[#B28A50] transition-colors"
                      >
                        <div className="aspect-[4/5] bg-[#E9E2D4] overflow-hidden border-b border-[#18201B]/8">
                          <img
                            src={cat.image}
                            alt={cat.imageAlt || cat.name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          />
                        </div>
                        <div className="p-3">
                          <h3 className="text-xs sm:text-sm font-semibold text-[#18201B] group-hover:underline">
                            {cat.name}
                          </h3>
                          <p className="text-xs text-[#18201B]/70 mt-0.5 line-clamp-1">
                            {cat.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            );

          /* =================================================================
           * SECTION 5, 7, 9: PRODUCT MERCHANDISING GRIDS
           * (Store Picks / Story-Connected Products / New Arrivals)
           * ================================================================= */
          case 'product_grid':
          case 'product_rail': {
            const sectionProducts = resolveProductsForSection(section);
            const isStoryBridge = section.type === 'product_rail';
            return (
              <section
                key={section.id}
                aria-label={section.heading}
                className={`py-10 sm:py-14 border-b border-[#18201B]/10 ${
                  isStoryBridge ? 'bg-[#18201B]/[0.025]' : 'bg-[#F8F5ED]'
                }`}
              >
                <div className="max-w-[1360px] mx-auto px-4 sm:px-6 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                    <div className="max-w-2xl">
                      {section.eyebrow && (
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#18201B]/70">
                          {section.eyebrow}
                        </p>
                      )}
                      <h2 className="font-story text-2xl sm:text-3xl font-bold text-[#18201B] mt-1">
                        {section.heading}
                      </h2>
                      {(section.subheading || section.description) && (
                        <p className="text-xs sm:text-sm text-[#18201B]/75 mt-1 leading-relaxed">
                          {section.subheading || section.description}
                        </p>
                      )}
                    </div>
                    {section.primaryCtaLabel && section.primaryCtaHref && (
                      <Link
                        href={section.primaryCtaHref}
                        className="text-xs sm:text-sm font-semibold text-[#18201B] underline decoration-[#B28A50] underline-offset-4 inline-flex items-center gap-1.5 shrink-0"
                      >
                        <span>{section.primaryCtaLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
                    {sectionProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        badgeText={isStoryBridge ? 'Origin Craft' : undefined}
                      />
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          /* =================================================================
           * SECTION 6: BUSINESS STORY 1 — WHY THE STORE STARTED
           * ================================================================= */
          /* =================================================================
           * SECTION 6: ORIGIN STORY — WHY WE STARTED (Fixes 01–15)
           * Mobile order: Eyebrow -> Heading -> Paragraph -> 4:3 Visual -> CTA Buttons
           * Desktop: Text right (~50%), 3:2 Macro detail photography left (~50%)
           * ================================================================= */
          case 'story_split':
            return (
              <section
                key={section.id}
                aria-label={section.heading || 'Why We Started'}
                className="py-10 sm:py-16 border-b border-[#18201B]/12 bg-[#18201B] text-[#F8F5ED]"
              >
                <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
                    {/* Text Column: First on Mobile (order-1), Right ~50% on Desktop (lg:col-span-6 lg:order-2) */}
                    <div className="lg:col-span-6 order-1 lg:order-2 space-y-3.5 sm:space-y-4">
                      {section.eyebrow && (
                        <span className="inline-block text-xs lg:text-[13px] font-medium uppercase tracking-[0.06em] text-[#B28A50]">
                          {section.eyebrow}
                        </span>
                      )}

                      <h2 className="font-story text-[29px] leading-[32px] sm:text-3xl lg:text-[40px] lg:leading-[1.1] font-bold text-[#F8F5ED]">
                        {section.heading || 'Why We Started'}
                      </h2>

                      {(section.description || section.subheading) && (
                        <p className="text-[16px] leading-[24px] sm:text-[16.5px] sm:leading-[27px] text-[#F8F5ED]/85 max-w-[58ch]">
                          {section.description || section.subheading}
                        </p>
                      )}

                      {/* Primary Gold CTA & Quiet Shopping Link */}
                      <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <Link
                          href={section.primaryCtaHref || '/about'}
                          className="min-h-[46px] px-5 rounded-[6px] bg-[#B28A50] text-[#18201B] text-[14px] font-bold inline-flex items-center justify-center gap-2 hover:bg-[#B28A50]/90 transition-colors"
                        >
                          <span>{section.primaryCtaLabel || 'Read Our Story'}</span>
                          <ArrowRight className="w-4 h-4 shrink-0" />
                        </Link>

                        <Link
                          href="/products"
                          className="min-h-[46px] px-4 text-[14px] font-semibold text-[#F8F5ED]/80 hover:text-[#F8F5ED] underline decoration-[#B28A50] underline-offset-4 inline-flex items-center"
                        >
                          <span>Shop the Collection</span>
                        </Link>
                      </div>
                    </div>

                    {/* Photography Column: Below Text on Mobile (order-2), Left ~50% on Desktop (lg:col-span-6 lg:order-1) */}
                    <div className="lg:col-span-6 order-2 lg:order-1">
                      <div className="relative w-full aspect-[4/3] lg:aspect-[3/2] rounded-[8px] overflow-hidden border border-[#F8F5ED]/15 bg-[#18201B]">
                        <picture>
                          <source
                            media="(max-width: 767px)"
                            srcSet="/images/story-detail-mobile.webp"
                            type="image/webp"
                          />
                          <source
                            media="(min-width: 768px)"
                            srcSet="/images/story-detail-desktop.webp"
                            type="image/webp"
                          />
                          <img
                            src="/images/story-detail-desktop.jpg"
                            alt="Full-grain leather texture, precision stitching seam, and brushed YKK zipper detail on a Whole/retail Name jacket"
                            width={1800}
                            height={1200}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                        </picture>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );

          /* =================================================================
           * SECTION 8: BUSINESS STORY 2 — MEET THE PEOPLE BEHIND THE STORE
           * ================================================================= */
          /* =================================================================
           * SECTION 8: MAKER SECTION — MEET THE MAKERS (Fixes 01–14)
           * Shared 1440px container, cream background (#F8F5ED)
           * Mobile order: Heading -> Paragraph -> Verified Fact -> 4:3 Visual -> Caption -> CTA Button
           * Desktop: Text left (~50%), 3:2 Artisan photography right (~50%)
           * ================================================================= */
          case 'story_people':
            return (
              <section
                key={section.id}
                aria-label={section.heading || 'Meet the Makers'}
                className="py-10 sm:py-16 border-b border-[#18201B]/12 bg-[#F8F5ED] text-[#18201B]"
              >
                <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
                    {/* Text Column: First on Mobile (order-1), Left ~50% on Desktop (lg:col-span-6 lg:order-1) */}
                    <div className="lg:col-span-6 order-1 lg:order-1 space-y-3 sm:space-y-4">
                      {section.eyebrow && (
                        <span className="inline-block text-xs lg:text-[13px] font-medium uppercase tracking-[0.06em] text-[#18201B]/70">
                          {section.eyebrow}
                        </span>
                      )}

                      <h2 className="font-story text-[28px] leading-[32px] sm:text-3xl lg:text-[38px] lg:leading-[1.12] font-bold text-[#18201B]">
                        {section.heading || 'Meet the Makers'}
                      </h2>

                      {(section.description || section.subheading) && (
                        <p className="text-[16px] leading-[24px] sm:text-[16.5px] sm:leading-[27px] text-[#18201B]/80 max-w-[54ch]">
                          {section.description || section.subheading}
                        </p>
                      )}

                      {section.proofLine && (
                        <p className="text-sm font-semibold text-[#18201B]/75 pt-0.5">
                          {section.proofLine}
                        </p>
                      )}

                      <div className="pt-2">
                        <Link
                          href={section.primaryCtaLabel === 'Meet Our Workshop Team' ? '/story' : (section.primaryCtaHref || '/story')}
                          className="min-h-[48px] px-6 rounded-[6px] bg-[#18201B] text-[#F8F5ED] text-[15px] font-medium inline-flex items-center justify-center gap-2 hover:bg-[#18201B]/90 transition-colors"
                        >
                          <span>{section.primaryCtaLabel === 'Meet Our Workshop Team' ? 'Meet the Team' : (section.primaryCtaLabel || 'Meet the Team')}</span>
                          <ArrowRight className="w-4 h-4 text-[#B28A50] shrink-0" />
                        </Link>
                      </div>
                    </div>

                    {/* Photography Column: Below Text on Mobile (order-2), Right ~50% on Desktop (lg:col-span-6 lg:order-2) */}
                    <div className="lg:col-span-6 order-2 lg:order-2 space-y-2">
                      <div className="relative w-full aspect-[4/3] lg:aspect-[3/2] rounded-[8px] overflow-hidden border border-[#18201B]/15 bg-[#E9E2D4]">
                        <picture>
                          <source
                            media="(max-width: 767px)"
                            srcSet="/images/story-maker-mobile.webp"
                            type="image/webp"
                          />
                          <source
                            media="(min-width: 768px)"
                            srcSet="/images/story-maker-desktop.webp"
                            type="image/webp"
                          />
                          <img
                            src="/images/story-maker-desktop.jpg"
                            alt="Master leather artisan inspecting and fitting a leather racer jacket on a mannequin at our studio"
                            width={1800}
                            height={1200}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                        </picture>
                      </div>
                      <p className="text-[13px] leading-[18px] text-[#18201B]/70">
                        Master artisan inspecting collar fitting and zipper alignment at our Connaught Place studio.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            );

          /* =================================================================
           * SECTION 10: BUSINESS STORY 3 — WHAT MAKES PRODUCTS DIFFERENT
           * ================================================================= */
          /* =================================================================
           * SECTION 10: CONSTRUCTION & MATERIAL DETAILS — A CLOSER LOOK (Fixes 01–14)
           * Shared 1440px container, 44% Image / 56% Text, 4:3 Aspect Ratio
           * Mobile order: Heading -> Description -> 4:3 Visual -> Factual Caption -> 3 Feature Rows -> CTA Button
           * ================================================================= */
          case 'story_craft':
            return (
              <section
                key={section.id}
                aria-label={section.heading || 'A Closer Look at the Details'}
                className="py-10 sm:py-16 border-b border-[#18201B]/12 bg-[#18201B]/[0.03] text-[#18201B]"
              >
                <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
                    {/* Visual Column: Left ~44% on Desktop (lg:col-span-5) */}
                    <div className="lg:col-span-5 order-2 lg:order-1 space-y-2">
                      <div className="relative w-full aspect-[4/3] rounded-[8px] overflow-hidden border border-[#18201B]/15 bg-[#F8F5ED]">
                        <picture>
                          <source
                            media="(max-width: 767px)"
                            srcSet="/images/craft-detail-mobile.webp"
                            type="image/webp"
                          />
                          <source
                            media="(min-width: 768px)"
                            srcSet="/images/craft-detail-desktop.webp"
                            type="image/webp"
                          />
                          <img
                            src="/images/craft-detail-desktop.jpg"
                            alt="Detail from the Obsidian Full-Grain Leather Asymmetric Biker Jacket showing lapel snap button, YKK zipper, and shoulder quilting"
                            width={1600}
                            height={1200}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                        </picture>
                      </div>
                      <p className="text-[13px] leading-[18px] text-[#18201B]/70">
                        Detail from the{' '}
                        <Link href="/product/mens-full-grain-leather-biker-jacket-black" className="font-semibold underline decoration-[#B28A50] hover:text-[#18201B]">
                          Obsidian Full-Grain Leather Asymmetric Biker Jacket
                        </Link>.
                      </p>
                    </div>

                    {/* Text & Feature Cards Column: Right ~56% on Desktop (lg:col-span-7) */}
                    <div className="lg:col-span-7 order-1 lg:order-2 space-y-4">
                      <div>
                        {section.eyebrow && (
                          <span className="inline-block text-xs lg:text-[13px] font-medium uppercase tracking-[0.06em] text-[#18201B]/70 mb-1">
                            {section.eyebrow}
                          </span>
                        )}
                        <h2 className="font-story text-[28px] leading-[32px] sm:text-3xl lg:text-[38px] lg:leading-[1.12] font-bold text-[#18201B]">
                          {section.heading || 'A Closer Look at the Details'}
                        </h2>
                        <p className="text-[16px] leading-[24px] sm:text-[17px] sm:leading-[27px] text-[#18201B]/80 max-w-[62ch] mt-2">
                          Look closer at the leather, stitching, and finishing details of each style. Check individual product pages for exact material, lining, and hardware specifications.
                        </p>
                      </div>

                      {/* 3 Detail Cards (Desktop 3-column / Mobile subtle stacked rows without checkmark icons) */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-1">
                        <div className="p-4 rounded-[6px] bg-[#F8F5ED] border border-[#18201B]/15 space-y-1">
                          <h3 className="text-[15px] font-semibold text-[#18201B]">
                            Leather Grade
                          </h3>
                          <p className="text-[13.5px] leading-[20px] text-[#18201B]/75">
                            Hand-selected full-grain lambskin and goat nappa. Specific hide specs are detailed per style.
                          </p>
                        </div>

                        <div className="p-4 rounded-[6px] bg-[#F8F5ED] border border-[#18201B]/15 space-y-1">
                          <h3 className="text-[15px] font-semibold text-[#18201B]">
                            Seam Construction
                          </h3>
                          <p className="text-[13.5px] leading-[20px] text-[#18201B]/75">
                            High-stress panels feature heavy-gauge bonded nylon thread and double-stitched seams.
                          </p>
                        </div>

                        <div className="p-4 rounded-[6px] bg-[#F8F5ED] border border-[#18201B]/15 space-y-1">
                          <h3 className="text-[15px] font-semibold text-[#18201B]">
                            Lining & Hardware
                          </h3>
                          <p className="text-[13.5px] leading-[20px] text-[#18201B]/75">
                            Smooth viscose satin or cotton linings paired with heavy-duty YKK metal zippers.
                          </p>
                        </div>
                      </div>

                      {/* Useful Next Step CTA Button */}
                      <div className="pt-2">
                        <Link
                          href="/products"
                          className="min-h-[48px] px-6 rounded-[6px] bg-[#18201B] text-[#F8F5ED] text-[15px] font-medium inline-flex items-center justify-center gap-2 hover:bg-[#18201B]/90 transition-colors"
                        >
                          <span>Explore the Collection</span>
                          <ArrowRight className="w-4 h-4 text-[#B28A50] shrink-0" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );

          /* =================================================================
           * SECTION 11: CUSTOMER REVIEWS & SERVICE INFORMATION
           * ================================================================= */
          case 'reviews_service':
            return (
              <section
                key={section.id}
                aria-label={section.heading}
                className="py-12 sm:py-16 border-b border-[#18201B]/12 bg-[#F8F5ED]"
              >
                <div className="max-w-[1360px] mx-auto px-4 sm:px-6 space-y-8">
                  <div className="max-w-2xl">
                    {section.eyebrow && (
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#18201B]/65">
                        {section.eyebrow}
                      </p>
                    )}
                    <h2 className="font-story text-2xl sm:text-3xl font-bold text-[#18201B] mt-1">
                      {section.heading}
                    </h2>
                    {section.subheading && (
                      <p className="text-xs sm:text-sm text-[#18201B]/75 mt-1">
                        {section.subheading}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {data.reviews.slice(0, 4).map((rev: any) => (
                        <div
                          key={rev.id}
                          className="p-5 rounded-[6px] border border-[#18201B]/15 bg-[#F8F5ED] flex flex-col justify-between space-y-3"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className="w-3.5 h-3.5 fill-[#B28A50] text-[#18201B]"
                                  />
                                ))}
                              </div>
                              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#B28A50]/20 text-[#18201B]">
                                Verified Buyer
                              </span>
                            </div>
                            <h3 className="text-sm font-bold text-[#18201B]">
                              {rev.title}
                            </h3>
                            <p className="text-xs text-[#18201B]/80 leading-relaxed">
                              &ldquo;{rev.body || rev.comment}&rdquo;
                            </p>
                          </div>

                          <div className="pt-2 border-t border-[#18201B]/10 flex items-center justify-between text-[11px] text-[#18201B]/70">
                            <span className="font-semibold text-[#18201B]">
                              {rev.customerName} • {rev.city}
                            </span>
                            <Link
                              href={`/product/${rev.productId}`}
                              className="underline hover:text-[#18201B] truncate max-w-[140px]"
                            >
                              {rev.productTitle}
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="lg:col-span-5 p-6 rounded-[8px] bg-[#18201B] text-[#F8F5ED] flex flex-col justify-between space-y-5">
                      <div className="space-y-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-[#B28A50]">
                          PLAIN-LANGUAGE STORE POLICIES
                        </p>
                        <h3 className="font-story text-2xl font-bold">
                          Clear Delivery, Exchange & Payment Terms
                        </h3>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="p-3 rounded bg-[#F8F5ED]/[0.05] border border-[#F8F5ED]/10 space-y-1">
                          <p className="font-bold text-[#B28A50]">
                            24-Hour Studio Dispatch
                          </p>
                          <p className="text-[#F8F5ED]/85">
                            Free delivery across India on orders over ₹999. Check your 6-digit PIN code for exact arrival window.
                          </p>
                        </div>
                        <div className="p-3 rounded bg-[#F8F5ED]/[0.05] border border-[#F8F5ED]/10 space-y-1">
                          <p className="font-bold text-[#B28A50]">
                            7-Day Free Size Exchange & Returns
                          </p>
                          <p className="text-[#F8F5ED]/85">
                            Reverse doorstep pickup across serviceable PIN codes. Full refund via UPI or original payment method.
                          </p>
                        </div>
                        <div className="p-3 rounded bg-[#F8F5ED]/[0.05] border border-[#F8F5ED]/10 space-y-1">
                          <p className="font-bold text-[#B28A50]">
                            UPI, RuPay, Cards & Cash on Delivery
                          </p>
                          <p className="text-[#F8F5ED]/85">
                            Pay with any UPI app, scan our verified merchant QR, or select COD on eligible PIN codes.
                          </p>
                        </div>
                      </div>

                      {/* Separated Store Rating Citation Block (Per Section 7.11) */}
                      <div className="pt-3 border-t border-[#F8F5ED]/15 flex items-center justify-between gap-3 text-[11px]">
                        <div>
                          <p className="font-bold text-[#B28A50] uppercase tracking-wider">
                            Store Rating (Separated from Product Reviews)
                          </p>
                          <p className="text-[#F8F5ED]/85 mt-0.5">
                            <strong>4.8 / 5.0</strong> • 412 Studio Reviews • Source: Google Business Profile (Retrieved Sep 2026)
                          </p>
                        </div>
                        <Link
                          href="/visit"
                          className="shrink-0 px-2.5 py-1.5 rounded bg-[#F8F5ED]/10 border border-[#B28A50]/50 text-[#F8F5ED] font-semibold hover:bg-[#F8F5ED]/20"
                        >
                          Verify Studio
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );

          /* =================================================================
           * SECTION 12: CURRENT OFFER OR CAMPAIGN
           * ================================================================= */
          case 'campaign_offer':
            return (
              <section
                key={section.id}
                aria-label={section.heading}
                className="py-10 sm:py-12 border-b border-[#18201B]/12 bg-[#F8F5ED]"
              >
                <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
                  <div className="rounded-[8px] bg-[#18201B] text-[#F8F5ED] border-2 border-[#B28A50] p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-8 space-y-2.5">
                      <span className="inline-block text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-[#B28A50] text-[#18201B]">
                        {section.eyebrow || 'ACTIVE STORE OFFER'}
                      </span>
                      <h2 className="font-story text-2xl sm:text-3xl font-bold text-[#F8F5ED]">
                        {section.heading}
                      </h2>
                      {section.description && (
                        <p className="text-xs sm:text-sm text-[#F8F5ED]/85 max-w-2xl leading-relaxed">
                          {section.description}
                        </p>
                      )}
                      {section.offerConditions && (
                        <p className="text-[11px] text-[#F8F5ED]/65 pt-1">
                          Terms: {section.offerConditions}
                        </p>
                      )}
                    </div>

                    <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-end gap-3">
                      {section.offerCode && (
                        <button
                          type="button"
                          onClick={() => handleCopyCoupon(section.offerCode!)}
                          className="px-4 py-3 rounded-[6px] bg-[#F8F5ED]/10 border border-dashed border-[#B28A50] text-[#F8F5ED] flex items-center justify-between gap-3 text-xs font-mono cursor-pointer hover:bg-[#F8F5ED]/15"
                        >
                          <span>
                            CODE:{' '}
                            <strong className="text-[#B28A50] text-sm">
                              {section.offerCode}
                            </strong>
                          </span>
                          {copiedCode === section.offerCode ? (
                            <span className="inline-flex items-center gap-1 text-[#B28A50] font-sans font-semibold">
                              <Check className="w-3.5 h-3.5" /> Copied
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[#F8F5ED]/80 font-sans">
                              <Copy className="w-3.5 h-3.5" /> Copy Code
                            </span>
                          )}
                        </button>
                      )}

                      {section.primaryCtaLabel && section.primaryCtaHref && (
                        <Link
                          href={section.primaryCtaHref}
                          className="px-5 py-3 rounded-[6px] bg-[#B28A50] text-[#18201B] text-xs sm:text-sm font-bold text-center inline-flex items-center justify-center gap-2 hover:bg-[#B28A50]/90"
                        >
                          <span>{section.primaryCtaLabel}</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            );

          /* =================================================================
           * SECTION 13: SHOP BY NEED OR BUDGET
           * ================================================================= */
          /* =================================================================
           * SECTION 13: STYLED COLLECTIONS — FIND YOUR NEXT LOOK (Fixes 01–15)
           * Shared 1440px container, cream background (#F8F5ED)
           * Mobile: 2-column × 2-row grid (4:5 aspect ratio)
           * Desktop: 4-column grid (4:3 aspect ratio)
           * ================================================================= */
          case 'shop_by_need':
            return (
              <section
                key={section.id}
                aria-label={section.heading || 'Find Your Next Look'}
                className="py-10 sm:py-16 border-b border-[#18201B]/12 bg-[#F8F5ED] text-[#18201B]"
              >
                <div className="max-w-[1440px] mx-auto px-4 lg:px-8 space-y-6">
                  <div>
                    <h2 className="font-story text-[28px] leading-[32px] sm:text-3xl lg:text-[36px] lg:leading-[1.15] font-bold text-[#18201B]">
                      {section.heading || 'Find Your Next Look'}
                    </h2>
                    <p className="text-[16px] leading-[24px] sm:text-[17px] sm:leading-[26px] text-[#18201B]/80 max-w-[600px] mt-1.5">
                      {section.subheading || 'Explore styled collections for everyday plans, evenings out and weekends away.'}
                    </p>
                  </div>

                  {/* Collection Cards: Mobile 2-column grid / Desktop 4-column grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    {[
                      {
                        title: 'Everyday Layers',
                        subtitle: 'Jackets styled for everyday outfits.',
                        linkText: 'Shop Everyday Layers',
                        href: '/category/jackets',
                        desktopImg: '/images/col-everyday-layers-desktop.webp',
                        mobileImg: '/images/col-everyday-layers-mobile.webp',
                        alt: 'Adult Indian male model wearing obsidian black leather biker jacket with neutral everyday clothing',
                      },
                      {
                        title: 'Statement Coats',
                        subtitle: 'Explore the longer silhouettes.',
                        linkText: 'Shop Statement Coats',
                        href: '/category/coats',
                        desktopImg: '/images/col-statement-coats-desktop.webp',
                        mobileImg: '/images/col-statement-coats-mobile.webp',
                        alt: 'Adult Indian male model wearing saddle brown belted double-breasted leather trench coat',
                      },
                      {
                        title: 'Evening Styles',
                        subtitle: 'Skirts and layers for evenings out.',
                        linkText: 'Shop Evening Styles',
                        href: '/category/skirts',
                        desktopImg: '/images/col-evening-styles-desktop.webp',
                        mobileImg: '/images/col-evening-styles-mobile.webp',
                        alt: 'Adult Indian female model wearing high-waisted black leather A-line midi skirt',
                      },
                      {
                        title: 'Weekend Travel',
                        subtitle: 'Bags for your next short trip.',
                        linkText: 'Shop Weekend Travel',
                        href: '/category/accessories',
                        desktopImg: '/images/col-weekend-travel-desktop.webp',
                        mobileImg: '/images/col-weekend-travel-mobile.webp',
                        alt: 'Bourbon brown full-grain leather 45L weekend travel duffel bag resting on a light stone bench',
                      },
                    ].map((col, i) => (
                      <Link
                        key={i}
                        href={col.href}
                        className="group rounded-[8px] border border-[#18201B]/15 bg-[#F8F5ED] overflow-hidden hover:border-[#B28A50] transition-colors flex flex-col focus:outline-none focus:ring-2 focus:ring-[#B28A50]"
                      >
                        <div className="relative w-full aspect-[4/5] lg:aspect-[4/3] bg-[#E9E2D4] overflow-hidden border-b border-[#18201B]/10">
                          <picture>
                            <source
                              media="(max-width: 767px)"
                              srcSet={col.mobileImg}
                              type="image/webp"
                            />
                            <source
                              media="(min-width: 768px)"
                              srcSet={col.desktopImg}
                              type="image/webp"
                            />
                            <img
                              src={col.desktopImg.replace('.webp', '.jpg')}
                              alt={col.alt}
                              width={1200}
                              height={900}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            />
                          </picture>
                        </div>
                        <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
                          <div>
                            <h3 className="font-story text-[17px] leading-[22px] sm:text-xl font-bold text-[#18201B] group-hover:underline">
                              {col.title}
                            </h3>
                            <p className="text-[12px] sm:text-[13.5px] leading-[17px] sm:leading-[21px] text-[#18201B]/75 mt-0.5">
                              {col.subtitle}
                            </p>
                          </div>
                          <span className="inline-flex items-center gap-1 text-[13px] sm:text-[14px] font-semibold text-[#18201B] pt-1">
                            <span>{col.linkText}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#B28A50] shrink-0" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            );

          /* =================================================================
           * SECTION 14: BUSINESS STORY 4 — REAL LOCAL BUSINESS & CONTACT
           * ================================================================= */
          /* =================================================================
           * SECTION 14: LOCAL STUDIO & CONTACT — VISIT OUR NEW DELHI STUDIO (Fixes 01–15)
           * Shared 1440px container, cream background (#F8F5ED)
           * Desktop: 55% Text / 45% Image
           * Mobile order: Heading -> Description -> Location & Hours -> CTAs -> Support -> Studio Photo
           * ================================================================= */
          case 'story_local_store':
            return (
              <section
                key={section.id}
                aria-label={section.heading || 'Visit Our New Delhi Studio'}
                className="py-10 sm:py-16 border-b border-[#18201B]/12 bg-[#F8F5ED] text-[#18201B]"
              >
                <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
                    {/* Information & Contact Actions Column: Left ~55% on Desktop (lg:col-span-7) */}
                    <div className="lg:col-span-7 order-1 lg:order-1 space-y-4">
                      <div>
                        {section.eyebrow && (
                          <span className="inline-block text-xs lg:text-[13px] font-medium uppercase tracking-[0.06em] text-[#18201B]/70 mb-1">
                            {section.eyebrow}
                          </span>
                        )}
                        <h2 className="font-story text-[28px] leading-[32px] sm:text-3xl lg:text-[38px] lg:leading-[1.12] font-bold text-[#18201B]">
                          {section.heading || 'Visit Our New Delhi Studio'}
                        </h2>
                        <p className="text-[16px] leading-[24px] sm:text-[17px] sm:leading-[27px] text-[#18201B]/80 max-w-[58ch] mt-2">
                          Try available styles, check your fit and speak with our team in person. Walk-ins welcome — contact us to check specific size or style availability before visiting.
                        </p>
                      </div>

                      {/* Studio Location & Support Details Grid */}
                      <div className="p-4 sm:p-5 rounded-[8px] bg-[#F8F5ED] border border-[#18201B]/20 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-[13px]">
                        {/* Location & Studio Hours */}
                        <div className="space-y-2">
                          <p className="font-bold text-[#18201B] flex items-center gap-1.5 text-sm">
                            <MapPin className="w-4 h-4 text-[#B28A50] shrink-0" />
                            <span>Connaught Place Flagship Studio</span>
                          </p>
                          <p className="text-[#18201B]/80 leading-relaxed">
                            {section.storeDetails?.address || data.globalSettings.footer.address}
                          </p>
                          <div className="pt-1 space-y-1 text-[12px] text-[#18201B]/75">
                            <p className="font-semibold text-[#18201B]">Studio Hours:</p>
                            <p>Mon–Sat: 10:00 AM – 7:00 PM IST</p>
                            <p className="text-[#18201B]/60 italic">Closed Sundays</p>
                          </div>
                        </div>

                        {/* Customer Support & Operable Contacts */}
                        <div className="space-y-2 sm:border-l sm:border-[#18201B]/12 sm:pl-4">
                          <p className="font-bold text-[#18201B] flex items-center gap-1.5 text-sm">
                            <Phone className="w-4 h-4 text-[#B28A50] shrink-0" />
                            <span>Customer Support</span>
                          </p>
                          <p className="text-[#18201B]/80">
                            <strong>Phone:</strong>{' '}
                            <a
                              href={`tel:${(section.storeDetails?.phone || data.globalSettings.footer.phone).replace(/\s+/g, '')}`}
                              className="font-semibold text-[#18201B] underline hover:text-[#B28A50]"
                            >
                              {section.storeDetails?.phone || data.globalSettings.footer.phone}
                            </a>
                          </p>
                          <p className="text-[#18201B]/80">
                            <strong>WhatsApp:</strong>{' '}
                            <a
                              href="https://wa.me/919876543210"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-[#18201B] underline hover:text-[#B28A50]"
                            >
                              {section.storeDetails?.whatsapp || data.globalSettings.footer.whatsapp}
                            </a>
                          </p>
                          <div className="pt-1 space-y-1 text-[12px] text-[#18201B]/75">
                            <p className="font-semibold text-[#18201B]">Support Hours:</p>
                            <p>Mon–Sat: 10:00 AM – 7:00 PM IST</p>
                          </div>
                        </div>
                      </div>

                      {/* Operable Action Buttons */}
                      <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <a
                          href="https://maps.google.com/?q=12th+Main+Road+Connaught Place+New Delhi+110001"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[48px] px-6 rounded-[6px] bg-[#18201B] text-[#F8F5ED] text-[15px] font-medium inline-flex items-center justify-center gap-2 hover:bg-[#18201B]/90 transition-colors text-center"
                        >
                          <span>Get Studio Directions</span>
                          <ArrowRight className="w-4 h-4 text-[#B28A50] shrink-0" />
                        </a>

                        <a
                          href="https://wa.me/919876543210"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[48px] px-5 rounded-[6px] border border-[#18201B]/30 text-[#18201B] text-[15px] font-semibold hover:border-[#B28A50] inline-flex items-center justify-center text-center transition-colors"
                        >
                          Message Us on WhatsApp
                        </a>
                      </div>
                    </div>

                    {/* Studio Photography Column: Right ~45% on Desktop (lg:col-span-5) */}
                    <div className="lg:col-span-5 order-2 lg:order-2">
                      <div className="relative w-full aspect-[3/2] rounded-[8px] overflow-hidden border border-[#18201B]/15 bg-[#E9E2D4]">
                        <picture>
                          <source
                            media="(max-width: 767px)"
                            srcSet="/images/story-studio-mobile.webp"
                            type="image/webp"
                          />
                          <source
                            media="(min-width: 768px)"
                            srcSet="/images/story-studio-desktop.webp"
                            type="image/webp"
                          />
                          <img
                            src="/images/story-studio-desktop.jpg"
                            alt="Whole/retail Name Connaught Place studio entrance, leather outerwear display, and fitting lounge"
                            width={1800}
                            height={1200}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                        </picture>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );

          /* =================================================================
           * SECTION 15: RECENTLY VIEWED OR RECOMMENDED FOR YOU
           * ================================================================= */
          case 'recently_viewed':
            return (
              <section
                key={section.id}
                aria-label={section.heading}
                className="py-10 sm:py-14 border-b border-[#18201B]/10 bg-[#F8F5ED]"
              >
                <div className="max-w-[1360px] mx-auto px-4 sm:px-6 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#18201B]/65">
                        {recentlyViewedProducts.length > 0
                          ? 'YOUR BROWSING HISTORY'
                          : section.eyebrow || 'TAILORED FOR YOU'}
                      </p>
                      <h2 className="font-story text-2xl sm:text-3xl font-bold text-[#18201B] mt-1">
                        {recentlyViewedProducts.length > 0
                          ? 'Recently Viewed Pieces'
                          : section.heading}
                      </h2>
                    </div>

                    {recentlyViewedProducts.length > 0 && (
                      <button
                        type="button"
                        onClick={clearRecentlyViewed}
                        className="text-xs font-semibold text-[#18201B]/75 hover:text-[#18201B] underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Clear Browsing History</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
                    {recommendedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              </section>
            );

          /* =================================================================
           * FAQ ACCORDION SECTION
           * ================================================================= */
          case 'faq_accordion':
            return (
              <section
                key={section.id}
                aria-label={section.heading}
                className="py-10 sm:py-14 border-b border-[#18201B]/12 bg-[#F8F5ED]"
              >
                <div className="max-w-[1360px] mx-auto px-4 sm:px-6 space-y-6">
                  <div className="max-w-2xl">
                    {section.eyebrow && (
                      <p className="text-xs font-bold uppercase tracking-widest text-[#18201B]/65">
                        {section.eyebrow}
                      </p>
                    )}
                    <h2 className="font-story text-2xl sm:text-3xl font-bold text-[#18201B] mt-1">
                      {section.heading}
                    </h2>
                    {section.description && (
                      <p className="text-xs sm:text-sm text-[#18201B]/75 mt-1">
                        {section.description}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(section.facts && section.facts.length > 0
                      ? section.facts
                      : [
                          {
                            title: 'How long does delivery take across India?',
                            body: 'Orders ship within 24 hours from our Connaught Place, New Delhi studio. Metro cities receive parcels in 1–3 business days; rest of India takes 3–5 business days.',
                          },
                          {
                            title: 'How does the 7-day doorstep size exchange work?',
                            body: 'Log in to My Account, select your order, and request a size exchange or return. Our courier partner picks up the parcel from your doorstep at no extra cost.',
                          },
                        ]
                    ).map((faq, idx) => (
                      <details
                        key={idx}
                        open={idx === 0}
                        className="p-4 rounded-[6px] border border-[#18201B]/15 bg-[#F8F5ED] group"
                      >
                        <summary className="text-sm font-bold text-[#18201B] cursor-pointer list-none flex items-center justify-between">
                          <span>{faq.title}</span>
                          <span className="text-xs text-[#B28A50] font-bold">▼</span>
                        </summary>
                        <p className="text-xs text-[#18201B]/80 leading-relaxed mt-2 pt-2 border-t border-[#18201B]/10">
                          {faq.body}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              </section>
            );

          /* =================================================================
           * PROMOTION STRIP SECTION
           * ================================================================= */
          case 'promotion_strip':
            return (
              <section
                key={section.id}
                aria-label={section.heading}
                className="py-5 border-b border-[#18201B]/12 bg-[#18201B] text-[#F8F5ED]"
              >
                <div className="max-w-[1360px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {section.eyebrow && (
                      <span className="px-2 py-0.5 rounded bg-[#B28A50] text-[#18201B] text-[10px] font-bold uppercase">
                        {section.eyebrow}
                      </span>
                    )}
                    <p className="text-xs sm:text-sm font-semibold">
                      {section.heading}{' '}
                      {section.description && (
                        <span className="text-[#F8F5ED]/75 font-normal">
                          — {section.description}
                        </span>
                      )}
                    </p>
                  </div>
                  {section.primaryCtaLabel && section.primaryCtaHref && (
                    <Link
                      href={section.primaryCtaHref}
                      className="px-4 py-1.5 rounded bg-[#B28A50] text-[#18201B] text-xs font-bold shrink-0"
                    >
                      {section.primaryCtaLabel}
                    </Link>
                  )}
                </div>
              </section>
            );

          /* =================================================================
           * ADDITIONAL CMS SECTION TYPES
           * ================================================================= */
          default:
            return (
              <section
                key={section.id}
                aria-label={section.heading}
                className="py-10 sm:py-12 border-b border-[#18201B]/12 bg-[#F8F5ED]"
              >
                <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
                  <div className="p-6 sm:p-8 rounded-[8px] border border-[#18201B]/15 bg-[#18201B]/[0.02] space-y-4">
                    {section.eyebrow && (
                      <p className="text-xs font-bold uppercase tracking-widest text-[#18201B]/65">
                        {section.eyebrow}
                      </p>
                    )}
                    <h2 className="font-story text-2xl sm:text-3xl font-bold text-[#18201B]">
                      {section.heading}
                    </h2>
                    {section.description && (
                      <p className="text-sm text-[#18201B]/80 max-w-3xl">
                        {section.description}
                      </p>
                    )}
                    {section.primaryCtaLabel && section.primaryCtaHref && (
                      <div className="pt-2">
                        <Link
                          href={section.primaryCtaHref}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[6px] bg-[#18201B] text-[#F8F5ED] text-xs font-semibold"
                        >
                          <span>{section.primaryCtaLabel}</span>
                          <ArrowRight className="w-4 h-4 text-[#B28A50]" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            );
        }
      })}
    </div>
  );
}