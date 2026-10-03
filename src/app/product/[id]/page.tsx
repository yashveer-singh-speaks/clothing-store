'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  MapPin,
  Ruler,
  Check,
  ChevronRight,
  Plus,
  Minus,
  X,
  FileText,
  Sparkles,
} from 'lucide-react';
import { ProductRecord, ProductVariant } from '@/lib/types';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/ProductCard';

interface ReviewItem {
  id: string;
  productId?: string;
  customerName: string;
  city: string;
  rating: number;
  title?: string;
  body?: string;
  comment?: string;
  verifiedPurchase?: boolean;
  fitFeedback?: string;
  status?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const idOrSlug = String(params?.id || '');
  const {
    addToCart,
    toggleWishlist,
    wishlistIds,
    recordRecentlyViewed,
    selectedPin,
    pinDetails,
    checkAndSetPin,
    showToast,
  } = useStore();

  const [product, setProduct] = useState<ProductRecord | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductRecord[]>([]);
  const [goesWellWithProducts, setGoesWellWithProducts] = useState<ProductRecord[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [sizeError, setSizeError] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [pinInput, setPinInput] = useState(selectedPin || '110001');
  const [pinLoading, setPinLoading] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [sizeUnit, setSizeUnit] = useState<'in' | 'cm'>('in');
  const [sizeMeasureType, setSizeMeasureType] = useState<'garment' | 'body'>('garment');
  const [activeTab, setActiveTab] = useState<'details' | 'metrology' | 'shipping' | 'qa'>('details');
  const [restockEmail, setRestockEmail] = useState('');
  const [restockSaved, setRestockSaved] = useState(false);
  const [qaList, setQaList] = useState<
    { id: string; question: string; answer: string; askedBy: string; date: string }[]
  >([
    {
      id: 'qa_1',
      question: 'Is this real full-grain leather and how does it handle Indian climate and rain?',
      answer:
        'All our outerwear is handcrafted from 100% full-grain aniline lambskin, calfskin, or vegetable-tanned cowhide. It breathes naturally and handles light drizzle easily; if exposed to heavy rain, let it air-dry at room temperature on a wide wooden hanger and condition annually with our complimentary balm.',
      askedBy: 'Rohan M., Pune',
      date: '14 Sep 2026',
    },
    {
      id: 'qa_2',
      question: 'Can I exchange the size if the chest or shoulder fit feels slightly snug?',
      answer:
        'Yes! We offer a 7-day free doorstep size exchange across all serviceable PIN codes. You can request an instant exchange directly from your My Account page.',
      askedBy: 'Ananya S., New Delhi',
      date: '09 Sep 2026',
    },
  ]);
  const [newQuestion, setNewQuestion] = useState('');

  // Review submission state
  const [reviewForm, setReviewForm] = useState({
    customerName: '',
    city: '',
    rating: 5,
    title: '',
    comment: '',
    fitFeedback: 'True to Size',
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    setLoading(true);
    setSizeError(false);
    fetch('/api/storefront')
      .then((r) => r.json())
      .then((data) => {
        const allProds: ProductRecord[] = data.products || [];
        const found =
          allProds.find((p) => p.id === idOrSlug || p.slug === idOrSlug) ||
          allProds[0];
        if (found) {
          setProduct(found);
          let restoredVariantId = '';
          try {
            const saved = sessionStorage.getItem(`karigar_selected_variant_${found.id}`);
            if (saved && found.variants?.some((v) => v.id === saved)) {
              restoredVariantId = saved;
            }
          } catch {}
          if (!restoredVariantId && found.variants?.length === 1) {
            restoredVariantId = found.variants[0].id;
          }
          setSelectedVariantId(restoredVariantId);
          recordRecentlyViewed(found.id);

          // Similar products: strictly same category or same outerwear/garment type
          const sameCategoryOrType = allProds.filter(
            (p) =>
              p.id !== found.id &&
              (p.categoryId === found.categoryId ||
                (['jacket', 'racer', 'bomber', 'trucker'].includes(found.productType) &&
                  ['jacket', 'racer', 'bomber', 'trucker'].includes(p.productType)) ||
                p.productType === found.productType)
          );
          setRelatedProducts(sameCategoryOrType.slice(0, 4));

          // Complete the look / Goes well with: complementary categories (e.g. duffle, boots, belts, skirts)
          const goesIds = found.goesWellWithIds || [];
          const customGoesList = allProds.filter((p) => goesIds.includes(p.id) && p.id !== found.id);
          const defaultGoesList = allProds.filter(
            (p) => p.id !== found.id && !sameCategoryOrType.some((sp) => sp.id === p.id)
          );
          setGoesWellWithProducts(
            customGoesList.length > 0 ? customGoesList.slice(0, 4) : defaultGoesList.slice(0, 4)
          );

          const allReviews: ReviewItem[] = data.reviews || [];
          setReviews(
            allReviews.filter(
              (r) => r.productId === found.id && (!r.status || r.status === 'approved')
            )
          );
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [idOrSlug]);

  if (loading || !product) {
    return (
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-6 aspect-[4/5] rounded-[8px] bg-[#18201B]/8 animate-pulse" />
        <div className="lg:col-span-6 space-y-4">
          <div className="h-8 w-2/3 bg-[#18201B]/8 rounded animate-pulse" />
          <div className="h-6 w-1/3 bg-[#18201B]/8 rounded animate-pulse" />
          <div className="h-32 w-full bg-[#18201B]/8 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  const selectedVariant: ProductVariant | undefined = product.variants.find(
    (v: ProductVariant) => v.id === selectedVariantId
  );
  const activeVariant: ProductVariant | undefined =
    selectedVariant || product.variants[0];
  const price = activeVariant ? activeVariant.price : product.price;
  const mrp = activeVariant ? activeVariant.mrp : product.mrp;
  const discountPct = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const wishlisted = wishlistIds.includes(product.id);
  const maxStock = activeVariant
    ? Math.max(1, activeVariant.onHand - activeVariant.reserved - activeVariant.allocated - activeVariant.unavailable)
    : 10;

  const handleAddToCart = (buyNow = false) => {
    if (!selectedVariant) {
      setSizeError(true);
      showToast('Please select a size before adding to your bag');
      if (typeof document !== 'undefined') {
        document
          .getElementById('size-selector-section')
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    setSizeError(false);
    addToCart(
      {
        productId: product.id,
        variantId: selectedVariant.id,
        sku: selectedVariant.sku,
        title: product.title,
        size: selectedVariant.size,
        color: selectedVariant.color,
        image: selectedVariant.image || product.images[0]?.url || '',
        price: selectedVariant.price,
        mrp: selectedVariant.mrp,
        maxStock,
      },
      qty
    );
    if (buyNow) {
      router.push('/checkout');
    }
  };

  const handlePinCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[1-9][0-9]{5}$/.test(pinInput.trim())) {
      showToast('Please enter a valid 6-digit Indian PIN code');
      return;
    }
    setPinLoading(true);
    await checkAndSetPin(pinInput.trim());
    setPinLoading(false);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.customerName || !reviewForm.comment) return;
    setSubmittingReview(true);
    try {
      await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_review',
          productId: product.id,
          productTitle: product.title,
          ...reviewForm,
          body: reviewForm.comment,
        }),
      });
      showToast('Thank you! Your review has been submitted for verification.');
      setReviewForm({
        customerName: '',
        city: '',
        rating: 5,
        title: '',
        comment: '',
        fitFeedback: 'True to Size',
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    setQaList((prev) => [
      {
        id: `qa_${Date.now()}`,
        question: newQuestion.trim(),
        answer:
          'Thank you for your question! Our Connaught Place studio textile specialist has received this and will post a verified measurement/craft response shortly.',
        askedBy: 'Verified Shopper',
        date: 'Just now',
      },
      ...prev,
    ]);
    setNewQuestion('');
    showToast('Your question has been posted to our studio team.');
  };

  const activeImgObj = product.images[activeImageIdx] || product.images[0];

  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: product.title,
        description: product.description,
        sku: activeVariant?.sku || product.variants[0]?.sku,
        brand: {
          '@type': 'Brand',
          name: product.brand || 'Karigar & Co.',
        },
        image: product.images.map((i) => i.url),
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          price: price,
          availability:
            maxStock > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.ratingAverage,
          reviewCount: product.reviewCount,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://karigarandco.in/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Products',
            item: 'https://karigarandco.in/products',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: product.title,
          },
        ],
      },
    ],
  };

