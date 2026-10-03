'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  LayoutTemplate,
  ShoppingBag,
  Package,
  Boxes,
  IndianRupee,
  Users,
  Sparkles,
  BarChart3,
  Settings,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Plus,
  Copy,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  LogOut,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Tablet,
  Monitor,
  FileText,
  Truck,
  Check,
  X,
  Search,
  Wand2,
  Play,
  Layers,
  Menu,
} from 'lucide-react';
import {
  CMSSection,
  CMSSectionType,
  GlobalCMSSettings,
  CMSReleaseManifest,
  ProductRecord,
  CategoryRecord,
  CollectionRecord,
  OrderRecord,
} from '@/lib/types';

export type AdminTabId =
  | 'today'
  | 'cms'
  | 'orders'
  | 'products'
  | 'stock'
  | 'finance'
  | 'customers'
  | 'growth'
  | 'reports'
  | 'settings';

interface AdminControlCenterProps {
  initialTab?: AdminTabId;
}

const SECTION_TYPE_LABELS: { type: CMSSectionType; label: string }[] = [
  { type: 'hero_campaign', label: 'Hero Campaign Banner' },
  { type: 'category_shortcuts', label: 'Category Shortcuts Strip' },
  { type: 'product_grid', label: 'Curated Product Grid (Store Picks / New Arrivals)' },
  { type: 'story_split', label: 'Story 1: Why the Store Started (Split Story)' },
  { type: 'product_rail', label: 'Story-Connected Product Rail' },
  { type: 'story_people', label: 'Story 2: Meet the People Behind the Store' },
  { type: 'story_craft', label: 'Story 3: What Makes the Products Different' },
  { type: 'reviews_service', label: 'Customer Reviews & Service Assurances' },
  { type: 'campaign_offer', label: 'Current Offer / Honest Promotion Banner' },
  { type: 'shop_by_need', label: 'Shop by Need or Budget Cards' },
  { type: 'story_local_store', label: 'Story 4: Local Business & Contact Block' },
  { type: 'recently_viewed', label: 'Recently Viewed Products' },
  { type: 'faq_accordion', label: 'FAQ Accordion Section' },
  { type: 'promotion_strip', label: 'Slim Promotion Strip' },
];

