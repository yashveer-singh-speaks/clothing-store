import fs from 'fs';
import path from 'path';
import {
  ProductRecord,
  CategoryRecord,
  CollectionRecord,
  CMSSection,
  GlobalCMSSettings,
  CMSReleaseManifest,
  OrderRecord,
} from './types';
import {
  initialGlobalSettings,
  initialCategories,
  initialCollections,
  initialProducts,
  initialCMSSections,
  initialReleases,
  initialPincodes,
  initialOrders,
  initialReviews,
  initialPromotions,
  initialWarehouses,
  initialSuppliers,
  initialPurchaseOrders,
  initialTickets,
  initialReturns,
  initialStaff,
  initialApprovals,
  initialAutomationRules,
  initialAnalyticsRollups,
} from './seed';

const dbPath = path.join(process.cwd(), 'data.json');

export interface DatabaseSchema {
  schemaVersion: number;
  products: ProductRecord[];
  categories: CategoryRecord[];
  collections: CollectionRecord[];
  cms: {
    globalDraft: GlobalCMSSettings;
    globalPublished: GlobalCMSSettings;
    draftSections: CMSSection[];
    publishedSections: CMSSection[];
    releases: CMSReleaseManifest[];
    activeReleaseId: string;
  };
  pincodes: typeof initialPincodes;
  orders: OrderRecord[];
  reviews: typeof initialReviews;
  promotions: typeof initialPromotions;
  warehouses: typeof initialWarehouses;
  suppliers: typeof initialSuppliers;
  purchaseOrders: typeof initialPurchaseOrders;
  stockMovements: {
    id: string;
    timestamp: string;
    sku: string;
    productId: string;
    variantId: string;
    warehouseId: string;
    type: 'receipt' | 'reservation' | 'release' | 'allocation' | 'shipment' | 'return_quarantine' | 'restock' | 'damage' | 'count_correction' | 'transfer';
    qtyDelta: number;
    reason: string;
    actor: string;
  }[];
  tickets: typeof initialTickets;
  returns: typeof initialReturns;
  refunds: {
    id: string;
    refundNumber: string;
    orderId: string;
    orderNumber: string;
    amount: number;
    method: 'original_razorpay' | 'manual_bank_upi' | 'store_credit';
    reason: string;
    status: 'requested' | 'approved' | 'completed' | 'failed';
    creditNoteNumber?: string;
    requestedBy: string;
    approvedBy?: string;
    createdAt: string;
  }[];
  customers: {
    id: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    segment: 'Repeat Buyer' | 'First-Time Buyer' | 'High Value' | 'Lapsed';
    ordersCount: number;
    totalSpent: number;
    loyaltyPoints: number;
    storeCreditBalance: number;
    marketingConsent: boolean;
    analyticsConsent: boolean;
    privacyRequests: { id: string; type: 'data_export' | 'account_deletion'; status: string; createdAt: string }[];
  }[];
  staff: typeof initialStaff;
  approvals: typeof initialApprovals;
  automationRules: typeof initialAutomationRules;
  analytics: typeof initialAnalyticsRollups;
  analyticsEvents: any[];
  auditLogs: {
    id: string;
    timestamp: string;
    actor: string;
    action: string;
    entityType: string;
    entityId: string;
    summary: string;
  }[];
  synonyms: { canonical: string; terms: string[] }[];
}

