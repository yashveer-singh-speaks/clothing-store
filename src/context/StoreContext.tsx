'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ProductRecord, GlobalCMSSettings, CategoryRecord, CollectionRecord } from '@/lib/types';

export interface CartItem {
  productId: string;
  variantId: string;
  sku: string;
  title: string;
  size: string;
  color: string;
  price: number;
  mrp: number;
  image: string;
  quantity: number;
  maxStock: number;
}

interface ToastMessage {
  id: string;
  text: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface StoreContextValue {
  products: ProductRecord[];
  categories: CategoryRecord[];
  collections: CollectionRecord[];
  globalSettings: GlobalCMSSettings | null;
  promotions: any[];
  synonyms: { canonical: string; terms: string[] }[];
  cart: CartItem[];
  savedForLater: CartItem[];
  wishlistIds: string[];
  recentlyViewedIds: string[];
  selectedPin: string;
  pinDetails: any | null;
  appliedCoupon: string;
  analyticsConsent: boolean;
  reduceMotion: boolean;
  isCartDrawerOpen: boolean;
  isPinModalOpen: boolean;
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;
  isAnnouncementModalOpen: boolean;
  toast: ToastMessage | null;
  setCartDrawerOpen: (open: boolean) => void;
  setPinModalOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setAnnouncementModalOpen: (open: boolean) => void;
  setAppliedCoupon: (code: string) => void;
  setAnalyticsConsent: (consent: boolean) => void;
  setReduceMotion: (reduce: boolean) => void;
  addToCart: (item: Omit<CartItem, 'quantity'>, qty?: number, openDrawer?: boolean) => void;
  updateCartQty: (variantId: string, qty: number) => void;
  removeFromCart: (variantId: string) => void;
  moveToSavedForLater: (variantId: string) => void;
  moveSavedToCart: (variantId: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string, productTitle?: string) => void;
  recordRecentlyViewed: (productId: string) => void;
  clearRecentlyViewed: () => void;
  checkAndSetPin: (pin: string) => Promise<any>;
  showToast: (text: string, actionLabel?: string, onAction?: () => void) => void;
  dismissToast: () => void;
  trackEvent: (eventName: string, payload?: Record<string, any>) => void;
  refreshStorefront: () => Promise<void>;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [collections, setCollections] = useState<CollectionRecord[]>([]);
  const [globalSettings, setGlobalSettings] = useState<GlobalCMSSettings | null>(null);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [synonyms, setSynonyms] = useState<{ canonical: string; terms: string[] }[]>([]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [savedForLater, setSavedForLater] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);
  const [selectedPin, setSelectedPin] = useState<string>('');
  const [pinDetails, setPinDetails] = useState<any | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<string>('');
  const [analyticsConsent, setAnalyticsConsentState] = useState<boolean>(true);
  const [reduceMotion, setReduceMotionState] = useState<boolean>(false);

  const [isCartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [isPinModalOpen, setPinModalOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAnnouncementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback((text: string, actionLabel?: string, onAction?: () => void) => {
    const id = `tst_${Date.now()}`;
    setToast({ id, text, actionLabel, onAction });
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast((prev) => (prev?.id === toast.id ? null : prev));
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  const refreshStorefront = useCallback(async () => {
    try {
      const res = await fetch('/api/storefront');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        setCategories(data.categories || []);
        setCollections(data.collections || []);
        setGlobalSettings(data.globalSettings || null);
        setPromotions(data.promotions || []);
        setSynonyms(data.synonyms || []);
      }
    } catch {
      // Ignore network error during initial hydration
    }
  }, []);

  useEffect(() => {
    refreshStorefront();
    try {
      const savedCart = localStorage.getItem('krg_cart_v2');
      if (savedCart) setCart(JSON.parse(savedCart));
      const savedLater = localStorage.getItem('krg_saved_v2');
      if (savedLater) setSavedForLater(JSON.parse(savedLater));
      const savedWish = localStorage.getItem('krg_wishlist_v2');
      if (savedWish) setWishlistIds(JSON.parse(savedWish));
      const savedRecent = localStorage.getItem('krg_recent_v2');
      if (savedRecent) setRecentlyViewedIds(JSON.parse(savedRecent));
      const savedPin = localStorage.getItem('krg_user_pin_v3');
      if (savedPin && /^[1-9][0-9]{5}$/.test(savedPin)) {
        setSelectedPin(savedPin);
        fetch(`/api/pincodes?pin=${encodeURIComponent(savedPin)}`)
          .then((r) => r.json())
          .then((d) => {
            if (d.valid && d.serviceable) setPinDetails(d);
          })
          .catch(() => {});
      }
      const savedConsent = localStorage.getItem('krg_consent_v2');
      if (savedConsent !== null) setAnalyticsConsentState(savedConsent === 'true');
    } catch {
      // Ignore storage access errors
    }
  }, [refreshStorefront]);

  useEffect(() => {
    try {
      localStorage.setItem('krg_cart_v2', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('krg_saved_v2', JSON.stringify(savedForLater));
    } catch {}
  }, [savedForLater]);

  useEffect(() => {
    try {
      localStorage.setItem('krg_wishlist_v2', JSON.stringify(wishlistIds));
    } catch {}
  }, [wishlistIds]);

  useEffect(() => {
    try {
      localStorage.setItem('krg_recent_v2', JSON.stringify(recentlyViewedIds));
    } catch {}
  }, [recentlyViewedIds]);

  const trackEvent = useCallback(
    (eventName: string, payload: Record<string, any> = {}) => {
      if (!analyticsConsent) return;
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name: eventName,
          page_id: typeof window !== 'undefined' ? window.location.pathname : 'home',
          section_id: payload.sectionId || null,
          entity_type: payload.entityType || null,
          entity_id: payload.entityId || null,
          position: payload.position ?? null,
          properties: payload,
        }),
      }).catch(() => {});
    },
    [analyticsConsent]
  );

  const addToCart = useCallback(
    (item: Omit<CartItem, 'quantity'>, qty = 1, openDrawer = false) => {
      if (item.maxStock <= 0) {
        showToast(`"${item.title}" (${item.size}) is currently out of stock.`);
        return;
      }
      setCart((prev) => {
        const existingIdx = prev.findIndex((i) => i.variantId === item.variantId);
        if (existingIdx > -1) {
          const updated = [...prev];
          const nextQty = Math.min(item.maxStock, updated[existingIdx].quantity + qty);
          updated[existingIdx] = { ...updated[existingIdx], quantity: nextQty };
          return updated;
        }
        return [...prev, { ...item, quantity: Math.min(item.maxStock, qty) }];
      });
      trackEvent('cart_add_succeeded', {
        entityType: 'product',
        entityId: item.productId,
        variantId: item.variantId,
      });
      if (openDrawer) {
        setCartDrawerOpen(true);
      } else {
        showToast(`Added "${item.title}" (${item.size}) to your cart.`, 'View Cart', () =>
          setCartDrawerOpen(true)
        );
      }
    },
    [showToast, trackEvent]
  );

  const updateCartQty = useCallback((variantId: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.variantId !== variantId));
      return;
    }
    setCart((prev) =>
      prev.map((i) =>
        i.variantId === variantId ? { ...i, quantity: Math.min(i.maxStock, qty) } : i
      )
    );
  }, []);

  const removeFromCart = useCallback(
    (variantId: string) => {
      setCart((prev) => {
        const removed = prev.find((i) => i.variantId === variantId);
        if (removed) {
          showToast(`Removed "${removed.title}" from cart.`, 'Undo', () => {
            setCart((curr) => [...curr, removed]);
          });
        }
        return prev.filter((i) => i.variantId !== variantId);
      });
    },
    [showToast]
  );

  const moveToSavedForLater = useCallback(
    (variantId: string) => {
      const target = cart.find((i) => i.variantId === variantId);
      if (!target) return;
      setCart((prev) => prev.filter((i) => i.variantId !== variantId));
      setSavedForLater((prev) => [
        ...prev.filter((i) => i.variantId !== variantId),
        target,
      ]);
      showToast(`Saved "${target.title}" for later.`);
    },
    [cart, showToast]
  );

  const moveSavedToCart = useCallback(
    (variantId: string) => {
      const target = savedForLater.find((i) => i.variantId === variantId);
      if (!target) return;
      setSavedForLater((prev) => prev.filter((i) => i.variantId !== variantId));
      addToCart(target, target.quantity, false);
    },
    [savedForLater, addToCart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const toggleWishlist = useCallback(
    (productId: string, productTitle?: string) => {
      setWishlistIds((prev) => {
        const exists = prev.includes(productId);
        const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
        showToast(
          exists
            ? `Removed ${productTitle || 'item'} from your wishlist.`
            : `Saved ${productTitle || 'item'} to your wishlist.`
        );
        return next;
      });
    },
    [showToast]
  );

  const recordRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewedIds((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 8);
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewedIds([]);
    try {
      localStorage.removeItem('krg_recent_v2');
    } catch {}
    showToast('Cleared your recently viewed browsing history.');
  }, [showToast]);

  const checkAndSetPin = useCallback(async (pin: string) => {
    const res = await fetch(`/api/pincodes?pin=${encodeURIComponent(pin)}`);
    const data = await res.json();
    if (data.valid && data.serviceable) {
      setSelectedPin(pin.trim());
      setPinDetails(data);
      try {
        localStorage.setItem('krg_user_pin_v3', pin.trim());
      } catch {}
    }
    return data;
  }, []);

  const setAnalyticsConsent = useCallback((consent: boolean) => {
    setAnalyticsConsentState(consent);
    try {
      localStorage.setItem('krg_consent_v2', String(consent));
    } catch {}
  }, []);

  const setReduceMotion = useCallback((reduce: boolean) => {
    setReduceMotionState(reduce);
  }, []);

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        collections,
        globalSettings,
        promotions,
        synonyms,
        cart,
        savedForLater,
        wishlistIds,
        recentlyViewedIds,
        selectedPin,
        pinDetails,
        appliedCoupon,
        analyticsConsent,
        reduceMotion,
        isCartDrawerOpen,
        isPinModalOpen,
        isSearchOpen,
        isMobileMenuOpen,
        isAnnouncementModalOpen,
        toast,
        setCartDrawerOpen,
        setPinModalOpen,
        setSearchOpen,
        setMobileMenuOpen,
        setAnnouncementModalOpen,
        setAppliedCoupon,
        setAnalyticsConsent,
        setReduceMotion,
        addToCart,
        updateCartQty,
        removeFromCart,
        moveToSavedForLater,
        moveSavedToCart,
        clearCart,
        toggleWishlist,
        recordRecentlyViewed,
        clearRecentlyViewed,
        checkAndSetPin,
        showToast,
        dismissToast,
        trackEvent,
        refreshStorefront,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
