'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  MapPin,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  Trash2,
  Bookmark,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Lock,
  Home,
  LayoutGrid,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { GlobalCMSSettings } from '@/lib/types';

const DEFAULT_SETTINGS: GlobalCMSSettings = {
  storeName: 'Whole/retail Name',
  storeTagline: 'Full-grain leather jackets, coats, skirts & goods.',
  legalEntityName: 'Whole/retail Name Pvt. Ltd.',
  gstin: '07AABCK4829L1Z5',
  foundingYear: 2019,
  announcementBar: {
    enabled: true,
    message: 'Free delivery on orders over ₹999',
    detailsLabel: 'Details',
    detailsHref: '/shipping',
    detailsModalText:
      'Orders with a payable merchandise value of ₹999 or above qualify for free insured delivery across serviceable Indian postcodes. Orders below ₹999 incur a flat ₹79 shipping charge. Unused leather garments with original tags intact are eligible for a 7-day size exchange or return from the date of delivery. Custom-altered garments are excluded from exchange. Cash on Delivery (COD) is available on eligible postcodes for orders up to ₹10,000 with a ₹40 cash handling fee.',
    startsAt: '2026-01-01T00:00:00+05:30',
    endsAt: null,
  },
  header: {
    logoText: 'WHOLE/RETAIL NAME',
    showPinChecker: true,
    defaultPin: '',
    navLinks: [
      { label: 'Shop All', href: '/products' },
      { label: 'Men', href: '/category/men-leather' },
      { label: 'Women', href: '/category/women-leather' },
      { label: 'New Arrivals', href: '/collection/new-arrivals' },
      { label: 'Our Story', href: '/story' },
    ],
  },
  footer: {
    aboutBlurb:
      'Founded in 2019 with cutting benches in Okhla, New Delhi and headquartered at our Connaught Place, New Delhi atelier. We craft outerwear from uncorrected full-grain lambskin, cowhide, and vegetable-tanned leather.',
    address: '45, Inner Circle, Connaught Place, New Delhi, Delhi 110001',
    phone: '+91 11 4123 9876',
    email: 'care@karigarstore.in',
    whatsapp: '+91 98765 43210',
    hours: 'Mon–Sat: 10:00 AM – 7:00 PM IST',
    grievanceOfficerName: 'Rohan Kulkarni (Grievance Redressal Officer)',
    grievanceOfficerEmail: 'grievance@karigarstore.in',
    showSuperAdminLink: true,
    superAdminLinkLabel: 'SA A/C',
  },
  colors: {
    ivory: '#F8F5ED',
    charcoal: '#18201B',
    gold: '#B28A50',
  },
};

const DESKTOP_NAV_ITEMS: {
  label: string;
  href: string;
  submenu?: { label: string; href: string }[];
}[] = [
  {
    label: 'Shop All',
    href: '/products',
    submenu: [
      { label: 'All Products', href: '/products' },
      { label: 'Jackets', href: '/category/jackets' },
      { label: 'Coats', href: '/category/coats' },
      { label: 'Bombers', href: '/category/bombers' },
      { label: 'Skirts', href: '/category/skirts' },
      { label: 'Accessories', href: '/category/accessories' },
      { label: 'Footwear', href: '/category/footwear' },
    ],
  },
  {
    label: 'Men',
    href: '/category/men-leather',
    submenu: [
      { label: "All Men's Leather", href: '/category/men-leather' },
      { label: 'Jackets', href: '/category/jackets' },
      { label: 'Coats', href: '/category/coats' },
      { label: 'Bombers', href: '/category/bombers' },
      { label: 'Accessories', href: '/category/accessories' },
      { label: 'Footwear', href: '/category/footwear' },
    ],
  },
  {
    label: 'Women',
    href: '/category/women-leather',
    submenu: [
      { label: "All Women's Leather", href: '/category/women-leather' },
      { label: 'Jackets', href: '/category/jackets' },
      { label: 'Coats', href: '/category/coats' },
      { label: 'Bombers', href: '/category/bombers' },
      { label: 'Skirts', href: '/category/skirts' },
      { label: 'Accessories', href: '/category/accessories' },
    ],
  },
  {
    label: 'New Arrivals',
    href: '/collection/new-arrivals',
  },
  {
    label: 'Our Story',
    href: '/story',
  },
];

const POPULAR_PINS = [
  { pincode: '110001', city: 'New Delhi' },
  { pincode: '110003', city: 'New Delhi' },
  { pincode: '400001', city: 'Mumbai' },
  { pincode: '110001', city: 'New Delhi' },
  { pincode: '600001', city: 'Chennai' },
  { pincode: '500001', city: 'Hyderabad' },
  { pincode: '302001', city: 'Jaipur' },
];