function buildInitialDatabase(): DatabaseSchema {
  return {
    schemaVersion: 2,
    products: JSON.parse(JSON.stringify(initialProducts)),
    categories: JSON.parse(JSON.stringify(initialCategories)),
    collections: JSON.parse(JSON.stringify(initialCollections)),
    cms: {
      globalDraft: JSON.parse(JSON.stringify(initialGlobalSettings)),
      globalPublished: JSON.parse(JSON.stringify(initialGlobalSettings)),
      draftSections: JSON.parse(JSON.stringify(initialCMSSections)),
      publishedSections: JSON.parse(JSON.stringify(initialCMSSections)),
      releases: JSON.parse(JSON.stringify(initialReleases)),
      activeReleaseId: 'rel_v2',
    },
    pincodes: JSON.parse(JSON.stringify(initialPincodes)),
    orders: JSON.parse(JSON.stringify(initialOrders)),
    reviews: JSON.parse(JSON.stringify(initialReviews)),
    promotions: JSON.parse(JSON.stringify(initialPromotions)),
    warehouses: JSON.parse(JSON.stringify(initialWarehouses)),
    suppliers: JSON.parse(JSON.stringify(initialSuppliers)),
    purchaseOrders: JSON.parse(JSON.stringify(initialPurchaseOrders)),
    stockMovements: [
      {
        id: 'mov_1',
        timestamp: '2026-09-20T14:30:00+05:30',
        sku: 'KRG-SH-MLC-CH-M',
        productId: 'prod_1',
        variantId: 'var_p1_ch_m',
        warehouseId: 'wh_blr_main',
        type: 'receipt',
        qtyDelta: 20,
        reason: 'Received Erode Loom Batch #EL-904 into BIN-SHIRTS-A1',
        actor: 'warehouse.del@karigarstore.in',
      },
      {
        id: 'mov_2',
        timestamp: '2026-09-27T09:15:00+05:30',
        sku: 'KRG-TR-CHN-KH-32',
        productId: 'prod_5',
        variantId: 'var_p5_kh_32',
        warehouseId: 'wh_blr_main',
        type: 'allocation',
        qtyDelta: -1,
        reason: 'Allocated to Order KRG-2026-1003',
        actor: 'system:checkout',
      },
    ],
    tickets: JSON.parse(JSON.stringify(initialTickets)),
    returns: JSON.parse(JSON.stringify(initialReturns)),
    refunds: [
      {
        id: 'ref_101',
        refundNumber: 'RFD-2026-101',
        orderId: 'ord_1001',
        orderNumber: 'KRG-2026-1001',
        amount: 400,
        method: 'original_razorpay',
        reason: 'Goodwill bundle adjustment requested by customer',
        status: 'completed',
        creditNoteNumber: 'CN-2627-0012',
        requestedBy: 'grievance@karigarstore.in',
        approvedBy: 'finance@karigarstore.in',
        createdAt: '2026-09-25T16:00:00+05:30',
      },
    ],
    customers: [
      {
        id: 'cust_1',
        name: 'Rahul Mehta',
        email: 'rahul.mehta@example.in',
        phone: '+91 98201 11223',
        city: 'Mumbai',
        segment: 'Repeat Buyer',
        ordersCount: 3,
        totalSpent: 7890,
        loyaltyPoints: 390,
        storeCreditBalance: 0,
        marketingConsent: true,
        analyticsConsent: true,
        privacyRequests: [],
      },
      {
        id: 'cust_2',
        name: 'Ananya Nair',
        email: 'ananya.nair@example.in',
        phone: '+91 98450 55667',
        city: 'New Delhi',
        segment: 'First-Time Buyer',
        ordersCount: 1,
        totalSpent: 1699,
        loyaltyPoints: 85,
        storeCreditBalance: 250,
        marketingConsent: false,
        analyticsConsent: true,
        privacyRequests: [],
      },
      {
        id: 'cust_3',
        name: 'Vikramaditya Singh',
        email: 'vikram.singh@example.in',
        phone: '+91 98111 22334',
        city: 'New Delhi',
        segment: 'High Value',
        ordersCount: 5,
        totalSpent: 14250,
        loyaltyPoints: 710,
        storeCreditBalance: 0,
        marketingConsent: true,
        analyticsConsent: false,
        privacyRequests: [],
      },
    ],
    staff: JSON.parse(JSON.stringify(initialStaff)),
    approvals: JSON.parse(JSON.stringify(initialApprovals)),
    automationRules: JSON.parse(JSON.stringify(initialAutomationRules)),
    analytics: JSON.parse(JSON.stringify(initialAnalyticsRollups)),
    analyticsEvents: [],
    auditLogs: [
      {
        id: 'aud_1',
        timestamp: '2026-09-27T12:00:00+05:30',
        actor: 'superadmin@store.com',
        action: 'cms.publish',
        entityType: 'cms_release',
        entityId: 'rel_v2',
        summary: 'Published Release v2: 13-section commerce + 4 business story homepage rhythm.',
      },
    ],
    synonyms: [
      { canonical: 'shirt', terms: ['shirt', 'shirts', 'linen', 'oxford', 'poplin', 'top', 'tee', 'bush shirt', 'kamij'] },
      { canonical: 'kurta', terms: ['kurta', 'kurtas', 'tunic', 'mandarin', 'ethnic', 'kutch', 'handloom', 'festive'] },
      { canonical: 'trousers', terms: ['trousers', 'chinos', 'pants', 'pant', 'bottoms', 'khaki', 'commuter', 'patloon'] },
      { canonical: 'footwear', terms: ['footwear', 'shoes', 'sandals', 'kolhapuri', 'jootis', 'chappal', 'sneakers', 'slippers'] },
      { canonical: 'accessory', terms: ['accessories', 'bag', 'tote', 'laptop bag', 'belt', 'leather belt', 'jhola', 'gift'] },
      { canonical: 'outerwear', terms: ['jacket', 'overshirt', 'monsoon', 'raincoat', 'coat', 'waxed'] },
    ],
  };
}