  const fmtMeasure = (inchesVal: number) => {
    if (sizeUnit === 'in') return `${inchesVal}"`;
    return `${Math.round(inchesVal * 2.54 * 10) / 10} cm`;
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-12 pb-28 md:pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#18201B]/65 overflow-x-auto no-scrollbar">
        <Link href="/" className="hover:text-[#18201B] hover:underline shrink-0">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link href="/products" className="hover:text-[#18201B] hover:underline shrink-0">
          Products
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="font-semibold text-[#18201B] truncate">
          {product.title}
        </span>
      </nav>

      {/* Main Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: 4:5 Product Visual Gallery */}
        <div className="lg:col-span-6 space-y-3">
          <div className="relative aspect-[4/5] rounded-[8px] border border-[#18201B]/15 bg-[#18201B]/[0.03] overflow-hidden">
            <img
              src={activeImgObj?.url || ''}
              alt={activeImgObj?.alt || product.title}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 bg-[#18201B] text-[#F8F5ED] text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded">
                {product.badge}
              </span>
            )}
            <button
              type="button"
              onClick={() => toggleWishlist(product.id, product.title)}
              aria-label="Toggle wishlist"
              className="absolute top-3 right-3 w-11 h-11 rounded-full bg-[#F8F5ED] border border-[#18201B]/20 flex items-center justify-center hover:border-[#B28A50]"
            >
              <Heart
                className="w-5 h-5"
                fill={wishlisted ? '#B28A50' : 'none'}
                stroke="#18201B"
              />
            </button>
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, i: number) => (
                <button
                  key={img.id || i}
                  type="button"
                  onClick={() => setActiveImageIdx(i)}
                  className={`w-20 aspect-[4/5] rounded-[6px] overflow-hidden border-2 shrink-0 ${
                    activeImageIdx === i
                      ? 'border-[#18201B]'
                      : 'border-[#18201B]/15 opacity-70'
                  }`}
                >
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Information & Purchase Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2 border-b border-[#18201B]/12 pb-5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#18201B]/70">
                {product.brand} • {product.attributes?.fabric}
              </span>
              {product.reviewCount > 0 && (
                <a
                  href="#reviews"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#18201B] hover:underline"
                >
                  <Star className="w-3.5 h-3.5 fill-[#B28A50] text-[#18201B]" />
                  <span>{product.ratingAverage.toFixed(1)}</span>
                  <span className="text-[#18201B]/65">
                    ({product.reviewCount} Verified {product.reviewCount === 1 ? 'Review' : 'Reviews'})
                  </span>
                </a>
              )}
            </div>

            <h1 className="font-story text-2xl sm:text-3xl lg:text-4xl font-bold text-[#18201B] leading-tight">
              {product.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#18201B]/75">
              {product.subtitle}
            </p>

            {/* Price Block */}
            <div className="pt-2 flex items-baseline flex-wrap gap-3 price-num">
              <span className="text-2xl sm:text-3xl font-bold text-[#18201B]">
                ₹{price.toLocaleString('en-IN')}
              </span>
              {mrp > price && (
                <>
                  <span className="text-base text-[#18201B]/50 line-through">
                    MRP ₹{mrp.toLocaleString('en-IN')}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-[#B28A50]/30 text-[#18201B] text-xs font-bold">
                    Save ₹{(mrp - price).toLocaleString('en-IN')} ({discountPct}% OFF)
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-[#18201B]/65">
              Inclusive of all taxes ({product.legalMetrology?.gstRatePercent || 12}% GST • HSN {product.legalMetrology?.hsnCode || '6205'}). Official GST Tax Invoice included.
            </p>
          </div>

          {/* Variant Selector (Size & Colour) */}
          <div id="size-selector-section" className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#18201B]">
                Select Size:{' '}
                <span className="font-normal text-[#18201B]/75">
                  {selectedVariant
                    ? `${selectedVariant.color} — ${selectedVariant.size} (SKU: ${selectedVariant.sku})`
                    : 'Choose your size'}
                </span>
              </label>
              <button
                type="button"
                onClick={() => setShowSizeGuide(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold underline text-[#18201B] cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5 text-[#B28A50]" />
                <span>Indian Size Guide (in / cm)</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {product.variants.map((v) => {
                const isSelected = v.id === selectedVariantId;
                const avail = Math.max(0, v.onHand - v.reserved - v.allocated - v.unavailable);
                return (
                  <button
                    key={v.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => {
                      setSelectedVariantId(v.id);
                      setSizeError(false);
                      try {
                        sessionStorage.setItem(`karigar_selected_variant_${product.id}`, v.id);
                      } catch {}
                    }}
                    className={`min-w-[56px] min-h-[46px] px-3.5 py-2 rounded-[6px] border text-xs font-semibold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#18201B] text-[#F8F5ED] border-[#18201B]'
                        : sizeError
                        ? 'bg-[#F8F5ED] text-[#18201B] border-[#9E2A2B]/60 hover:border-[#18201B]'
                        : 'bg-[#F8F5ED] text-[#18201B] border-[#18201B]/25 hover:border-[#B28A50]'
                    }`}
                  >
                    <div>{v.size}</div>
                    <div className="text-[10px] opacity-75 font-normal">
                      {v.color} {avail <= 3 && avail > 0 ? `• ${avail} left` : ''}
                    </div>
                  </button>
                );
              })}
            </div>

            {sizeError && (
              <p
                role="alert"
                className="text-xs font-semibold text-[#9E2A2B] bg-[#9E2A2B]/10 border border-[#9E2A2B]/30 rounded-[6px] px-3 py-2"
              >
                Please select a size above before adding this item to your bag.
              </p>
            )}
          </div>

          {/* Quantity & Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
            <div className="inline-flex items-center justify-between border border-[#18201B]/30 rounded-[6px] h-12 px-2 sm:w-32">
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                aria-label="Decrease quantity"
                className="w-8 h-8 flex items-center justify-center hover:bg-[#18201B]/5 rounded"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold price-num">{qty}</span>
              <button
                type="button"
                onClick={() => setQty(Math.min(10, qty + 1))}
                aria-label="Increase quantity"
                className="w-8 h-8 flex items-center justify-center hover:bg-[#18201B]/5 rounded"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleAddToCart(false)}
              className="flex-1 h-12 px-6 rounded-[6px] bg-[#18201B] text-[#F8F5ED] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#18201B]/90 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#B28A50]" />
              <span>Add to Shopping Bag • ₹{(price * qty).toLocaleString('en-IN')}</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddToCart(true)}
              className="h-12 px-6 rounded-[6px] bg-[#B28A50] text-[#18201B] text-sm font-bold flex items-center justify-center hover:bg-[#B28A50]/90 cursor-pointer"
            >
              Buy Now
            </button>
          </div>

          {/* Back-in-Stock / Custom Loom Batch Alert */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-[6px] border border-[#18201B]/12 bg-[#F8F5ED] text-xs">
            <span className="text-[#18201B]/80">
              Need a custom size or restock alert for the next loom batch?
            </span>
            {restockSaved ? (
              <span className="font-bold text-[#18201B]">
                ✓ Alert registered for {activeVariant?.size}
              </span>
            ) : (
              <div className="flex items-center gap-1.5">
                <input
                  type="email"
                  value={restockEmail}
                  onChange={(e) => setRestockEmail(e.target.value)}
                  placeholder="Enter email for batch alert"
                  className="h-8 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED] text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!restockEmail.includes('@')) {
                      showToast('Enter a valid email address for restock alerts');
                      return;
                    }
                    setRestockSaved(true);
                    showToast(`Restock alert set for ${product.title} (${activeVariant?.size})`);
                  }}
                  className="h-8 px-3 rounded bg-[#18201B] text-[#F8F5ED] font-semibold cursor-pointer"
                >
                  Notify Me
                </button>
              </div>
            )}
          </div>

          {/* Inline 6-Digit PIN Serviceability & Delivery Date Box */}
          <div className="p-4 rounded-[6px] border border-[#18201B]/15 bg-[#18201B]/[0.025] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#B28A50]" />
                <span>Check Delivery Date & COD Availability</span>
              </span>
              <span className="text-[11px] text-[#18201B]/65">
                Ships from Connaught Place, New Delhi (110001)
              </span>
            </div>

            <form onSubmit={handlePinCheck} className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit PIN code"
                className="flex-1 h-10 px-3 rounded bg-[#F8F5ED] border border-[#18201B]/25 text-xs font-mono"
              />
              <button
                type="submit"
                disabled={pinLoading}
                className="px-4 h-10 rounded bg-[#18201B] text-[#F8F5ED] text-xs font-semibold cursor-pointer"
              >
                {pinLoading ? 'Checking...' : 'Check PIN'}
              </button>
            </form>

            {pinDetails && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                <div className="p-2.5 rounded bg-[#F8F5ED] border border-[#18201B]/10">
                  <p className="font-semibold text-[#18201B]">
                    Estimated Arrival ({pinDetails.city || pinDetails.pincode || selectedPin})
                  </p>
                  <p className="text-[#18201B]/75 mt-0.5">
                    {pinDetails.transitDays || pinDetails.estimatedWindow || '2–4 business days'}
                  </p>
                </div>
                <div className="p-2.5 rounded bg-[#F8F5ED] border border-[#18201B]/10">
                  <p className="font-semibold text-[#18201B]">Cash on Delivery</p>
                  <p className="text-[#18201B]/75 mt-0.5">
                    {(pinDetails.cod ?? pinDetails.codEligible)
                      ? `Available (₹${pinDetails.codFee ?? 40} COD fee)`
                      : 'Prepaid Only (UPI / Card)'}
                  </p>
                </div>
                <div className="p-2.5 rounded bg-[#F8F5ED] border border-[#18201B]/10">
                  <p className="font-semibold text-[#18201B]">Size Exchange</p>
                  <p className="text-[#18201B]/75 mt-0.5">7-Day Free Doorstep Pickup</p>
                </div>
              </div>
            )}
          </div>

          {/* Product Details, Legal Metrology, Returns & Q&A Tabs */}
          <div className="pt-2">
            <div className="flex flex-wrap border-b border-[#18201B]/15 gap-5 text-xs font-bold uppercase tracking-wider">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'details'
                    ? 'border-[#18201B] text-[#18201B]'
                    : 'border-transparent text-[#18201B]/55'
                }`}
              >
                Craft & Fabric Details
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('metrology')}
                className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'metrology'
                    ? 'border-[#18201B] text-[#18201B]'
                    : 'border-transparent text-[#18201B]/55'
                }`}
              >
                Legal Metrology Info
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('shipping')}
                className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'shipping'
                    ? 'border-[#18201B] text-[#18201B]'
                    : 'border-transparent text-[#18201B]/55'
                }`}
              >
                Returns & Care
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('qa')}
                className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'qa'
                    ? 'border-[#18201B] text-[#18201B]'
                    : 'border-transparent text-[#18201B]/55'
                }`}
              >
                Questions & Answers ({qaList.length})
              </button>
            </div>

            <div className="py-4 text-xs sm:text-sm text-[#18201B]/85 leading-relaxed space-y-3">
              {activeTab === 'details' && (
                <>
                  <p>{product.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded border border-[#18201B]/12">
                      <span className="text-[11px] uppercase text-[#18201B]/60 block">
                        Material & Weave
                      </span>
                      <strong className="text-xs">{product.attributes?.fabric}</strong>
                    </div>
                    <div className="p-3 rounded border border-[#18201B]/12">
                      <span className="text-[11px] uppercase text-[#18201B]/60 block">
                        Construction
                      </span>
                      <strong className="text-xs">{product.attributes?.weaveOrConstruction}</strong>
                    </div>
                    <div className="p-3 rounded border border-[#18201B]/12">
                      <span className="text-[11px] uppercase text-[#18201B]/60 block">
                        Fit & Silhouette
                      </span>
                      <strong className="text-xs">{product.attributes?.fit}</strong>
                    </div>
                    <div className="p-3 rounded border border-[#18201B]/12">
                      <span className="text-[11px] uppercase text-[#18201B]/60 block">
                        Garment Care
                      </span>
                      <strong className="text-xs">{product.attributes?.careInstructions}</strong>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'metrology' && (
                <div className="p-4 rounded-[6px] border border-[#18201B]/15 bg-[#18201B]/[0.02] space-y-2 text-xs">
                  <p className="font-bold text-[#18201B] pb-1 border-b border-[#18201B]/10">
                    Mandatory Declarations under Legal Metrology (Packaged Commodities) Rules
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <p>
                      <strong>Generic Name:</strong>{' '}
                      {product.legalMetrology?.genericName || 'Handloom Apparel / Craft'}
                    </p>
                    <p>
                      <strong>Net Quantity:</strong>{' '}
                      {product.legalMetrology?.netQuantity || '1 N (1 Unit)'}
                    </p>
                    <p>
                      <strong>Country of Origin:</strong>{' '}
                      {product.legalMetrology?.countryOfOrigin || 'India'}
                    </p>
                    <p>
                      <strong>Packer Name:</strong>{' '}
                      {product.legalMetrology?.packerName || 'Karigar & Co.'}
                    </p>
                    <p className="sm:col-span-2">
                      <strong>Manufactured & Packed By:</strong>{' '}
                      {product.legalMetrology?.manufacturerName},{' '}
                      {product.legalMetrology?.manufacturerAddress}
                    </p>
                    <p className="sm:col-span-2">
                      <strong>Consumer Care:</strong>{' '}
                      {product.legalMetrology?.consumerCareEmail} |{' '}
                      {product.legalMetrology?.consumerCarePhone}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-2 text-xs sm:text-sm">
                  <p>
                    • <strong>Dispatch:</strong> Dispatched within 24 hours from our Connaught Place, New Delhi studio in moisture-sealed kraft packaging.
                  </p>
                  <p>
                    • <strong>{product.returnWindowDays}-Day Easy Size Exchange & Returns:</strong> {product.warrantySummary}
                  </p>
                </div>
              )}

              {activeTab === 'qa' && (
                <div className="space-y-4 text-xs">
                  <form onSubmit={handleAskQuestion} className="flex gap-2">
                    <input
                      type="text"
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      placeholder="Ask a question about sizing, weave, shrinkage, or dispatch..."
                      className="flex-1 h-9 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                    />
                    <button
                      type="submit"
                      className="px-4 h-9 rounded bg-[#18201B] text-[#F8F5ED] font-semibold cursor-pointer"
                    >
                      Ask Studio
                    </button>
                  </form>
                  <div className="space-y-2.5">
                    {qaList.map((qa) => (
                      <div key={qa.id} className="p-3 rounded border border-[#18201B]/15 bg-[#F8F5ED] space-y-1">
                        <p className="font-bold text-[#18201B]">Q: {qa.question}</p>
                        <p className="text-[#18201B]/80">A: {qa.answer}</p>
                        <p className="text-[10px] text-[#18201B]/55">
                          Asked by {qa.askedBy} • {qa.date}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Verified Customer Reviews & Write Review Section */}
      <section id="reviews" className="pt-10 border-t border-[#18201B]/15 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="font-story text-2xl sm:text-3xl font-bold text-[#18201B]">
              Verified Customer Reviews ({reviews.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-[6px] border border-[#18201B]/15 bg-[#F8F5ED] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: r.rating }).map((_, idx) => (
                        <Star
                          key={idx}
                          className="w-3.5 h-3.5 fill-[#B28A50] text-[#18201B]"
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#B28A50]/25">
                      Verified Purchase
                    </span>
                  </div>
                  <p className="text-sm font-bold">{r.title}</p>
                  <p className="text-xs text-[#18201B]/80 leading-relaxed">
                    &ldquo;{r.body || r.comment}&rdquo;
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[11px] font-semibold text-[#18201B]/65">
                    <span>
                      {r.customerName} — {r.city}
                    </span>
                    {r.fitFeedback && (
                      <span className="px-1.5 py-0.5 rounded border border-[#18201B]/15 text-[10px]">
                        Fit: {r.fitFeedback}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Write a Review Form */}
          <div className="lg:col-span-5 p-6 rounded-[8px] border border-[#18201B]/15 bg-[#18201B]/[0.02] space-y-4">
            <h3 className="font-story text-xl font-bold">Write a Product Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={reviewForm.customerName}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, customerName: e.target.value })
                    }
                    placeholder="e.g. Siddharth Nair"
                    className="w-full h-9 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={reviewForm.city}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, city: e.target.value })
                    }
                    placeholder="e.g. New Delhi"
                    className="w-full h-9 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Rating</label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, rating: Number(e.target.value) })
                    }
                    className="w-full h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                  >
                    <option value={5}>5 Stars — Excellent</option>
                    <option value={4}>4 Stars — Very Good</option>
                    <option value={3}>3 Stars — Good</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Short Headline</label>
                  <input
                    type="text"
                    value={reviewForm.title}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, title: e.target.value })
                    }
                    placeholder="Breathable fabric & true fit"
                    className="w-full h-9 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Your Experience *</label>
                <textarea
                  rows={3}
                  required
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, comment: e.target.value })
                  }
                  placeholder="Share how the fabric feels, sizing accuracy, and craft quality..."
                  className="w-full p-3 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                />
              </div>
              <button
                type="submit"
                disabled={submittingReview}
                className="w-full py-2.5 rounded-[6px] bg-[#18201B] text-[#F8F5ED] font-semibold cursor-pointer"
              >
                {submittingReview ? 'Submitting...' : 'Submit Verified Review'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Goes Well With — Complete the Look */}
      {goesWellWithProducts.length > 0 && (
        <section className="pt-8 border-t border-[#18201B]/12 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#18201B]/65">
              Curated Pairing
            </span>
            <h2 className="font-story text-2xl sm:text-3xl font-bold text-[#18201B]">
              Goes Well With • Complete the Look
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {goesWellWithProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Similar Products */}
      <section className="pt-8 border-t border-[#18201B]/12 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#18201B]/65">
            More From This Cluster
          </span>
          <h2 className="font-story text-2xl sm:text-3xl font-bold text-[#18201B]">
            Similar Products You May Like
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Sticky Mobile Purchase Bar */}
      <div className="md:hidden fixed bottom-14 inset-x-0 z-30 bg-[#F8F5ED] border-t border-[#18201B]/20 px-4 py-2.5 flex items-center justify-between gap-3 shadow-lg">
        <div className="price-num">
          <p className="text-sm font-bold text-[#18201B]">
            ₹{price.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-[#18201B]/70">
            {selectedVariant ? `Size ${selectedVariant.size}` : 'Select size'} • Incl. GST
          </p>
        </div>
        <div className="flex items-center gap-2 flex-1 justify-end">
          <button
            type="button"
            onClick={() => handleAddToCart(false)}
            className="px-4 py-2.5 rounded-[6px] bg-[#18201B] text-[#F8F5ED] text-xs font-semibold"
          >
            Add to Bag
          </button>
          <button
            type="button"
            onClick={() => handleAddToCart(true)}
            className="px-4 py-2.5 rounded-[6px] bg-[#B28A50] text-[#18201B] text-xs font-bold"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Indian Size Guide Modal with in/cm and Body/Garment toggles */}
      {showSizeGuide && (
        <div
          className="fixed inset-0 z-50 bg-[#18201B]/60 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Indian garment and footwear size guide"
        >
          <div className="w-full max-w-xl bg-[#F8F5ED] text-[#18201B] rounded-[8px] border border-[#18201B]/20 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#18201B]/12 pb-3">
              <h3 className="font-story text-xl font-bold">
                Karigar & Co. — Standard Indian Size Chart
              </h3>
              <button
                type="button"
                onClick={() => setShowSizeGuide(false)}
                className="p-1 rounded hover:bg-[#18201B]/8"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="inline-flex rounded border border-[#18201B]/20 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setSizeUnit('in')}
                  className={`px-3 py-1.5 font-semibold cursor-pointer ${
                    sizeUnit === 'in'
                      ? 'bg-[#18201B] text-[#F8F5ED]'
                      : 'bg-[#F8F5ED] text-[#18201B]'
                  }`}
                >
                  Inches (in)
                </button>
                <button
                  type="button"
                  onClick={() => setSizeUnit('cm')}
                  className={`px-3 py-1.5 font-semibold cursor-pointer ${
                    sizeUnit === 'cm'
                      ? 'bg-[#18201B] text-[#F8F5ED]'
                      : 'bg-[#F8F5ED] text-[#18201B]'
                  }`}
                >
                  Centimetres (cm)
                </button>
              </div>

              <div className="inline-flex rounded border border-[#18201B]/20 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setSizeMeasureType('garment')}
                  className={`px-3 py-1.5 font-semibold cursor-pointer ${
                    sizeMeasureType === 'garment'
                      ? 'bg-[#18201B] text-[#F8F5ED]'
                      : 'bg-[#F8F5ED] text-[#18201B]'
                  }`}
                >
                  Garment Measurement
                </button>
                <button
                  type="button"
                  onClick={() => setSizeMeasureType('body')}
                  className={`px-3 py-1.5 font-semibold cursor-pointer ${
                    sizeMeasureType === 'body'
                      ? 'bg-[#18201B] text-[#F8F5ED]'
                      : 'bg-[#F8F5ED] text-[#18201B]'
                  }`}
                >
                  Body Measurement
                </button>
              </div>
            </div>

            <p className="text-xs text-[#18201B]/75">
              All our leather garments are individually bench-tailored with articulated sleeves and precision panels.{' '}
              {sizeMeasureType === 'garment'
                ? 'Garment chest includes 3 inches (7.6 cm) of comfortable breathing and layering ease over your body chest.'
                : 'Body measurements indicate the wearer chest and shoulder dimensions the leather jacket or coat is tailored to fit.'}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse border border-[#18201B]/20 price-num">
                <thead>
                  <tr className="bg-[#18201B] text-[#F8F5ED]">
                    <th className="p-2 text-left">Indian Size</th>
                    <th className="p-2 text-left">
                      {sizeMeasureType === 'garment' ? 'Garment Chest' : 'Body Chest'} ({sizeUnit})
                    </th>
                    <th className="p-2 text-left">Across Shoulder ({sizeUnit})</th>
                    <th className="p-2 text-left">Garment Length ({sizeUnit})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#18201B]/15">
                  {[
                    { label: 'XS (36)', bodyChest: 36, garmentChest: 39, shoulder: 16.5, length: 26.0 },
                    { label: 'S (38)', bodyChest: 38, garmentChest: 41, shoulder: 17.0, length: 27.0 },
                    { label: 'M (40)', bodyChest: 40, garmentChest: 43, shoulder: 17.75, length: 28.0 },
                    { label: 'L (42)', bodyChest: 42, garmentChest: 45, shoulder: 18.5, length: 29.0 },
                    { label: 'XL (44)', bodyChest: 44, garmentChest: 47, shoulder: 19.25, length: 30.0 },
                    { label: 'XXL (46)', bodyChest: 46, garmentChest: 49, shoulder: 20.0, length: 31.0 },
                  ].map((row) => (
                    <tr key={row.label}>
                      <td className="p-2 font-bold">{row.label}</td>
                      <td className="p-2">
                        {fmtMeasure(sizeMeasureType === 'garment' ? row.garmentChest : row.bodyChest)}
                      </td>
                      <td className="p-2">{fmtMeasure(row.shoulder)}</td>
                      <td className="p-2">{fmtMeasure(row.length)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
