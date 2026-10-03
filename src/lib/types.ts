export type CurrencyCode = 'INR';

export interface MoneyAmount {
  amountMinor: number; // Integer paise (e.g., 129900 = ₹1,299.00)
  currency: CurrencyCode;
}

export interface ProductVariant {
  id: string;
  sku: string;
  barcode?: string;
  size: string;
  color: string;
  colorHex?: string;
  material?: string;
  price: number; // in INR ₹ (server also tracks minor units)
  mrp: number;
  costPrice: number;
  weightGrams: number;
  image: string;
  onHand: number;
  reserved: number;
  allocated: number;
  unavailable: number;
  incoming: number;
  lowStockThreshold: number;
  enabled: boolean;
}

export interface LegalMetrologyDeclaration {
  genericName: string;
  manufacturerName: string;
  manufacturerAddress: string;
  packerName: string;
  countryOfOrigin: string;
  netQuantity: string;
  consumerCareEmail: string;
  consumerCarePhone: string;
  hsnCode: string;
  gstRatePercent: number; // e.g., 5, 12, 18
}

export interface ProductRecord {
  id: string;
  slug: string;
  title: string;
  cardTitle?: string;
  materialLabel?: string;
  subtitle: string;
  shortDescription: string;
  description: string;
  productType: 'shirt' | 'kurta' | 'trousers' | 'outerwear' | 'jacket' | 'skirt' | 'coat' | 'bomber' | 'racer' | 'trucker' | 'footwear' | 'accessory' | 'gift';
  brand: string;
  supplierId: string;
  categoryId: string;
  categoryAncestry: string[];
  collectionIds: string[];
  tags: string[];
  status: 'published' | 'draft' | 'archived' | 'scheduled';
  scheduledPublishAt?: string | null;
  price: number; // Base selling price in ₹
  mrp: number; // Maximum Retail Price (inclusive of all taxes)
  costPrice: number;
  badge?: string | null;
  images: {
    id: string;
    url: string;
    mobileUrl?: string;
    alt: string;
    color?: string;
    focalPoint: { x: number; y: number };
  }[];
  variants: ProductVariant[];
  attributes: {
    fabric: string;
    fit: string;
    weaveOrConstruction: string;
    careInstructions: string;
    packageContents: string;
    occasion: string;
    genderScope: 'Men' | 'Women' | 'Unisex';
    sizeSystem: string;
    dimensionsCm: string;
    fragile?: boolean;
  };
  legalMetrology: LegalMetrologyDeclaration;
  returnPolicyClass: '7_day_easy_return' | 'exchange_only' | 'non_returnable_hygiene';
  returnWindowDays: number;
  warrantySummary: string;
  seo: {
    title: string;
    description: string;
    canonicalSlug: string;
    noindex: boolean;
  };
  relatedProductIds: string[];
  goesWellWithIds: string[];
  ratingAverage: number;
  ratingCount: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  revision: number;
  history: {
    revision: number;
    actor: string;
    timestamp: string;
    summary: string;
  }[];
}

export interface CategoryRecord {
  id: string;
  slug: string;
  name: string;
  shortName?: string;
  description: string;
  parentId: string | null;
  ancestry: string[];
  image: string;
  mobileImage?: string;
  imageAlt: string;
  order: number;
  archived: boolean;
  allowedFilters: string[];
  seoTitle: string;
  seoDescription: string;
}

export interface CollectionRule {
  field: 'productType' | 'price' | 'tag' | 'genderScope' | 'fabric' | 'inStock';
  operator: 'equals' | 'less_than_or_equal' | 'greater_than_or_equal' | 'contains';
  value: string | number | boolean;
}

export interface CollectionRecord {
  id: string;
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  campaignTerms?: string;
  bannerImage: string;
  bannerAlt: string;
  mode: 'manual' | 'automatic';
  matchType: 'ALL' | 'ANY';
  rules: CollectionRule[];
  manualProductIds: string[];
  excludedProductIds: string[];
  enabled: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
  order: number;
}

export type CMSSectionType =
  | 'hero_campaign'
  | 'category_shortcuts'
  | 'product_grid'
  | 'story_split'
  | 'product_rail'
  | 'story_people'
  | 'story_craft'
  | 'reviews_service'
  | 'campaign_offer'
  | 'shop_by_need'
  | 'story_local_store'
  | 'recently_viewed'
  | 'faq_accordion'
  | 'promotion_strip';

export interface CMSSection {
  id: string;
  type: CMSSectionType;
  friendlyName: string;
  enabled: boolean;
  order: number;
  revision: number;
  eyebrow?: string;
  heading: string;
  subheading?: string;
  description?: string;
  desktopImage?: string;
  mobileImage?: string;
  imageAlt?: string;
  desktopFocalPoint?: { x: number; y: number };
  mobileFocalPoint?: { x: number; y: number };
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  collectionId?: string;
  productIds?: string[];
  categoryIds?: string[];
  offerId?: string;
  offerCode?: string;
  offerConditions?: string;
  proofLine?: string;
  facts?: { title: string; body: string }[];
  needCards?: { title: string; subtitle: string; href: string; image: string; alt: string }[];
  storeDetails?: {
    city: string;
    neighbourhood: string;
    address: string;
    hours: string;
    phone: string;
    email: string;
    whatsapp: string;
    pickupInfo: string;
    directionsUrl: string;
  };
  backgroundTone: 'ivory' | 'ivory_subtle' | 'charcoal' | 'gold_tint';
  startsAt?: string | null;
  endsAt?: string | null;
  timezone: 'Asia/Kolkata';
  fallbackSectionTitle?: string;
}

