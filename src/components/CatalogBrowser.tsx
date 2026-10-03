'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  SlidersHorizontal,
  X,
  ChevronRight,
  RotateCcw,
  Search,
  Sparkles,
} from 'lucide-react';
import { ProductRecord, CategoryRecord, CollectionRecord } from '@/lib/types';
import ProductCard from './ProductCard';

interface CatalogBrowserProps {
  initialCategorySlug?: string;
  initialCollectionSlug?: string;
  initialSearchQuery?: string;
  initialMaxPrice?: number;
  pageTitle?: string;
  pageSubtitle?: string;
}

export default function CatalogBrowser({
  initialCategorySlug,
  initialCollectionSlug,
  initialSearchQuery = '',
  initialMaxPrice,
  pageTitle,
  pageSubtitle,
}: CatalogBrowserProps) {
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [collections, setCollections] = useState<CollectionRecord[]>([]);
  const [synonyms, setSynonyms] = useState<{ canonical: string; terms: string[] }[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategorySlug || 'all'
  );
  const [selectedCollection, setSelectedCollection] = useState<string>(
    initialCollectionSlug || 'all'
  );
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
  const [maxPrice, setMaxPrice] = useState<number | null>(initialMaxPrice || null);
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const lastUrlSearchRef = useRef<string>('');

  useEffect(() => {
    const syncUrlParams = () => {
      lastUrlSearchRef.current = window.location.search;
      const params = new URLSearchParams(window.location.search);
      const qParam = params.get('q');
      const maxPriceParam = params.get('maxPrice');
      if (qParam !== null) setSearchQuery(qParam);
      if (maxPriceParam) setMaxPrice(Number(maxPriceParam));
    };
    syncUrlParams();
    window.addEventListener('popstate', syncUrlParams);

    fetch('/api/storefront')
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || []);
        setCategories(data.categories || []);
        setCollections(data.collections || []);
        setSynonyms(data.synonyms || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => window.removeEventListener('popstate', syncUrlParams);
  }, []);

  // Sync only when URL query string actually changes (e.g. new search from header)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.search !== lastUrlSearchRef.current) {
      lastUrlSearchRef.current = window.location.search;
      const params = new URLSearchParams(window.location.search);
      const qParam = params.get('q');
      if (qParam !== null) {
        setSearchQuery(qParam);
      }
    }
  });

  // Lock body scroll when mobile filter sheet is open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (mobileFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileFilterOpen]);

  const activeCategoryObj = useMemo(
    () =>
      categories.find(
        (c) => c.slug === selectedCategory || c.id === selectedCategory
      ),
    [categories, selectedCategory]
  );

  const activeCollectionObj = useMemo(
    () =>
      collections.find(
        (c) => c.slug === selectedCollection || c.id === selectedCollection
      ),
    [collections, selectedCollection]
  );

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      const cat = categories.find(
        (c) => c.slug === selectedCategory || c.id === selectedCategory
      );
      if (cat) {
        list = list.filter((p) => p.categoryId === cat.id || p.categoryAncestry?.includes(cat.id));
      } else {
        const slugLower = selectedCategory.toLowerCase();
        list = list.filter(
          (p) =>
            p.categoryId.toLowerCase().includes(slugLower) ||
            p.title.toLowerCase().includes(slugLower) ||
            p.tags.some((t: string) => t.toLowerCase().includes(slugLower))
        );
      }
    }

    // Collection filter
    if (selectedCollection !== 'all') {
      const col = collections.find(
        (c) => c.slug === selectedCollection || c.id === selectedCollection
      );
      if (col && col.manualProductIds && col.manualProductIds.length > 0) {
        list = list.filter((p) => col.manualProductIds.includes(p.id) || p.collectionIds?.includes(col.id));
      } else if (col) {
        list = list.filter((p) => p.collectionIds?.includes(col.id));
      } else if (selectedCollection === 'new' || selectedCollection === 'new-arrivals') {
        list = list.filter((p) => p.badge === 'New');
      }
    }

    // Search query with Indian synonym expansion + Super Admin dynamic synonyms
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const synonymMap: Record<string, string[]> = {
        biker: ['moto', 'jacket', 'rider', 'leather'],
        coat: ['trench', 'car coat', 'overcoat', 'longline'],
        bomber: ['flight', 'ma-1', 'aviator', 'shearling'],
        racer: ['cafe racer', 'mandarin', 'moto', 'track'],
        trucker: ['western', 'cowhide', 'suede', 'jacket'],
        skirt: ['midi', 'pencil', 'mini', 'wrap', 'aline'],
        duffel: ['bag', 'travel', 'voyager', 'holdall'],
        briefcase: ['bag', 'laptop', 'commuter', 'attache'],
        boots: ['chelsea', 'footwear', 'shoes', 'goodyear'],
        belt: ['bridle', 'brass', 'accessory'],
      };
      const terms = [q];
      Object.entries(synonymMap).forEach(([k, vals]) => {
        if (q.includes(k)) terms.push(...vals);
      });
      (synonyms || []).forEach((entry) => {
        const c = entry.canonical.toLowerCase();
        const synTerms = (entry.terms || []).map((t) => t.toLowerCase());
        if (q.includes(c) || synTerms.some((t) => q.includes(t))) {
          terms.push(c, ...synTerms);
        }
      });
      list = list.filter((p) => {
        const text = `${p.title} ${p.subtitle} ${p.description} ${p.attributes?.fabric || ''} ${p.productType} ${p.tags.join(' ')}`.toLowerCase();
        return terms.some((t) => text.includes(t));
      });
    }

    // Max price filter
    if (maxPrice) {
      list = list.filter((p) => p.price <= maxPrice);
    }

    // Material filter
    if (selectedMaterial !== 'all') {
      const matLower = selectedMaterial.toLowerCase();
      list = list.filter((p) => {
        const hay = `${p.title} ${p.subtitle} ${p.attributes?.fabric || ''} ${p.tags.join(' ')}`.toLowerCase();
        return hay.includes(matLower);
      });
    }

    // Size filter (supports exact match like "M" or prefix match like "UK 7" -> "UK 7 (25.8 cm)")
    if (selectedSize !== 'all') {
      const szLower = selectedSize.toLowerCase();
      list = list.filter((p) =>
        p.variants.some((v) => {
          const vs = v.size.toLowerCase();
          return vs === szLower || vs.startsWith(szLower + ' ');
        })
      );
    }

    // Sort
    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.ratingAverage - a.ratingAverage);
    } else if (sortBy === 'discount') {
      list.sort(
        (a, b) =>
          (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp
      );
    }

    return list;
  }, [
    products,
    categories,
    collections,
    synonyms,
    selectedCategory,
    selectedCollection,
    searchQuery,
    maxPrice,
    selectedMaterial,
    selectedSize,
    sortBy,
  ]);

  const clearAllFilters = () => {
    if (!initialCategorySlug) setSelectedCategory('all');
    if (!initialCollectionSlug) setSelectedCollection('all');
    setSearchQuery('');
    setMaxPrice(null);
    setSelectedMaterial('all');
    setSelectedSize('all');
    setSortBy('featured');
    if (typeof window !== 'undefined' && window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  const resolvedTitle =
    pageTitle ||
    activeCategoryObj?.name ||
    activeCollectionObj?.title ||
    (searchQuery ? `Search Results for "${searchQuery}"` : 'All Handcrafted Leather Garments & Goods');

  const resolvedSubtitle =
    pageSubtitle ||
    activeCategoryObj?.description ||
    activeCollectionObj?.description ||
    'Full-grain lambskin, cowhide, and goat leather garments & goods, bench-crafted and inspected at our New Delhi atelier.';

  const MATERIAL_OPTIONS = ['all', 'Lambskin Nappa', 'Cowhide', 'Goat Leather', 'Calf Suede', 'Bridle Leather', 'Leather'];
  const SIZE_OPTIONS = ['all', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36', '38', '40', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'One Size'];

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#18201B]/65 flex-wrap">
        <Link href="/" className="hover:text-[#18201B] hover:underline">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link href="/products" className="hover:text-[#18201B] hover:underline">
          Catalog
        </Link>
        {(activeCategoryObj || activeCollectionObj) && (
          <>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <span className="font-semibold text-[#18201B]">
              {activeCategoryObj?.name || activeCollectionObj?.title}
            </span>
          </>
        )}
      </nav>

      {/* Editorial Category / Collection Header Banner */}
      {(activeCategoryObj?.image || activeCollectionObj?.bannerImage) && (
        <div className="relative rounded-[8px] overflow-hidden border border-[#18201B]/15 bg-[#18201B] text-[#F8F5ED] aspect-[16/6] sm:aspect-[21/6] max-h-[240px] flex items-center">
          <img
            src={activeCollectionObj?.bannerImage || activeCategoryObj?.image}
            alt={resolvedTitle}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-45 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#18201B] via-[#18201B]/85 to-transparent" />
          <div className="relative z-10 p-6 sm:p-8 max-w-2xl space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#B28A50]">
              {activeCollectionObj ? 'CURATED ATELIER COLLECTION' : 'LEATHER CRAFT DEPARTMENT'}
            </span>
            <h1 className="font-story text-2xl sm:text-4xl font-bold text-[#F8F5ED]">
              {resolvedTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#F8F5ED]/85 line-clamp-2 leading-relaxed">
              {resolvedSubtitle}
            </p>
          </div>
        </div>
      )}

      {/* Catalog Header & Controls */}
      <div className="border-b border-[#18201B]/12 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        {!(activeCategoryObj?.image || activeCollectionObj?.bannerImage) ? (
          <div className="max-w-2xl space-y-1.5">
            <h1 className="font-story text-2xl sm:text-4xl font-bold text-[#18201B]">
              {resolvedTitle}
            </h1>
            <p className="text-xs sm:text-sm text-[#18201B]/75 leading-relaxed">
              {resolvedSubtitle}
            </p>
          </div>
        ) : (
          <div className="text-xs text-[#18201B]/65 font-medium">
            Handcrafted full-grain pieces bench-inspected at Connaught Place Studio
          </div>
        )}

        <div className="flex items-center justify-between md:justify-end gap-2 sm:gap-3 flex-wrap">
          <span className="text-xs font-semibold text-[#18201B]/70 price-num">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'Piece' : 'Pieces'}
          </span>

          {/* Mobile Filter & Sort Trigger Button (44px touch target) */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden min-h-[44px] px-3.5 py-2 rounded-[6px] border border-[#18201B]/25 text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#B28A50]" />
            <span>Filter</span>
          </button>

          {/* Sort Dropdown */}
          <select
            aria-label="Sort products"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="min-h-[44px] h-11 px-3 rounded-[6px] bg-[#F8F5ED] border border-[#18201B]/25 text-xs font-semibold text-[#18201B] cursor-pointer"
          >
            <option value="featured">Sort: Featured Curations</option>
            <option value="price_asc">Price: Low to High (₹)</option>
            <option value="price_desc">Price: High to Low (₹)</option>
            <option value="rating">Highest Customer Rating</option>
            <option value="discount">Biggest Savings (%)</option>
          </select>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(maxPrice ||
        selectedMaterial !== 'all' ||
        selectedSize !== 'all' ||
        searchQuery) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#18201B]/65">Active Filters:</span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                if (typeof window !== 'undefined' && window.location.search) {
                  window.history.replaceState({}, '', window.location.pathname);
                }
              }}
              className="px-2.5 py-1 rounded-full bg-[#18201B] text-[#F8F5ED] text-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Search: {searchQuery}</span>
              <X className="w-3 h-3" />
            </button>
          )}
          {maxPrice && (
            <button
              type="button"
              onClick={() => setMaxPrice(null)}
              className="px-2.5 py-1 rounded-full bg-[#18201B] text-[#F8F5ED] text-xs inline-flex items-center gap-1.5 price-num cursor-pointer"
            >
              <span>Under ₹{maxPrice.toLocaleString('en-IN')}</span>
              <X className="w-3 h-3" />
            </button>
          )}
          {selectedMaterial !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedMaterial('all')}
              className="px-2.5 py-1 rounded-full bg-[#18201B] text-[#F8F5ED] text-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Material: {selectedMaterial}</span>
              <X className="w-3 h-3" />
            </button>
          )}
          {selectedSize !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedSize('all')}
              className="px-2.5 py-1 rounded-full bg-[#18201B] text-[#F8F5ED] text-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Size: {selectedSize}</span>
              <X className="w-3 h-3" />
            </button>
          )}
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-xs font-semibold underline text-[#18201B] ml-2 cursor-pointer"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Layout: Sidebar Filters + Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Desktop Facet Sidebar */}
        <aside className="hidden md:block md:col-span-3 space-y-6">
          {/* Search within catalog */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#18201B]/75">
              Filter by Keyword
            </label>
            <div className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Linen, Indigo, Chinos..."
                className="w-full h-10 pl-3 pr-8 rounded border border-[#18201B]/25 bg-[#F8F5ED] text-xs"
              />
              <Search className="w-3.5 h-3.5 text-[#18201B]/50 absolute right-2.5 top-3" />
            </div>
          </div>

          {/* Categories Filter */}
          <div className="space-y-2 pt-4 border-t border-[#18201B]/10">
            <p className="text-xs font-bold uppercase tracking-wider text-[#18201B]/75">
              Department
            </p>
            <div className="space-y-1.5 text-xs">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`block w-full text-left py-1.5 px-2.5 rounded cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#18201B] text-[#F8F5ED] font-semibold'
                    : 'hover:bg-[#18201B]/5'
                }`}
              >
                All Departments
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`block w-full text-left py-1.5 px-2.5 rounded cursor-pointer ${
                    selectedCategory === cat.slug || selectedCategory === cat.id
                      ? 'bg-[#18201B] text-[#F8F5ED] font-semibold'
                      : 'hover:bg-[#18201B]/5'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Brackets */}
          <div className="space-y-2 pt-4 border-t border-[#18201B]/10">
            <p className="text-xs font-bold uppercase tracking-wider text-[#18201B]/75">
              Budget (₹)
            </p>
            <div className="space-y-1.5 text-xs price-num">
              {[
                { label: 'Any Price', val: null },
                { label: 'Under ₹1,499', val: 1499 },
                { label: 'Under ₹1,999', val: 1999 },
                { label: 'Under ₹2,999', val: 2999 },
                { label: 'Under ₹5,000', val: 5000 },
              ].map((b) => (
                <button
                  key={String(b.val)}
                  type="button"
                  onClick={() => setMaxPrice(b.val)}
                  className={`block w-full text-left py-1.5 px-2.5 rounded cursor-pointer ${
                    maxPrice === b.val
                      ? 'bg-[#18201B] text-[#F8F5ED] font-semibold'
                      : 'hover:bg-[#18201B]/5'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Material / Craft Filter */}
          <div className="space-y-2 pt-4 border-t border-[#18201B]/10">
            <p className="text-xs font-bold uppercase tracking-wider text-[#18201B]/75">
              Material & Weave
            </p>
            <div className="flex flex-wrap gap-1.5">
              {MATERIAL_OPTIONS.map((mat) => (
                <button
                  key={mat}
                  type="button"
                  onClick={() => setSelectedMaterial(mat)}
                  className={`px-2.5 py-1.5 rounded text-xs border cursor-pointer ${
                    selectedMaterial === mat
                      ? 'bg-[#18201B] text-[#F8F5ED] border-[#18201B]'
                      : 'border-[#18201B]/20 hover:border-[#B28A50]'
                  }`}
                >
                  {mat === 'all' ? 'All Materials' : mat}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter (Grouped by Category System per Fix 09) */}
          <div className="space-y-3 pt-4 border-t border-[#18201B]/10">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-[#18201B]/75">
                Size Systems
              </p>
              {selectedSize !== 'all' && (
                <button
                  type="button"
                  onClick={() => setSelectedSize('all')}
                  className="text-[11px] font-semibold text-[#B28A50] underline cursor-pointer"
                >
                  Reset Size
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSelectedSize('all')}
              className={`w-full text-left px-2.5 py-1.5 rounded text-xs border cursor-pointer ${
                selectedSize === 'all'
                  ? 'bg-[#18201B] text-[#F8F5ED] border-[#18201B] font-semibold'
                  : 'border-[#18201B]/20 hover:border-[#B28A50]'
              }`}
            >
              All Available Sizes
            </button>

            {/* Apparel Sizes */}
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#18201B]/60">
                Outerwear & Apparel
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`px-2.5 py-1.5 rounded text-xs border cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-[#18201B] text-[#F8F5ED] border-[#18201B] font-bold'
                        : 'border-[#18201B]/20 hover:border-[#B28A50]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Waist & Skirt Sizes */}
            <div className="space-y-1 pt-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#18201B]/60">
                Waist & Skirts
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['28', '30', '32', '34', '36', '38'].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`px-2.5 py-1.5 rounded text-xs border cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-[#18201B] text-[#F8F5ED] border-[#18201B] font-bold'
                        : 'border-[#18201B]/20 hover:border-[#B28A50]'
                    }`}
                  >
                    {sz}&quot;
                  </button>
                ))}
              </div>
            </div>

            {/* Footwear & Accessories Sizes */}
            <div className="space-y-1 pt-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#18201B]/60">
                Footwear & Goods
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'One Size'].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`px-2.5 py-1.5 rounded text-xs border cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-[#18201B] text-[#F8F5ED] border-[#18201B] font-bold'
                        : 'border-[#18201B]/20 hover:border-[#B28A50]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="md:col-span-9">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="aspect-[4/5] rounded-[6px] bg-[#18201B]/8 animate-pulse"
                />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-8 sm:p-12 rounded-[8px] border border-[#18201B]/15 bg-[#18201B]/[0.02] text-center space-y-4">
              <p className="font-story text-2xl font-bold text-[#18201B]">
                No products match your selected filters
              </p>
              <p className="text-xs sm:text-sm text-[#18201B]/75 max-w-md mx-auto">
                Try clearing a price, material, or size filter, or browse our core everyday essentials below.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[6px] bg-[#18201B] text-[#F8F5ED] text-xs font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#B28A50]" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#18201B]/60 flex items-end md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Filter products"
          onClick={() => setMobileFilterOpen(false)}
        >
          <div
            className="w-full max-h-[85vh] bg-[#F8F5ED] text-[#18201B] rounded-t-[12px] p-5 flex flex-col justify-between overflow-y-auto space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#18201B]/12 pb-3">
              <h2 className="font-story text-xl font-bold">Filter & Sort</h2>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                aria-label="Close filter drawer"
                className="p-2 rounded hover:bg-[#18201B]/8 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Department Filter on Mobile */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-2">
                  Department
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1.5 rounded text-xs border cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-[#18201B] text-[#F8F5ED] border-[#18201B]'
                        : 'border-[#18201B]/25'
                    }`}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`px-3 py-1.5 rounded text-xs border cursor-pointer ${
                        selectedCategory === cat.slug || selectedCategory === cat.id
                          ? 'bg-[#18201B] text-[#F8F5ED] border-[#18201B]'
                          : 'border-[#18201B]/25'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-2">
                  Budget (₹)
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'All', val: null },
                    { label: 'Under ₹1,499', val: 1499 },
                    { label: 'Under ₹1,999', val: 1999 },
                    { label: 'Under ₹2,999', val: 2999 },
                  ].map((b) => (
                    <button
                      key={String(b.val)}
                      type="button"
                      onClick={() => setMaxPrice(b.val)}
                      className={`px-3 py-1.5 rounded text-xs border cursor-pointer ${
                        maxPrice === b.val
                          ? 'bg-[#18201B] text-[#F8F5ED] border-[#18201B]'
                          : 'border-[#18201B]/25'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-2">
                  Material
                </p>
                <div className="flex flex-wrap gap-2">
                  {MATERIAL_OPTIONS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSelectedMaterial(m)}
                      className={`px-3 py-1.5 rounded text-xs border cursor-pointer ${
                        selectedMaterial === m
                          ? 'bg-[#18201B] text-[#F8F5ED] border-[#18201B]'
                          : 'border-[#18201B]/25'
                      }`}
                    >
                      {m === 'all' ? 'All' : m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {SIZE_OPTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1.5 rounded text-xs border cursor-pointer ${
                        selectedSize === s
                          ? 'bg-[#18201B] text-[#F8F5ED] border-[#18201B]'
                          : 'border-[#18201B]/25'
                      }`}
                    >
                      {s === 'all' ? 'All' : s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#18201B]/12">
              <button
                type="button"
                onClick={clearAllFilters}
                className="min-h-[44px] py-3 rounded-[6px] border border-[#18201B] text-xs font-semibold cursor-pointer"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="min-h-[44px] py-3 rounded-[6px] bg-[#18201B] text-[#F8F5ED] text-xs font-semibold cursor-pointer"
              >
                Show {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
