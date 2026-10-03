'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Lock,
  MapPin,
  CreditCard,
  QrCode,
  Banknote,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Tag,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

type PaymentMethod = 'razorpay' | 'manual_upi' | 'cod';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    clearCart,
    selectedPin,
    pinDetails,
    appliedCoupon: storeCoupon,
    setAppliedCoupon: setStoreCoupon,
    checkAndSetPin,
    showToast,
    trackEvent,
  } = useStore();

  const [form, setForm] = useState({
    fullName: 'Vikramaditya Rathore',
    phone: '9829011223',
    email: 'vikram.rathore@example.in',
    pincode: selectedPin || '110001',
    city: pinDetails?.city || 'New Delhi',
    state: pinDetails?.state || 'Delhi',
    addressLine1: '123, Inner Circle, Connaught Place',
    addressLine2: 'Connaught Place',
    landmark: 'Near 100 Feet Road Junction',
    addressType: 'home' as 'home' | 'office' | 'other',
    customerGstin: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');
  const [manualUtr, setManualUtr] = useState('');
  const [couponCode, setCouponCode] = useState(storeCoupon || '');
  const [serverQuote, setServerQuote] = useState<any>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = params.get('coupon');
    if (c) {
      setCouponCode(c.toUpperCase());
      setStoreCoupon(c.toUpperCase());
    } else if (storeCoupon) {
      setCouponCode(storeCoupon);
    }
    trackEvent('checkout_start');
  }, [storeCoupon, setStoreCoupon, trackEvent]);

  // Fetch authoritative server quote whenever cart, pincode, paymentMethod, or coupon changes
  useEffect(() => {
    if (cart.length === 0) return;
    setQuoteLoading(true);
    fetch('/api/checkout/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
        })),
        pincode: form.pincode,
        couponCode: couponCode || undefined,
        paymentMethod,
      }),
    })
      .then((r) => r.json())
      .then((q) => {
        setServerQuote(q);
        const pinObj = q?.pinInfo || q?.pinDetails;
        if (pinObj?.city) {
          setForm((prev) => ({
            ...prev,
            city: pinObj.city,
            state: pinObj.state,
          }));
        }
        setQuoteLoading(false);
      })
      .catch(() => setQuoteLoading(false));
  }, [cart, form.pincode, paymentMethod, couponCode]);

  const handlePincodeBlur = () => {
    if (/^[1-9][0-9]{5}$/.test(form.pincode)) {
      checkAndSetPin(form.pincode);
    }
  };

  const submitOrderToBackend = async (gatewayPaymentId?: string) => {
    setPlacingOrder(true);
    setErrorMsg(null);
    try {
      const idempotencyKey = `idem_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idempotencyKey,
          customer: {
            name: form.fullName,
            email: form.email,
            phone: form.phone,
            gstin: form.customerGstin || undefined,
          },
          shippingAddress: {
            recipientName: form.fullName,
            phone: form.phone,
            line1: form.addressLine1,
            locality: form.addressLine2,
            landmark: form.landmark,
            pincode: form.pincode,
            city: form.city,
            state: form.state,
            country: 'India',
          },
          items: cart.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
          paymentMethod,
          couponCode: couponCode || undefined,
          razorpayPaymentId: gatewayPaymentId,
          manualUpiClaim:
            paymentMethod === 'manual_upi'
              ? {
                  utrReference: manualUtr.trim(),
                  paidAtClaimed: new Date().toISOString(),
                  screenshotNote: 'Paid via UPI QR scan',
                }
              : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Could not place order. Please check your details.');
        setPlacingOrder(false);
        return;
      }

      clearCart();
      setShowRazorpayModal(false);
      const createdId = data?.id || data?.order?.id;
      router.push(`/order-confirmation/${createdId}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error while placing order');
      setPlacingOrder(false);
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, '').slice(-10))) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number starting with 6–9.');
      return;
    }
    if (!/^[1-9][0-9]{5}$/.test(form.pincode)) {
      setErrorMsg('Please enter a valid 6-digit Indian PIN code.');
      return;
    }
    if (paymentMethod === 'manual_upi' && !/^\d{12}$/.test(manualUtr.trim())) {
      setErrorMsg(
        'For Manual UPI QR Payment, please enter your 12-digit UPI UTR / Reference Number.'
      );
      return;
    }

    if (paymentMethod === 'razorpay') {
      setShowRazorpayModal(true);
    } else {
      submitOrderToBackend();
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-story text-3xl font-bold">Your Checkout Bag is Empty</h1>
        <p className="text-xs sm:text-sm text-[#18201B]/75">
          Add one or more handloom garments or craft items to proceed to checkout.
        </p>
        <Link
          href="/products"
          className="inline-block px-6 py-3 rounded-[6px] bg-[#18201B] text-[#F8F5ED] text-xs font-semibold"
        >
          Return to Store Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Checkout Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#18201B]/12 pb-4">
        <div>
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#18201B]/75 hover:text-[#18201B]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Shopping Bag</span>
          </Link>
          <h1 className="font-story text-2xl sm:text-3xl font-bold text-[#18201B] mt-1">
            Secure Indian Checkout
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#18201B]">
          <Lock className="w-4 h-4 text-[#B28A50]" />
          <span>256-Bit Encrypted • Official GST Invoice</span>
        </div>
      </div>

      {/* 4-Step Checkout Progress Bar (Per Section 12) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        {[
          { step: '1. Contact', sub: '+91 Mobile & Email' },
          { step: '2. Indian Address', sub: '6-Digit PIN & Landmark' },
          { step: '3. Delivery Speed', sub: serverQuote?.pinInfo?.transitDays || '24h Studio Dispatch' },
          { step: '4. Payment & GST', sub: 'UPI / Cards / COD' },
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-[6px] border border-[#18201B]/20 bg-[#18201B]/[0.03] flex items-center justify-between"
          >
            <div>
              <p className="font-bold text-[#18201B]">{item.step}</p>
              <p className="text-[11px] text-[#18201B]/70">{item.sub}</p>
            </div>
            <CheckCircle2 className="w-4 h-4 text-[#B28A50] shrink-0" />
          </div>
        ))}
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="p-4 rounded-[6px] bg-[#18201B] text-[#F8F5ED] border-l-4 border-[#B28A50] flex items-center gap-3 text-xs sm:text-sm"
        >
          <AlertCircle className="w-5 h-5 text-[#B28A50] shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form
        onSubmit={handleCheckoutSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* Left 7 Columns: Address + Payment Selection */}
        <div className="lg:col-span-7 space-y-8">
          {/* Step 1 & 2: Contact & Delivery Address */}
          <section className="p-5 sm:p-6 rounded-[8px] border border-[#18201B]/15 bg-[#F8F5ED] space-y-4">
            <div className="flex items-center justify-between border-b border-[#18201B]/10 pb-3">
              <h2 className="font-story text-xl font-bold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#B28A50]" />
                <span>1. Contact & Indian Delivery Address</span>
              </h2>
              <span className="text-[11px] font-semibold text-[#18201B]/65">
                Guest Checkout Enabled
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full h-10 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  10-Digit Mobile Number (+91) *
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={form.phone}
                  onChange={(e) =>
                    setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })
                  }
                  className="w-full h-10 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED] font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold mb-1">
                  Email Address (for GST Invoice & Tracking Link) *
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full h-10 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  6-Digit PIN Code *
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  maxLength={6}
                  value={form.pincode}
                  onChange={(e) =>
                    setForm({ ...form, pincode: e.target.value.replace(/\D/g, '') })
                  }
                  onBlur={handlePincodeBlur}
                  className="w-full h-10 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED] font-mono"
                />
                {serverQuote?.pinInfo && (
                  <p className="text-[11px] font-semibold text-[#18201B] mt-1">
                    {serverQuote.pinInfo.serviceable === false
                      ? `⚠ PIN ${form.pincode} is currently unserviceable for courier delivery.`
                      : `✓ Serviceable: ${serverQuote.pinInfo.city}, ${serverQuote.pinInfo.state} • ${serverQuote.pinInfo.transitDays}`}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full h-10 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full h-10 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold mb-1">
                  House / Flat / Plot No. & Building Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.addressLine1}
                  onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
                  className="w-full h-10 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  Street / Colony / Sector / Locality *
                </label>
                <input
                  type="text"
                  required
                  value={form.addressLine2}
                  onChange={(e) => setForm({ ...form, addressLine2: e.target.value })}
                  className="w-full h-10 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  Nearby Landmark (Helps Courier)
                </label>
                <input
                  type="text"
                  value={form.landmark}
                  onChange={(e) => setForm({ ...form, landmark: e.target.value })}
                  placeholder="e.g. Near Metro Gate / Temple / Park"
                  className="w-full h-10 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Address Type</label>
                <div className="flex gap-2">
                  {(['home', 'office', 'other'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm({ ...form, addressType: t })}
                      className={`px-3 py-2 rounded border uppercase text-[11px] font-semibold cursor-pointer ${
                        form.addressType === t
                          ? 'bg-[#18201B] text-[#F8F5ED] border-[#18201B]'
                          : 'border-[#18201B]/25'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  Buyer GSTIN (Optional — For Business Tax Credit)
                </label>
                <input
                  type="text"
                  value={form.customerGstin}
                  onChange={(e) =>
                    setForm({ ...form, customerGstin: e.target.value.toUpperCase() })
                  }
                  placeholder="e.g. 29AABCU9603R1ZM"
                  className="w-full h-10 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED] font-mono uppercase"
                />
              </div>
            </div>
          </section>

          {/* Step 2: Payment Method Selection */}
          <section className="p-5 sm:p-6 rounded-[8px] border border-[#18201B]/15 bg-[#F8F5ED] space-y-4">
            <h2 className="font-story text-xl font-bold border-b border-[#18201B]/10 pb-3">
              2. Select Indian Payment Method
            </h2>

            <div className="space-y-3">
              {/* Option A: Razorpay Instant Gateway */}
              <label
                className={`block p-4 rounded-[6px] border cursor-pointer transition-colors ${
                  paymentMethod === 'razorpay'
                    ? 'border-[#18201B] bg-[#18201B]/[0.03]'
                    : 'border-[#18201B]/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-bold flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#B28A50] shrink-0" />
                        <span>
                          Instant UPI Apps (GPay, PhonePe, Paytm), RuPay, Cards & NetBanking
                        </span>
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#B28A50]/25">
                        Instant Confirmation
                      </span>
                    </div>
                    <p className="text-xs text-[#18201B]/70 mt-1">
                      Powered by Razorpay India. Instant order confirmation and priority 24-hour Connaught Place, New Delhi dispatch.
                    </p>
                  </div>
                </div>
              </label>

              {/* Option B: Manual Merchant UPI QR + 12-Digit UTR Claim */}
              <label
                className={`block p-4 rounded-[6px] border cursor-pointer transition-colors ${
                  paymentMethod === 'manual_upi'
                    ? 'border-[#18201B] bg-[#18201B]/[0.03]'
                    : 'border-[#18201B]/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'manual_upi'}
                    onChange={() => setPaymentMethod('manual_upi')}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-bold flex items-center gap-2">
                        <QrCode className="w-4 h-4 text-[#B28A50] shrink-0" />
                        <span>Direct Merchant UPI QR Scan + 12-Digit UTR Verification</span>
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#18201B]/10">
                        Zero Gateway Fee
                      </span>
                    </div>
                    <p className="text-xs text-[#18201B]/70">
                      Scan our official Whole/retail Name Pvt. Ltd. UPI QR with any UPI app and enter your 12-digit UTR number below.
                    </p>

                    {paymentMethod === 'manual_upi' && (
                      <div className="p-4 rounded bg-[#F8F5ED] border border-[#18201B]/20 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                        <div className="sm:col-span-4 flex justify-center">
                          <img
                            src="/images/upi-qr.svg"
                            alt="Whole/retail Name Verified Merchant UPI QR"
                            className="w-36 h-44 object-contain rounded border border-[#18201B]/15"
                          />
                        </div>
                        <div className="sm:col-span-8 space-y-2.5 text-xs">
                          <p className="font-bold text-[#18201B]">
                            Merchant VPA: <span className="font-mono">karigarstore@icici</span>
                          </p>
                          <p>
                            Exact Amount to Transfer:{' '}
                            <strong className="price-num text-sm">
                              ₹{(serverQuote?.grandTotal || 0).toLocaleString('en-IN')}
                            </strong>
                          </p>
                          <div>
                            <label className="block font-semibold mb-1">
                              Enter 12-Digit UPI Reference / UTR Number *
                            </label>
                            <input
                              type="text"
                              inputMode="numeric"
                              maxLength={12}
                              value={manualUtr}
                              onChange={(e) =>
                                setManualUtr(e.target.value.replace(/\D/g, ''))
                              }
                              placeholder="e.g. 623918472910"
                              className="w-full h-10 px-3 rounded border border-[#18201B]/30 bg-[#F8F5ED] font-mono"
                            />
                            <p className="text-[11px] text-[#18201B]/65 mt-1">
                              Your order will be reserved immediately and verified by our Finance Desk against our bank statement.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </label>

              {/* Option C: Cash on Delivery (COD) */}
              <label
                className={`block p-4 rounded-[6px] border transition-colors ${
                  serverQuote?.codEligible === false
                    ? 'opacity-60 cursor-not-allowed border-[#18201B]/15'
                    : paymentMethod === 'cod'
                    ? 'border-[#18201B] bg-[#18201B]/[0.03] cursor-pointer'
                    : 'border-[#18201B]/20 cursor-pointer'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    disabled={serverQuote?.codEligible === false}
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-bold flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-[#B28A50] shrink-0" />
                        <span>Cash on Delivery (Pay via Cash or UPI at Doorstep)</span>
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#18201B]/10 price-num">
                        +₹40 COD Fee
                      </span>
                    </div>
                    <p className="text-xs text-[#18201B]/70 mt-1">
                      {serverQuote?.codEligible === false
                        ? 'COD is unavailable for this PIN code or for orders above ₹10,000. Please choose Instant UPI or Manual UPI QR.'
                        : 'Available on serviceable Indian PIN codes for orders up to ₹10,000.'}
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* Right 5 Columns: Authoritative Server Order Quote */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 rounded-[8px] border border-[#18201B]/20 bg-[#F8F5ED] space-y-5 sticky top-24">
            <h2 className="font-story text-xl font-bold border-b border-[#18201B]/12 pb-3">
              Order & GST Summary ({cart.length} {cart.length === 1 ? 'Item' : 'Items'})
            </h2>

            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {cart.map((item) => (
                <div
                  key={item.variantId}
                  className="flex items-center justify-between gap-3 text-xs pb-2.5 border-b border-[#18201B]/8"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-11 h-13 object-cover rounded border border-[#18201B]/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{item.title}</p>
                      <p className="text-[#18201B]/65">
                        {item.color} / {item.size} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold price-num shrink-0">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon Input */}
            <div className="space-y-1.5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => {
                    const next = e.target.value.toUpperCase();
                    setCouponCode(next);
                    setStoreCoupon(next);
                  }}
                  placeholder="Promo code (FESTIVE500 / WELCOME10)"
                  className="flex-1 h-10 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED] text-xs font-mono uppercase"
                />
                {couponCode && (
                  <button
                    type="button"
                    onClick={() => {
                      setCouponCode('');
                      setStoreCoupon('');
                    }}
                    className="px-3 h-10 rounded border border-[#18201B]/25 text-xs font-semibold cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
              {serverQuote?.couponExplanation && (
                <p className="text-[11px] font-semibold text-[#18201B]/80">
                  {serverQuote.couponExplanation}
                </p>
              )}
            </div>

            {/* Server Calculated Totals */}
            {serverQuote && (
              <div className="space-y-2 text-xs sm:text-sm border-t border-[#18201B]/12 pt-4 price-num">
                <div className="flex justify-between">
                  <span className="text-[#18201B]/75">Merchandise Subtotal</span>
                  <span>₹{(serverQuote.subtotal || 0).toLocaleString('en-IN')}</span>
                </div>
                {(serverQuote.discountTotal || 0) > 0 && (
                  <div className="flex justify-between font-semibold">
                    <span>Coupon Discount ({serverQuote.appliedCoupon})</span>
                    <span>
                      -₹{(serverQuote.discountTotal || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#18201B]/75">Insured Delivery</span>
                  <span>
                    {(serverQuote.shippingCharge || 0) === 0
                      ? 'FREE'
                      : `₹${serverQuote.shippingCharge}`}
                  </span>
                </div>
                {(serverQuote.codFee || 0) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-[#18201B]/75">COD Handling Fee</span>
                    <span>₹{serverQuote.codFee}</span>
                  </div>
                )}
                <div className="p-2.5 rounded bg-[#18201B]/[0.03] text-[11px] text-[#18201B]/75 space-y-0.5">
                  <div className="flex justify-between">
                    <span>Included GST Total</span>
                    <span>₹{(serverQuote.taxTotal || 0).toLocaleString('en-IN')}</span>
                  </div>
                  {(serverQuote.cgstTotal || 0) > 0 ? (
                    <div className="flex justify-between">
                      <span>Intra-State CGST + SGST (Delhi)</span>
                      <span>
                        ₹
                        {(
                          (serverQuote.cgstTotal || 0) + (serverQuote.sgstTotal || 0)
                        ).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <span>Inter-State IGST Included</span>
                      <span>₹{(serverQuote.igstTotal || 0).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-base sm:text-lg font-bold border-t border-[#18201B]/20 pt-3">
                  <span>Grand Total Payable</span>
                  <span>₹{(serverQuote.grandTotal || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={placingOrder || quoteLoading || serverQuote?.pinInfo?.serviceable === false}
              className="w-full py-3.5 px-5 rounded-[6px] bg-[#18201B] text-[#F8F5ED] text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#18201B]/90 disabled:opacity-50 cursor-pointer"
            >
              <Lock className="w-4 h-4 text-[#B28A50]" />
              <span>
                {placingOrder
                  ? 'Processing Order...'
                  : paymentMethod === 'razorpay'
                  ? `Pay ₹${(serverQuote?.grandTotal || 0).toLocaleString('en-IN')} via Razorpay`
                  : paymentMethod === 'manual_upi'
                  ? `Submit UPI UTR & Place Order (₹${(
                      serverQuote?.grandTotal || 0
                    ).toLocaleString('en-IN')})`
                  : `Place Cash on Delivery Order (₹${(
                      serverQuote?.grandTotal || 0
                    ).toLocaleString('en-IN')})`}
              </span>
            </button>
          </div>
        </div>
      </form>

      {/* SIMULATED RAZORPAY INDIA CHECKOUT MODAL */}
      {showRazorpayModal && (
        <div
          className="fixed inset-0 z-50 bg-[#18201B]/70 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Razorpay payment gateway"
          onClick={() => !placingOrder && setShowRazorpayModal(false)}
        >
          <div
            className="w-full max-w-md bg-[#F8F5ED] text-[#18201B] rounded-[8px] border-2 border-[#B28A50] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#18201B] text-[#F8F5ED] p-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#B28A50] font-bold">
                  RAZORPAY SECURE INDIA
                </p>
                <h3 className="font-story text-lg font-bold">
                  Whole/retail Name Pvt. Ltd.
                </h3>
              </div>
              <div className="text-right price-num">
                <p className="text-xs text-[#F8F5ED]/70">Payable</p>
                <p className="text-lg font-bold text-[#B28A50]">
                  ₹{(serverQuote?.grandTotal || 0).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-[#18201B]/80">
                Choose your preferred instant payment option to complete your order:
              </p>

              <div className="space-y-2">
                <button
                  type="button"
                  disabled={placingOrder}
                  onClick={() =>
                    submitOrderToBackend(`pay_rzp_upi_${Date.now().toString().slice(-6)}`)
                  }
                  className="w-full p-3.5 rounded-[6px] bg-[#18201B] text-[#F8F5ED] font-semibold flex items-center justify-between hover:bg-[#18201B]/90 cursor-pointer"
                >
                  <span>Approve via UPI App (GPay / PhonePe / Paytm / BHIM)</span>
                  <span className="text-[#B28A50]">Instant →</span>
                </button>

                <button
                  type="button"
                  disabled={placingOrder}
                  onClick={() =>
                    submitOrderToBackend(`pay_rzp_card_${Date.now().toString().slice(-6)}`)
                  }
                  className="w-full p-3.5 rounded-[6px] border border-[#18201B]/25 text-[#18201B] font-semibold flex items-center justify-between hover:border-[#B28A50] cursor-pointer"
                >
                  <span>Pay via RuPay / Visa / Mastercard / NetBanking</span>
                  <span>Proceed →</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowRazorpayModal(false)}
                className="w-full py-2 text-center text-xs text-[#18201B]/65 underline cursor-pointer"
              >
                Cancel and choose another payment method
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
