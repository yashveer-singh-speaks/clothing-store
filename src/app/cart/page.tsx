'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Bookmark,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function CartPage() {
  const {
    products,
    promotions,
    cart,
    savedForLater,
    appliedCoupon: storeCoupon,
    setAppliedCoupon: setStoreCoupon,
    addToCart,
    updateCartQty,
    removeFromCart,
    moveToSavedForLater,
    moveSavedToCart,
    showToast,
  } = useStore();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartMrpTotal = cart.reduce((sum, item) => sum + item.mrp * item.quantity, 0);

  const [couponCode, setCouponCode] = useState(storeCoupon || '');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(storeCoupon || null);

  const freeShippingThreshold = 999;
  const shippingFee = cartSubtotal >= freeShippingThreshold || cartSubtotal === 0 ? 0 : 79;

  let couponDiscount = 0;
  if (appliedCoupon) {
    const matchedPromo = promotions.find(
      (p) =>
        p.code.toUpperCase() === appliedCoupon.toUpperCase() &&
        p.enabled !== false &&
        p.status !== 'disabled'
    );
    if (matchedPromo && cartSubtotal >= matchedPromo.minOrderAmount) {
      if (matchedPromo.type === 'percentage') {
        const raw = Math.round((cartSubtotal * matchedPromo.value) / 100);
        couponDiscount = matchedPromo.maxDiscountCap
          ? Math.min(raw, matchedPromo.maxDiscountCap)
          : raw;
      } else if (matchedPromo.type === 'fixed_amount') {
        couponDiscount = matchedPromo.value;
      }
    } else if (appliedCoupon === 'FESTIVE500' && cartSubtotal >= 2500) {
      couponDiscount = 500;
    } else if (appliedCoupon === 'WELCOME10' && cartSubtotal >= 1199) {
      couponDiscount = Math.min(300, Math.round(cartSubtotal * 0.1));
    }
  }

  const grandTotal = Math.max(0, cartSubtotal - couponDiscount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    const matchedPromo = promotions.find(
      (p) =>
        p.code.toUpperCase() === code &&
        p.enabled !== false &&
        p.status !== 'disabled'
    );
    if (matchedPromo) {
      if (cartSubtotal < matchedPromo.minOrderAmount) {
        showToast(
          `${matchedPromo.code} requires a minimum bag value of ₹${matchedPromo.minOrderAmount.toLocaleString('en-IN')}`
        );
        return;
      }
      setAppliedCoupon(matchedPromo.code);
      setStoreCoupon(matchedPromo.code);
      showToast(`Coupon ${matchedPromo.code} applied (${matchedPromo.title})`);
      return;
    }

    if (code === 'FESTIVE500') {
      if (cartSubtotal < 2500) {
        showToast('FESTIVE500 requires a minimum bag value of ₹2,500');
        return;
      }
      setAppliedCoupon('FESTIVE500');
      setStoreCoupon('FESTIVE500');
      showToast('Coupon FESTIVE500 applied (Flat ₹500 off)');
    } else if (code === 'WELCOME10') {
      if (cartSubtotal < 1199) {
        showToast('WELCOME10 requires a minimum bag value of ₹1,199');
        return;
      }
      setAppliedCoupon('WELCOME10');
      setStoreCoupon('WELCOME10');
      showToast('Coupon WELCOME10 applied (10% off up to ₹300)');
    } else {
      showToast('Invalid coupon code. Try FESTIVE500 or WELCOME10');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setStoreCoupon('');
    setCouponCode('');
    showToast('Coupon removed');
  };

  // Maximum 2 items for "Pairs Well With" per Section 11 of UI/UX spec
  const pairsWellWith = products
    .filter((p) => !cart.some((c) => c.productId === p.id))
    .slice(0, 2);

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      <div className="border-b border-[#18201B]/12 pb-5 flex items-center justify-between">
        <div>
          <h1 className="font-story text-3xl sm:text-4xl font-bold text-[#18201B]">
            Your Shopping Bag ({cartCount})
          </h1>
          <p className="text-xs sm:text-sm text-[#18201B]/75 mt-1">
            All prices are in Indian Rupees (₹) inclusive of GST. Dispatched from New Delhi within 24 hours.
          </p>
        </div>
        <Link
          href="/products"
          className="text-xs sm:text-sm font-semibold underline text-[#18201B]"
        >
          Continue Shopping
        </Link>
      </div>

      {cart.length === 0 ? (
        <div className="p-10 sm:p-16 rounded-[8px] border border-[#18201B]/15 bg-[#18201B]/[0.02] text-center space-y-4">
          <ShoppingBag className="w-10 h-10 text-[#18201B]/60 mx-auto" />
          <h2 className="font-story text-2xl font-bold">Your shopping bag is empty</h2>
          <p className="text-xs sm:text-sm text-[#18201B]/75 max-w-md mx-auto">
            Browse our breathable linen-cotton shirts, Kutch handloom kurtas, and handcrafted footwear.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[6px] bg-[#18201B] text-[#F8F5ED] text-xs sm:text-sm font-semibold"
          >
            <span>Explore Store Catalog</span>
            <ArrowRight className="w-4 h-4 text-[#B28A50]" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Cart Line Items */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div
                key={item.variantId}
                className="p-4 sm:p-5 rounded-[8px] border border-[#18201B]/15 bg-[#F8F5ED] flex flex-col sm:flex-row gap-4 justify-between"
              >
                <div className="flex gap-4">
                  <Link
                    href={`/product/${item.productId}`}
                    className="w-24 h-28 rounded-[6px] overflow-hidden border border-[#18201B]/12 shrink-0"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="space-y-1">
                    <Link
                      href={`/product/${item.productId}`}
                      className="text-base font-bold text-[#18201B] hover:underline"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs text-[#18201B]/70">
                      Variant: <strong>{item.color} / {item.size}</strong> • SKU: {item.sku}
                    </p>
                    <p className="text-[11px] text-[#18201B]/60">
                      GST Included • Official Tax Invoice Provided
                    </p>

                    <div className="flex items-center gap-4 pt-2">
                      <button
                        type="button"
                        onClick={() => moveToSavedForLater(item.variantId)}
                        className="text-xs font-semibold underline text-[#18201B]/75 hover:text-[#18201B] cursor-pointer"
                      >
                        Save for Later
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.variantId)}
                        className="text-xs font-semibold text-[#18201B]/65 hover:text-[#18201B] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 price-num">
                  <div className="text-right">
                    <p className="text-base font-bold text-[#18201B]">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                    {item.mrp > item.price && (
                      <p className="text-xs text-[#18201B]/50 line-through">
                        MRP ₹{(item.mrp * item.quantity).toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>

                  <div className="inline-flex items-center border border-[#18201B]/25 rounded-[6px]">
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${item.title}`}
                      onClick={() => updateCartQty(item.variantId, item.quantity - 1)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-[#18201B]/5 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label={`Increase quantity of ${item.title}`}
                      onClick={() => updateCartQty(item.variantId, item.quantity + 1)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-[#18201B]/5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Restrained Cross-Sell: Maximum 2 items ("Pairs well with") per Section 11 */}
            {pairsWellWith.length > 0 && (
              <div className="pt-4 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-[#18201B]/70">
                  Pairs Well With (Curated Add-Ons • Max 2 Items)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {pairsWellWith.map((prod) => {
                    const v = prod.variants[0];
                    if (!v) return null;
                    return (
                      <div
                        key={prod.id}
                        className="p-3.5 rounded-[6px] border border-[#18201B]/15 bg-[#F8F5ED] flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={prod.images[0]?.url}
                            alt={prod.title}
                            className="w-12 h-14 object-cover rounded border border-[#18201B]/10 shrink-0"
                          />
                          <div className="min-w-0">
                            <Link
                              href={`/product/${prod.slug}`}
                              className="text-xs font-bold text-[#18201B] hover:underline truncate block"
                            >
                              {prod.title}
                            </Link>
                            <p className="text-[11px] text-[#18201B]/70 price-num">
                              ₹{v.price.toLocaleString('en-IN')} • {v.size}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            addToCart(
                              {
                                productId: prod.id,
                                variantId: v.id,
                                sku: v.sku,
                                title: prod.title,
                                size: v.size,
                                color: v.color,
                                price: v.price,
                                mrp: v.mrp,
                                image: prod.images[0]?.url || '',
                                maxStock: 10,
                              },
                              1,
                              false
                            )
                          }
                          className="px-3.5 py-2 rounded bg-[#18201B] text-[#F8F5ED] text-[11px] font-semibold shrink-0 cursor-pointer"
                        >
                          + Add
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary & Coupon Box */}
          <div className="lg:col-span-4 space-y-5">
            <div className="p-6 rounded-[8px] border border-[#18201B]/20 bg-[#18201B]/[0.02] space-y-5">
              <h2 className="font-story text-xl font-bold border-b border-[#18201B]/12 pb-3">
                Order Summary
              </h2>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#B28A50]" />
                    <span>Apply Store Coupon</span>
                  </span>
                  {appliedCoupon && (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[11px] underline text-[#18201B]/70 hover:text-[#18201B] cursor-pointer"
                    >
                      Remove ({appliedCoupon})
                    </button>
                  )}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="FESTIVE500 or WELCOME10"
                    className="flex-1 h-10 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED] text-xs font-mono uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 h-10 rounded bg-[#18201B] text-[#F8F5ED] text-xs font-semibold cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setCouponCode('FESTIVE500')}
                    className="text-[11px] px-2 py-1 rounded bg-[#B28A50]/25 font-mono font-semibold cursor-pointer"
                  >
                    FESTIVE500 (₹500 OFF ≥ ₹2,500)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCouponCode('WELCOME10')}
                    className="text-[11px] px-2 py-1 rounded bg-[#B28A50]/25 font-mono font-semibold cursor-pointer"
                  >
                    WELCOME10 (10% OFF)
                  </button>
                </div>
              </form>

              <div className="space-y-2.5 text-xs sm:text-sm border-t border-[#18201B]/12 pt-4 price-num">
                <div className="flex justify-between">
                  <span className="text-[#18201B]/75">Total MRP</span>
                  <span>₹{cartMrpTotal.toLocaleString('en-IN')}</span>
                </div>
                {cartMrpTotal > cartSubtotal && (
                  <div className="flex justify-between text-[#18201B]">
                    <span>Product Discount on MRP</span>
                    <span className="font-semibold">
                      -₹{(cartMrpTotal - cartSubtotal).toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-[#18201B] font-semibold">
                    <span>Coupon Discount ({appliedCoupon})</span>
                    <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#18201B]/75">Insured Shipping</span>
                  <span>
                    {shippingFee === 0 ? (
                      <strong className="text-[#18201B]">FREE</strong>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold border-t border-[#18201B]/15 pt-3">
                  <span>Total Payable (Incl. GST)</span>
                  <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <Link
                href={`/checkout${appliedCoupon ? `?coupon=${appliedCoupon}` : ''}`}
                className="w-full py-3.5 px-5 rounded-[6px] bg-[#18201B] text-[#F8F5ED] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#18201B]/90"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#B28A50]" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Saved for Later Section */}
      {savedForLater.length > 0 && (
        <div className="pt-8 border-t border-[#18201B]/15 space-y-4">
          <h2 className="font-story text-2xl font-bold flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#B28A50]" />
            <span>Saved for Later ({savedForLater.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedForLater.map((item) => (
              <div
                key={item.variantId}
                className="p-4 rounded-[6px] border border-[#18201B]/15 bg-[#F8F5ED] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-14 h-16 object-cover rounded border border-[#18201B]/10"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">{item.title}</p>
                    <p className="text-[11px] text-[#18201B]/70">{item.color} / {item.size}</p>
                    <p className="text-xs font-bold price-num mt-0.5">
                      ₹{item.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveSavedToCart(item.variantId)}
                    className="px-3 py-1.5 rounded bg-[#18201B] text-[#F8F5ED] text-[11px] font-semibold"
                  >
                    Move to Bag
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