export default function StoreShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    products,
    globalSettings,
    synonyms,
    cart,
    savedForLater,
    wishlistIds,
    selectedPin,
    pinDetails,
    reduceMotion,
    isCartDrawerOpen,
    isPinModalOpen,
    isSearchOpen,
    isMobileMenuOpen,
    isAnnouncementModalOpen,
    toast,
    setReduceMotion,
    setCartDrawerOpen,
    setPinModalOpen,
    setSearchOpen,
    setMobileMenuOpen,
    setAnnouncementModalOpen,
    updateCartQty,
    removeFromCart,
    moveToSavedForLater,
    moveSavedToCart,
    checkAndSetPin,
    dismissToast,
  } = useStore();

  const settings = globalSettings || DEFAULT_SETTINGS;
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [pinInput, setPinInput] = useState(selectedPin || '');
  const [pinChecking, setPinChecking] = useState(false);
  const [openNavSubmenu, setOpenNavSubmenu] = useState<string | null>(null);
  const [openFooterAccordion, setOpenFooterAccordion] = useState<string | null>(null);
  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Biker Jacket',
    'Leather Coat',
    'Bomber Jacket',
    'Leather Skirt',
  ]);

  useEffect(() => {
    if (selectedPin) setPinInput(selectedPin);
  }, [selectedPin]);

  const isBareRoute =
    pathname?.startsWith('/admin') || pathname?.startsWith('/invoice');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close all open overlays when route changes (e.g. browser Back/Forward navigation)
  useEffect(() => {
    setSearchOpen(false);
    setCartDrawerOpen(false);
    setPinModalOpen(false);
    setMobileMenuOpen(false);
    setAnnouncementModalOpen(false);
    setIsAccessibilityModalOpen(false);
    setOpenNavSubmenu(null);
  }, [
    pathname,
    setSearchOpen,
    setCartDrawerOpen,
    setPinModalOpen,
    setMobileMenuOpen,
    setAnnouncementModalOpen,
  ]);

  const isAnyOverlayOpen =
    isCartDrawerOpen ||
    isPinModalOpen ||
    isSearchOpen ||
    isMobileMenuOpen ||
    isAnnouncementModalOpen ||
    isAccessibilityModalOpen;

  // Lock background page scroll when any drawer or modal is open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = isAnyOverlayOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAnyOverlayOpen]);

  // Escape key closes active drawers/modals/submenus (WCAG 2.2 AA Keyboard Accessibility)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (openNavSubmenu) setOpenNavSubmenu(null);
        if (isSearchOpen) setSearchOpen(false);
        if (isCartDrawerOpen) setCartDrawerOpen(false);
        if (isPinModalOpen) setPinModalOpen(false);
        if (isMobileMenuOpen) setMobileMenuOpen(false);
        if (isAnnouncementModalOpen) setAnnouncementModalOpen(false);
        if (isAccessibilityModalOpen) setIsAccessibilityModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    openNavSubmenu,
    isSearchOpen,
    isCartDrawerOpen,
    isPinModalOpen,
    isMobileMenuOpen,
    isAnnouncementModalOpen,
    isAccessibilityModalOpen,
    setSearchOpen,
    setCartDrawerOpen,
    setPinModalOpen,
    setMobileMenuOpen,
    setAnnouncementModalOpen,
  ]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );
  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );
  const cartMrpTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.mrp * item.quantity, 0),
    [cart]
  );

  // Synonym-aware predictive search results (merges built-in + Super Admin dynamic synonyms)
  const searchResults = useMemo(() => {
    if (!debouncedQuery) return [];
    const q = debouncedQuery.toLowerCase();
    const synonymMap: Record<string, string[]> = {
      biker: ['jacket', 'moto', 'racer', 'leather'],
      coat: ['trench', 'overcoat', 'car coat', 'leather'],
      bomber: ['flight', 'aviator', 'ma-1', 'jacket'],
      skirt: ['midi', 'pencil', 'wrap', 'aline'],
      boots: ['footwear', 'chelsea', 'shoe', 'leather'],
      bag: ['duffle', 'briefcase', 'accessories', 'leather'],
    };
    const expandedTerms = [q];
    Object.entries(synonymMap).forEach(([key, vals]) => {
      if (q.includes(key)) expandedTerms.push(...vals);
    });
    (synonyms || []).forEach((entry) => {
      const c = entry.canonical.toLowerCase();
      const terms = (entry.terms || []).map((t) => t.toLowerCase());
      if (q.includes(c) || terms.some((t) => q.includes(t))) {
        expandedTerms.push(c, ...terms);
      }
    });

    return products
      .filter((p) => {
        const haystack = `${p.title} ${p.subtitle} ${p.shortDescription} ${p.productType} ${p.tags.join(' ')}`.toLowerCase();
        return expandedTerms.some((term) => haystack.includes(term));
      })
      .slice(0, 6);
  }, [debouncedQuery, products, synonyms]);

  if (isBareRoute) {
    return <>{children}</>;
  }

  const freeShippingThreshold = 999;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const freeShippingProgress = Math.min(
    100,
    Math.round((cartSubtotal / freeShippingThreshold) * 100)
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const term = searchQuery.trim();
    setRecentSearches((prev) => [term, ...prev.filter((x) => x !== term)].slice(0, 6));
    setSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const handlePinCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[1-9][0-9]{5}$/.test(pinInput.trim())) return;
    setPinChecking(true);
    await checkAndSetPin(pinInput.trim());
    setPinChecking(false);
  };

  const announcementMessage =
    settings.announcementBar?.message && settings.announcementBar.message.length <= 48
      ? settings.announcementBar.message
      : 'Free delivery on orders over ₹999';

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#F8F5ED] text-[#18201B] overflow-x-hidden ${
        reduceMotion ? 'reduce-motion' : ''
      }`}
    >
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-[#18201B] focus:text-[#F8F5ED] focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to main content
      </a>

      {/* GLOBAL SECTION 1: SHORT ANNOUNCEMENT BAR (Fix 06 & Fix 14: 32px desktop / 34px mobile) */}
      {settings.announcementBar?.enabled !== false && (
        <div
          role="region"
          aria-label="Store announcement"
          className="bg-[#18201B] text-[#F8F5ED] border-b border-[#B28A50]/25 text-xs min-h-[34px] lg:min-h-[32px] py-1.5 lg:py-1 px-4 flex items-center justify-center"
        >
          <button
            type="button"
            onClick={() => setAnnouncementModalOpen(true)}
            className="max-w-[1440px] mx-auto inline-flex items-center justify-center gap-x-2.5 gap-y-0.5 flex-wrap text-center cursor-pointer group"
          >
            <span className="font-normal tracking-wide text-[#F8F5ED]">
              {announcementMessage}
            </span>
            <span className="underline decoration-[#B28A50] underline-offset-4 font-semibold text-[#F8F5ED] group-hover:text-[#B28A50] transition-colors">
              {settings.announcementBar?.detailsLabel || 'Details'}
            </span>
          </button>
        </div>
      )}

      {/* GLOBAL SECTION 2: SIMPLIFIED HEADER & NAVIGATION (Fix 06, 07, 08, 09, 12, 13) */}
      {/* Non-sticky on mobile so scrolling immediately gives space back to content; sticky on desktop */}
      <header className="lg:sticky lg:top-0 z-40 bg-[#F8F5ED]/95 backdrop-blur-sm border-b border-[#18201B]/12">
        {/* Main Header Row: 56px mobile, 76px desktop */}
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 h-[56px] lg:h-[76px] flex items-center justify-between gap-4">
          {/* Mobile Left: 44px menu button (Fix 08) */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open categories and store menu"
              className="w-11 h-11 -ml-1.5 flex items-center justify-center rounded-[6px] text-[#18201B] hover:bg-[#18201B]/5 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Wordmark: Centre on mobile, Left on desktop, no small tagline (Fix 08 & Fix 12) */}
          <Link
            href="/"
            className="flex items-center justify-center lg:justify-start focus:outline-none shrink-0"
          >
            <span className="font-story text-xl sm:text-2xl lg:text-[26px] font-bold tracking-tight text-[#18201B] leading-none">
              {settings.header?.logoText || 'WHOLE/RETAIL NAME'}
            </span>
          </Link>

          {/* Desktop Search Form: 360px to 520px flexible width, 44px height, "Search products", no chip (Fix 09) */}
          <form
            onSubmit={handleSearchSubmit}
            role="search"
            className="hidden lg:flex flex-1 min-w-[360px] max-w-[520px] mx-6 relative"
          >
            <Search className="w-4 h-4 text-[#18201B]/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              aria-label="Search products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim().length > 0) setSearchOpen(true);
              }}
              placeholder="Search products"
              className="w-full h-11 pl-10 pr-4 rounded-[6px] bg-[#F8F5ED] border border-[#18201B]/25 hover:border-[#18201B]/50 focus:border-[#18201B] text-base text-[#18201B] placeholder:text-[#18201B]/60 transition-colors"
            />
          </form>

          {/* Right Controls: Mobile shows only 44px Wishlist icon; Desktop shows Wishlist, Account, and Cart (Fix 08) */}
          <div className="flex items-center gap-1.5 lg:gap-2.5">
            <Link
              href="/account?tab=wishlist"
              aria-label={`Saved items (${wishlistIds.length})`}
              className="relative w-11 h-11 -mr-1.5 lg:mr-0 rounded-[6px] flex items-center justify-center text-[#18201B] hover:bg-[#18201B]/5 transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#B28A50] text-[#18201B] text-xs font-bold flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </Link>

            <Link
              href="/account"
              aria-label="Customer account and orders"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 h-11 rounded-[6px] text-sm font-medium text-[#18201B] hover:bg-[#18201B]/5 transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Account</span>
            </Link>

            <button
              type="button"
              onClick={() => setCartDrawerOpen(true)}
              aria-label={`Shopping bag with ${cartCount} items`}
              className="hidden lg:inline-flex relative h-11 px-3.5 rounded-[6px] bg-[#18201B] text-[#F8F5ED] items-center gap-2 hover:bg-[#18201B]/90 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#B28A50]" />
              <span className="text-sm font-semibold price-num">{cartCount}</span>
              {cartSubtotal > 0 && (
                <span className="text-xs text-[#F8F5ED]/85 border-l border-[#F8F5ED]/20 pl-2 price-num">
                  ₹{cartSubtotal.toLocaleString('en-IN')}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Row: 54px including padding, 16px horizontal gutters, 44px height, 16px input text (Fix 06 & Fix 09) */}
        <div className="lg:hidden px-4 pb-2.5 pt-0.5 h-[54px] flex items-center">
          <form onSubmit={handleSearchSubmit} role="search" className="w-full relative">
            <Search className="w-4 h-4 text-[#18201B]/75 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              aria-label="Search products"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products"
              className="w-full h-11 pl-10 pr-3.5 rounded-[6px] bg-[#F8F5ED] border border-[#18201B]/25 focus:border-[#18201B] text-base text-[#18201B] placeholder:text-[#18201B]/65"
            />
          </form>
        </div>

        {/* Mobile Delivery Row: 32px height, stateful postcode message (Fix 06, Fix 13, Fix 17) */}
        <div className="lg:hidden bg-[#18201B]/[0.04] border-t border-[#18201B]/10 px-4 h-8 flex items-center">
          <button
            type="button"
            onClick={() => setPinModalOpen(true)}
            className="w-full h-8 flex items-center justify-between gap-2 text-xs text-[#18201B] font-medium cursor-pointer text-left"
          >
            <span className="inline-flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#B28A50] shrink-0" />
              {pinDetails ? (
                <span className="truncate">
                  Deliver to <strong>{pinDetails.pincode}</strong> ({pinDetails.city}) •{' '}
                  {pinDetails.transitDays}
                </span>
              ) : (
                <span className="truncate">Check delivery to your postcode</span>
              )}
            </span>
            <span className="underline text-[#18201B]/80 shrink-0 text-xs">
              {pinDetails ? 'Change' : 'Select'}
            </span>
          </button>
        </div>

        {/* Desktop Shopping Navigation Row: 44px height, 5 top-level items + stateful postcode control on right (Fix 06, 07, 13) */}
        <nav
          aria-label="Primary shopping navigation"
          className="hidden lg:block border-t border-[#18201B]/10 bg-[#F8F5ED]"
          onMouseLeave={() => setOpenNavSubmenu(null)}
        >
          <div className="max-w-[1440px] mx-auto px-8 h-11 flex items-center justify-between">
            <ul className="flex items-center gap-6 text-[15px] leading-[20px] font-medium">
              {DESKTOP_NAV_ITEMS.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.submenu && item.submenu.some((sub) => pathname === sub.href));
                const isOpen = openNavSubmenu === item.label;

                if (!item.submenu) {
                  return (
                    <li key={item.label} className="whitespace-nowrap">
                      <Link
                        href={item.href}
                        className={`h-11 inline-flex items-center border-b-2 transition-colors whitespace-nowrap ${
                          isActive
                            ? 'border-[#18201B] text-[#18201B] font-semibold'
                            : 'border-transparent text-[#18201B]/85 hover:text-[#18201B] hover:border-[#18201B]/40'
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }

                return (
                  <li
                    key={item.label}
                    className="relative whitespace-nowrap"
                    onMouseEnter={() => setOpenNavSubmenu(item.label)}
                  >
                    <div className="inline-flex items-center h-11">
                      <Link
                        href={item.href}
                        className={`h-11 inline-flex items-center border-b-2 transition-colors whitespace-nowrap ${
                          isActive
                            ? 'border-[#18201B] text-[#18201B] font-semibold'
                            : 'border-transparent text-[#18201B]/85 hover:text-[#18201B] hover:border-[#18201B]/40'
                        }`}
                      >
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        aria-label={`${item.label} submenu`}
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                        onClick={() =>
                          setOpenNavSubmenu((prev) =>
                            prev === item.label ? null : item.label
                          )
                        }
                        className="ml-1 p-1 rounded text-[#18201B]/75 hover:text-[#18201B] cursor-pointer"
                      >
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </div>

                    {isOpen && (
                      <div
                        role="menu"
                        aria-label={`${item.label} categories`}
                        className="absolute left-0 top-full pt-1 z-50 min-w-[210px]"
                      >
                        <ul className="bg-[#F8F5ED] border border-[#18201B]/15 rounded-[6px] shadow-xl py-2">
                          {item.submenu.map((sub) => (
                            <li key={sub.label + sub.href} role="none">
                              <Link
                                role="menuitem"
                                href={sub.href}
                                onClick={() => setOpenNavSubmenu(null)}
                                className="block px-4 py-2 text-sm text-[#18201B]/90 hover:bg-[#18201B]/5 hover:text-[#18201B] whitespace-nowrap"
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Desktop Right: Stateful Postcode Control (Fix 06 & Fix 13) */}
            <button
              type="button"
              onClick={() => setPinModalOpen(true)}
              className="min-h-[36px] px-2.5 rounded-[6px] inline-flex items-center gap-1.5 text-xs font-medium text-[#18201B] hover:bg-[#18201B]/5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <MapPin className="w-3.5 h-3.5 text-[#B28A50] shrink-0" />
              {pinDetails ? (
                <span>
                  Deliver to <strong>{pinDetails.pincode}</strong> ({pinDetails.city}) •{' '}
                  <span className="text-[#18201B]/75">{pinDetails.transitDays}</span>
                </span>
              ) : (
                <span className="underline decoration-[#18201B]/40 underline-offset-4">
                  Check delivery to your postcode
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* MAIN PAGE CONTENT (Fix 18: matching bottom padding so content is never covered by fixed bottom nav) */}
      <main id="main-content" className="flex-1 pb-20 lg:pb-0">
        {children}
      </main>

      {/* GLOBAL SECTION 15: FOOTER */}
      <footer className="bg-[#18201B] text-[#F8F5ED] border-t border-[#B28A50]/30 pb-[calc(56px+env(safe-area-inset-bottom,0px)+1rem)] lg:pb-0">
        {/* Top Assurance Strip */}
        <div className="border-b border-[#F8F5ED]/12 bg-[#18201B]">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-5 sm:py-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#B28A50]/20 border border-[#B28A50]/40 flex items-center justify-center shrink-0 mt-0.5">
                <Truck className="w-5 h-5 text-[#B28A50]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#F8F5ED]">
                  Delivery across India
                </p>
                <p className="text-xs text-[#F8F5ED]/75 mt-0.5 leading-relaxed">
                  Complimentary delivery on orders over ₹999.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#B28A50]/20 border border-[#B28A50]/40 flex items-center justify-center shrink-0 mt-0.5">
                <RotateCcw className="w-5 h-5 text-[#B28A50]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#F8F5ED]">
                  Easy size exchanges
                </p>
                <p className="text-xs text-[#F8F5ED]/75 mt-0.5 leading-relaxed">
                  7-day doorstep exchange. Refund terms and timing are explained in our returns policy.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#B28A50]/20 border border-[#B28A50]/40 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5 text-[#B28A50]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#F8F5ED]">
                  Leather, clearly described
                </p>
                <p className="text-xs text-[#F8F5ED]/75 mt-0.5 leading-relaxed">
                  See leather type, care guidance, and GST invoice details on each product page.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Main Footer Columns */}
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-10 md:py-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Brand & Registered Office Column */}
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center gap-3.5">
                <picture className="shrink-0">
                  <source srcSet="/images/footer-makers-seal.webp" type="image/webp" />
                  <img
                    src="/images/footer-makers-seal.jpg"
                    alt=""
                    aria-hidden="true"
                    className="w-14 h-14 lg:w-20 lg:h-20 object-contain rounded-md"
                  />
                </picture>
                <div>
                  <Link href="/" className="font-story text-2xl lg:text-3xl font-bold text-[#F8F5ED] leading-none">
                    {settings.storeName.toUpperCase()}
                  </Link>
                  <p className="text-xs uppercase tracking-[0.15em] text-[#B28A50] mt-1">
                    {settings.storeTagline}
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#F8F5ED]/80 leading-relaxed">
                {settings.footer.aboutBlurb}
              </p>

              <div className="pt-3 space-y-1.5 text-xs text-[#F8F5ED]/80 border-t border-[#F8F5ED]/12">
                <p className="font-semibold text-[#F8F5ED]">
                  {settings.legalEntityName}
                </p>
                <p>{settings.footer.address}</p>
                <p>
                  <span className="text-[#F8F5ED]/60">GSTIN:</span>{' '}
                  <span className="font-mono">{settings.gstin}</span>
                </p>
                <p className="pt-1">
                  <strong>Phone:</strong> {settings.footer.phone} |{' '}
                  <strong>WhatsApp:</strong> {settings.footer.whatsapp}
                </p>
                <p>
                  <strong>Hours:</strong> {settings.footer.hours}
                </p>
              </div>
            </div>

            {/* Group 1: Shop */}
            <div className="md:col-span-2 border-b md:border-b-0 border-[#F8F5ED]/12 pb-2 md:pb-0">
              <button
                type="button"
                onClick={() =>
                  setOpenFooterAccordion(openFooterAccordion === 'shop' ? null : 'shop')
                }
                aria-expanded={openFooterAccordion === 'shop'}
                className="w-full min-h-[48px] flex items-center justify-between md:cursor-default text-left text-xs uppercase tracking-wider font-semibold text-[#B28A50]"
              >
                <span>Shop</span>
                <ChevronDown
                  className={`w-4 h-4 md:hidden transition-transform ${
                    openFooterAccordion === 'shop' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <ul
                className={`space-y-1 text-xs sm:text-sm text-[#F8F5ED]/85 ${
                  openFooterAccordion === 'shop' ? 'block' : 'hidden md:block'
                }`}
              >
                <li>
                  <Link href="/products" className="min-h-[44px] flex items-center hover:text-[#B28A50] hover:underline">
                    Shop All
                  </Link>
                </li>
                <li>
                  <Link
                    href="/category/men-leather"
                    className="min-h-[44px] flex items-center hover:text-[#B28A50] hover:underline"
                  >
                    Men&apos;s Leather
                  </Link>
                </li>
                <li>
                  <Link
                    href="/category/women-leather"
                    className="min-h-[44px] flex items-center hover:text-[#B28A50] hover:underline"
                  >
                    Women&apos;s Leather
                  </Link>
                </li>
                <li>
                  <Link
                    href="/category/jackets"
                    className="min-h-[44px] flex items-center hover:text-[#B28A50] hover:underline"
                  >
                    Jackets
                  </Link>
                </li>
                <li>
                  <Link
                    href="/category/coats"
                    className="min-h-[44px] flex items-center hover:text-[#B28A50] hover:underline"
                  >
                    Coats
                  </Link>
                </li>
                <li>
                  <Link
                    href="/category/skirts"
                    className="min-h-[44px] flex items-center hover:text-[#B28A50] hover:underline"
                  >
                    Skirts
                  </Link>
                </li>
                <li>
                  <Link
                    href="/collection/new-arrivals"
                    className="min-h-[44px] flex items-center hover:text-[#B28A50] hover:underline"
                  >
                    New Arrivals
                  </Link>
                </li>
              </ul>
            </div>

            {/* Group 2: Customer Service */}
            <div className="md:col-span-3 border-b md:border-b-0 border-[#F8F5ED]/12 pb-2 md:pb-0">
              <button
                type="button"
                onClick={() =>
                  setOpenFooterAccordion(
                    openFooterAccordion === 'service' ? null : 'service'
                  )
                }
                aria-expanded={openFooterAccordion === 'service'}
                className="w-full min-h-[48px] flex items-center justify-between md:cursor-default text-left text-xs uppercase tracking-wider font-semibold text-[#B28A50]"
              >
                <span>Customer Service</span>
                <ChevronDown
                  className={`w-4 h-4 md:hidden transition-transform ${
                    openFooterAccordion === 'service' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <ul
                className={`space-y-1 text-xs sm:text-sm text-[#F8F5ED]/85 ${
                  openFooterAccordion === 'service' ? 'block' : 'hidden md:block'
                }`}
              >
                <li>
                  <Link
                    href="/track-order"
                    className="min-h-[44px] flex items-center hover:text-[#B28A50] hover:underline"
                  >
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="min-h-[44px] flex items-center hover:text-[#B28A50] hover:underline">
                    Returns & Size Exchange
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="min-h-[44px] flex items-center hover:text-[#B28A50] hover:underline">
                    Shipping & Postcode Policy
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="min-h-[44px] flex items-center hover:text-[#B28A50] hover:underline">
                    Help & Garment Care
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="min-h-[44px] flex items-center hover:text-[#B28A50] hover:underline">
                    Contact Support Desk
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="min-h-[44px] flex items-center hover:text-[#B28A50] hover:underline">
                    My Account & DPDP Privacy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Group 3: About the Store & Policies */}
            <div className="md:col-span-3">
              <button
                type="button"
                onClick={() =>
                  setOpenFooterAccordion(openFooterAccordion === 'about' ? null : 'about')
                }
                aria-expanded={openFooterAccordion === 'about'}
                className="w-full min-h-[48px] flex items-center justify-between md:cursor-default text-left text-xs uppercase tracking-wider font-semibold text-[#B28A50]"
              >
                <span>About the Store & Legal</span>
                <ChevronDown
                  className={`w-4 h-4 md:hidden transition-transform ${
                    openFooterAccordion === 'about' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <ul
                className={`space-y-1 text-xs sm:text-sm text-[#F8F5ED]/85 ${
                  openFooterAccordion === 'about' ? 'block' : 'hidden md:block'
                }`}
              >
                <li>
                  <Link href="/story" className="min-h-[44px] flex items-center hover:text-[#B28A50] hover:underline">
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link href="/team" className="min-h-[44px] flex items-center hover:text-[#B28A50] hover:underline">
                    Meet the Team
                  </Link>
                </li>
                <li>
                  <Link href="/visit" className="min-h-[44px] flex items-center hover:text-[#B28A50] hover:underline">
                    Visit Connaught Place Studio
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="min-h-[44px] flex items-center hover:text-[#B28A50] hover:underline">
                    Privacy Policy (DPDP Act 2023)
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="min-h-[44px] flex items-center hover:text-[#B28A50] hover:underline">
                    Terms of Service & Legal Metrology
                  </Link>
                </li>
                <li className="pt-2 text-xs text-[#F8F5ED]/75">
                  <strong>Grievance Officer:</strong> {settings.footer.grievanceOfficerName}{' '}
                  ({settings.footer.grievanceOfficerEmail})
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Accessibility Control */}
        <div className="border-t border-[#F8F5ED]/12 bg-[#18201B]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#F8F5ED]/75">
            <p>
              © 2026 {settings.legalEntityName}. All prices in ₹ inclusive of GST.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <span>Accepted: UPI • RuPay • Visa • Mastercard • NetBanking • COD</span>
              <span className="text-[#F8F5ED]/30">|</span>
              <button
                type="button"
                onClick={() => setReduceMotion(!reduceMotion)}
                className="px-2.5 py-1 min-h-[36px] rounded border border-[#F8F5ED]/25 text-[#F8F5ED]/85 hover:border-[#B28A50] text-xs cursor-pointer inline-flex items-center"
                aria-pressed={reduceMotion}
              >
                {reduceMotion ? '✓ Reduced Motion On' : 'Reduce Motion'}
              </button>
              <span className="text-[#F8F5ED]/30">|</span>
              <button
                type="button"
                onClick={() => setIsAccessibilityModalOpen(true)}
                className="px-2.5 py-1 min-h-[36px] rounded border border-[#B28A50]/50 text-[#F8F5ED] hover:bg-[#B28A50] hover:text-[#18201B] font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Accessibility</span>
              </button>
              <span className="text-[#F8F5ED]/30">|</span>
              <Link
                href="/admin/login"
                className="p-1.5 rounded text-[#F8F5ED]/60 hover:text-[#F8F5ED] transition-colors"
                title="Admin Portal"
                aria-label="Super Admin Portal"
              >
                <Lock className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* MOBILE BOTTOM NAVIGATION BAR (Fix 18: 4 equal-width items, 56px height + safe area, 12px labels, 21px icons, 44px touch target, clear active bar) */}
      {!pathname?.startsWith('/checkout') && !isAnyOverlayOpen && (
        <nav
          aria-label="Mobile quick navigation"
          className="lg:hidden fixed bottom-0 inset-x-0 z-40 min-h-[56px] pb-[env(safe-area-inset-bottom)] bg-[#F8F5ED] border-t border-[#18201B]/15 grid grid-cols-4"
        >
          <Link
            href="/"
            className={`min-h-[44px] min-w-[44px] h-14 flex flex-col items-center justify-center gap-1 text-xs border-t-2 transition-colors ${
              pathname === '/'
                ? 'border-[#18201B] text-[#18201B] font-bold bg-[#18201B]/[0.03]'
                : 'border-transparent text-[#18201B]/75 font-medium hover:text-[#18201B]'
            }`}
          >
            <Home className="w-[21px] h-[21px]" />
            <span>Home</span>
          </Link>

          <Link
            href="/categories"
            className={`min-h-[44px] min-w-[44px] h-14 flex flex-col items-center justify-center gap-1 text-xs border-t-2 transition-colors ${
              pathname?.startsWith('/categor')
                ? 'border-[#18201B] text-[#18201B] font-bold bg-[#18201B]/[0.03]'
                : 'border-transparent text-[#18201B]/75 font-medium hover:text-[#18201B]'
            }`}
          >
            <LayoutGrid className="w-[21px] h-[21px]" />
            <span>Categories</span>
          </Link>

          <Link
            href="/account"
            className={`min-h-[44px] min-w-[44px] h-14 flex flex-col items-center justify-center gap-1 text-xs border-t-2 transition-colors ${
              pathname?.startsWith('/account')
                ? 'border-[#18201B] text-[#18201B] font-bold bg-[#18201B]/[0.03]'
                : 'border-transparent text-[#18201B]/75 font-medium hover:text-[#18201B]'
            }`}
          >
            <User className="w-[21px] h-[21px]" />
            <span>Account</span>
          </Link>

          <button
            type="button"
            onClick={() => setCartDrawerOpen(true)}
            className={`min-h-[44px] min-w-[44px] h-14 relative flex flex-col items-center justify-center gap-1 text-xs border-t-2 transition-colors cursor-pointer ${
              isCartDrawerOpen
                ? 'border-[#18201B] text-[#18201B] font-bold'
                : 'border-transparent text-[#18201B]/85 font-medium hover:text-[#18201B]'
            }`}
          >
            <ShoppingBag className="w-[21px] h-[21px]" />
            <span>Cart ({cartCount})</span>
          </button>
        </nav>
      )}

      {/* SLIDE-OUT CART DRAWER */}
      {isCartDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-[#18201B]/60 backdrop-blur-[1px]"
          role="dialog"
          aria-modal="true"
          aria-label="Shopping Cart"
          onClick={() => setCartDrawerOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#F8F5ED] text-[#18201B] h-full flex flex-col shadow-2xl border-l border-[#18201B]/15"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-[#18201B]/12 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#18201B]" />
                <h2 className="font-story text-xl font-bold">
                  Your Shopping Bag ({cartCount})
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setCartDrawerOpen(false)}
                aria-label="Close shopping bag"
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#18201B]/8 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Strip */}
            <div className="px-5 py-3 bg-[#18201B]/[0.04] border-b border-[#18201B]/10">
              {amountToFreeShipping > 0 ? (
                <p className="text-xs font-medium text-[#18201B]">
                  Add{' '}
                  <strong className="price-num">
                    ₹{amountToFreeShipping.toLocaleString('en-IN')}
                  </strong>{' '}
                  more for <strong>FREE Delivery</strong> across India
                </p>
              ) : (
                <p className="text-xs font-semibold text-[#18201B] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#B28A50]" />
                  <span>You have unlocked FREE Delivery!</span>
                </p>
              )}
              <div className="w-full h-1.5 bg-[#18201B]/12 rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-[#B28A50] transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#18201B]/5 mx-auto flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-[#18201B]/60" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-story text-lg font-bold">
                      Your bag is currently empty
                    </p>
                    <p className="text-xs text-[#18201B]/70 max-w-xs mx-auto">
                      Explore our full-grain leather jackets, tailored coats, skirts, and handcrafted boots.
                    </p>
                  </div>
                  <Link
                    href="/products"
                    onClick={() => setCartDrawerOpen(false)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[6px] bg-[#18201B] text-[#F8F5ED] text-xs font-semibold"
                  >
                    <span>Browse Collection</span>
                    <ArrowRight className="w-4 h-4 text-[#B28A50]" />
                  </Link>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.variantId}
                    className="flex gap-3.5 pb-4 border-b border-[#18201B]/10"
                  >
                    <Link
                      href={`/product/${item.productId}`}
                      onClick={() => setCartDrawerOpen(false)}
                      className="w-20 h-24 rounded bg-[#18201B]/5 overflow-hidden shrink-0 border border-[#18201B]/10"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.productId}`}
                        onClick={() => setCartDrawerOpen(false)}
                        className="text-sm font-semibold text-[#18201B] line-clamp-1 hover:underline"
                      >
                        {item.title}
                      </Link>
                      <p className="text-xs text-[#18201B]/70 mt-0.5">
                        {item.color} / {item.size}
                      </p>
                      <div className="flex items-baseline gap-2 mt-1 price-num">
                        <span className="text-sm font-bold">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        {item.mrp > item.price && (
                          <span className="text-xs text-[#18201B]/50 line-through">
                            ₹{(item.mrp * item.quantity).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2.5">
                        <div className="inline-flex items-center border border-[#18201B]/25 rounded">
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.variantId, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="w-9 h-9 flex items-center justify-center hover:bg-[#18201B]/5 cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold price-num">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.variantId, item.quantity + 1)}
                            aria-label="Increase quantity"
                            className="w-9 h-9 flex items-center justify-center hover:bg-[#18201B]/5 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 text-[11px]">
                          <button
                            type="button"
                            onClick={() => moveToSavedForLater(item.variantId)}
                            className="text-[#18201B]/75 hover:text-[#18201B] underline py-1 cursor-pointer"
                          >
                            Save for later
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.variantId)}
                            aria-label="Remove item"
                            className="text-[#18201B]/60 hover:text-[#18201B] p-2 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {savedForLater.length > 0 && (
                <div className="pt-4 border-t border-[#18201B]/15 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#18201B]/75 flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5 text-[#B28A50]" />
                    <span>Saved for Later ({savedForLater.length})</span>
                  </h3>
                  {savedForLater.map((item) => (
                    <div
                      key={item.variantId}
                      className="flex items-center justify-between gap-3 p-2.5 rounded border border-[#18201B]/12 bg-[#18201B]/[0.02]"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate">{item.title}</p>
                        <p className="text-[11px] text-[#18201B]/65">
                          {item.color} / {item.size} • ₹
                          {item.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => moveSavedToCart(item.variantId)}
                        className="px-2.5 py-1.5 rounded bg-[#18201B] text-[#F8F5ED] text-[11px] font-medium shrink-0 cursor-pointer"
                      >
                        Move to Bag
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-5 border-t border-[#18201B]/15 bg-[#F8F5ED] space-y-3">
                <div className="space-y-1 text-sm">
                  {cartMrpTotal > cartSubtotal && (
                    <div className="flex justify-between text-xs text-[#18201B]/75">
                      <span>Total Savings on MRP</span>
                      <span className="font-semibold price-num">
                        -₹{(cartMrpTotal - cartSubtotal).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold">
                    <span>Subtotal (Incl. GST)</span>
                    <span className="price-num">
                      ₹{cartSubtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    href="/cart"
                    onClick={() => setCartDrawerOpen(false)}
                    className="py-3 px-4 rounded-[6px] border border-[#18201B] text-[#18201B] text-xs font-semibold text-center hover:bg-[#18201B]/5"
                  >
                    View Bag & Coupons
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={() => setCartDrawerOpen(false)}
                    className="py-3 px-4 rounded-[6px] bg-[#18201B] text-[#F8F5ED] text-xs font-semibold text-center flex items-center justify-center gap-1.5 hover:bg-[#18201B]/90"
                  >
                    <span>Checkout</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#B28A50]" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PREDICTIVE SEARCH MODAL */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#18201B]/60 backdrop-blur-[1px] flex items-start justify-center pt-4 sm:pt-14 px-3"
          role="dialog"
          aria-modal="true"
          aria-label="Search store"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-[#F8F5ED] text-[#18201B] rounded-[8px] border border-[#18201B]/20 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center px-4 border-b border-[#18201B]/12"
            >
              <Search className="w-5 h-5 text-[#18201B]/70 shrink-0" />
              <input
                type="search"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shirts, kurtas, chinos, footwear, totes..."
                className="w-full h-12 px-3 bg-transparent text-sm sm:text-base text-[#18201B] placeholder:text-[#18201B]/50 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2 text-[#18201B]/70 hover:text-[#18201B] cursor-pointer"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </form>

            <div className="p-4 sm:p-5 max-h-[75vh] overflow-y-auto space-y-5">
              {!debouncedQuery && (
                <>
                  {recentSearches.length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#18201B]/60 mb-2">
                        Recent Searches
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((term: string) => (
                          <button
                            key={term}
                            type="button"
                            onClick={() => setSearchQuery(term)}
                            className="px-3 py-1.5 rounded-full text-xs border border-[#18201B]/20 hover:border-[#B28A50] cursor-pointer"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#18201B]/60 mb-2">
                      Popular Searches (Synonym-Aware)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Black Biker Jacket',
                        'Brown Leather Coat',
                        'Lambskin Bomber',
                        'Leather Skirt',
                        'Chelsea Boots',
                        'Leather Duffle',
                        'Cafe Racer',
                      ].map((term: string) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => setSearchQuery(term)}
                          className="px-3 py-1.5 rounded bg-[#18201B]/5 hover:bg-[#B28A50]/25 text-xs font-medium cursor-pointer"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {debouncedQuery && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-[#18201B]/70">
                      Showing matches for &ldquo;{debouncedQuery}&rdquo;
                    </p>
                    <Link
                      href={`/search?q=${encodeURIComponent(debouncedQuery)}`}
                      onClick={() => setSearchOpen(false)}
                      className="text-xs font-semibold underline"
                    >
                      View all results
                    </Link>
                  </div>

                  {searchResults.length === 0 ? (
                    <div className="py-6 text-center space-y-2">
                      <p className="text-sm font-semibold">
                        No exact matches for &ldquo;{debouncedQuery}&rdquo;
                      </p>
                      <p className="text-xs text-[#18201B]/70">
                        Try searching by category: Biker, Bomber, Racer, Coat, Skirt, Boots, or Duffle.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#18201B]/10">
                      {searchResults.map((p) => (
                        <Link
                          key={p.id}
                          href={`/product/${p.id}`}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center gap-3.5 py-2.5 hover:bg-[#18201B]/[0.03] rounded px-2 transition-colors"
                        >
                          <img
                            src={p.images[0]?.url}
                            alt={p.title}
                            className="w-12 h-14 object-cover rounded border border-[#18201B]/12 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#18201B] truncate">
                              {p.title}
                            </p>
                            <p className="text-xs text-[#18201B]/65 truncate">
                              {p.subtitle}
                            </p>
                          </div>
                          <div className="text-right shrink-0 price-num">
                            <p className="text-sm font-bold">
                              ₹{p.price.toLocaleString('en-IN')}
                            </p>
                            {p.mrp > p.price && (
                              <p className="text-[11px] text-[#18201B]/50 line-through">
                                ₹{p.mrp.toLocaleString('en-IN')}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PIN SERVICEABILITY MODAL */}
      {isPinModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#18201B]/60 backdrop-blur-[1px] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Check PIN code delivery"
          onClick={() => setPinModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#F8F5ED] text-[#18201B] rounded-[8px] border border-[#18201B]/20 p-5 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#B28A50]" />
                <h2 className="font-story text-xl font-bold">
                  Check Delivery Date & COD
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setPinModalOpen(false)}
                aria-label="Close PIN modal"
                className="p-2 rounded hover:bg-[#18201B]/8 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#18201B]/75 leading-relaxed">
              Enter your 6-digit Indian PIN code to see estimated dispatch and delivery dates from our Connaught Place, New Delhi studio.
            </p>

            <form onSubmit={handlePinCheck} className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit PIN (e.g. 110001)"
                className="flex-1 h-11 px-3.5 rounded-[6px] bg-[#F8F5ED] border border-[#18201B]/30 text-sm font-mono"
              />
              <button
                type="submit"
                disabled={pinChecking || pinInput.length !== 6}
                className="px-5 h-11 rounded-[6px] bg-[#18201B] text-[#F8F5ED] text-xs font-semibold disabled:opacity-50 cursor-pointer"
              >
                {pinChecking ? 'Checking...' : 'Check PIN'}
              </button>
            </form>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#18201B]/60 mb-2">
                Quick Select City PIN
              </p>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_PINS.map((p) => (
                  <button
                    key={p.pincode}
                    type="button"
                    onClick={() => {
                      setPinInput(p.pincode);
                      checkAndSetPin(p.pincode);
                    }}
                    className={`px-2.5 py-1.5 rounded text-xs border transition-colors cursor-pointer ${
                      pinDetails?.pincode === p.pincode
                        ? 'bg-[#18201B] text-[#F8F5ED] border-[#18201B]'
                        : 'border-[#18201B]/20 hover:border-[#B28A50]'
                    }`}
                  >
                    {p.city} ({p.pincode})
                  </button>
                ))}
              </div>
            </div>

            {pinDetails && (
              <div className="p-3.5 rounded-[6px] bg-[#18201B]/[0.04] border border-[#18201B]/15 space-y-1.5 text-xs">
                <p className="font-bold text-sm text-[#18201B] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#B28A50]" />
                  <span>
                    Serviceable: {pinDetails.city}, {pinDetails.state} ({pinDetails.pincode})
                  </span>
                </p>
                <p>
                  <strong>Estimated Arrival:</strong> {pinDetails.transitDays}
                </p>
                <p>
                  <strong>Cash on Delivery (COD):</strong>{' '}
                  {pinDetails.cod ? 'Available (+₹40 handling fee)' : 'Prepaid Only'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MOBILE NAVIGATION DRAWER */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#18201B]/60 backdrop-blur-[1px] flex lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile store navigation"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-[85%] max-w-xs bg-[#F8F5ED] text-[#18201B] h-full flex flex-col justify-between p-5 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#18201B]/12">
                <div>
                  <p className="font-story text-xl font-bold">
                    {settings.storeName.toUpperCase()}
                  </p>
                  <p className="text-xs text-[#18201B]/65">
                    Leather Clothing & Goods
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close mobile menu"
                  className="w-11 h-11 rounded flex items-center justify-center hover:bg-[#18201B]/8 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-[#18201B]/55 px-2 mb-1">
                  Shop
                </p>
                {[
                  { label: 'Shop All', href: '/products' },
                  { label: 'Men', href: '/category/men-leather' },
                  { label: 'Women', href: '/category/women-leather' },
                  { label: 'Jackets', href: '/category/jackets' },
                  { label: 'Coats', href: '/category/coats' },
                  { label: 'Bombers', href: '/category/bombers' },
                  { label: 'Skirts', href: '/category/skirts' },
                  { label: 'Accessories', href: '/category/accessories' },
                  { label: 'Footwear', href: '/category/footwear' },
                  { label: 'New Arrivals', href: '/collection/new-arrivals' },
                ].map((link) => (
                  <Link
                    key={link.href + link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-2.5 min-h-[44px] rounded text-sm font-medium hover:bg-[#18201B]/5"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-[#18201B]/50" />
                  </Link>
                ))}
              </div>

              <div className="space-y-1 pt-3 border-t border-[#18201B]/12">
                <p className="text-xs font-bold uppercase tracking-wider text-[#18201B]/55 px-2 mb-1">
                  About & Support
                </p>
                {[
                  { label: 'Our Story', href: '/story' },
                  { label: 'Meet the Team', href: '/team' },
                  { label: 'Visit Studio', href: '/visit' },
                  { label: 'Track Your Order', href: '/track-order' },
                  { label: 'Returns & Size Exchange', href: '/returns' },
                  { label: 'Help & Garment Care', href: '/help' },
                  { label: 'Contact Support', href: '/contact' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-2.5 min-h-[44px] rounded text-sm font-medium text-[#18201B]/85 hover:bg-[#18201B]/5"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#18201B]/12 text-xs space-y-2">
              <p className="font-semibold">{settings.footer.phone}</p>
              <p className="text-[#18201B]/70">{settings.footer.hours}</p>
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold underline pt-1"
              >
                <Lock className="w-3.5 h-3.5 text-[#B28A50]" />
                <span>SA A/C (Super Admin)</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ANNOUNCEMENT BAR DETAILS MODAL (Fix 14) */}
      {isAnnouncementModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#18201B]/60 backdrop-blur-[1px] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Delivery and exchange policy"
          onClick={() => setAnnouncementModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#F8F5ED] text-[#18201B] rounded-[8px] border border-[#18201B]/20 p-5 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-story text-xl font-bold">
                Delivery & Exchange Policy
              </h3>
              <button
                type="button"
                onClick={() => setAnnouncementModalOpen(false)}
                aria-label="Close policy modal"
                className="w-11 h-11 rounded flex items-center justify-center hover:bg-[#18201B]/8 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-[#18201B]/85 leading-relaxed">
              {settings.announcementBar.detailsModalText}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Link
                href="/shipping"
                onClick={() => setAnnouncementModalOpen(false)}
                className="px-4 py-2.5 rounded border border-[#18201B]/25 text-[#18201B] text-xs font-semibold"
              >
                Full Shipping Policy
              </Link>
              <Link
                href="/returns"
                onClick={() => setAnnouncementModalOpen(false)}
                className="px-4 py-2.5 rounded bg-[#18201B] text-[#F8F5ED] text-xs font-semibold"
              >
                Size Exchange Policy
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ACCESSIBILITY & CONTROLS MODAL (Fix 5) */}
      {isAccessibilityModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#18201B]/60 backdrop-blur-[1px] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Accessibility options"
          onClick={() => setIsAccessibilityModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#F8F5ED] text-[#18201B] rounded-[8px] border border-[#18201B]/20 p-5 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#18201B]/12 pb-3">
              <h3 className="font-story text-xl font-bold">
                Accessibility Controls
              </h3>
              <button
                type="button"
                onClick={() => setIsAccessibilityModalOpen(false)}
                aria-label="Close accessibility modal"
                className="w-10 h-10 rounded flex items-center justify-center hover:bg-[#18201B]/8 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#18201B]/85">
              <div className="flex items-center justify-between gap-4 p-3 rounded bg-[#18201B]/[0.03] border border-[#18201B]/10">
                <div>
                  <p className="font-semibold text-[#18201B]">Reduce Motion</p>
                  <p className="text-xs text-[#18201B]/70">Minimizes smooth scrolling and CSS animations.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setReduceMotion(!reduceMotion)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer ${
                    reduceMotion
                      ? 'bg-[#18201B] text-[#F8F5ED]'
                      : 'border border-[#18201B]/30 hover:border-[#18201B]'
                  }`}
                >
                  {reduceMotion ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              <div className="p-3 rounded bg-[#18201B]/[0.03] border border-[#18201B]/10 space-y-1">
                <p className="font-semibold text-[#18201B]">Keyboard Navigation</p>
                <p className="text-xs text-[#18201B]/70 leading-relaxed">
                  Use <kbd className="px-1.5 py-0.5 bg-[#18201B]/10 rounded font-mono">Tab</kbd> to move focus, <kbd className="px-1.5 py-0.5 bg-[#18201B]/10 rounded font-mono">Enter</kbd> or <kbd className="px-1.5 py-0.5 bg-[#18201B]/10 rounded font-mono">Space</kbd> to activate buttons, and <kbd className="px-1.5 py-0.5 bg-[#18201B]/10 rounded font-mono">Esc</kbd> to close open menus or modals.
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[#18201B]/12">
              <Link
                href="/admin/login"
                onClick={() => setIsAccessibilityModalOpen(false)}
                className="inline-flex items-center gap-1.5 text-xs text-[#18201B]/70 hover:text-[#18201B] underline"
              >
                <Lock className="w-3.5 h-3.5 text-[#B28A50]" />
                <span>Super Admin Portal</span>
              </Link>
              <button
                type="button"
                onClick={() => setIsAccessibilityModalOpen(false)}
                className="px-4 py-2 rounded bg-[#18201B] text-[#F8F5ED] text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-28 md:bottom-6 left-3 right-3 sm:left-auto sm:right-6 z-50 bg-[#18201B] text-[#F8F5ED] border border-[#B28A50] px-4 py-3 rounded-[6px] shadow-xl flex items-center gap-3 text-xs sm:text-sm font-medium sm:max-w-sm"
        >
          <Sparkles className="w-4 h-4 text-[#B28A50] shrink-0" />
          <span className="flex-1">{toast.text}</span>
          {toast.actionLabel && toast.onAction && (
            <button
              type="button"
              onClick={() => {
                toast.onAction?.();
                dismissToast();
              }}
              className="underline text-[#B28A50] font-bold shrink-0 cursor-pointer"
            >
              {toast.actionLabel}
            </button>
          )}
          <button
            type="button"
            onClick={dismissToast}
            aria-label="Dismiss notification"
            className="text-[#F8F5ED]/70 hover:text-[#F8F5ED] p-1 shrink-0 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