export interface GlobalCMSSettings {
  storeName: string;
  storeTagline: string;
  legalEntityName: string;
  gstin: string;
  foundingYear: number;
  announcementBar: {
    enabled: boolean;
    message: string;
    detailsLabel: string;
    detailsHref: string;
    detailsModalText: string;
    startsAt?: string | null;
    endsAt?: string | null;
  };
  header: {
    logoText: string;
    showPinChecker: boolean;
    defaultPin: string;
    navLinks: { label: string; href: string; highlight?: boolean }[];
  };
  footer: {
    aboutBlurb: string;
    address: string;
    phone: string;
    email: string;
    whatsapp: string;
    hours: string;
    grievanceOfficerName: string;
    grievanceOfficerEmail: string;
    showSuperAdminLink: boolean;
    superAdminLinkLabel: string;
  };
  colors: {
    ivory: '#F8F5ED';
    charcoal: '#18201B';
    gold: '#B28A50';
  };
}

export interface CMSReleaseManifest {
  id: string;
  versionNumber: number;
  publishedAt: string;
  publishedBy: string;
  releaseNote: string;
  sectionsSnapshot: CMSSection[];
  globalSettingsSnapshot: GlobalCMSSettings;
}

export type OrderAcceptanceState = 'draft' | 'placed' | 'awaiting_review' | 'confirmed' | 'on_hold' | 'cancelled' | 'closed';
export type PaymentAttemptState = 'created' | 'pending' | 'requires_action' | 'authorised' | 'captured' | 'failed' | 'expired' | 'cancelled' | 'unknown';
export type ManualPaymentState = 'not_applicable' | 'awaiting_submission' | 'submitted' | 'verifying' | 'verified' | 'rejected' | 'amount_mismatch' | 'reversed';
export type CODReceivableState = 'not_applicable' | 'due' | 'collected' | 'remittance_pending' | 'remitted' | 'short' | 'disputed' | 'uncollectible';
export type FulfilmentState = 'unallocated' | 'allocated' | 'picking' | 'packed' | 'ready_for_pickup' | 'partially_fulfilled' | 'fulfilled' | 'cancelled';
export type ShipmentState = 'not_started' | 'label_pending' | 'booked' | 'pickup_scheduled' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'delivery_failed' | 'delayed' | 'lost' | 'damaged' | 'rto_initiated' | 'rto_in_transit' | 'rto_received' | 'cancelled';

export interface OrderLineSnapshot {
  lineId: string;
  productId: string;
  variantId: string;
  sku: string;
  title: string;
  size: string;
  color: string;
  image: string;
  qtyOrdered: number;
  qtyAllocated: number;
  qtyPacked: number;
  qtyShipped: number;
  qtyCancelled: number;
  qtyReturned: number;
  unitPrice: number;
  unitMrp: number;
  unitCost: number;
  allocatedDiscount: number;
  taxableValue: number;
  gstRatePercent: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  lineTotalPayable: number;
  hsnCode: string;
  categorySnapshot: string;
  returnPolicySnapshot: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  idempotencyKey: string;
  accessToken: string; // High-entropy guest order access token
  customerId: string | null;
  isGuest: boolean;
  customer: {
    name: string;
    email: string;
    phone: string;
    gstin?: string;
    businessName?: string;
  };
  shippingAddress: {
    recipientName: string;
    phone: string;
    line1: string;
    locality: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
    country: 'India';
  };
  paymentMethod: 'razorpay' | 'manual_upi' | 'cod';
  // Multi-dimensional states (Section 9)
  acceptanceStatus: OrderAcceptanceState;
  paymentStatus: PaymentAttemptState;
  manualPaymentStatus: ManualPaymentState;
  codStatus: CODReceivableState;
  fulfilmentStatus: FulfilmentState;
  shipmentStatus: ShipmentState;
  customerSummaryStatus: string;
  // Financial breakdown (in ₹ and minor units)
  currency: 'INR';
  subtotal: number;
  discountTotal: number;
  couponCode?: string | null;
  shippingCharge: number;
  codFee: number;
  taxTotal: number;
  cgstTotal: number;
  sgstTotal: number;
  igstTotal: number;
  supplyType: 'intra_state_delhi' | 'intra_state_delhi' | 'inter_state';
  grandTotal: number;
  grandTotalMinor: number; // Integer paise
  refundedTotal: number;
  pendingRefundTotal: number;
  // Payment details
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  manualUpiClaim?: {
    utrReference: string;
    paidAtClaimed: string;
    screenshotNote?: string;
    submittedAt: string;
    verifiedBy?: string;
    verifiedAt?: string;
    verificationNote?: string;
    bankStatementMatchId?: string;
  };
  // Shipment & Warehouse
  warehouseId: string;
  shipment?: {
    carrierName: string;
    awbNumber: string;
    trackingUrl: string;
    bookedAt?: string;
    pickedUpAt?: string;
    deliveredAt?: string;
    estimatedDelivery: string;
    weightGrams: number;
    actualCarrierCost: number;
    ndrReason?: string;
    ndrResolutionNote?: string;
  };
  invoiceNumber?: string;
  invoiceIssuedAt?: string;
  lines: OrderLineSnapshot[];
  timeline: {
    id: string;
    timestamp: string;
    dimension: string;
    fromState: string;
    toState: string;
    actor: string;
    reason: string;
    source: 'customer' | 'admin' | 'webhook' | 'automation' | 'system';
  }[];
  attributedBannerId?: string | null;
  attributedSectionId?: string | null;
  createdAt: string;
  updatedAt: string;
}