export function getDB(): DatabaseSchema {
  try {
    if (!fs.existsSync(dbPath)) {
      const initial = buildInitialDatabase();
      fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2));
      return initial;
    }
    const raw = fs.readFileSync(dbPath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.schemaVersion !== 2 || !parsed.cms || !parsed.cms.publishedSections) {
      const upgraded = buildInitialDatabase();
      fs.writeFileSync(dbPath, JSON.stringify(upgraded, null, 2));
      return upgraded;
    }
    return parsed as DatabaseSchema;
  } catch (err) {
    const fallback = buildInitialDatabase();
    fs.writeFileSync(dbPath, JSON.stringify(fallback, null, 2));
    return fallback;
  }
}

export function saveDB(data: DatabaseSchema) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export function resetDBToSeed(): DatabaseSchema {
  const fresh = buildInitialDatabase();
  saveDB(fresh);
  return fresh;
}

export function getAvailableToPromise(variant: {
  onHand: number;
  reserved: number;
  allocated: number;
  unavailable: number;
}): number {
  return Math.max(0, variant.onHand - variant.reserved - variant.allocated - variant.unavailable);
}

export function resolveCollectionProducts(db: DatabaseSchema, collection: CollectionRecord): ProductRecord[] {
  const publishedProducts = db.products.filter((p) => p.status === 'published');
  let matched: ProductRecord[] = [];

  if (collection.mode === 'manual') {
    matched = collection.manualProductIds
      .map((id) => publishedProducts.find((p) => p.id === id))
      .filter((p): p is ProductRecord => Boolean(p));
  } else {
    matched = publishedProducts.filter((product) => {
      if (!collection.rules || collection.rules.length === 0) return true;
      const results = collection.rules.map((rule) => {
        if (rule.field === 'price') {
          if (rule.operator === 'less_than_or_equal') return product.price <= Number(rule.value);
          if (rule.operator === 'greater_than_or_equal') return product.price >= Number(rule.value);
          return product.price === Number(rule.value);
        }
        if (rule.field === 'productType') {
          return product.productType === String(rule.value);
        }
        if (rule.field === 'tag') {
          return product.tags.includes(String(rule.value));
        }
        if (rule.field === 'genderScope') {
          return product.attributes.genderScope === String(rule.value);
        }
        if (rule.field === 'inStock') {
          const totalAtp = product.variants.reduce((sum, v) => sum + getAvailableToPromise(v), 0);
          return totalAtp > 0;
        }
        return true;
      });
      return collection.matchType === 'ALL' ? results.every(Boolean) : results.some(Boolean);
    });
  }

  if (collection.excludedProductIds && collection.excludedProductIds.length > 0) {
    matched = matched.filter((p) => !collection.excludedProductIds.includes(p.id));
  }

  return matched;
}