export default function AdminControlCenter({ initialTab = 'today' }: AdminControlCenterProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTabId>(initialTab);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  // CMS State
  const [draftSections, setDraftSections] = useState<CMSSection[]>([]);
  const [globalDraft, setGlobalDraft] = useState<GlobalCMSSettings | null>(null);
  const [releases, setReleases] = useState<CMSReleaseManifest[]>([]);
  const [activeReleaseId, setActiveReleaseId] = useState<string>('');
  const [cmsValidation, setCmsValidation] = useState<{
    canPublish: boolean;
    errors: string[];
    warnings: string[];
  }>({ canPublish: true, errors: [], warnings: [] });
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [cmsSubTab, setCmsSubTab] = useState<'sections' | 'global' | 'categories' | 'releases'>('sections');
  const [previewMode, setPreviewMode] = useState<'none' | 'mobile' | 'tablet' | 'desktop'>('none');
  const [previewRefreshKey, setPreviewRefreshKey] = useState(0);
  const [releaseNote, setReleaseNote] = useState('');
  const [newSectionType, setNewSectionType] = useState<CMSSectionType>('product_grid');
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionHeading, setNewSectionHeading] = useState('');

  // Catalog & Orders State
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [collections, setCollections] = useState<CollectionRecord[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');

  // Stock, Returns, Customers, Growth, Analytics, Settings State
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stockData, setStockData] = useState<any>({
    variants: [],
    warehouses: [],
    suppliers: [],
    purchaseOrders: [],
    stockMovements: [],
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [returnsData, setReturnsData] = useState<any>({ returns: [], refunds: [], hsnSummary: [] });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [customersData, setCustomersData] = useState<any>({
    customers: [],
    tickets: [],
    reviews: [],
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [promotions, setPromotions] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [settingsData, setSettingsData] = useState<any>({
    firebaseStatus: null,
    staff: [],
    approvals: [],
    automationRules: [],
    auditLogs: [],
    synonyms: [],
  });

  // AI Copilot State
  const [aiTask, setAiTask] = useState<
    'product_copy' | 'ops_summary' | 'review_sentiment' | 'margin_check'
  >('ops_summary');
  const [aiInput, setAiInput] = useState('Summarize today’s store operations and priority queues');
  const [aiOutput, setAiOutput] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);

  // Forms State
  const [newProductForm, setNewProductForm] = useState({
    title: '',
    subtitle: '',
    categoryId: 'cat_clothing',
    mrp: 1899,
    sellingPrice: 1499,
    hsnCode: '62052000',
    gstRatePercent: 12,
    fabricCare: '100% Long-Staple Indian Cotton. Gentle machine wash.',
    fitNotes: 'Regular Indian Fit — true to size.',
    primaryImage: '/images/prod-shirt-charcoal.svg',
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [csvDryRunReport, setCsvDryRunReport] = useState<any>(null);
  const [newCatForm, setNewCatForm] = useState({ name: '', description: '' });
  const [newColForm, setNewColForm] = useState({ title: '', eyebrow: 'Curated Edit', description: '' });
  const [stockAdjForm, setStockAdjForm] = useState({
    sku: '',
    warehouseId: 'wh_blr_main',
    type: 'receipt',
    deltaQty: 10,
    reason: 'Fresh workshop batch received after QC',
  });
  const [newPoForm, setNewPoForm] = useState({
    sku: 'KRG-SH-MLC-CH-M',
    itemTitle: 'Malabar Linen-Cotton Everyday Shirt',
    orderedQty: 30,
    unitCost: 640,
  });
  const [manualRefundForm, setManualRefundForm] = useState({
    orderNumber: 'KRG-2026-1001',
    amount: 200,
    method: 'original_razorpay',
    reason: 'Goodwill shipping delay adjustment',
  });
  const [ticketReplyMap, setTicketReplyMap] = useState<Record<string, { message: string; isInternal: boolean }>>({});
  const [newCouponForm, setNewCouponForm] = useState({
    code: 'CRAFT15',
    title: '15% Off Craft Collection',
    description: 'Valid on orders above ₹1,999',
    discountType: 'percentage',
    discountValue: 15,
    minCartSubtotal: 1999,
    maxDiscountCap: 750,
  });
  const [promoTestCode, setPromoTestCode] = useState('WELCOME10');
  const [promoTestPin, setPromoTestPin] = useState('110001');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [promoTestResult, setPromoTestResult] = useState<any>(null);
  const [newSynonymForm, setNewSynonymForm] = useState({
    term: '',
    synonyms: '',
  });
  const [newStaffForm, setNewStaffForm] = useState({
    name: '',
    email: '',
    role: 'Merchandising',
    locationScope: 'DEL-CP',
  });

  const showNotice = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const loadAllAdminData = useCallback(async () => {
    try {
      const [
        cmsRes,
        prodRes,
        catRes,
        ordRes,
        stkRes,
        retRes,
        custRes,
        promoRes,
        anaRes,
        setRes,
      ] = await Promise.all([
        fetch('/api/cms').then((r) => r.json()),
        fetch('/api/products?admin=true').then((r) => r.json()),
        fetch('/api/categories').then((r) => r.json()),
        fetch('/api/orders').then((r) => r.json()),
        fetch('/api/stock').then((r) => r.json()),
        fetch('/api/returns').then((r) => r.json()),
        fetch('/api/customers').then((r) => r.json()),
        fetch('/api/promotions').then((r) => r.json()),
        fetch('/api/analytics').then((r) => r.json()),
        fetch('/api/settings').then((r) => r.json()),
      ]);

      if (cmsRes?.cms) {
        const sortedDraft = [...(cmsRes.cms.draftSections || [])].sort(
          (a: CMSSection, b: CMSSection) => a.order - b.order
        );
        setDraftSections(sortedDraft);
        setGlobalDraft(cmsRes.cms.globalDraft || null);
        setReleases(cmsRes.cms.releases || []);
        setActiveReleaseId(cmsRes.cms.activeReleaseId || '');
        if (cmsRes.validation) {
          setCmsValidation(cmsRes.validation);
        }
        setSelectedSectionId((prev) => prev || sortedDraft[0]?.id || null);
      }

      const prodList = Array.isArray(prodRes) ? prodRes : prodRes?.products || [];
      setProducts(prodList);
      setCategories(catRes?.categories || []);
      setCollections(catRes?.collections || []);
      setOrders(Array.isArray(ordRes) ? ordRes : ordRes?.orders || []);
      setStockData(stkRes || { variants: [], warehouses: [], suppliers: [], purchaseOrders: [], stockMovements: [] });
      setReturnsData(retRes || { returns: [], refunds: [] });
      setCustomersData(custRes || { customers: [], tickets: [], reviews: [] });
      setPromotions(promoRes?.promotions || []);
      setAnalyticsData(anaRes || null);
      setSettingsData(
        setRes || {
          firebaseStatus: null,
          staff: [],
          approvals: [],
          automationRules: [],
          auditLogs: [],
          synonyms: [],
        }
      );

      if (!stockAdjForm.sku && stkRes?.variants?.[0]?.sku) {
        setStockAdjForm((prev) => ({ ...prev, sku: stkRes.variants[0].sku }));
      }
    } catch (err) {
      console.error('Failed loading Admin data:', err);
    } finally {
      setLoading(false);
    }
  }, [stockAdjForm.sku]);

  useEffect(() => {
    loadAllAdminData();
  }, [loadAllAdminData]);

  // CMS Actions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sendCmsAction = async (payload: Record<string, any>, successMsg: string) => {
    try {
      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        showNotice(data.error || 'CMS action failed');
        return;
      }
      if (data.cms) {
        const sorted = [...(data.cms.draftSections || [])].sort(
          (a: CMSSection, b: CMSSection) => a.order - b.order
        );
        setDraftSections(sorted);
        setGlobalDraft(data.cms.globalDraft);
        setReleases(data.cms.releases || []);
        setActiveReleaseId(data.cms.activeReleaseId || '');
      }
      if (data.validation) {
        setCmsValidation(data.validation);
      }
      setPreviewRefreshKey((k) => k + 1);
      showNotice(successMsg);
    } catch {
      showNotice('Network error while saving CMS changes');
    }
  };

  const selectedSection = draftSections.find((s) => s.id === selectedSectionId) || null;

  const handleUpdateSelectedSection = (patch: Partial<CMSSection>) => {
    if (!selectedSection) return;
    const updated: CMSSection = { ...selectedSection, ...patch };
    setDraftSections((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleSaveSelectedSection = async () => {
    if (!selectedSection) return;
    await sendCmsAction(
      { action: 'update_section', section: selectedSection },
      `Saved draft section "${selectedSection.friendlyName}"`
    );
  };

  // Order Actions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOrderCommand = async (orderId: string, command: string, extra: Record<string, any> = {}) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, ...extra }),
      });
      const data = await res.json();
      if (!res.ok) {
        showNotice(data.error || 'Order action failed');
        return;
      }
      showNotice(`Order updated: ${command.replace(/_/g, ' ')}`);
      await loadAllAdminData();
    } catch {
      showNotice('Error executing order command');
    }
  };

  // Product Actions
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.title.trim()) return;
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProductForm,
          images: [newProductForm.primaryImage],
          status: 'published',
        }),
      });
      if (res.ok) {
        showNotice(`Created & published "${newProductForm.title}"`);
        setNewProductForm((prev) => ({ ...prev, title: '', subtitle: '' }));
        await loadAllAdminData();
      }
    } catch {
      showNotice('Failed to create product');
    }
  };

  const handleQuickPriceUpdate = async (product: ProductRecord, newSellingPrice: number) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellingPrice: newSellingPrice }),
      });
      if (res.ok) {
        showNotice(`Updated selling price for ${product.title} to ₹${newSellingPrice}`);
        await loadAllAdminData();
      }
    } catch {
      showNotice('Failed updating price');
    }
  };

  // Stock Actions
  const handleStockAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'adjust_stock',
          ...stockAdjForm,
          deltaQty: Number(stockAdjForm.deltaQty),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showNotice(data.error || 'Stock adjustment failed');
        return;
      }
      showNotice(`Stock adjusted for ${stockAdjForm.sku}`);
      await loadAllAdminData();
    } catch {
      showNotice('Stock adjustment error');
    }
  };

  // Returns Action
  const handleProcessReturn = async (
    returnId: string,
    status: string,
    disposition: 'restock' | 'quarantine',
    triggerRefund: boolean
  ) => {
    try {
      const res = await fetch('/api/returns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'process_return',
          returnId,
          status,
          disposition,
          triggerRefund,
        }),
      });
      if (res.ok) {
        showNotice(`Return ${returnId} processed (${disposition})`);
        await loadAllAdminData();
      }
    } catch {
      showNotice('Return processing error');
    }
  };

  // Customer / Review / Ticket Action
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCustomerAction = async (payload: Record<string, any>, msg: string) => {
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showNotice(msg);
        await loadAllAdminData();
      }
    } catch {
      showNotice('Action failed');
    }
  };

  // Promotions Action
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePromoAction = async (payload: Record<string, any>, msg: string) => {
    try {
      const res = await fetch('/api/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showNotice(msg);
        await loadAllAdminData();
      }
    } catch {
      showNotice('Promotion action failed');
    }
  };

  // Settings / Approvals / Automations / Synonyms Action
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSettingsAction = async (payload: Record<string, any>, msg: string) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showNotice(msg);
        await loadAllAdminData();
      }
    } catch {
      showNotice('Settings action failed');
    }
  };

  // AI Copilot Action
  const handleRunAiCopilot = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: aiTask, prompt: aiInput }),
      });
      const data = await res.json();
      setAiOutput(data.output || 'No suggestion generated.');
    } catch {
      setAiOutput('Error contacting AI assistant.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  // Derived Queues
  const pendingManualUpiOrders = orders.filter(
    (o) =>
      o.paymentMethod === 'manual_upi' &&
      (o.manualPaymentStatus === 'awaiting_submission' ||
        (o.manualPaymentStatus as string) === 'submitted' ||
        (o.manualPaymentStatus as string) === 'verifying' ||
        (o.manualPaymentStatus as string) === 'awaiting_transfer')
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pendingApprovals = (settingsData.approvals || []).filter(
    (a: any) => a.status === 'pending_approval' || a.status === 'pending'
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lowStockVariants = (stockData.variants || []).filter(
    (v: any) => (v.availableToPromise ?? v.available ?? 0) <= (v.lowStockThreshold ?? v.reorderPoint ?? 5)
  );

  const navItems: { id: AdminTabId; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'today',
      label: '1. Today & Queues',
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: pendingManualUpiOrders.length + pendingApprovals.length,
    },
    {
      id: 'cms',
      label: '2. Website & CMS',
      icon: <LayoutTemplate className="w-4 h-4" />,
      badge: draftSections.length,
    },
    {
      id: 'orders',
      label: '3. Orders & Ship',
      icon: <ShoppingBag className="w-4 h-4" />,
      badge: orders.length,
    },
    {
      id: 'products',
      label: '4. Products & PIM',
      icon: <Package className="w-4 h-4" />,
      badge: products.length,
    },
    {
      id: 'stock',
      label: '5. Stock & WMS',
      icon: <Boxes className="w-4 h-4" />,
      badge: lowStockVariants.length || undefined,
    },
    {
      id: 'finance',
      label: '6. UPI, RMA & GST',
      icon: <IndianRupee className="w-4 h-4" />,
      badge: pendingManualUpiOrders.length || undefined,
    },
    {
      id: 'customers',
      label: '7. Customers & CRM',
      icon: <Users className="w-4 h-4" />,
      badge: (customersData.tickets || []).filter((t: any) => t.status === 'waiting_for_staff').length || undefined,
    },
    {
      id: 'growth',
      label: '8. Offers & Search',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'reports',
      label: '9. BI & Attribution',
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: 'settings',
      label: '10. Settings & RBAC',
      icon: <Settings className="w-4 h-4" />,
      badge: pendingApprovals.length || undefined,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F5ED] text-[#18201B] flex items-center justify-center p-6">
        <div className="text-center space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#B28A50]" />
          <p className="text-sm font-bold">Loading Super Admin Control Center (SA A/C)...</p>
        </div>
      </div>
    );
  }

  const bt = analyticsData?.analytics?.businessTruth || {};

  return (
    <div className="min-h-screen bg-[#F8F5ED] text-[#18201B] flex flex-col overflow-x-hidden">
      {/* Top Super Admin Bar */}
      <header className="sticky top-0 z-40 bg-[#18201B] text-[#F8F5ED] border-b border-[#B28A50]/40 px-3 sm:px-4 lg:px-6 h-14 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded border border-[#F8F5ED]/20 text-[#F8F5ED] shrink-0 cursor-pointer"
            aria-label="Toggle Admin Menu"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <ShieldCheck className="w-5 h-5 text-[#B28A50] shrink-0 hidden sm:block" />
          <div className="min-w-0">
            <span className="font-story font-bold text-xs sm:text-base tracking-wide truncate block">
              WHOLE/RETAIL NAME • SA A/C
            </span>
          </div>
          <span className="hidden xl:inline-block ml-2 text-[11px] font-mono px-2 py-0.5 rounded bg-[#B28A50]/20 text-[#B28A50] shrink-0">
            superadmin@store.com
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <Link
            href="/?preview=draft"
            target="_blank"
            className="px-2.5 py-1.5 rounded text-xs font-semibold border border-[#B28A50] text-[#F8F5ED] hover:bg-[#B28A50]/20 inline-flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-[#B28A50]" />
            <span className="hidden sm:inline">Preview Draft</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="px-2.5 py-1.5 rounded text-xs font-semibold bg-[#B28A50] text-[#18201B] hover:opacity-90 inline-flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Live Store</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="px-2.5 py-1.5 rounded text-xs font-semibold border border-[#F8F5ED]/25 text-[#F8F5ED]/85 hover:text-[#F8F5ED] inline-flex items-center gap-1 cursor-pointer"
            aria-label="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Mobile Horizontal Quick-Switch Strip (Visible on phones & tablets) */}
      <div className="lg:hidden bg-[#F2ECE1] border-b border-[#18201B]/15 px-3 py-2 flex items-center gap-1.5 overflow-x-auto">
        {navItems.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveTab(item.id);
                setMobileNavOpen(false);
              }}
              className={`px-3 py-1.5 rounded-[6px] text-xs font-bold whitespace-nowrap inline-flex items-center gap-1.5 shrink-0 cursor-pointer ${
                active
                  ? 'bg-[#18201B] text-[#F8F5ED]'
                  : 'bg-[#F8F5ED] text-[#18201B] border border-[#18201B]/15'
              }`}
            >
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                    active ? 'bg-[#B28A50] text-[#18201B]' : 'bg-[#18201B]/10 text-[#18201B]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 left-3 right-3 sm:left-auto sm:right-5 z-50 bg-[#18201B] text-[#F8F5ED] border-2 border-[#B28A50] px-4 py-3 rounded-[6px] shadow-xl flex items-center justify-between gap-2.5 text-xs font-semibold sm:max-w-md">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#B28A50] shrink-0" />
            <span>{toast}</span>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="p-1 text-[#F8F5ED]/70 hover:text-[#F8F5ED] cursor-pointer"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto">
        {/* Sidebar Navigation (10 Modules) */}
        <aside
          className={`${
            mobileNavOpen ? 'block' : 'hidden'
          } lg:block w-full lg:w-64 shrink-0 bg-[#F2ECE1] border-b lg:border-b-0 lg:border-r border-[#18201B]/15 p-3 space-y-1`}
        >
          <div className="px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#18201B]/60">
            10-Module Operations
          </div>
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileNavOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[6px] text-xs font-bold transition cursor-pointer ${
                  active
                    ? 'bg-[#18201B] text-[#F8F5ED] border-l-4 border-[#B28A50]'
                    : 'text-[#18201B]/80 hover:bg-[#18201B]/[0.06]'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span className={active ? 'text-[#B28A50]' : 'text-[#18201B]/70'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                      active
                        ? 'bg-[#B28A50] text-[#18201B]'
                        : 'bg-[#18201B]/10 text-[#18201B]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Main Workspace Container */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden space-y-6">
          {/* ==============================================================
              MODULE 1: TODAY & ACTIONABLE EXCEPTION QUEUES + AI COPILOT
             ============================================================== */}
          {activeTab === 'today' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#18201B]/15 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#18201B]/60">
                    MODULE 1 • DAILY COMMAND CENTER
                  </span>
                  <h1 className="font-story text-2xl sm:text-3xl font-bold mt-0.5">
                    Today’s Operations & Priority Queues
                  </h1>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('cms')}
                    className="px-3.5 py-2 rounded-[6px] bg-[#18201B] text-[#F8F5ED] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <LayoutTemplate className="w-3.5 h-3.5 text-[#B28A50]" />
                    <span>Open No-Code Homepage CMS</span>
                  </button>
                  <button
                    type="button"
                    onClick={loadAllAdminData}
                    className="px-3 py-2 rounded-[6px] border border-[#18201B]/25 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* KPI Strip (Dual-Truth: Demand vs Cash Realized) */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
                <div className="p-4 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/15">
                  <p className="text-[11px] font-bold uppercase text-[#18201B]/65">Demand Placed</p>
                  <p className="text-xl font-bold font-mono mt-1">
                    ₹{(bt.orderValuePlaced || bt.grossOrderedRevenue || 0).toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-[#18201B]/70 mt-1">
                    Cash Verified: ₹{(bt.cashReceiptsVerified || bt.netRealizedRevenue || 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="p-4 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/15">
                  <p className="text-[11px] font-bold uppercase text-[#18201B]/65">Total Orders</p>
                  <p className="text-xl font-bold font-mono mt-1">{orders.length}</p>
                  <p className="text-[11px] text-[#18201B]/70 mt-1">6-state lifecycle tracked</p>
                </div>
                <div className="p-4 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/15">
                  <p className="text-[11px] font-bold uppercase text-[#18201B]/65">Manual UPI Queue</p>
                  <p className="text-xl font-bold font-mono mt-1">{pendingManualUpiOrders.length}</p>
                  <p className="text-[11px] text-[#18201B]/70 mt-1">
                    ₹{(bt.manualUpiAwaitingVerification || 0).toLocaleString('en-IN')} awaiting UTR
                  </p>
                </div>
                <div className="p-4 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/15">
                  <p className="text-[11px] font-bold uppercase text-[#18201B]/65">Homepage Sections</p>
                  <p className="text-xl font-bold font-mono mt-1">
                    {draftSections.filter((s) => s.enabled).length} / {draftSections.length}
                  </p>
                  <p className="text-[11px] text-[#18201B]/70 mt-1">Release: {activeReleaseId}</p>
                </div>
                <div className="p-4 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/15">
                  <p className="text-[11px] font-bold uppercase text-[#18201B]/65">Low Stock SKUs</p>
                  <p className="text-xl font-bold font-mono mt-1">{lowStockVariants.length}</p>
                  <p className="text-[11px] text-[#18201B]/70 mt-1">Below reorder threshold</p>
                </div>
                <div className="p-4 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/15">
                  <p className="text-[11px] font-bold uppercase text-[#18201B]/65">Dual Approvals</p>
                  <p className="text-xl font-bold font-mono mt-1">{pendingApprovals.length}</p>
                  <p className="text-[11px] text-[#18201B]/70 mt-1">Two-person guardrails</p>
                </div>
              </div>

              {/* Actionable Exception Queues */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Queue 1: Manual UPI UTR Verification */}
                <div className="p-5 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold uppercase tracking-wider">
                      Manual UPI Verification Queue ({pendingManualUpiOrders.length})
                    </h2>
                    <button
                      type="button"
                      onClick={() => setActiveTab('finance')}
                      className="text-xs font-bold underline cursor-pointer"
                    >
                      Open Finance
                    </button>
                  </div>
                  {pendingManualUpiOrders.length === 0 ? (
                    <p className="text-xs text-[#18201B]/70">
                      All submitted UPI UTR claims have been reconciled.
                    </p>
                  ) : (
                    <div className="space-y-2.5">
                      {pendingManualUpiOrders.map((o) => (
                        <div
                          key={o.id}
                          className="p-3 rounded-[6px] bg-[#F8F5ED] border border-[#18201B]/15 flex flex-wrap items-center justify-between gap-2 text-xs"
                        >
                          <div>
                            <p className="font-bold">
                              {o.orderNumber} • ₹{o.grandTotal.toLocaleString('en-IN')}
                            </p>
                            <p className="font-mono text-[11px] text-[#18201B]/75">
                              Customer: {o.customer.name} | UTR:{' '}
                              {o.manualUpiClaim?.utrReference || 'Pending input'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOrderCommand(o.id, 'verify_manual_upi')}
                              className="px-2.5 py-1.5 rounded bg-[#18201B] text-[#F8F5ED] font-bold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5 text-[#B28A50]" />
                              <span>Verify UTR</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOrderCommand(o.id, 'reject_manual_upi')}
                              className="px-2.5 py-1.5 rounded border border-[#18201B]/30 font-bold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Queue 2: High-Risk Dual-Control Approvals */}
                <div className="p-5 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/15 space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold uppercase tracking-wider">
                      High-Risk Approval Requests ({pendingApprovals.length})
                    </h2>
                    <button
                      type="button"
                      onClick={() => setActiveTab('settings')}
                      className="text-xs font-bold underline cursor-pointer"
                    >
                      View All
                    </button>
                  </div>
                  {pendingApprovals.length === 0 ? (
                    <p className="text-xs text-[#18201B]/70">No pending dual-control approvals.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {pendingApprovals.map((app: any) => (
                        <div
                          key={app.id}
                          className="p-3 rounded-[6px] bg-[#F8F5ED] border border-[#18201B]/15 flex flex-wrap items-center justify-between gap-2 text-xs"
                        >
                          <div>
                            <p className="font-bold">{app.title}</p>
                            <p className="text-[11px] text-[#18201B]/75">
                              Scope: {app.amountOrQty || app.impactSummary} • By: {app.requestedBy}
                            </p>
                            {app.reason && (
                              <p className="text-[11px] text-[#18201B]/65 mt-0.5">{app.reason}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleSettingsAction(
                                  {
                                    action: 'resolve_approval',
                                    approvalId: app.id,
                                    decision: 'approve',
                                  },
                                  `Approved request ${app.id}`
                                )
                              }
                              className="px-2.5 py-1.5 rounded bg-[#18201B] text-[#F8F5ED] font-bold cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleSettingsAction(
                                  {
                                    action: 'resolve_approval',
                                    approvalId: app.id,
                                    decision: 'reject',
                                  },
                                  `Rejected request ${app.id}`
                                )
                              }
                              className="px-2.5 py-1.5 rounded border border-[#18201B]/30 font-bold cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Embedded AI Copilot Workspace */}
              <div className="p-5 rounded-[8px] bg-[#18201B] text-[#F8F5ED] border border-[#B28A50]/40 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-[#B28A50]" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-[#B28A50]">
                      AI Merchandising & Operations Copilot (Assistive / Non-Autonomous)
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {(
                      [
                        ['ops_summary', 'Ops Briefing'],
                        ['product_copy', 'Write Product Copy'],
                        ['review_sentiment', 'Review Sentiment'],
                        ['margin_check', 'Margin & Promo Audit'],
                      ] as const
                    ).map(([taskKey, label]) => (
                      <button
                        key={taskKey}
                        type="button"
                        onClick={() => setAiTask(taskKey)}
                        className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${
                          aiTask === taskKey
                            ? 'bg-[#B28A50] text-[#18201B]'
                            : 'bg-[#F8F5ED]/10 text-[#F8F5ED]'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Ask AI Copilot to draft copy, audit margins, or summarize queues..."
                    className="flex-1 h-10 px-3 rounded bg-[#F8F5ED] text-[#18201B] text-xs font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleRunAiCopilot}
                    disabled={aiLoading}
                    className="px-4 h-10 rounded bg-[#B28A50] text-[#18201B] text-xs font-bold cursor-pointer shrink-0"
                  >
                    {aiLoading ? 'Generating...' : 'Run Copilot'}
                  </button>
                </div>
                {aiOutput && (
                  <pre className="p-3.5 rounded bg-[#F8F5ED]/10 text-[#F8F5ED] text-xs whitespace-pre-wrap font-sans leading-relaxed border border-[#B28A50]/30">
                    {aiOutput}
                  </pre>
                )}
              </div>
            </div>
          )}

          {/* ==============================================================
              MODULE 2: NO-CODE WEBSITE & CMS SECTION BUILDER
             ============================================================== */}
          {activeTab === 'cms' && (
            <div className="space-y-6">
              {/* Header + Publish Bar */}
              <div className="p-4 sm:p-5 rounded-[8px] bg-[#18201B] text-[#F8F5ED] border-2 border-[#B28A50] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#B28A50]">
                      MODULE 2 • NO-CODE HOMEPAGE & GLOBAL CMS BUILDER
                    </span>
                    <h1 className="font-story text-xl sm:text-2xl font-bold mt-0.5">
                      Add, Edit, Hide, Reorder, Preview, Publish & Rollback Homepage Sections
                    </h1>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={releaseNote}
                      onChange={(e) => setReleaseNote(e.target.value)}
                      placeholder="Release note (e.g., Festive Banner Update)..."
                      className="h-9 px-3 rounded bg-[#F8F5ED] text-[#18201B] text-xs w-56"
                    />
                    <button
                      type="button"
                      disabled={!cmsValidation.canPublish}
                      onClick={() =>
                        sendCmsAction(
                          {
                            action: 'publish_release',
                            releaseNote: releaseNote || 'Published via Super Admin CMS',
                          },
                          'Published draft sections to Live Storefront!'
                        )
                      }
                      className="h-9 px-4 rounded bg-[#B28A50] text-[#18201B] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Publish Draft to Live</span>
                    </button>
                  </div>
                </div>

                {/* Validation Status & Sub-navigation */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F8F5ED]/15 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCmsSubTab('sections')}
                      className={`px-3 py-1.5 rounded font-bold cursor-pointer ${
                        cmsSubTab === 'sections'
                          ? 'bg-[#B28A50] text-[#18201B]'
                          : 'bg-[#F8F5ED]/10 text-[#F8F5ED]'
                      }`}
                    >
                      Homepage Sections ({draftSections.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setCmsSubTab('global')}
                      className={`px-3 py-1.5 rounded font-bold cursor-pointer ${
                        cmsSubTab === 'global'
                          ? 'bg-[#B28A50] text-[#18201B]'
                          : 'bg-[#F8F5ED]/10 text-[#F8F5ED]'
                      }`}
                    >
                      Announcement Bar, Header & Footer
                    </button>
                    <button
                      type="button"
                      onClick={() => setCmsSubTab('categories')}
                      className={`px-3 py-1.5 rounded font-bold cursor-pointer ${
                        cmsSubTab === 'categories'
                          ? 'bg-[#B28A50] text-[#18201B]'
                          : 'bg-[#F8F5ED]/10 text-[#F8F5ED]'
                      }`}
                    >
                      Categories & Collections ({categories.length} / {collections.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setCmsSubTab('releases')}
                      className={`px-3 py-1.5 rounded font-bold cursor-pointer ${
                        cmsSubTab === 'releases'
                          ? 'bg-[#B28A50] text-[#18201B]'
                          : 'bg-[#F8F5ED]/10 text-[#F8F5ED]'
                      }`}
                    >
                      Release History & Rollback ({releases.length})
                    </button>
                  </div>

                  {/* Responsive Live Preview Toggles */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-[#F8F5ED]/70 mr-1">Live Draft Preview:</span>
                    {(
                      [
                        ['none', 'Off', null],
                        ['mobile', '390px', <Smartphone key="m" className="w-3.5 h-3.5" />],
                        ['tablet', '768px', <Tablet key="t" className="w-3.5 h-3.5" />],
                        ['desktop', 'Desktop', <Monitor key="d" className="w-3.5 h-3.5" />],
                      ] as const
                    ).map(([mode, label, icon]) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setPreviewMode(mode)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer ${
                          previewMode === mode
                            ? 'bg-[#B28A50] text-[#18201B]'
                            : 'bg-[#F8F5ED]/10 text-[#F8F5ED]'
                        }`}
                      >
                        {icon}
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Publish Validation Errors / Warnings */}
                {(cmsValidation.errors.length > 0 || cmsValidation.warnings.length > 0) && (
                  <div className="p-3 rounded bg-[#F8F5ED] text-[#18201B] text-xs space-y-1">
                    {cmsValidation.errors.map((err, i) => (
                      <p key={i} className="font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-[#B28A50] shrink-0" />
                        <span>Publish Blocker: {err}</span>
                      </p>
                    ))}
                    {cmsValidation.warnings.map((warn, i) => (
                      <p key={i} className="text-[#18201B]/80 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#B28A50] shrink-0" />
                        <span>Notice: {warn}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Embedded Responsive Preview Iframe */}
              {previewMode !== 'none' && (
                <div className="p-4 rounded-[8px] bg-[#F2ECE1] border-2 border-[#18201B] space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>
                      LIVE DRAFT PREVIEW ({previewMode.toUpperCase()}) — Rendering `/?preview=draft`
                    </span>
                    <button
                      type="button"
                      onClick={() => setPreviewRefreshKey((k) => k + 1)}
                      className="px-2.5 py-1 rounded bg-[#18201B] text-[#F8F5ED] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reload Frame</span>
                    </button>
                  </div>
                  <div className="flex justify-center bg-[#18201B]/10 p-3 rounded overflow-x-auto">
                    <iframe
                      key={previewRefreshKey}
                      src="/?preview=draft"
                      title="Draft Storefront Preview"
                      className="bg-[#F8F5ED] border-2 border-[#18201B] rounded shadow-xl"
                      style={{
                        width:
                          previewMode === 'mobile'
                            ? '390px'
                            : previewMode === 'tablet'
                            ? '768px'
                            : '100%',
                        height: '640px',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* SUBTAB 1: HOMEPAGE SECTIONS EDITOR */}
              {cmsSubTab === 'sections' && (
                <div className="space-y-6">
                  {/* Add New Section Bar */}
                  <div className="p-4 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/20 flex flex-wrap items-end gap-3">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-[11px] font-bold uppercase mb-1">
                        Add Homepage Section Type
                      </label>
                      <select
                        value={newSectionType}
                        onChange={(e) => setNewSectionType(e.target.value as CMSSectionType)}
                        className="w-full h-10 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED] text-xs font-semibold"
                      >
                        {SECTION_TYPE_LABELS.map((item) => (
                          <option key={item.type} value={item.type}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-52">
                      <label className="block text-[11px] font-bold uppercase mb-1">
                        Friendly Admin Label
                      </label>
                      <input
                        type="text"
                        value={newSectionName}
                        onChange={(e) => setNewSectionName(e.target.value)}
                        placeholder="e.g., Festive Silk Edit"
                        className="w-full h-10 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED] text-xs"
                      />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-[11px] font-bold uppercase mb-1">
                        Section Heading
                      </label>
                      <input
                        type="text"
                        value={newSectionHeading}
                        onChange={(e) => setNewSectionHeading(e.target.value)}
                        placeholder="e.g., Handloom Chanderi & Mulmul Festivities"
                        className="w-full h-10 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED] text-xs"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        sendCmsAction(
                          {
                            action: 'add_section',
                            type: newSectionType,
                            friendlyName:
                              newSectionName.trim() ||
                              SECTION_TYPE_LABELS.find((t) => t.type === newSectionType)?.label ||
                              'New Section',
                            heading: newSectionHeading.trim() || 'New Curated Section',
                          },
                          'Added new section to Homepage Draft'
                        );
                        setNewSectionName('');
                        setNewSectionHeading('');
                      }}
                      className="h-10 px-4 rounded bg-[#18201B] text-[#F8F5ED] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#B28A50]" />
                      <span>Add Section</span>
                    </button>
                  </div>

                  {/* Two-Column Split: Left Ordered Section Stack | Right Inspector */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column: Ordered Sections */}
                    <div className="lg:col-span-5 space-y-2">
                      <div className="flex items-center justify-between px-1 text-xs font-bold uppercase tracking-wider text-[#18201B]/70">
                        <span>Homepage Order (Top to Bottom)</span>
                        <span>Click to Edit</span>
                      </div>
                      {draftSections.map((sec, idx) => {
                        const isSelected = sec.id === selectedSection?.id;
                        return (
                          <div
                            key={sec.id}
                            onClick={() => setSelectedSectionId(sec.id)}
                            className={`p-3.5 rounded-[8px] border transition cursor-pointer ${
                              isSelected
                                ? 'bg-[#18201B] text-[#F8F5ED] border-[#B28A50] border-2 shadow-md'
                                : sec.enabled
                                ? 'bg-[#F2ECE1] text-[#18201B] border-[#18201B]/15 hover:border-[#18201B]/40'
                                : 'bg-[#F2ECE1]/50 text-[#18201B]/50 border-dashed border-[#18201B]/20'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[#B28A50]/20 text-[#B28A50] font-bold">
                                    #{idx + 1}
                                  </span>
                                  <span className="text-xs font-bold">{sec.friendlyName}</span>
                                  {!sec.enabled && (
                                    <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-[#18201B]/20">
                                      Hidden
                                    </span>
                                  )}
                                </div>
                                <p
                                  className={`text-[11px] line-clamp-1 ${
                                    isSelected ? 'text-[#F8F5ED]/80' : 'text-[#18201B]/70'
                                  }`}
                                >
                                  {sec.heading}
                                </p>
                              </div>

                              {/* Quick Controls: Up, Down, Hide/Show, Duplicate, Delete */}
                              <div
                                className="flex items-center gap-1 shrink-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() =>
                                    sendCmsAction(
                                      {
                                        action: 'reorder_section',
                                        sectionId: sec.id,
                                        direction: 'up',
                                      },
                                      `Moved "${sec.friendlyName}" up`
                                    )
                                  }
                                  title="Move Up"
                                  className="p-1 rounded hover:bg-[#B28A50]/20 disabled:opacity-30 cursor-pointer"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === draftSections.length - 1}
                                  onClick={() =>
                                    sendCmsAction(
                                      {
                                        action: 'reorder_section',
                                        sectionId: sec.id,
                                        direction: 'down',
                                      },
                                      `Moved "${sec.friendlyName}" down`
                                    )
                                  }
                                  title="Move Down"
                                  className="p-1 rounded hover:bg-[#B28A50]/20 disabled:opacity-30 cursor-pointer"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    sendCmsAction(
                                      { action: 'toggle_section', sectionId: sec.id },
                                      `Toggled visibility for "${sec.friendlyName}"`
                                    )
                                  }
                                  title={sec.enabled ? 'Hide Section' : 'Show Section'}
                                  className="p-1 rounded hover:bg-[#B28A50]/20 cursor-pointer"
                                >
                                  {sec.enabled ? (
                                    <Eye className="w-3.5 h-3.5 text-[#B28A50]" />
                                  ) : (
                                    <EyeOff className="w-3.5 h-3.5" />
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    sendCmsAction(
                                      { action: 'duplicate_section', sectionId: sec.id },
                                      `Duplicated "${sec.friendlyName}"`
                                    )
                                  }
                                  title="Duplicate Section"
                                  className="p-1 rounded hover:bg-[#B28A50]/20 cursor-pointer"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    sendCmsAction(
                                      { action: 'remove_section', sectionId: sec.id },
                                      `Removed "${sec.friendlyName}"`
                                    )
                                  }
                                  title="Delete Section"
                                  className="p-1 rounded hover:bg-[#B28A50]/20 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Right Column: Deep Section Inspector */}
                    <div className="lg:col-span-7">
                      {selectedSection ? (
                        <div className="p-5 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/20 space-y-5">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#18201B]/15 pb-3">
                            <div>
                              <span className="text-[11px] font-mono uppercase text-[#18201B]/60">
                                EDITING SECTION • {selectedSection.type} • rev {selectedSection.revision}
                              </span>
                              <h2 className="font-story text-xl font-bold">
                                {selectedSection.friendlyName}
                              </h2>
                            </div>
                            <button
                              type="button"
                              onClick={handleSaveSelectedSection}
                              className="px-4 py-2 rounded-[6px] bg-[#18201B] text-[#F8F5ED] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4 text-[#B28A50]" />
                              <span>Save Section Changes</span>
                            </button>
                          </div>

                          {/* Core Identity & Tone */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div>
                              <label className="block font-bold uppercase mb-1">
                                Friendly Admin Name
                              </label>
                              <input
                                type="text"
                                value={selectedSection.friendlyName}
                                onChange={(e) =>
                                  handleUpdateSelectedSection({ friendlyName: e.target.value })
                                }
                                className="w-full h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                              />
                            </div>
                            <div>
                              <label className="block font-bold uppercase mb-1">
                                Eyebrow Label
                              </label>
                              <input
                                type="text"
                                value={selectedSection.eyebrow || ''}
                                onChange={(e) =>
                                  handleUpdateSelectedSection({ eyebrow: e.target.value })
                                }
                                className="w-full h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                              />
                            </div>
                            <div>
                              <label className="block font-bold uppercase mb-1">
                                Background Surface
                              </label>
                              <select
                                value={selectedSection.backgroundTone || 'ivory'}
                                onChange={(e) =>
                                  handleUpdateSelectedSection({
                                    backgroundTone: e.target.value as
                                      | 'ivory'
                                      | 'ivory_subtle'
                                      | 'charcoal'
                                      | 'gold_tint',
                                  })
                                }
                                className="w-full h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                              >
                                <option value="ivory">Warm Ivory (#F8F5ED)</option>
                                <option value="ivory_subtle">Soft Sand Card (#F2ECE1)</option>
                                <option value="charcoal">Deep Charcoal (#18201B)</option>
                                <option value="gold_tint">Antique Gold Tint</option>
                              </select>
                            </div>
                          </div>

                          {/* Heading & Subheading */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <label className="block font-bold uppercase mb-1">
                                Section Heading (Required)
                              </label>
                              <input
                                type="text"
                                value={selectedSection.heading}
                                onChange={(e) =>
                                  handleUpdateSelectedSection({ heading: e.target.value })
                                }
                                className="w-full h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED] font-semibold"
                              />
                            </div>
                            <div>
                              <label className="block font-bold uppercase mb-1">
                                Subheading / Subtitle
                              </label>
                              <input
                                type="text"
                                value={selectedSection.subheading || ''}
                                onChange={(e) =>
                                  handleUpdateSelectedSection({ subheading: e.target.value })
                                }
                                className="w-full h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                              />
                            </div>
                          </div>

                          {/* Body Description */}
                          <div className="space-y-1.5 text-xs">
                            <label className="block font-bold uppercase">
                              Story / Section Description (Separate paragraphs with blank lines)
                            </label>
                            <textarea
                              rows={4}
                              value={selectedSection.description || ''}
                              onChange={(e) =>
                                handleUpdateSelectedSection({ description: e.target.value })
                              }
                              className="w-full p-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                            />
                          </div>

                          {/* Primary & Secondary CTAs */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <label className="block font-bold uppercase mb-1">
                                Primary CTA Button Label
                              </label>
                              <input
                                type="text"
                                value={selectedSection.primaryCtaLabel || ''}
                                onChange={(e) =>
                                  handleUpdateSelectedSection({ primaryCtaLabel: e.target.value })
                                }
                                className="w-full h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                              />
                            </div>
                            <div>
                              <label className="block font-bold uppercase mb-1">
                                Primary CTA Link (`href`)
                              </label>
                              <input
                                type="text"
                                value={selectedSection.primaryCtaHref || ''}
                                onChange={(e) =>
                                  handleUpdateSelectedSection({ primaryCtaHref: e.target.value })
                                }
                                className="w-full h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED] font-mono"
                              />
                            </div>
                            <div>
                              <label className="block font-bold uppercase mb-1">
                                Secondary CTA Label
                              </label>
                              <input
                                type="text"
                                value={selectedSection.secondaryCtaLabel || ''}
                                onChange={(e) =>
                                  handleUpdateSelectedSection({ secondaryCtaLabel: e.target.value })
                                }
                                className="w-full h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                              />
                            </div>
                            <div>
                              <label className="block font-bold uppercase mb-1">
                                Secondary CTA Link (`href`)
                              </label>
                              <input
                                type="text"
                                value={selectedSection.secondaryCtaHref || ''}
                                onChange={(e) =>
                                  handleUpdateSelectedSection({ secondaryCtaHref: e.target.value })
                                }
                                className="w-full h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED] font-mono"
                              />
                            </div>
                          </div>

                          {/* Visual Media, Focal Points & Accessibility Alt Text */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                            <div>
                              <label className="block font-bold uppercase mb-1">
                                Desktop Image URL
                              </label>
                              <input
                                type="text"
                                value={selectedSection.desktopImage || ''}
                                onChange={(e) =>
                                  handleUpdateSelectedSection({ desktopImage: e.target.value })
                                }
                                className="w-full h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED] font-mono"
                              />
                            </div>
                            <div>
                              <label className="block font-bold uppercase mb-1">
                                Mobile Image URL
                              </label>
                              <input
                                type="text"
                                value={selectedSection.mobileImage || ''}
                                onChange={(e) =>
                                  handleUpdateSelectedSection({ mobileImage: e.target.value })
                                }
                                className="w-full h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED] font-mono"
                              />
                            </div>
                            <div>
                              <label className="block font-bold uppercase mb-1">
                                Image Alt Text (WCAG Required)
                              </label>
                              <input
                                type="text"
                                value={selectedSection.imageAlt || ''}
                                onChange={(e) =>
                                  handleUpdateSelectedSection({ imageAlt: e.target.value })
                                }
                                className="w-full h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                              />
                            </div>
                          </div>

                          {/* Schedule Window (Asia/Kolkata) & Focal Coordinates */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-[#18201B]/15">
                            <div>
                              <label className="block font-bold uppercase mb-1">
                                Schedule Start (Asia/Kolkata ISO)
                              </label>
                              <input
                                type="text"
                                value={selectedSection.startsAt || ''}
                                onChange={(e) =>
                                  handleUpdateSelectedSection({
                                    startsAt: e.target.value.trim() || null,
                                  })
                                }
                                placeholder="Immediate (or YYYY-MM-DDTHH:mm)"
                                className="w-full h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED] font-mono"
                              />
                            </div>
                            <div>
                              <label className="block font-bold uppercase mb-1">
                                Schedule End (Asia/Kolkata ISO)
                              </label>
                              <input
                                type="text"
                                value={selectedSection.endsAt || ''}
                                onChange={(e) =>
                                  handleUpdateSelectedSection({
                                    endsAt: e.target.value.trim() || null,
                                  })
                                }
                                placeholder="No Expiry (or YYYY-MM-DDTHH:mm)"
                                className="w-full h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED] font-mono"
                              />
                            </div>
                            <div>
                              <label className="block font-bold uppercase mb-1">
                                Focal Point (X, Y • 0.0 to 1.0)
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="number"
                                  step="0.05"
                                  min="0"
                                  max="1"
                                  value={selectedSection.desktopFocalPoint?.x ?? 0.5}
                                  onChange={(e) =>
                                    handleUpdateSelectedSection({
                                      desktopFocalPoint: {
                                        x: Number(e.target.value),
                                        y: selectedSection.desktopFocalPoint?.y ?? 0.5,
                                      },
                                    })
                                  }
                                  className="w-1/2 h-9 px-2 rounded border border-[#18201B]/25 bg-[#F8F5ED] font-mono"
                                />
                                <input
                                  type="number"
                                  step="0.05"
                                  min="0"
                                  max="1"
                                  value={selectedSection.desktopFocalPoint?.y ?? 0.45}
                                  onChange={(e) =>
                                    handleUpdateSelectedSection({
                                      desktopFocalPoint: {
                                        x: selectedSection.desktopFocalPoint?.x ?? 0.5,
                                        y: Number(e.target.value),
                                      },
                                    })
                                  }
                                  className="w-1/2 h-9 px-2 rounded border border-[#18201B]/25 bg-[#F8F5ED] font-mono"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Merchandising Bindings: Collection, Products, Offer */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-[#18201B]/15">
                            <div>
                              <label className="block font-bold uppercase mb-1">
                                Linked Collection
                              </label>
                              <select
                                value={selectedSection.collectionId || ''}
                                onChange={(e) =>
                                  handleUpdateSelectedSection({
                                    collectionId: e.target.value || undefined,
                                  })
                                }
                                className="w-full h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                              >
                                <option value="">None (Use Selected Products)</option>
                                {collections.map((c) => (
                                  <option key={c.id} value={c.id}>
                                    {c.title}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block font-bold uppercase mb-1">
                                Offer Coupon Code
                              </label>
                              <input
                                type="text"
                                value={selectedSection.offerCode || ''}
                                onChange={(e) =>
                                  handleUpdateSelectedSection({ offerCode: e.target.value })
                                }
                                placeholder="e.g., WELCOME10"
                                className="w-full h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED] font-mono"
                              />
                            </div>
                            <div>
                              <label className="block font-bold uppercase mb-1">
                                Offer Conditions / Proof Line
                              </label>
                              <input
                                type="text"
                                value={
                                  selectedSection.offerConditions || selectedSection.proofLine || ''
                                }
                                onChange={(e) =>
                                  handleUpdateSelectedSection({
                                    offerConditions: e.target.value,
                                    proofLine: e.target.value,
                                  })
                                }
                                className="w-full h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                              />
                            </div>
                          </div>

                          {/* Curated Product Picker */}
                          <div className="space-y-2 text-xs pt-2 border-t border-[#18201B]/15">
                            <label className="block font-bold uppercase">
                              Pinned Products in This Section (Click to Toggle)
                            </label>
                            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 rounded bg-[#F8F5ED] border border-[#18201B]/15">
                              {products.map((prod) => {
                                const active = (selectedSection.productIds || []).includes(prod.id);
                                return (
                                  <button
                                    key={prod.id}
                                    type="button"
                                    onClick={() => {
                                      const curr = selectedSection.productIds || [];
                                      const next = active
                                        ? curr.filter((id) => id !== prod.id)
                                        : [...curr, prod.id];
                                      handleUpdateSelectedSection({ productIds: next });
                                    }}
                                    className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                                      active
                                        ? 'bg-[#18201B] text-[#F8F5ED] border border-[#B28A50]'
                                        : 'bg-[#F2ECE1] text-[#18201B] hover:bg-[#18201B]/10'
                                    }`}
                                  >
                                    {active ? '✓ ' : '+ '}
                                    {prod.title} (₹{prod.price})
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Story 3 Craft Facts Editor */}
                          {selectedSection.facts && selectedSection.facts.length > 0 && (
                            <div className="space-y-2 text-xs pt-3 border-t border-[#18201B]/15">
                              <p className="font-bold uppercase">
                                Story 3: Verifiable Craft & Quality Points ({selectedSection.facts.length})
                              </p>
                              {selectedSection.facts.map((fact, fIdx) => (
                                <div key={fIdx} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  <input
                                    type="text"
                                    value={fact.title}
                                    onChange={(e) => {
                                      const next = [...(selectedSection.facts || [])];
                                      next[fIdx] = { ...next[fIdx], title: e.target.value };
                                      handleUpdateSelectedSection({ facts: next });
                                    }}
                                    className="h-8 px-2 rounded border border-[#18201B]/25 bg-[#F8F5ED] font-bold"
                                  />
                                  <input
                                    type="text"
                                    value={fact.body}
                                    onChange={(e) => {
                                      const next = [...(selectedSection.facts || [])];
                                      next[fIdx] = { ...next[fIdx], body: e.target.value };
                                      handleUpdateSelectedSection({ facts: next });
                                    }}
                                    className="sm:col-span-2 h-8 px-2 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Shop by Need Cards Editor */}
                          {selectedSection.needCards && selectedSection.needCards.length > 0 && (
                            <div className="space-y-2 text-xs pt-3 border-t border-[#18201B]/15">
                              <p className="font-bold uppercase">
                                Shop by Need / Budget Cards ({selectedSection.needCards.length})
                              </p>
                              {selectedSection.needCards.map((card, cIdx) => (
                                <div key={cIdx} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  <input
                                    type="text"
                                    value={card.title}
                                    onChange={(e) => {
                                      const next = [...(selectedSection.needCards || [])];
                                      next[cIdx] = { ...next[cIdx], title: e.target.value };
                                      handleUpdateSelectedSection({ needCards: next });
                                    }}
                                    className="h-8 px-2 rounded border border-[#18201B]/25 bg-[#F8F5ED] font-bold"
                                  />
                                  <input
                                    type="text"
                                    value={card.subtitle}
                                    onChange={(e) => {
                                      const next = [...(selectedSection.needCards || [])];
                                      next[cIdx] = { ...next[cIdx], subtitle: e.target.value };
                                      handleUpdateSelectedSection({ needCards: next });
                                    }}
                                    className="h-8 px-2 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                                  />
                                  <input
                                    type="text"
                                    value={card.href}
                                    onChange={(e) => {
                                      const next = [...(selectedSection.needCards || [])];
                                      next[cIdx] = { ...next[cIdx], href: e.target.value };
                                      handleUpdateSelectedSection({ needCards: next });
                                    }}
                                    className="h-8 px-2 rounded border border-[#18201B]/25 bg-[#F8F5ED] font-mono"
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Local Business Contact Editor (When Story 4 is selected) */}
                          {selectedSection.storeDetails && (
                            <div className="space-y-3 text-xs pt-3 border-t border-[#18201B]/15">
                              <p className="font-bold uppercase text-[#18201B]">
                                Local Business & Studio Contact Fields (Story 4)
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input
                                  type="text"
                                  value={selectedSection.storeDetails.city}
                                  onChange={(e) =>
                                    handleUpdateSelectedSection({
                                      storeDetails: {
                                        ...selectedSection.storeDetails!,
                                        city: e.target.value,
                                      },
                                    })
                                  }
                                  placeholder="City"
                                  className="h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                                />
                                <input
                                  type="text"
                                  value={selectedSection.storeDetails.phone}
                                  onChange={(e) =>
                                    handleUpdateSelectedSection({
                                      storeDetails: {
                                        ...selectedSection.storeDetails!,
                                        phone: e.target.value,
                                      },
                                    })
                                  }
                                  placeholder="Phone"
                                  className="h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                                />
                                <input
                                  type="text"
                                  value={selectedSection.storeDetails.email}
                                  onChange={(e) =>
                                    handleUpdateSelectedSection({
                                      storeDetails: {
                                        ...selectedSection.storeDetails!,
                                        email: e.target.value,
                                      },
                                    })
                                  }
                                  placeholder="Support Email"
                                  className="h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                                />
                                <input
                                  type="text"
                                  value={selectedSection.storeDetails.hours}
                                  onChange={(e) =>
                                    handleUpdateSelectedSection({
                                      storeDetails: {
                                        ...selectedSection.storeDetails!,
                                        hours: e.target.value,
                                      },
                                    })
                                  }
                                  placeholder="Support Hours"
                                  className="h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                                />
                              </div>
                            </div>
                          )}

                          <div className="pt-3 border-t border-[#18201B]/15 flex justify-end">
                            <button
                              type="button"
                              onClick={handleSaveSelectedSection}
                              className="px-5 py-2.5 rounded-[6px] bg-[#18201B] text-[#F8F5ED] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4 text-[#B28A50]" />
                              <span>Save Draft Changes for "{selectedSection.friendlyName}"</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-8 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/15 text-center text-xs">
                          Select any section on the left to edit its content, links, images, or products.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 2: GLOBAL ANNOUNCEMENT BAR, HEADER & FOOTER EDITOR */}
              {cmsSubTab === 'global' && globalDraft && (
                <div className="p-5 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/20 space-y-6 text-xs">
                  <div className="flex items-center justify-between border-b border-[#18201B]/15 pb-3">
                    <div>
                      <h2 className="font-story text-xl font-bold">
                        Global Storefront Settings (Announcement Bar, Header & Footer)
                      </h2>
                      <p className="text-[#18201B]/70">
                        Changes apply across the entire storefront when published.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        sendCmsAction(
                          { action: 'update_global_settings', globalSettings: globalDraft },
                          'Saved Global Storefront Draft Settings'
                        )
                      }
                      className="px-4 py-2 rounded bg-[#18201B] text-[#F8F5ED] font-bold cursor-pointer"
                    >
                      Save Global Draft
                    </button>
                  </div>

                  {/* Announcement Bar */}
                  <div className="space-y-3">
                    <h3 className="font-bold uppercase tracking-wider">
                      Global Section 1: Announcement Bar
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label className="flex items-center gap-2 font-bold">
                        <input
                          type="checkbox"
                          checked={globalDraft.announcementBar.enabled}
                          onChange={(e) =>
                            setGlobalDraft({
                              ...globalDraft,
                              announcementBar: {
                                ...globalDraft.announcementBar,
                                enabled: e.target.checked,
                              },
                            })
                          }
                        />
                        <span>Enable Announcement Bar</span>
                      </label>
                      <div className="sm:col-span-2">
                        <label className="block font-bold uppercase mb-1">
                          Announcement Message
                        </label>
                        <input
                          type="text"
                          value={globalDraft.announcementBar.message}
                          onChange={(e) =>
                            setGlobalDraft({
                              ...globalDraft,
                              announcementBar: {
                                ...globalDraft.announcementBar,
                                message: e.target.value,
                              },
                            })
                          }
                          className="w-full h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold uppercase mb-1">Details Link Label</label>
                        <input
                          type="text"
                          value={globalDraft.announcementBar.detailsLabel}
                          onChange={(e) =>
                            setGlobalDraft({
                              ...globalDraft,
                              announcementBar: {
                                ...globalDraft.announcementBar,
                                detailsLabel: e.target.value,
                              },
                            })
                          }
                          className="w-full h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block font-bold uppercase mb-1">
                          Delivery & Offer Terms Modal Summary
                        </label>
                        <input
                          type="text"
                          value={globalDraft.announcementBar.detailsModalText}
                          onChange={(e) =>
                            setGlobalDraft({
                              ...globalDraft,
                              announcementBar: {
                                ...globalDraft.announcementBar,
                                detailsModalText: e.target.value,
                              },
                            })
                          }
                          className="w-full h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer & SA A/C Link */}
                  <div className="space-y-3 pt-4 border-t border-[#18201B]/15">
                    <h3 className="font-bold uppercase tracking-wider">
                      Footer Contact, Legal Entity & "SA A/C" Gateway Link
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold uppercase mb-1">Store Name</label>
                        <input
                          type="text"
                          value={globalDraft.storeName}
                          onChange={(e) =>
                            setGlobalDraft({ ...globalDraft, storeName: e.target.value })
                          }
                          className="w-full h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold uppercase mb-1">GSTIN</label>
                        <input
                          type="text"
                          value={globalDraft.gstin}
                          onChange={(e) =>
                            setGlobalDraft({ ...globalDraft, gstin: e.target.value })
                          }
                          className="w-full h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED] font-mono"
                        />
                      </div>
                      <div>
                        <label className="block font-bold uppercase mb-1">
                          Footer Super Admin Link Label
                        </label>
                        <input
                          type="text"
                          value={globalDraft.footer.superAdminLinkLabel}
                          onChange={(e) =>
                            setGlobalDraft({
                              ...globalDraft,
                              footer: {
                                ...globalDraft.footer,
                                superAdminLinkLabel: e.target.value,
                              },
                            })
                          }
                          className="w-full h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED] font-mono"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block font-bold uppercase mb-1">Physical Address</label>
                        <input
                          type="text"
                          value={globalDraft.footer.address}
                          onChange={(e) =>
                            setGlobalDraft({
                              ...globalDraft,
                              footer: { ...globalDraft.footer, address: e.target.value },
                            })
                          }
                          className="w-full h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold uppercase mb-1">Support Phone</label>
                        <input
                          type="text"
                          value={globalDraft.footer.phone}
                          onChange={(e) =>
                            setGlobalDraft({
                              ...globalDraft,
                              footer: { ...globalDraft.footer, phone: e.target.value },
                            })
                          }
                          className="w-full h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 3: CATEGORIES & COLLECTIONS MANAGER */}
              {cmsSubTab === 'categories' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
                  {/* Categories Manager */}
                  <div className="p-5 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/20 space-y-4">
                    <h2 className="font-story text-lg font-bold">
                      Store Categories ({categories.length})
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      <input
                        type="text"
                        value={newCatForm.name}
                        onChange={(e) => setNewCatForm({ ...newCatForm, name: e.target.value })}
                        placeholder="Category Name (e.g., Home Linen)"
                        className="h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED] flex-1"
                      />
                      <input
                        type="text"
                        value={newCatForm.description}
                        onChange={(e) =>
                          setNewCatForm({ ...newCatForm, description: e.target.value })
                        }
                        placeholder="Short Description"
                        className="h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED] flex-1"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          if (!newCatForm.name.trim()) return;
                          const res = await fetch('/api/categories', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              entity: 'category',
                              action: 'create',
                              ...newCatForm,
                            }),
                          });
                          if (res.ok) {
                            setNewCatForm({ name: '', description: '' });
                            showNotice('Created new category');
                            await loadAllAdminData();
                          }
                        }}
                        className="h-9 px-3 rounded bg-[#18201B] text-[#F8F5ED] font-bold cursor-pointer"
                      >
                        + Add Category
                      </button>
                    </div>
                    <div className="space-y-2">
                      {categories.map((cat) => (
                        <div
                          key={cat.id}
                          className="p-3 rounded bg-[#F8F5ED] border border-[#18201B]/15 flex items-center justify-between gap-2"
                        >
                          <div>
                            <p className="font-bold">
                              {cat.name}{' '}
                              <span className="font-mono text-[11px] text-[#18201B]/60">
                                (/{cat.slug})
                              </span>
                            </p>
                            <p className="text-[11px] text-[#18201B]/70">{cat.description}</p>
                          </div>
                          <button
                            type="button"
                            onClick={async () => {
                              await fetch('/api/categories', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  entity: 'category',
                                  action: 'toggle_archive',
                                  categoryId: cat.id,
                                }),
                              });
                              showNotice(`Toggled archive status for ${cat.name}`);
                              await loadAllAdminData();
                            }}
                            className="px-2.5 py-1 rounded border border-[#18201B]/30 font-bold cursor-pointer"
                          >
                            {cat.archived ? 'Archived (Restore)' : 'Active'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Collections Manager */}
                  <div className="p-5 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/20 space-y-4">
                    <h2 className="font-story text-lg font-bold">
                      Curated & Rule-Based Collections ({collections.length})
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      <input
                        type="text"
                        value={newColForm.title}
                        onChange={(e) => setNewColForm({ ...newColForm, title: e.target.value })}
                        placeholder="Collection Title (e.g., Monsoon Edit)"
                        className="h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED] flex-1"
                      />
                      <input
                        type="text"
                        value={newColForm.description}
                        onChange={(e) =>
                          setNewColForm({ ...newColForm, description: e.target.value })
                        }
                        placeholder="Collection Description"
                        className="h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED] flex-1"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          if (!newColForm.title.trim()) return;
                          const res = await fetch('/api/categories', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              entity: 'collection',
                              action: 'create',
                              ...newColForm,
                            }),
                          });
                          if (res.ok) {
                            setNewColForm({ title: '', eyebrow: 'Curated Edit', description: '' });
                            showNotice('Created new collection');
                            await loadAllAdminData();
                          }
                        }}
                        className="h-9 px-3 rounded bg-[#18201B] text-[#F8F5ED] font-bold cursor-pointer"
                      >
                        + Add Collection
                      </button>
                    </div>
                    <div className="space-y-2">
                      {collections.map((col) => (
                        <div
                          key={col.id}
                          className="p-3 rounded bg-[#F8F5ED] border border-[#18201B]/15 space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold">
                              {col.title}{' '}
                              <span className="font-mono text-[11px] text-[#18201B]/60">
                                ({col.mode})
                              </span>
                            </span>
                            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#18201B] text-[#B28A50]">
                              {col.manualProductIds?.length || 0} pinned items
                            </span>
                          </div>
                          <p className="text-[11px] text-[#18201B]/70">{col.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 4: RELEASE MANIFESTS & 1-CLICK ROLLBACK */}
              {cmsSubTab === 'releases' && (
                <div className="p-5 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/20 space-y-4 text-xs">
                  <h2 className="font-story text-xl font-bold">
                    Immutable Storefront Release History & 1-Click Rollback
                  </h2>
                  <div className="space-y-2.5">
                    {releases.map((rel) => {
                      const isCurrent = rel.id === activeReleaseId;
                      return (
                        <div
                          key={rel.id}
                          className="p-3.5 rounded-[6px] bg-[#F8F5ED] border border-[#18201B]/15 flex flex-wrap items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold">
                                v{rel.versionNumber} ({rel.id})
                              </span>
                              {isCurrent && (
                                <span className="px-2 py-0.5 rounded bg-[#18201B] text-[#B28A50] text-[10px] font-bold uppercase">
                                  Active Live Release
                                </span>
                              )}
                            </div>
                            <p className="font-semibold mt-1">{rel.releaseNote}</p>
                            <p className="text-[11px] text-[#18201B]/65">
                              Published by {rel.publishedBy} at{' '}
                              {new Date(rel.publishedAt).toLocaleString('en-IN')} •{' '}
                              {rel.sectionsSnapshot?.length || 0} sections snapshot
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              sendCmsAction(
                                { action: 'rollback_release', releaseId: rel.id },
                                `Rolled back live storefront to ${rel.id}`
                              )
                            }
                            className="px-3 py-1.5 rounded border border-[#18201B] font-bold inline-flex items-center gap-1.5 hover:bg-[#18201B] hover:text-[#F8F5ED] cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Rollback to v{rel.versionNumber}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==============================================================
              MODULE 3: ORDERS & FULFILMENT (6-STATE-MACHINE WORKFLOWS)
             ============================================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#18201B]/15 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#18201B]/60">
                    MODULE 3 • 6-DIMENSION ORDER MANAGEMENT & FULFILMENT
                  </span>
                  <h1 className="font-story text-2xl font-bold mt-0.5">
                    Orders, Manual UPI Verification, AWB Dispatch & COD Remittance
                  </h1>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#18201B]/50" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="Search Order #, Customer, Phone..."
                      className="h-9 pl-8 pr-3 rounded border border-[#18201B]/25 bg-[#F2ECE1]"
                    />
                  </div>
                  <select
                    value={orderFilter}
                    onChange={(e) => setOrderFilter(e.target.value)}
                    className="h-9 px-3 rounded border border-[#18201B]/25 bg-[#F2ECE1] font-semibold"
                  >
                    <option value="all">All Orders ({orders.length})</option>
                    <option value="manual_upi">Manual UPI Verification</option>
                    <option value="cod">Cash on Delivery (COD)</option>
                    <option value="unfulfilled">Unpacked / Ready to Ship</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {orders
                  .filter((o) => {
                    if (orderFilter === 'manual_upi' && o.paymentMethod !== 'manual_upi')
                      return false;
                    if (orderFilter === 'cod' && o.paymentMethod !== 'cod') return false;
                    if (
                      orderFilter === 'unfulfilled' &&
                      o.fulfilmentStatus !== 'unallocated' &&
                      o.fulfilmentStatus !== 'allocated' &&
                      o.fulfilmentStatus !== 'packed'
                    )
                      return false;
                    if (!orderSearch.trim()) return true;
                    const q = orderSearch.toLowerCase();
                    return (
                      o.orderNumber.toLowerCase().includes(q) ||
                      o.customer.name.toLowerCase().includes(q) ||
                      o.customer.phone.includes(q)
                    );
                  })
                  .map((order) => (
                    <div
                      key={order.id}
                      className="p-4 sm:p-5 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/20 space-y-3 text-xs"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#18201B]/10 pb-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-sm font-bold">{order.orderNumber}</span>
                            <span className="px-2 py-0.5 rounded bg-[#18201B] text-[#F8F5ED] font-bold">
                              {order.customerSummaryStatus}
                            </span>
                            <span className="px-2 py-0.5 rounded border border-[#18201B]/25 font-mono uppercase">
                              {order.paymentMethod}
                            </span>
                          </div>
                          <p className="text-[#18201B]/75 mt-1">
                            {order.customer.name} ({order.customer.phone}) • Ship to:{' '}
                            {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                            {order.shippingAddress.pincode}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-base font-bold font-mono">
                            ₹{order.grandTotal.toLocaleString('en-IN')}
                          </p>
                          <Link
                            href={`/invoice/${order.id}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-[11px] font-bold underline mt-0.5"
                          >
                            <FileText className="w-3 h-3" />
                            <span>GST Tax Invoice</span>
                          </Link>
                        </div>
                      </div>

                      {/* 6 State Machine Badges */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[11px]">
                        <div className="p-2 rounded bg-[#F8F5ED] border border-[#18201B]/10">
                          <span className="block text-[#18201B]/60 uppercase">1. Acceptance</span>
                          <span className="font-mono font-bold">{order.acceptanceStatus}</span>
                        </div>
                        <div className="p-2 rounded bg-[#F8F5ED] border border-[#18201B]/10">
                          <span className="block text-[#18201B]/60 uppercase">2. Payment</span>
                          <span className="font-mono font-bold">{order.paymentStatus}</span>
                        </div>
                        <div className="p-2 rounded bg-[#F8F5ED] border border-[#18201B]/10">
                          <span className="block text-[#18201B]/60 uppercase">3. Manual UPI</span>
                          <span className="font-mono font-bold">{order.manualPaymentStatus}</span>
                        </div>
                        <div className="p-2 rounded bg-[#F8F5ED] border border-[#18201B]/10">
                          <span className="block text-[#18201B]/60 uppercase">4. COD Status</span>
                          <span className="font-mono font-bold">{order.codStatus}</span>
                        </div>
                        <div className="p-2 rounded bg-[#F8F5ED] border border-[#18201B]/10">
                          <span className="block text-[#18201B]/60 uppercase">5. Fulfilment</span>
                          <span className="font-mono font-bold">{order.fulfilmentStatus}</span>
                        </div>
                        <div className="p-2 rounded bg-[#F8F5ED] border border-[#18201B]/10">
                          <span className="block text-[#18201B]/60 uppercase">6. Shipment</span>
                          <span className="font-mono font-bold">{order.shipmentStatus}</span>
                        </div>
                      </div>

                      {/* Operational Commands */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                        <div className="text-[11px] text-[#18201B]/75">
                          Items:{' '}
                          {order.lines
                            .map((l) => `${l.title} (${l.size}) × ${l.qtyOrdered}`)
                            .join(', ')}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {order.paymentMethod === 'manual_upi' &&
                            order.manualPaymentStatus !== 'verified' && (
                              <button
                                type="button"
                                onClick={() => handleOrderCommand(order.id, 'verify_manual_upi')}
                                className="px-2.5 py-1.5 rounded bg-[#18201B] text-[#F8F5ED] font-bold cursor-pointer"
                              >
                                Verify UPI UTR
                              </button>
                            )}
                          {order.fulfilmentStatus !== 'packed' &&
                            order.fulfilmentStatus !== 'fulfilled' &&
                            order.fulfilmentStatus !== 'cancelled' && (
                              <button
                                type="button"
                                onClick={() => handleOrderCommand(order.id, 'pack_order')}
                                className="px-2.5 py-1.5 rounded border border-[#18201B] font-bold cursor-pointer"
                              >
                                Mark Packed
                              </button>
                            )}
                          {(order.shipmentStatus === 'not_started' ||
                            order.shipmentStatus === 'label_pending') && (
                            <button
                              type="button"
                              onClick={() =>
                                handleOrderCommand(order.id, 'book_shipment', {
                                  courierName: 'BlueDart Express',
                                  awbNumber: `BD${Date.now().toString().slice(-8)}`,
                                })
                              }
                              className="px-2.5 py-1.5 rounded bg-[#18201B] text-[#F8F5ED] font-bold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Truck className="w-3.5 h-3.5 text-[#B28A50]" />
                              <span>Dispatch AWB</span>
                            </button>
                          )}
                          {order.shipmentStatus !== 'delivered' && (
                            <button
                              type="button"
                              onClick={() => handleOrderCommand(order.id, 'mark_delivered')}
                              className="px-2.5 py-1.5 rounded border border-[#18201B] font-bold cursor-pointer"
                            >
                              Mark Delivered
                            </button>
                          )}
                          {order.paymentMethod === 'cod' && order.codStatus !== 'remitted' && (
                            <button
                              type="button"
                              onClick={() => handleOrderCommand(order.id, 'remit_cod')}
                              className="px-2.5 py-1.5 rounded border border-[#B28A50] bg-[#B28A50]/20 font-bold cursor-pointer"
                            >
                              Remit COD
                            </button>
                          )}
                          {order.acceptanceStatus !== 'cancelled' &&
                            order.shipmentStatus !== 'delivered' && (
                              <button
                                type="button"
                                onClick={() => handleOrderCommand(order.id, 'cancel_order')}
                                className="px-2.5 py-1.5 rounded border border-[#18201B]/30 text-[#18201B]/75 cursor-pointer"
                              >
                                Cancel
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ==============================================================
              MODULE 4: PRODUCTS & MERCHANDISING (PIM + LEGAL METROLOGY)
             ============================================================== */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#18201B]/15 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#18201B]/60">
                    MODULE 4 • PRODUCT INFORMATION MANAGEMENT (PIM)
                  </span>
                  <h1 className="font-story text-2xl font-bold mt-0.5">
                    Catalog, HSN/GST Compliance, Legal Metrology & Publish Readiness
                  </h1>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      const csvHeaders = 'ID,SKU,Title,Price,MRP,HSN,GST_Percent,Status\n';
                      const csvRows = products
                        .map(
                          (p) =>
                            `${p.id},${p.variants[0]?.sku || ''},"${p.title.replace(/"/g, '""')}",${p.price},${p.mrp},${p.legalMetrology?.hsnCode || ''},${p.legalMetrology?.gstRatePercent ?? 12},${p.status}`
                        )
                        .join('\n');
                      const blob = new Blob([csvHeaders + csvRows], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'karigar-catalog-export.csv';
                      a.click();
                      showNotice('Exported catalog CSV');
                    }}
                    className="px-3 py-2 rounded border border-[#18201B] font-bold cursor-pointer"
                  >
                    Export Catalog CSV
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const res = await fetch('/api/products', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          action: 'csv_dry_run',
                          rows: [
                            {
                              sku: 'KRG-SH-DRY-01',
                              title: 'Sample Handloom Oxford Shirt',
                              price: 1599,
                              hsnCode: '62052000',
                            },
                            {
                              sku: 'KRG-SH-DRY-02',
                              title: 'Incomplete Draft Row',
                              price: 0,
                              hsnCode: '',
                            },
                          ],
                        }),
                      });
                      const data = await res.json();
                      setCsvDryRunReport(data);
                      showNotice('Executed CSV Import Dry-Run Validation');
                    }}
                    className="px-3 py-2 rounded bg-[#18201B] text-[#F8F5ED] font-bold cursor-pointer"
                  >
                    Run CSV Import Dry-Run
                  </button>
                </div>
              </div>

              {csvDryRunReport && (
                <div className="p-4 rounded-[8px] bg-[#F2ECE1] border border-[#B28A50] text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase">
                      CSV Import Dry-Run Report: {csvDryRunReport.validCount} Valid /{' '}
                      {csvDryRunReport.invalidCount} Blocked
                    </span>
                    <button
                      type="button"
                      onClick={() => setCsvDryRunReport(null)}
                      className="underline font-bold cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                  <div className="space-y-1">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(csvDryRunReport.report || []).map((r: any) => (
                      <div
                        key={r.rowNumber}
                        className="p-2 rounded bg-[#F8F5ED] flex justify-between"
                      >
                        <span className="font-mono">
                          Row #{r.rowNumber} ({r.sku}): {r.title}
                        </span>
                        <span className="font-bold">
                          {r.valid ? '✓ Ready to Import' : `✗ Blocked: ${r.errors.join(', ')}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Create Product Form */}
              <form
                onSubmit={handleCreateProduct}
                className="p-5 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/20 space-y-4 text-xs"
              >
                <h2 className="font-bold uppercase tracking-wider">
                  + Launch New Product (With Mandatory Indian Legal Metrology & HSN)
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <input
                    type="text"
                    required
                    value={newProductForm.title}
                    onChange={(e) =>
                      setNewProductForm({ ...newProductForm, title: e.target.value })
                    }
                    placeholder="Product Title (e.g., Sanganeri Indigo Kurta)"
                    className="h-9 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                  />
                  <select
                    value={newProductForm.categoryId}
                    onChange={(e) =>
                      setNewProductForm({ ...newProductForm, categoryId: e.target.value })
                    }
                    className="h-9 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    required
                    value={newProductForm.mrp}
                    onChange={(e) =>
                      setNewProductForm({ ...newProductForm, mrp: Number(e.target.value) })
                    }
                    placeholder="MRP (₹)"
                    className="h-9 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED] font-mono"
                  />
                  <input
                    type="number"
                    required
                    value={newProductForm.sellingPrice}
                    onChange={(e) =>
                      setNewProductForm({
                        ...newProductForm,
                        sellingPrice: Number(e.target.value),
                      })
                    }
                    placeholder="Selling Price (₹)"
                    className="h-9 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED] font-mono"
                  />
                  <input
                    type="text"
                    value={newProductForm.hsnCode}
                    onChange={(e) =>
                      setNewProductForm({ ...newProductForm, hsnCode: e.target.value })
                    }
                    placeholder="HSN Code (e.g. 62052000)"
                    className="h-9 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED] font-mono"
                  />
                  <input
                    type="number"
                    value={newProductForm.gstRatePercent}
                    onChange={(e) =>
                      setNewProductForm({
                        ...newProductForm,
                        gstRatePercent: Number(e.target.value),
                      })
                    }
                    placeholder="GST %"
                    className="h-9 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED] font-mono"
                  />
                  <input
                    type="text"
                    value={newProductForm.primaryImage}
                    onChange={(e) =>
                      setNewProductForm({ ...newProductForm, primaryImage: e.target.value })
                    }
                    placeholder="Image URL"
                    className="h-9 px-3 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                  />
                  <button
                    type="submit"
                    className="h-9 px-4 rounded bg-[#18201B] text-[#F8F5ED] font-bold cursor-pointer"
                  >
                    Create & Publish Product
                  </button>
                </div>
              </form>

              {/* Product List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((prod) => {
                  const hasHsn = Boolean(prod.legalMetrology?.hsnCode);
                  const hasAlt = Boolean(prod.images[0]?.alt);
                  const isReady = prod.price > 0 && hasHsn && hasAlt;
                  return (
                    <div
                      key={prod.id}
                      className="p-4 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/15 flex gap-4 text-xs"
                    >
                      <img
                        src={prod.images[0]?.url || ''}
                        alt={prod.title}
                        className="w-20 h-24 object-cover rounded border border-[#18201B]/15 shrink-0"
                      />
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-sm">{prod.title}</p>
                            <p className="text-[11px] text-[#18201B]/70">
                              HSN: {prod.legalMetrology?.hsnCode || '62052000'} • GST:{' '}
                              {prod.legalMetrology?.gstRatePercent ?? 12}% • Origin:{' '}
                              {prod.legalMetrology?.countryOfOrigin || 'India'}
                            </p>
                            <p className="text-[10px] font-mono text-[#18201B]/65 mt-0.5">
                              Readiness: {isReady ? '✓ 5/5 Checks Passed' : '⚠ Missing HSN/Alt'} •
                              Rev #{prod.revision || 1}
                            </p>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-[#18201B] text-[#F8F5ED] text-[10px] font-mono uppercase">
                            {prod.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="font-mono">
                            MRP: <del>₹{prod.mrp}</del>
                          </span>
                          <span className="font-mono font-bold">Selling: ₹{prod.price}</span>
                          <button
                            type="button"
                            onClick={() =>
                              handleQuickPriceUpdate(prod, Math.max(299, prod.price - 100))
                            }
                            className="px-2 py-0.5 rounded border border-[#18201B]/25 text-[11px] font-semibold cursor-pointer"
                          >
                            -₹100
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickPriceUpdate(prod, prod.price + 100)}
                            className="px-2 py-0.5 rounded border border-[#18201B]/25 text-[11px] font-semibold cursor-pointer"
                          >
                            +₹100
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              await fetch('/api/products', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ action: 'duplicate', productId: prod.id }),
                              });
                              showNotice(`Duplicated "${prod.title}" as draft`);
                              await loadAllAdminData();
                            }}
                            className="px-2 py-0.5 rounded border border-[#18201B]/25 text-[11px] font-semibold cursor-pointer"
                          >
                            Duplicate
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              const nextStatus =
                                prod.status === 'published' ? 'archived' : 'published';
                              await fetch(`/api/products/${prod.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status: nextStatus }),
                              });
                              showNotice(`Marked "${prod.title}" as ${nextStatus}`);
                              await loadAllAdminData();
                            }}
                            className="px-2 py-0.5 rounded border border-[#18201B]/25 text-[11px] font-semibold cursor-pointer"
                          >
                            {prod.status === 'published' ? 'Archive' : 'Publish'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==============================================================
              MODULE 5: STOCK & WAREHOUSES (WMS)
             ============================================================== */}
          {activeTab === 'stock' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#18201B]/60">
                  MODULE 5 • MULTI-WAREHOUSE INVENTORY LEDGER & PURCHASE ORDERS
                </span>
                <h1 className="font-story text-2xl font-bold mt-0.5">
                  On-Hand, Reserved, Available to Promise (ATP), PO Receiving & Transfers
                </h1>
              </div>

              {/* Stock Adjustment Form */}
              <form
                onSubmit={handleStockAdjustment}
                className="p-4 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/20 grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs items-end"
              >
                <div>
                  <label className="block font-bold uppercase mb-1">SKU</label>
                  <select
                    value={stockAdjForm.sku}
                    onChange={(e) => setStockAdjForm({ ...stockAdjForm, sku: e.target.value })}
                    className="w-full h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED] font-mono"
                  >
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(stockData.variants || []).map((v: any) => (
                      <option key={v.sku} value={v.sku}>
                        {v.sku} (ATP: {v.availableToPromise ?? v.available})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase mb-1">Movement Type</label>
                  <select
                    value={stockAdjForm.type}
                    onChange={(e) => setStockAdjForm({ ...stockAdjForm, type: e.target.value })}
                    className="w-full h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                  >
                    <option value="receipt">Receive Batch (+)</option>
                    <option value="count_correction">Cycle Count Correction</option>
                    <option value="damage">Damage / Quarantine Hold</option>
                    <option value="restock_from_quarantine">Release from Quarantine</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase mb-1">Quantity Delta</label>
                  <input
                    type="number"
                    value={stockAdjForm.deltaQty}
                    onChange={(e) =>
                      setStockAdjForm({ ...stockAdjForm, deltaQty: Number(e.target.value) })
                    }
                    className="w-full h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED] font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase mb-1">Audit Reason (Mandatory)</label>
                  <input
                    type="text"
                    required
                    value={stockAdjForm.reason}
                    onChange={(e) => setStockAdjForm({ ...stockAdjForm, reason: e.target.value })}
                    className="w-full h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                  />
                </div>
                <button
                  type="submit"
                  className="h-9 px-4 rounded bg-[#18201B] text-[#F8F5ED] font-bold cursor-pointer"
                >
                  Record Stock Entry
                </button>
              </form>

              {/* Purchase Orders & Inter-Warehouse Transfer */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
                <div className="p-4 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold uppercase tracking-wider">
                      Supplier Purchase Orders ({(stockData.purchaseOrders || []).length})
                    </h2>
                    <button
                      type="button"
                      onClick={async () => {
                        const res = await fetch('/api/stock', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            action: 'create_po',
                            ...newPoForm,
                          }),
                        });
                        if (res.ok) {
                          showNotice('Created new Supplier Purchase Order');
                          await loadAllAdminData();
                        }
                      }}
                      className="px-3 py-1 rounded bg-[#18201B] text-[#F8F5ED] font-bold cursor-pointer"
                    >
                      + Issue New PO
                    </button>
                  </div>
                  <div className="space-y-2">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(stockData.purchaseOrders || []).map((po: any) => (
                      <div
                        key={po.id}
                        className="p-3 rounded bg-[#F8F5ED] border border-[#18201B]/15 flex flex-wrap items-center justify-between gap-2"
                      >
                        <div>
                          <p className="font-bold font-mono">
                            {po.poNumber} • {po.supplierName}
                          </p>
                          <p className="text-[11px] text-[#18201B]/75">
                            Total: ₹{(po.totalCost || 0).toLocaleString('en-IN')} • Status:{' '}
                            <strong className="uppercase">{po.status}</strong> • ETA:{' '}
                            {po.expectedDate}
                          </p>
                        </div>
                        {po.status !== 'received' && (
                          <button
                            type="button"
                            onClick={async () => {
                              await fetch('/api/stock', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ action: 'receive_po', poId: po.id }),
                              });
                              showNotice(`Received PO ${po.poNumber} into On-Hand Stock`);
                              await loadAllAdminData();
                            }}
                            className="px-2.5 py-1.5 rounded bg-[#18201B] text-[#B28A50] font-bold cursor-pointer"
                          >
                            Receive Full Batch
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Stock Movements Ledger */}
                <div className="p-4 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold uppercase tracking-wider">
                      Immutable Stock Movement Ledger ({(stockData.stockMovements || []).length})
                    </h2>
                    <button
                      type="button"
                      onClick={async () => {
                        await fetch('/api/stock', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            action: 'transfer_stock',
                            sku: stockAdjForm.sku,
                            fromWarehouseId: 'wh_blr_main',
                            toWarehouseId: 'wh_mum_studio',
                            qty: 5,
                            reason: 'Studio replenishment transfer',
                          }),
                        });
                        showNotice(`Transferred 5 units of ${stockAdjForm.sku} to Mumbai Studio`);
                        await loadAllAdminData();
                      }}
                      className="px-2.5 py-1 rounded border border-[#18201B] font-bold cursor-pointer"
                    >
                      Transfer 5 Units BLR → MUM
                    </button>
                  </div>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(stockData.stockMovements || []).slice(0, 10).map((mov: any) => (
                      <div
                        key={mov.id}
                        className="p-2 rounded bg-[#F8F5ED] border border-[#18201B]/10 flex justify-between text-[11px]"
                      >
                        <span>
                          <strong className="font-mono">{mov.sku}</strong> ({mov.type}:{' '}
                          {mov.qtyDelta > 0 ? `+${mov.qtyDelta}` : mov.qtyDelta}) — {mov.reason}
                        </span>
                        <span className="font-mono text-[#18201B]/60">{mov.warehouseId}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SKU Table */}
              <div className="overflow-x-auto rounded-[8px] border border-[#18201B]/20 bg-[#F2ECE1]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#18201B] text-[#F8F5ED] uppercase text-[11px]">
                    <tr>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Product</th>
                      <th className="p-3">Variant</th>
                      <th className="p-3">On Hand</th>
                      <th className="p-3">Reserved / Alloc</th>
                      <th className="p-3">ATP (Available)</th>
                      <th className="p-3">Quarantine / Incoming</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#18201B]/10">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(stockData.variants || []).slice(0, 30).map((v: any) => (
                      <tr key={v.sku} className="hover:bg-[#18201B]/[0.03]">
                        <td className="p-3 font-mono font-bold">{v.sku}</td>
                        <td className="p-3">{v.productTitle}</td>
                        <td className="p-3">
                          {v.color} / {v.size}
                        </td>
                        <td className="p-3 font-mono">{v.onHand}</td>
                        <td className="p-3 font-mono">
                          {v.reserved} / {v.allocated || 0}
                        </td>
                        <td className="p-3 font-mono font-bold">
                          {v.availableToPromise ?? v.available}
                        </td>
                        <td className="p-3 font-mono">
                          {v.unavailable ?? v.damaged ?? 0} / +{v.incoming || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==============================================================
              MODULE 6: PAYMENTS, RETURNS (RMA) & GST FINANCE
             ============================================================== */}
          {activeTab === 'finance' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#18201B]/60">
                  MODULE 6 • PAYMENTS, RMA DISPOSITION & GST LEDGER
                </span>
                <h1 className="font-story text-2xl font-bold mt-0.5">
                  Manual UPI Reconciliation, Return QC, Cap-Guarded Refunds & HSN GST
                </h1>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
                {/* RMA Returns List */}
                <div className="p-5 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/20 space-y-3">
                  <h2 className="font-bold uppercase tracking-wider">
                    RMA Returns & Exchange Inspection ({(returnsData.returns || []).length})
                  </h2>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(returnsData.returns || []).map((rma: any) => (
                    <div
                      key={rma.id}
                      className="p-3.5 rounded bg-[#F8F5ED] border border-[#18201B]/15 space-y-2"
                    >
                      <div className="flex justify-between font-bold">
                        <span>
                          {rma.returnNumber || rma.rmaNumber} • Order {rma.orderNumber}
                        </span>
                        <span className="font-mono uppercase">{rma.status}</span>
                      </div>
                      <p className="text-[#18201B]/75">
                        {rma.productTitle} ({rma.sku}) • Reason: {rma.reason || rma.reasonCategory}{' '}
                        • Remedy: <strong className="uppercase">{rma.preferredRemedy || 'exchange'}</strong>
                      </p>
                      {rma.inspectionNotes && (
                        <p className="text-[11px] text-[#18201B]/65">
                          Notes: {rma.inspectionNotes}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() =>
                            handleProcessReturn(rma.id, 'refund_completed', 'restock', true)
                          }
                          className="px-2.5 py-1 rounded bg-[#18201B] text-[#F8F5ED] font-bold cursor-pointer"
                        >
                          QC Pass: Restock & Refund ₹{rma.refundAmount}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleProcessReturn(rma.id, 'refund_completed', 'quarantine', true)
                          }
                          className="px-2.5 py-1 rounded border border-[#18201B] font-bold cursor-pointer"
                        >
                          Defect: Quarantine & Refund
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Refunds Ledger + Issue Refund Form */}
                <div className="p-5 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/20 space-y-4">
                  <h2 className="font-bold uppercase tracking-wider">
                    Cap-Guarded Refunds & Credit Notes ({(returnsData.refunds || []).length})
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <input
                      type="text"
                      value={manualRefundForm.orderNumber}
                      onChange={(e) =>
                        setManualRefundForm({ ...manualRefundForm, orderNumber: e.target.value })
                      }
                      placeholder="Order #"
                      className="h-8 px-2 rounded border border-[#18201B]/25 bg-[#F8F5ED] font-mono"
                    />
                    <input
                      type="number"
                      value={manualRefundForm.amount}
                      onChange={(e) =>
                        setManualRefundForm({
                          ...manualRefundForm,
                          amount: Number(e.target.value),
                        })
                      }
                      placeholder="Amount ₹"
                      className="h-8 px-2 rounded border border-[#18201B]/25 bg-[#F8F5ED] font-mono"
                    />
                    <input
                      type="text"
                      value={manualRefundForm.reason}
                      onChange={(e) =>
                        setManualRefundForm({ ...manualRefundForm, reason: e.target.value })
                      }
                      placeholder="Refund Reason"
                      className="h-8 px-2 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        const res = await fetch('/api/returns', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            action: 'create_refund',
                            ...manualRefundForm,
                          }),
                        });
                        const data = await res.json();
                        if (!res.ok) {
                          showNotice(data.error || 'Refund blocked by cap');
                          return;
                        }
                        showNotice(`Issued refund & GST Credit Note for ${manualRefundForm.orderNumber}`);
                        await loadAllAdminData();
                      }}
                      className="h-8 px-3 rounded bg-[#18201B] text-[#F8F5ED] font-bold cursor-pointer"
                    >
                      Issue Refund
                    </button>
                  </div>

                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(returnsData.refunds || []).map((ref: any) => (
                    <div
                      key={ref.id}
                      className="p-3.5 rounded bg-[#F8F5ED] border border-[#18201B]/15 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-bold">
                          {ref.refundNumber || ref.id} • Order {ref.orderNumber} • ₹{ref.amount}
                        </p>
                        <p className="text-[11px] text-[#18201B]/70">
                          Method: {ref.method} • Credit Note:{' '}
                          {ref.creditNoteNumber || ref.referenceUtr || 'CN-2627'} • {ref.reason}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#18201B] text-[#B28A50] font-mono text-[10px] uppercase">
                        {ref.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* GST HSN Tax Summary Table */}
              <div className="p-5 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/20 space-y-3 text-xs">
                <h2 className="font-bold uppercase tracking-wider">
                  GST HSN Tax Liability Summary (CGST + SGST Intra-State vs IGST Inter-State)
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#18201B] text-[#F8F5ED] uppercase text-[11px]">
                      <tr>
                        <th className="p-2.5">HSN Code</th>
                        <th className="p-2.5">GST Rate</th>
                        <th className="p-2.5">Units Sold</th>
                        <th className="p-2.5">Taxable Value</th>
                        <th className="p-2.5">CGST</th>
                        <th className="p-2.5">SGST</th>
                        <th className="p-2.5">IGST</th>
                        <th className="p-2.5">Total GST</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#18201B]/10 bg-[#F8F5ED] font-mono">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {(returnsData.hsnSummary || []).map((row: any, idx: number) => (
                        <tr key={idx}>
                          <td className="p-2.5 font-bold">{row.hsnCode}</td>
                          <td className="p-2.5">{row.gstRatePercent}%</td>
                          <td className="p-2.5">{row.units}</td>
                          <td className="p-2.5">₹{Math.round(row.taxableValue).toLocaleString('en-IN')}</td>
                          <td className="p-2.5">₹{Math.round(row.cgst).toLocaleString('en-IN')}</td>
                          <td className="p-2.5">₹{Math.round(row.sgst).toLocaleString('en-IN')}</td>
                          <td className="p-2.5">₹{Math.round(row.igst).toLocaleString('en-IN')}</td>
                          <td className="p-2.5 font-bold">
                            ₹{Math.round(row.totalTax).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              MODULE 7: CUSTOMERS, SUPPORT TICKETS & REVIEWS
             ============================================================== */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#18201B]/60">
                  MODULE 7 • CUSTOMER 360 CRM, TICKETS & VERIFIED REVIEWS
                </span>
                <h1 className="font-story text-2xl font-bold mt-0.5">
                  Customer Profiles, Support SLA Desk (Public vs Internal Notes) & Review Moderation
                </h1>
              </div>

              {/* Support Ticket SLA Queue */}
              <div className="p-5 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/20 space-y-4 text-xs">
                <h2 className="font-bold uppercase tracking-wider">
                  Support & Grievance SLA Desk ({(customersData.tickets || []).length})
                </h2>
                <div className="space-y-3">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(customersData.tickets || []).map((tkt: any) => {
                    const draft = ticketReplyMap[tkt.id] || { message: '', isInternal: false };
                    return (
                      <div
                        key={tkt.id}
                        className="p-4 rounded bg-[#F8F5ED] border border-[#18201B]/15 space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <span className="font-mono font-bold">{tkt.ticketNumber}</span> •{' '}
                            <span className="font-bold">{tkt.subject}</span> (Order{' '}
                            {tkt.orderNumber})
                          </div>
                          <span className="px-2 py-0.5 rounded bg-[#18201B] text-[#B28A50] font-mono text-[10px] uppercase">
                            {tkt.status} • SLA Due:{' '}
                            {new Date(tkt.slaDueAt).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                        <div className="space-y-1.5 pl-3 border-l-2 border-[#B28A50]">
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {(tkt.messages || []).map((m: any) => (
                            <div
                              key={m.id}
                              className={`p-2 rounded text-[11px] ${
                                m.isInternalNote
                                  ? 'bg-[#B28A50]/20 border border-[#B28A50]'
                                  : 'bg-[#F2ECE1]'
                              }`}
                            >
                              <span className="font-bold uppercase">
                                {m.isInternalNote ? '[INTERNAL STAFF NOTE] ' : ''}
                                {m.author}:
                              </span>{' '}
                              <span>{m.body}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <input
                            type="text"
                            value={draft.message}
                            onChange={(e) =>
                              setTicketReplyMap({
                                ...ticketReplyMap,
                                [tkt.id]: { ...draft, message: e.target.value },
                              })
                            }
                            placeholder="Write customer reply or internal warehouse note..."
                            className="flex-1 h-8 px-2.5 rounded border border-[#18201B]/25 bg-[#F2ECE1]"
                          />
                          <label className="flex items-center gap-1.5 font-semibold cursor-pointer">
                            <input
                              type="checkbox"
                              checked={draft.isInternal}
                              onChange={(e) =>
                                setTicketReplyMap({
                                  ...ticketReplyMap,
                                  [tkt.id]: { ...draft, isInternal: e.target.checked },
                                })
                              }
                            />
                            <span>Internal Note Only</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              if (!draft.message.trim()) return;
                              handleCustomerAction(
                                {
                                  action: 'reply_ticket',
                                  ticketId: tkt.id,
                                  message: draft.message,
                                  isInternalNote: draft.isInternal,
                                  markResolved: !draft.isInternal,
                                },
                                draft.isInternal
                                  ? 'Saved internal staff note'
                                  : 'Sent public reply & marked resolved'
                              );
                              setTicketReplyMap({
                                ...ticketReplyMap,
                                [tkt.id]: { message: '', isInternal: false },
                              });
                            }}
                            className="h-8 px-3 rounded bg-[#18201B] text-[#F8F5ED] font-bold cursor-pointer"
                          >
                            {draft.isInternal ? 'Add Internal Note' : 'Send Public Reply'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
                {/* Customers List */}
                <div className="p-5 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/20 space-y-3">
                  <h2 className="font-bold uppercase tracking-wider">
                    Customer Directory ({(customersData.customers || []).length})
                  </h2>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(customersData.customers || []).map((c: any) => (
                    <div
                      key={c.id}
                      className="p-3 rounded bg-[#F8F5ED] border border-[#18201B]/15 space-y-1"
                    >
                      <div className="flex justify-between font-bold">
                        <span>
                          {c.name} ({c.city}, {c.state})
                        </span>
                        <span className="font-mono">
                          LTV: ₹{(c.totalSpend || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#18201B]/75">
                        {c.phone} • {c.email} • Orders: {c.ordersCount} • COD Risk: {c.codRiskLevel}
                      </p>
                      <p className="text-[10px] font-mono text-[#18201B]/60">
                        DPDP Consent: Notice {c.consent?.noticeVersion || 'v3_2026'} • WhatsApp:{' '}
                        {c.consent?.whatsappOrderUpdatesOptIn ? 'Opted-In' : 'Off'}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Reviews Moderation */}
                <div className="p-5 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/20 space-y-3">
                  <h2 className="font-bold uppercase tracking-wider">
                    Verified Buyer Reviews ({(customersData.reviews || []).length})
                  </h2>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(customersData.reviews || []).map((rev: any) => (
                    <div
                      key={rev.id}
                      className="p-3 rounded bg-[#F8F5ED] border border-[#18201B]/15 space-y-1.5"
                    >
                      <div className="flex justify-between font-bold">
                        <span>
                          {rev.customerName} ({rev.city}) — {rev.rating}★
                        </span>
                        <span className="font-mono uppercase">{rev.status}</span>
                      </div>
                      <p className="font-semibold">{rev.title}</p>
                      <p className="text-[#18201B]/75">{rev.body || rev.comment}</p>
                      {rev.staffReply && (
                        <p className="text-[11px] italic text-[#18201B]/70 border-l-2 border-[#B28A50] pl-2">
                          Whole/retail Name Response: {rev.staffReply}
                        </p>
                      )}
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() =>
                            handleCustomerAction(
                              { action: 'moderate_review', reviewId: rev.id, status: 'published' },
                              'Review published'
                            )
                          }
                          className="px-2 py-1 rounded bg-[#18201B] text-[#F8F5ED] font-bold cursor-pointer"
                        >
                          Publish
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleCustomerAction(
                              { action: 'moderate_review', reviewId: rev.id, status: 'hidden' },
                              'Review hidden'
                            )
                          }
                          className="px-2 py-1 rounded border border-[#18201B]/30 cursor-pointer"
                        >
                          Hide
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              MODULE 8: GROWTH, HONEST PROMOTIONS & HINGLISH SYNONYMS
             ============================================================== */}
          {activeTab === 'growth' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#18201B]/60">
                  MODULE 8 • HONEST PROMOTIONS, SAMPLE CART TESTER & SEARCH SYNONYMS
                </span>
                <h1 className="font-story text-2xl font-bold mt-0.5">
                  Coupons, Margin-Guarded Offers, Quote Simulator & Hinglish Search Dictionary
                </h1>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
                {/* Create & Toggle Coupons */}
                <div className="p-5 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/20 space-y-4">
                  <h2 className="font-bold uppercase tracking-wider">Active Coupons & Offers</h2>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newCouponForm.code}
                      onChange={(e) =>
                        setNewCouponForm({
                          ...newCouponForm,
                          code: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="CODE"
                      className="h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED] font-mono"
                    />
                    <input
                      type="text"
                      value={newCouponForm.title}
                      onChange={(e) =>
                        setNewCouponForm({ ...newCouponForm, title: e.target.value })
                      }
                      placeholder="Offer Title"
                      className="h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                    />
                    <input
                      type="number"
                      value={newCouponForm.discountValue}
                      onChange={(e) =>
                        setNewCouponForm({
                          ...newCouponForm,
                          discountValue: Number(e.target.value),
                        })
                      }
                      placeholder="Discount Value"
                      className="h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED] font-mono"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handlePromoAction(
                          { action: 'create', ...newCouponForm },
                          `Created coupon ${newCouponForm.code}`
                        )
                      }
                      className="h-9 px-3 rounded bg-[#18201B] text-[#F8F5ED] font-bold cursor-pointer"
                    >
                      + Create Coupon
                    </button>
                  </div>

                  <div className="space-y-2">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {promotions.map((p: any) => {
                      const isEnabled = p.enabled ?? p.active;
                      const minOrder = p.minOrderAmount ?? p.minCartSubtotal ?? 0;
                      return (
                        <div
                          key={p.id}
                          className="p-3 rounded bg-[#F8F5ED] border border-[#18201B]/15 flex items-center justify-between"
                        >
                          <div>
                            <p className="font-mono font-bold">
                              {p.code} — {p.title}
                            </p>
                            <p className="text-[11px] text-[#18201B]/70">
                              Min Cart: ₹{minOrder} • Cap: ₹{p.maxDiscountCap || p.value} • Used:{' '}
                              {p.usedCount} times
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handlePromoAction(
                                { action: 'toggle', promoId: p.id },
                                `Toggled coupon ${p.code}`
                              )
                            }
                            className={`px-2.5 py-1 rounded font-bold cursor-pointer ${
                              isEnabled
                                ? 'bg-[#18201B] text-[#B28A50]'
                                : 'border border-[#18201B]/30 text-[#18201B]/60'
                            }`}
                          >
                            {isEnabled ? 'Active' : 'Paused'}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Interactive Sample Cart Promotion Tester */}
                  <div className="pt-3 border-t border-[#18201B]/15 space-y-2">
                    <p className="font-bold uppercase">Sample Cart Promotion & GST Quote Tester</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoTestCode}
                        onChange={(e) => setPromoTestCode(e.target.value.toUpperCase())}
                        placeholder="Coupon (e.g. WELCOME10)"
                        className="h-8 px-2 rounded border border-[#18201B]/25 bg-[#F8F5ED] font-mono w-36"
                      />
                      <input
                        type="text"
                        value={promoTestPin}
                        onChange={(e) => setPromoTestPin(e.target.value)}
                        placeholder="PIN (110001)"
                        className="h-8 px-2 rounded border border-[#18201B]/25 bg-[#F8F5ED] font-mono w-28"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          const res = await fetch('/api/checkout/quote', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              items: [{ id: 'prod_1', quantity: 2 }],
                              couponCode: promoTestCode,
                              pincode: promoTestPin,
                              paymentMethod: 'razorpay_upi',
                            }),
                          });
                          const data = await res.json();
                          setPromoTestResult(data);
                        }}
                        className="h-8 px-3 rounded bg-[#18201B] text-[#F8F5ED] font-bold cursor-pointer"
                      >
                        Simulate Cart Quote
                      </button>
                    </div>
                    {promoTestResult && (
                      <div className="p-2.5 rounded bg-[#F8F5ED] border border-[#B28A50] font-mono text-[11px]">
                        Subtotal: ₹{promoTestResult.subtotal} | Discount: -₹
                        {promoTestResult.discountTotal} ({promoTestResult.couponMessage || 'OK'}) |
                        Shipping: ₹{promoTestResult.shippingFee} | Grand Total: ₹
                        {promoTestResult.grandTotal} (GST Included: ₹{promoTestResult.taxIncludedTotal})
                      </div>
                    )}
                  </div>
                </div>

                {/* Hinglish Search Synonyms */}
                <div className="p-5 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/20 space-y-4">
                  <h2 className="font-bold uppercase tracking-wider">
                    Indian Hinglish Search Synonyms
                  </h2>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSynonymForm.term}
                      onChange={(e) =>
                        setNewSynonymForm({ ...newSynonymForm, term: e.target.value })
                      }
                      placeholder="Canonical (e.g. sandals)"
                      className="h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED] w-36"
                    />
                    <input
                      type="text"
                      value={newSynonymForm.synonyms}
                      onChange={(e) =>
                        setNewSynonymForm({ ...newSynonymForm, synonyms: e.target.value })
                      }
                      placeholder="Hinglish terms (chappal, jutti, kolhapuri)"
                      className="h-9 px-2.5 rounded border border-[#18201B]/25 bg-[#F8F5ED] flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newSynonymForm.term.trim()) return;
                        handleSettingsAction(
                          {
                            action: 'add_synonym',
                            canonical: newSynonymForm.term.trim(),
                            terms: newSynonymForm.synonyms
                              .split(',')
                              .map((s) => s.trim())
                              .filter(Boolean),
                          },
                          'Added search synonym mapping'
                        );
                        setNewSynonymForm({ term: '', synonyms: '' });
                      }}
                      className="h-9 px-3 rounded bg-[#18201B] text-[#F8F5ED] font-bold cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(settingsData.synonyms || []).map((syn: any, idx: number) => (
                      <div
                        key={syn.canonical || syn.term || idx}
                        className="p-2.5 rounded bg-[#F8F5ED] border border-[#18201B]/15 flex justify-between"
                      >
                        <span className="font-mono font-bold">{syn.canonical || syn.term}</span>
                        <span className="text-[#18201B]/75">
                          → {(syn.terms || syn.synonyms || []).join(', ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              MODULE 9: REPORTS, DUAL-TRUTH BI & SECTION ATTRIBUTION
             ============================================================== */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#18201B]/60">
                  MODULE 9 • BUSINESS TRUTH BI & HOMEPAGE SECTION ATTRIBUTION
                </span>
                <h1 className="font-story text-2xl font-bold mt-0.5">
                  Demand vs Realized Cash, Funnel & Homepage Section Performance
                </h1>
              </div>

              {/* Dual-Truth Financial Reconciliation Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-4 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/15">
                  <p className="text-[11px] uppercase font-bold text-[#18201B]/65">
                    1. Order Demand Placed
                  </p>
                  <p className="text-lg font-bold font-mono mt-1">
                    ₹{(bt.orderValuePlaced || 0).toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-[#18201B]/70">
                    Confirmed Sales: ₹{(bt.confirmedMerchandiseSales || 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="p-4 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/15">
                  <p className="text-[11px] uppercase font-bold text-[#18201B]/65">
                    2. Recognised Ex-Tax + GST
                  </p>
                  <p className="text-lg font-bold font-mono mt-1">
                    ₹{(bt.recognisedRevenueExTax || 0).toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-[#18201B]/70">
                    GST Liability: ₹{(bt.taxCollectedGst || 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="p-4 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/15">
                  <p className="text-[11px] uppercase font-bold text-[#18201B]/65">
                    3. Cash Receipts Verified
                  </p>
                  <p className="text-lg font-bold font-mono mt-1">
                    ₹{(bt.cashReceiptsVerified || 0).toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-[#18201B]/70">
                    COD Pending: ₹{(bt.codPendingRemittance || 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="p-4 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/15">
                  <p className="text-[11px] uppercase font-bold text-[#18201B]/65">
                    4. Contribution Margin
                  </p>
                  <p className="text-lg font-bold font-mono mt-1">
                    ₹{(bt.estimatedContributionMargin || 0).toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-[#18201B]/70">
                    Refunds Completed: ₹{(bt.refundsCompleted || 0).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Storefront Conversion Funnel */}
              {analyticsData?.analytics?.funnel && (
                <div className="p-4 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/20 text-xs">
                  <h2 className="font-bold uppercase tracking-wider mb-3">
                    Storefront Conversion Funnel
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center font-mono">
                    {[
                      ['Sessions', analyticsData.analytics.funnel.sessions],
                      ['Product Views', analyticsData.analytics.funnel.productViews],
                      ['PIN Checks', analyticsData.analytics.funnel.pinChecks],
                      ['Add to Cart', analyticsData.analytics.funnel.addToCart],
                      ['Checkouts', analyticsData.analytics.funnel.checkoutStarted],
                      ['Orders', analyticsData.analytics.funnel.ordersCompleted],
                    ].map(([label, val]) => (
                      <div
                        key={String(label)}
                        className="p-2.5 rounded bg-[#F8F5ED] border border-[#18201B]/10"
                      >
                        <p className="text-[10px] font-sans uppercase text-[#18201B]/65">{label}</p>
                        <p className="text-sm font-bold mt-0.5">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Homepage Section Attribution Table */}
              <div className="p-5 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/20 space-y-3 text-xs">
                <h2 className="font-bold uppercase tracking-wider">
                  Homepage Section Revenue & Click Attribution
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#18201B] text-[#F8F5ED] uppercase text-[11px]">
                      <tr>
                        <th className="p-2.5">Section</th>
                        <th className="p-2.5">Impressions</th>
                        <th className="p-2.5">Clicks</th>
                        <th className="p-2.5">CTR %</th>
                        <th className="p-2.5">Assisted Orders</th>
                        <th className="p-2.5">Attributed Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#18201B]/10 bg-[#F8F5ED]">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {(analyticsData?.analytics?.sectionPerformance || []).map((row: any) => (
                        <tr key={row.sectionId}>
                          <td className="p-2.5 font-bold">{row.name || row.sectionName}</td>
                          <td className="p-2.5 font-mono">
                            {row.visibleImpressions ?? row.impressions}
                          </td>
                          <td className="p-2.5 font-mono">{row.clicks}</td>
                          <td className="p-2.5 font-mono">{row.ctrPercent}%</td>
                          <td className="p-2.5 font-mono">{row.attributedOrders}</td>
                          <td className="p-2.5 font-mono font-bold">
                            ₹{(row.attributedRevenue || 0).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              MODULE 10: SETTINGS, TEAM, AUTOMATIONS & IMMUTABLE AUDIT LOG
             ============================================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#18201B]/15 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#18201B]/60">
                    MODULE 10 • GOVERNANCE, AUTOMATION ENGINE & AUDIT LOG
                  </span>
                  <h1 className="font-story text-2xl font-bold mt-0.5">
                    RBAC Staff, Two-Person Approvals, Automations & Immutable Audit Trail
                  </h1>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleSettingsAction(
                      { action: 'reset_seed' },
                      'Reset database to clean seed state'
                    )
                  }
                  className="px-3.5 py-2 rounded border border-[#18201B] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Reset Demo Seed Data</span>
                </button>
              </div>

              {/* Staff & RBAC Matrix */}
              <div className="p-5 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/20 space-y-4 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-bold uppercase tracking-wider">
                    RBAC Staff Accounts & Location Scopes ({(settingsData.staff || []).length})
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <input
                      type="text"
                      value={newStaffForm.name}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
                      placeholder="Staff Name"
                      className="h-8 px-2 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                    />
                    <input
                      type="email"
                      value={newStaffForm.email}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, email: e.target.value })}
                      placeholder="staff@karigarstore.in"
                      className="h-8 px-2 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                    />
                    <select
                      value={newStaffForm.role}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, role: e.target.value })}
                      className="h-8 px-2 rounded border border-[#18201B]/25 bg-[#F8F5ED]"
                    >
                      <option value="Merchandising">Merchandising</option>
                      <option value="Warehouse">Warehouse</option>
                      <option value="Finance">Finance</option>
                      <option value="Support">Support</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => {
                        if (!newStaffForm.name.trim()) return;
                        handleSettingsAction(
                          { action: 'add_staff', ...newStaffForm },
                          `Added staff member ${newStaffForm.name}`
                        );
                        setNewStaffForm({ ...newStaffForm, name: '', email: '' });
                      }}
                      className="h-8 px-3 rounded bg-[#18201B] text-[#F8F5ED] font-bold cursor-pointer"
                    >
                      + Add Staff
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(settingsData.staff || []).map((stf: any) => (
                    <div
                      key={stf.id}
                      className="p-3 rounded bg-[#F8F5ED] border border-[#18201B]/15 space-y-1"
                    >
                      <div className="flex justify-between font-bold">
                        <span>{stf.name}</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#18201B] text-[#B28A50]">
                          {stf.role}
                        </span>
                      </div>
                      <p className="font-mono text-[11px] text-[#18201B]/75">{stf.email}</p>
                      <p className="text-[10px] text-[#18201B]/65">
                        Scope: {stf.locationScope} • MFA: {stf.mfaEnabled ? 'Enforced' : 'Off'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Event-Driven Automation Rules */}
              <div className="p-5 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/20 space-y-3 text-xs">
                <h2 className="font-bold uppercase tracking-wider">
                  Event-Driven Workflow Automations (IF Trigger → Condition → Action)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(settingsData.automationRules || []).map((rule: any) => (
                    <div
                      key={rule.id}
                      className="p-3.5 rounded bg-[#F8F5ED] border border-[#18201B]/15 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{rule.name}</span>
                        <span className="font-mono text-[11px]">
                          Runs: {rule.runsCount ?? rule.executionCount ?? 0}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#18201B]/75">
                        <strong>IF</strong> {rule.trigger || rule.triggerEvent} •{' '}
                        <strong>WHEN</strong> {rule.condition || rule.conditionSummary} →{' '}
                        <strong>THEN</strong> {rule.action || rule.actionSummary}
                      </p>
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() =>
                            handleSettingsAction(
                              { action: 'toggle_automation', ruleId: rule.id },
                              `Toggled rule ${rule.name}`
                            )
                          }
                          className={`px-2.5 py-1 rounded font-bold cursor-pointer ${
                            rule.enabled
                              ? 'bg-[#18201B] text-[#B28A50]'
                              : 'border border-[#18201B]/30'
                          }`}
                        >
                          {rule.enabled ? 'Enabled' : 'Paused'}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleSettingsAction(
                              { action: 'run_automation_now', ruleId: rule.id },
                              `Triggered rule ${rule.name}`
                            )
                          }
                          className="px-2.5 py-1 rounded border border-[#18201B]/30 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Play className="w-3 h-3" />
                          <span>Test Run</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Immutable Audit Log */}
              <div className="p-5 rounded-[8px] bg-[#F2ECE1] border border-[#18201B]/20 space-y-3 text-xs">
                <h2 className="font-bold uppercase tracking-wider">
                  Immutable Super Admin Audit Trail ({(settingsData.auditLogs || []).length})
                </h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(settingsData.auditLogs || []).slice(0, 30).map((log: any) => (
                    <div
                      key={log.id}
                      className="p-2.5 rounded bg-[#F8F5ED] border border-[#18201B]/10 flex flex-wrap justify-between gap-2"
                    >
                      <div>
                        <span className="font-mono font-bold">
                          [{log.entityType || log.module}]
                        </span>{' '}
                        <span className="font-semibold">{log.action}</span> —{' '}
                        <span>{log.summary}</span>
                      </div>
                      <span className="font-mono text-[11px] text-[#18201B]/65">
                        {log.actor || log.actorEmail} •{' '}
                        {new Date(log.timestamp).toLocaleTimeString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