export function checkPinServiceability(db: DatabaseSchema, pincode: string) {
  const clean = (pincode || '').trim();
  if (!/^[1-9][0-9]{5}$/.test(clean)) {
    return {
      valid: false,
      serviceable: false,
      message: 'Please enter a valid 6-digit Indian PIN code (cannot start with 0).',
    };
  }
  const exact = db.pincodes.find((p) => p.pincode === clean);
  if (exact) {
    return {
      valid: true,
      serviceable: true,
      ...exact,
      confirmationNeeded: false,
    };
  }
  // Prefix-based zone inference for other valid 6-digit Indian PINs
  const prefix = clean.substring(0, 2);
  const stateMap: Record<string, { state: string; city: string; transitDays: string; cod: boolean }> = {
    '56': { state: 'Delhi', city: 'Delhi Circle', transitDays: '2–3 business days', cod: true },
    '57': { state: 'Delhi', city: 'Mysuru / Coastal KA', transitDays: '2–4 business days', cod: true },
    '40': { state: 'Maharashtra', city: 'Mumbai Metropolitan', transitDays: '2–4 business days', cod: true },
    '41': { state: 'Maharashtra', city: 'Pune / Western MH', transitDays: '3–4 business days', cod: true },
    '11': { state: 'Delhi', city: 'Delhi NCR', transitDays: '3–5 business days', cod: true },
    '12': { state: 'Haryana', city: 'Gurugram / Faridabad', transitDays: '3–5 business days', cod: true },
    '20': { state: 'Uttar Pradesh', city: 'Noida / Western UP', transitDays: '3–5 business days', cod: true },
    '60': { state: 'Tamil Nadu', city: 'Chennai / TN Circle', transitDays: '2–4 business days', cod: true },
    '64': { state: 'Tamil Nadu', city: 'Coimbatore / Erode', transitDays: '2–3 business days', cod: true },
    '50': { state: 'Telangana', city: 'Hyderabad Circle', transitDays: '2–4 business days', cod: true },
    '38': { state: 'Gujarat', city: 'Ahmedabad / Gujarat', transitDays: '3–5 business days', cod: true },
    '37': { state: 'Gujarat', city: 'Kutch / Bhuj', transitDays: '4–6 business days', cod: true },
    '70': { state: 'West Bengal', city: 'Kolkata Circle', transitDays: '4–6 business days', cod: true },
    '30': { state: 'Rajasthan', city: 'Jaipur / Rajasthan', transitDays: '4–5 business days', cod: true },
    '68': { state: 'Kerala', city: 'Kochi / Kerala', transitDays: '3–5 business days', cod: true },
  };
  const inferred = stateMap[prefix];
  if (inferred) {
    return {
      valid: true,
      serviceable: true,
      pincode: clean,
      city: inferred.city,
      state: inferred.state,
      zone: `${inferred.state} Standard Zone`,
      prepaid: true,
      cod: inferred.cod,
      reversePickup: true,
      maxWeightGrams: 12000,
      transitDays: inferred.transitDays,
      codFee: 40,
      confirmationNeeded: false,
    };
  }
  return {
    valid: true,
    serviceable: true,
    pincode: clean,
    city: 'Serviceable India Post / Surface Hub',
    state: 'India',
    zone: 'Rest of India Surface',
    prepaid: true,
    cod: false,
    reversePickup: false,
    maxWeightGrams: 5000,
    transitDays: '5–8 business days (Prepaid supported; dispatch confirmed within 24h)',
    codFee: 0,
    confirmationNeeded: true,
  };
}

export function calculateServerQuote(
  db: DatabaseSchema,
  params: {
    items: { productId: string; variantId?: string; quantity: number }[];
    pincode?: string;
    couponCode?: string;
    paymentMethod?: 'razorpay' | 'manual_upi' | 'cod';
  }
) {
  let subtotal = 0;
  let mrpTotal = 0;
  let shirtKurtaCount = 0;
  const quotedLines: any[] = [];
  const stockErrors: string[] = [];

  for (const reqItem of params.items || []) {
    const product = db.products.find((p) => p.id === reqItem.productId);
    if (!product || product.status !== 'published') {
      stockErrors.push(`Product ${reqItem.productId} is unavailable.`);
      continue;
    }
    const variant =
      (reqItem.variantId && product.variants.find((v) => v.id === reqItem.variantId)) ||
      product.variants[0];
    if (!variant || !variant.enabled) {
      stockErrors.push(`Selected option for ${product.title} is unavailable.`);
      continue;
    }
    const atp = getAvailableToPromise(variant);
    if (atp < reqItem.quantity) {
      stockErrors.push(
        `Only ${atp} unit(s) of ${product.title} (${variant.color} / ${variant.size}) available in stock.`
      );
    }
    const lineTotal = variant.price * reqItem.quantity;
    const lineMrp = variant.mrp * reqItem.quantity;
    subtotal += lineTotal;
    mrpTotal += lineMrp;
    if (product.productType === 'shirt' || product.productType === 'kurta') {
      shirtKurtaCount += reqItem.quantity;
    }
    quotedLines.push({
      productId: product.id,
      variantId: variant.id,
      sku: variant.sku,
      title: product.title,
      size: variant.size,
      color: variant.color,
      image: variant.image || product.images[0]?.url || '/images/prod-shirt-charcoal.svg',
      quantity: reqItem.quantity,
      unitPrice: variant.price,
      unitMrp: variant.mrp,
      unitCost: variant.costPrice,
      lineSubtotal: lineTotal,
      gstRatePercent: product.legalMetrology.gstRatePercent,
      hsnCode: product.legalMetrology.hsnCode,
      categoryName: db.categories.find((c) => c.id === product.categoryId)?.name || 'Apparel',
      returnPolicyClass: product.returnPolicyClass,
      availableStock: atp,
    });
  }

  // Deterministic Promotion & Coupon Engine
  let discountTotal = 0;
  let appliedCoupon: string | null = null;
  let couponExplanation: string | null = null;

  const requestedCode = (params.couponCode || '').trim().toUpperCase();
  if (requestedCode) {
    const promo = db.promotions.find((p) => p.code.toUpperCase() === requestedCode && p.enabled);
    if (!promo) {
      couponExplanation = `Coupon "${requestedCode}" is not recognized or has expired.`;
    } else if (subtotal < promo.minOrderAmount) {
      couponExplanation = `Add ₹${promo.minOrderAmount - subtotal} more to qualify for ${promo.code} (minimum spend ₹${promo.minOrderAmount}).`;
    } else if (promo.usedCount >= promo.usageLimit) {
      couponExplanation = `Coupon "${requestedCode}" has reached its redemption limit.`;
    } else {
      if (promo.type === 'fixed_amount') {
        discountTotal = Math.min(promo.value, promo.maxDiscountCap, subtotal);
      } else if (promo.type === 'percentage') {
        discountTotal = Math.min(Math.round((subtotal * promo.value) / 100), promo.maxDiscountCap);
      }
      appliedCoupon = promo.code;
      couponExplanation = `Applied ${promo.code}: Saved ₹${discountTotal}.`;
    }
  } else {
    // Check automatic bundle offer (FESTIVE500: 2+ shirts/kurtas and subtotal >= 2500)
    const autoPromo = db.promotions.find((p) => p.autoApply && p.enabled);
    if (autoPromo && subtotal >= autoPromo.minOrderAmount && shirtKurtaCount >= 2) {
      discountTotal = Math.min(autoPromo.value, autoPromo.maxDiscountCap, subtotal);
      appliedCoupon = autoPromo.code;
      couponExplanation = `Auto-applied Wardrobe Bundle (${autoPromo.code}): ₹${discountTotal} off on 2+ shirts/kurtas!`;
    }
  }

  const netMerchandiseValue = Math.max(0, subtotal - discountTotal);
  const freeShippingThreshold = 999;
  const shippingCharge = subtotal === 0 ? 0 : netMerchandiseValue >= freeShippingThreshold ? 0 : 79;
  const amountForFreeShipping = Math.max(0, freeShippingThreshold - netMerchandiseValue);

  const pinInfo = params.pincode ? checkPinServiceability(db, params.pincode) : null;
  const codEligible = pinInfo ? Boolean(pinInfo.serviceable && pinInfo.cod && netMerchandiseValue <= 10000) : true;
  const codFee = params.paymentMethod === 'cod' && subtotal > 0 ? 40 : 0;

  const isIntraState = !pinInfo || (pinInfo as any).state === 'Delhi';
  let taxTotal = 0;
  let cgstTotal = 0;
  let sgstTotal = 0;
  let igstTotal = 0;

  // Allocate discounts proportionally across lines and calculate tax-inclusive GST breakdown
  const finalLines = quotedLines.map((line) => {
    const share = subtotal > 0 ? line.lineSubtotal / subtotal : 0;
    const lineDiscount = Math.round(discountTotal * share);
    const linePayable = Math.max(0, line.lineSubtotal - lineDiscount);
    const rate = line.gstRatePercent || 12;
    const taxableValue = Math.round(linePayable / (1 + rate / 100));
    const lineTax = linePayable - taxableValue;
    const cgst = isIntraState ? Math.floor(lineTax / 2) : 0;
    const sgst = isIntraState ? lineTax - cgst : 0;
    const igst = isIntraState ? 0 : lineTax;

    taxTotal += lineTax;
    cgstTotal += cgst;
    sgstTotal += sgst;
    igstTotal += igst;

    return {
      ...line,
      allocatedDiscount: lineDiscount,
      taxableValue,
      cgstAmount: cgst,
      sgstAmount: sgst,
      igstAmount: igst,
      lineTotalPayable: linePayable,
    };
  });

  const grandTotal = netMerchandiseValue + shippingCharge + codFee;

  return {
    quoteId: `qt_${Date.now()}`,
    calculationVersion: '2026.09.v2',
    currency: 'INR' as const,
    subtotal,
    mrpTotal,
    mrpSavings: Math.max(0, mrpTotal - subtotal),
    discountTotal,
    appliedCoupon,
    couponExplanation,
    shippingCharge,
    freeShippingThreshold,
    amountForFreeShipping,
    codEligible,
    codFee,
    taxTotal,
    cgstTotal,
    sgstTotal,
    igstTotal,
    supplyType: isIntraState ? ('intra_state_delhi' as const) : ('inter_state' as const),
    grandTotal,
    grandTotalMinor: grandTotal * 100,
    lines: finalLines,
    stockErrors,
    pinInfo,
    valid: stockErrors.length === 0 && quotedLines.length > 0,
  };
}

export function validateCMSForPublication(db: DatabaseSchema) {
  const issues: { severity: 'error' | 'warning'; sectionId: string; message: string }[] = [];
  const sections = db.cms.draftSections;

  const enabledSections = sections.filter((s) => s.enabled);
  if (enabledSections.length === 0) {
    issues.push({
      severity: 'error',
      sectionId: 'global',
      message: 'At least one homepage section must be enabled before publishing.',
    });
  }

  let promoCount = 0;
  for (const sec of enabledSections) {
    if (!sec.heading || sec.heading.trim().length < 3) {
      issues.push({
        severity: 'error',
        sectionId: sec.id,
        message: `Section "${sec.friendlyName}" is missing a valid heading.`,
      });
    }
    if (
      (sec.type === 'hero_campaign' || sec.type === 'story_split' || sec.type === 'story_people' || sec.type === 'story_local_store') &&
      (!sec.imageAlt || sec.imageAlt.trim().length < 5)
    ) {
      issues.push({
        severity: 'error',
        sectionId: sec.id,
        message: `Section "${sec.friendlyName}" requires descriptive image alt text for accessibility (WCAG 2.2 AA).`,
      });
    }
    if (sec.primaryCtaLabel && (!sec.primaryCtaHref || !sec.primaryCtaHref.startsWith('/')) && !sec.primaryCtaHref?.startsWith('#')) {
      issues.push({
        severity: 'error',
        sectionId: sec.id,
        message: `Section "${sec.friendlyName}" has a button label ("${sec.primaryCtaLabel}") without a valid internal destination route.`,
      });
    }
    if (sec.type === 'campaign_offer' || sec.type === 'promotion_strip') {
      promoCount++;
    }
    if (sec.heading && sec.heading.length > 75) {
      issues.push({
        severity: 'warning',
        sectionId: sec.id,
        message: `Heading in "${sec.friendlyName}" exceeds 75 characters and may wrap to 4+ lines on 360px mobile screens.`,
      });
    }
  }

  if (promoCount > 2) {
    issues.push({
      severity: 'warning',
      sectionId: 'global',
      message: `${promoCount} promotional modules are active simultaneously. UI/UX specification recommends keeping promotions restrained.`,
    });
  }

  return {
    canPublish: !issues.some((i) => i.severity === 'error'),
    issues,
  };
}
