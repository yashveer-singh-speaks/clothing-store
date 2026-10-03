# Custom Ecommerce Platform: Master Product Blueprint

Research date: 27 September 2026. Initial market: India. Product scope: clothing, footwear, accessories, and other physical goods. Document status: product and architecture proposal, ready to turn into design specifications and development tickets.

## How to use this document

This blueprint describes a store operated by one merchant, with multiple staff and warehouses. It does not assume a marketplace with independent sellers. Marketplace onboarding, seller payouts, and marketplace tax obligations require a separate business model decision.

The final service restrictions in the brief take precedence over earlier requests for integrations. Features remain in the blueprint, but their delivery mode is explicit: custom code, permitted service, manual operation, or deferred because an additional service would be required.

Priority labels: **Essential** means launch requirement; **Important** means the next release; **Advanced** means mature operations; **Optional** means business dependent; **Unnecessary** means excluded without a demonstrated need. Priorities express dependency and usefulness, not a development budget limit.

Sources are linked in the research register at the end. Platform facts are distinguished from our design recommendations. Competitor documentation verifies capabilities, but does not prove how frequently users struggle with them. Where no representative usability study was found, difficulties are explicitly labelled design risks, not established customer sentiment. Detailed workflows, schemas, targets, and defaults below are proposals for our system.

## Contents

1. [1. Product direction and nonnegotiable decisions](#1-product-direction-and-nonnegotiable-decisions)
1. [2. Research findings and competitor lessons](#2-research-findings-and-competitor-lessons)
1. [3. Store structure and catalogue information architecture](#3-store-structure-and-catalogue-information-architecture)
1. [4. Customer website: pages and behaviour](#4-customer-website-pages-and-behaviour)
1. [5. Product management and publishing](#5-product-management-and-publishing)
1. [6. Accounts, authentication, and privacy controls](#6-accounts-authentication-and-privacy-controls)
1. [7. Cart, checkout, and pricing](#7-cart-checkout-and-pricing)
1. [8. Payments, reconciliation, and financial controls](#8-payments-reconciliation-and-financial-controls)
1. [9. Order lifecycle and state model](#9-order-lifecycle-and-state-model)
1. [10. Beginner friendly Super Admin Dashboard](#10-beginner-friendly-super-admin-dashboard)
1. [11. Built in CMS and website editor](#11-built-in-cms-and-website-editor)
1. [12. Inventory, procurement, and warehouse management](#12-inventory-procurement-and-warehouse-management)
1. [13. Shipping and fulfilment under the restricted service list](#13-shipping-and-fulfilment-under-the-restricted-service-list)
1. [14. Returns, exchanges, refunds, and warranty](#14-returns-exchanges-refunds-and-warranty)
1. [15. Staff, permissions, and approvals](#15-staff-permissions-and-approvals)
1. [16. Customer management and support](#16-customer-management-and-support)
1. [17. Promotions, loyalty, and growth](#17-promotions-loyalty-and-growth)
1. [18. Reviews, questions, and notifications](#18-reviews-questions-and-notifications)
1. [19. Search, discovery, and personalisation](#19-search-discovery-and-personalisation)
1. [20. AI with NVIDIA Nemotron](#20-ai-with-nvidia-nemotron)
1. [21. First party analytics: the main business intelligence system](#21-first-party-analytics-the-main-business-intelligence-system)
1. [22. SEO and public product discovery](#22-seo-and-public-product-discovery)
1. [23. Performance and accessibility](#23-performance-and-accessibility)
1. [24. Security, privacy, fraud, and Indian compliance](#24-security-privacy-fraud-and-indian-compliance)
1. [25. Tax, invoices, accounting, and money model](#25-tax-invoices-accounting-and-money-model)
1. [26. Technical architecture and data model](#26-technical-architecture-and-data-model)
1. [27. API contracts, integrations, and automation](#27-api-contracts-integrations-and-automation)
1. [28. Infrastructure, scale, and reliability](#28-infrastructure-scale-and-reliability)
1. [29. Mobile, languages, and international readiness](#29-mobile-languages-and-international-readiness)
1. [30. Complete customer and staff journeys](#30-complete-customer-and-staff-journeys)
1. [31. Requirements added beyond the original list](#31-requirements-added-beyond-the-original-list)
1. [32. Feature prioritisation and rationale](#32-feature-prioritisation-and-rationale)
1. [33. Development milestones and reviewable outputs](#33-development-milestones-and-reviewable-outputs)
1. [34. Acceptance, testing, and release quality](#34-acceptance-testing-and-release-quality)
1. [35. Decision register, risks, and operational ownership](#35-decision-register-risks-and-operational-ownership)
1. [36. Coverage map to the original brief](#36-coverage-map-to-the-original-brief)
1. [Research source register](#research-source-register)

## 1. Product direction and nonnegotiable decisions

Build an original commerce application with a customer website, task focused administration, structured website editor, transaction processing, warehouse workflows, support, and analytics. The owner should manage routine business through this application without opening Firebase or editing code.

1. Use Next.js, React, JavaScript, semantic HTML, and CSS. TypeScript is a recommended optional enhancement for contracts and correctness, not a replacement for the requested stack. Do not use Three.js or decorative 3D.
2. Use Firebase Authentication, Firestore, Cloud Storage, and suitable Firebase backend capabilities. Firebase and hosting are not assumed to be free at production scale.
3. Write our own catalogue, CMS, checkout orchestration, inventory, order management, promotion engine, CRM, support, analytics, and automation logic.
4. Permit Razorpay online checkout, manual UPI QR payments, and COD. Payments, refunds, and bank settlements are different records.
5. Use Google Analytics only as an optional overview. Our event pipeline and financial records power the main dashboard.
6. Make every AI capability optional. Core shopping and operations must work when NVIDIA is unavailable.
7. Keep advanced capabilities accessible through progressive disclosure. Do not maintain two incompatible beginner and expert applications.
8. Preserve historical order, tax, product, price, policy, and category snapshots. Changing today's product must not rewrite yesterday's sale.
9. Treat customer privacy, accessibility, recovery, and reconciliation as product requirements.
10. Store monetary amounts as integer minor units with explicit currency. Never use floating point arithmetic for payment totals.

### 1.1 What the service restriction actually allows

| Capability | Delivery under current rules | Important boundary |
| --- | --- | --- |
| Authentication | Firebase email/password, Google sign in, supported email links; optional Firebase phone authentication | Phone messages have quotas and costs. Email OTP is not interchangeable with native Firebase email links. |
| Admin MFA | Firebase Authentication with Identity Platform and TOTP, subject to configuration | An authenticator app is a security credential tool, not a commerce SaaS dependency. Do not write our own cryptography. |
| Commerce and CMS | Our code with Firebase data | No Shopify, WooCommerce, headless commerce SaaS, or external CMS runtime. |
| Search | Our search API and merchandising logic; evaluate Firestore Enterprise text search | Standard and Enterprise capabilities differ. Do not assume every search feature exists automatically. |
| Payments | Razorpay, manually verified UPI, COD ledger | Bank and payment infrastructure cannot be recreated with application code. |
| Courier operations | Manual booking, AWB entry, document upload, CSV imports, reconciliation queues | No automatic carrier API, live serviceability, label purchase, pickup booking, or tracking feed in the permitted list. |
| Email | Firebase authentication emails only by default; commerce messages in the website | Firebase's Trigger Email extension requires SMTP. General order and marketing email needs an explicitly permitted mail transport. [S20] |
| SMS | Firebase authentication messages where enabled | Arbitrary order or promotional SMS requires a separate delivery service and applicable registration. Deferred. |
| WhatsApp | Optional user initiated contact link and manually composed support replies | Automated outbound WhatsApp needs Meta infrastructure and permission outside the current list. Even manual use assumes the business has a WhatsApp account. |
| Push | Firebase Cloud Messaging and supported browser/device push infrastructure | Consent and platform support apply. Native Apple delivery depends on Apple push credentials if an iOS app is later approved. |
| AI | Server side adapter for the permitted NVIDIA Nemotron endpoint | NVIDIA describes free serverless access as development access. Do not assume unlimited production entitlement, a fixed quota, or an SLA. [S21] |
| Tax reporting | Own invoice generation, exports, manual official portal submissions | A locally generated PDF cannot create a government IRN or replace mandatory external reporting. |
| CRM, marketing, support | Our profiles, segments, tickets, campaign rules, and message drafts | Delivery through blocked channels stays disabled, not simulated as sent. |
| Hosting infrastructure | Hosting CDN, compute, TLS, logs, secrets, jobs and backups needed to operate our code | Firebase uses underlying Google Cloud services. Inventory these dependencies rather than claiming there are no external services. |

Open source libraries installed in our code are compatible with ownership of the application. Hosted SaaS dependencies are not. Review licences and security. If the intended restriction also prohibits local libraries, that changes the implementation substantially and should be resolved before coding.

### 1.2 Honest product limits

The strict service list can support a complete store with manual logistics and in site support. It cannot provide fully automated physical delivery, bank verification of an unrelated static QR, or arbitrary email, SMS, and WhatsApp delivery by code alone. Manual workflows are real supported workflows with staffing requirements, deadlines, and audit trails. They are not described as integrations.

No external analytics warehouse, search SaaS, CRM SaaS, automation SaaS, ERP, or accounting API is part of the default architecture. Export files and internal adapter interfaces preserve future options without activating them.

## 2. Research findings and competitor lessons

### 2.1 Commerce platforms

| Reference | Verified capability or workflow | What to learn | Friction, limitation, or design risk | Our decision |
| --- | --- | --- | --- | --- |
| Shopify | Theme editing uses templates, sections, and blocks. Inventory distinguishes available, committed, unavailable, and incoming quantities. [S01, S02] | Structured editing and meaningful stock states | Theme supplied block types constrain what an owner can insert. Maintaining a consistent state vocabulary matters. | Provide an extensible block registry and a stock ledger with plain language labels. |
| WooCommerce | Variable products have variation specific prices and stock; order editing exposes item changes and refunds. [S03, S04] | Strong variation model and an actionable order detail screen | Design risk: a long settings screen can overwhelm a beginner; extensions can fragment workflows. | Guided product creation plus one order workspace; core operations implemented together. |
| BigCommerce | Page Builder uses schema configured widgets in designated regions. [S05] | Schema driven authoring lets developers add safe controls | Design risk: different widget configurations can create inconsistent editing experiences. | One field and validation system for every section type. |
| Wix eCommerce | Guided setup, product galleries, inventory management, and mobile administration are documented. [S06] | Setup checklist and mobile stock changes | Design risk: visually flexible storefront work can distract from operational exceptions. | Separate website editing from daily fulfilment tasks while sharing product records. |
| Ecwid | Options become independently stocked variations when supplied with SKU and stock. [S07] | Clearly separate a selectable option from a stock keeping item | Documentation points to an app for multiple variation images, illustrating a capability to include natively here. | Native colour galleries and unique SKU per sellable variation. |
| Adobe Commerce | Source selection and reservations connect order lifecycle to salable quantity. [S08] | Allocation, compensation, and multi location stock discipline | Design risk: source, stock, and reservation concepts are difficult for a novice. | Explain quantities as physical, held, available, and incoming; retain full technical model underneath. |
| Salesforce Commerce Cloud | Business Manager separates merchandising and administration, with module and functional permissions. Current documentation also uses Agentforce Commerce branding. [S09] | Permission scoped workspaces and controlled merchandising | Design risk: a broad enterprise menu is excessive for a small operational role. | Role specific landing pages and server enforced action permissions. |
| Webflow Ecommerce | Variant combinations generate separate variant records; CSV workflows include variants and categories. Variants count against platform item limits. [S10] | Visual presentation tied to structured catalogue data | Documented coupling between variant count and item allowance; import workflow sits in the Designer. | Bulk tools belong in Products; capacities follow tested infrastructure limits. |
| Squarespace Commerce | A central product panel supports stock, variants, visibility, and scheduling. Its documentation warns that deleting a store page removes that store's products. [S11] | Simple inventory overview | Concrete deletion coupling is unsuitable for our needs; documented mobile search differs from desktop search. | Deleting a page never deletes products; preserve key mobile admin search capabilities. |

These references are not product recommendations. Our application should combine useful concepts without copying proprietary implementations or their plan restrictions. Features not established by the cited documentation are not asserted to be absent from those platforms.

### 2.2 CMS, fulfilment, security, and usability references

WordPress supplies a useful reference for site editing and revision restoration. Our implementation should make global versus page specific changes unmistakable and make restoring a revision create a new revision. [S12]

Shiprocket and Delhivery documentation foreground NDR, RTO, shipment exceptions, COD remittance, and serviceability. Those are core operational concepts even when our staff updates them manually. Do not copy advertised delivery coverage or success claims into our promises. [S13, S14]

Baymard's checkout research supports prominent guest checkout and delaying account creation until confirmation. It does not establish an India specific conversion uplift for our store. Validate the proposed checkout with Indian shoppers. [S15]

W3C WCAG 2.2 guides accessibility; OWASP guides API authorisation risks. They are verification references, not badges to display without testing. [S27, S28]

### 2.3 Gaps our design should deliberately close

1. Bring product content, stock, sales, returns, and engagement into the same product workspace.
2. Give every exception an owner, next action, deadline, and evidence rather than another unexplained status.
3. Support manual UPI and COD with the same accounting discipline as online payments.
4. Explain why an action is unavailable: “This item has already shipped. Start a return after delivery.”
5. Connect page and banner versions to analytics. An owner should know which version customers actually saw.
6. Make imports reversible where possible and conflict aware. Never silently overwrite newer stock.
7. Show data freshness, incomplete observations, and estimated metrics.
8. Keep financial operations protected even when the interface is simple.

## 3. Store structure and catalogue information architecture

### 3.1 Separate concepts that are often mixed together

| Concept | Purpose | Example | Rule |
| --- | --- | --- | --- |
| Category | Stable browsing hierarchy | Clothing > Men > Shirts | Acyclic tree with stable IDs and one primary parent per node. |
| Collection | Curated or rule based merchandising | Office Essentials, Under ₹999 | A product can belong to many. Membership is versioned for analysis. |
| Product type | Data template and validation | Shirt, shoe, bag | Determines required attributes, size guide, and applicable filters. |
| Attribute | Structured product fact | Cotton, regular fit, sleeve length | Typed values with units and controlled vocabularies where useful. |
| Variant | Purchasable combination | Black shirt, size M | Own SKU, price, barcode, stock, weight, availability, and media mapping. |
| Tag | Internal or lightweight grouping | Campaign September | Not a substitute for attributes or the category tree. |
| Navigation item | Link displayed to a shopper | Men, New Arrivals, Sale | Independent of the full tree; can point to a category, collection, or page. |
| Market | Selling context | India, INR, English | Controls availability, pricing, policy, and tax context. |

Support arbitrary hierarchy depth in the data model, with cycle prevention and configurable operational limits. Do not promise literally unlimited nesting or expose a twelve level menu. Keep common discovery paths to roughly two to four deliberate choices, as a design target to test.

Prefer Clothing > Men > Shirts and Clothing > Women > Tops for the initial navigation hypothesis. Upper Wear and Lower Wear can be intermediate categories or menu groups if research shows customers understand them. Gender or audience should also be an attribute so unisex products do not require duplication. Shoes and Accessories have their own type appropriate attributes.

Store category ancestry and canonical category separately from navigation. Product URLs should not require the full category path, so moving a category does not break every product link.

### 3.2 Category and collection administration

Create, rename, move, reorder, archive, restore, and merge categories. Preview affected products, breadcrumbs, menus, automatic collections, SEO pages, and analytics before a move or merge. Block cycles. Warn about orphaned products. Archive a category without deleting its products or history.

Manual collections support drag reorder and accessible move controls. Automatic collections use an allowlisted rule builder with AND/OR groups, preview count, exclusions, scheduled activation, and a “why included” explanation. Rules can use type, attribute, tag, price, publication, stock eligibility, and release date. Computed performance based rules use a declared freshness window.

Each landing page supports title, description, image, banner, SEO, merchandising order, allowed filters, and a content template. Menus support desktop mega menus and mobile drilldown, draft preview, broken link detection, and keyboard operation.

## 4. Customer website: pages and behaviour

| Page or component | Required behaviour | Priority |
| --- | --- | --- |
| Homepage | Clear value proposition, searchable header, category shortcuts, honest promotion, curated products, trust and support details | Essential |
| Category hub | Explain scope, show relevant subcategories and products, preserve filter state | Essential |
| Product listing | Useful facets, sort, product count, available sizes, explicit price, stock state, pagination | Essential |
| Collection page | Editorial description, campaign terms, products, expiry behaviour | Essential |
| Search results | Query, corrections, suggestions, filters, relevance order, zero result recovery | Essential |
| Product detail | Accurate images, variant selection, size guide, price, delivery check, returns summary, declarations, reviews area | Essential |
| Cart | Variant and quantity editing, remove, save for later, clear charges, checkout recovery | Essential |
| Checkout | Guest option, contact, address, delivery, payment, final payable total | Essential |
| Payment pending or failed | Explain what is known, safe refresh and retry, support route | Essential |
| Confirmation | Order reference, payment state, next step, receipt or invoice availability | Essential |
| Account | Profile, addresses, orders, returns, refunds, preferences, privacy requests | Essential |
| Order tracking | Shipment specific events, source and freshness, estimated delivery, delays | Essential |
| Return and exchange centre | Eligible items, reasons, evidence, pickup or self ship, status | Essential |
| Refund detail | Amount, destination summary, request status, reference, expected timing explanation | Essential |
| Help and contact | Searchable FAQs, order linked tickets, business contact and grievance details | Essential |
| Policy pages | Shipping, cancellation, returns, refunds, privacy, terms, accessibility contact | Essential |
| Wishlist and saved items | Guest local save, optional account sync, variant aware availability | Important |
| Recently viewed | Local device history with clear/delete control | Important |
| Offers page | Valid offers, eligibility, expiry, exclusions | Important |
| Comparison | Compare relevant structured attributes across a small selection | Optional |
| Editorial guides | Sizing, care, outfits, gift guides, internal links | Important |
| Gift card and loyalty pages | Balance, transactions, terms, redemption restrictions | Optional |
| Error and empty pages | Helpful 404, unavailable product, no orders, offline, maintenance | Essential |

### 4.1 Product detail acceptance requirements

Show product and colour specific images, zoom, alt text, optional captioned video, material, fit, dimensions, care instructions, package contents, and applicable manufacturer/importer declarations. Shoe sizing must specify the size system and measurement guidance. Clothing charts must explain garment versus body measurements. Do not invent sizing or fabric claims with AI.

Do not silently select a size that affects fit. Show disabled combinations and explain unavailable stock. When colour changes, preserve the chosen size only if the combination exists. Recheck the selected variant at add to cart and checkout.

Display selling price, genuine comparison or MRP information, tax treatment, delivery estimate source, shipping costs or their calculation, and return eligibility near purchase controls. A sticky mobile purchase control must not cover content or accessibility tools. Recommendations must not push the primary purchase information out of reach.

Reviews show rating distribution, verified purchase meaning, sort controls, helpful votes with abuse controls, and moderation policy. Never create fake urgency, fake reviews, or fabricated scarcity. [S25]

### 4.2 Indian shopping requirements

Use ₹ and Indian number formatting, six digit PIN code validation, flexible address lines, locality, city/district, state, recipient name, and phone. Keep landmark optional. Support Unicode names and addresses; do not reject legitimate names with narrow Latin only validation. Default country to India, with a separate international format later.

PIN code format validation is not courier serviceability. Maintain a versioned, manually imported service table containing prepaid, COD, reverse pickup, weight constraints, zone, and effective date. Display “Needs confirmation” when data is missing rather than claiming delivery is available.

Prefer fast pages and useful images over autoplay media. Offer English initially with a reviewed Hindi interface if supported operationally. Add other regional languages based on demand. Localise critical policies and transaction messages consistently. Customer preferred language is separate from delivery geography.

Provide visible business identity, contact details, understandable payment instructions, realistic delivery windows, accurate product photographs, accessible size guides, and a clear returns summary. These are trust features; decorative certification logos without entitlement are not.

## 5. Product management and publishing

### 5.1 Product record and editing capabilities

The product workspace has Overview, Details, Variants, Stock, Media, Website, Performance, and History tabs. The first screen exposes only title, type, images, selling price, variants, stock, and publication readiness.

Support all of the following through our code:

1. Add, edit, duplicate, archive, restore, schedule, hide, and publish products. Duplication creates new IDs and requires new SKU/barcode checks; it does not copy historical sales or reviews.
2. Titles, short and long descriptions, specifications, brand, supplier, product type, categories, collections, tags, and typed custom fields.
3. Multiple images, ordering, focal points, colour mapping, accessible alt text, video, thumbnails, and media processing status.
4. Variant creation by size, colour, material, style, or other options. Preview combinations before generation; delete impossible combinations. Support bulk variant edits and size ordering.
5. Unique SKU registry, optional validated barcode/GTIN, merchant assigned internal barcodes, and manufacturer identifiers. Do not fabricate official GTINs.
6. Selling price, MRP where applicable, comparison price provenance, cost price, effective dates, tax class, HSN, currency, margin preview, and price history.
7. Per location inventory, purchase restrictions, minimum/maximum quantities, low stock thresholds, lead time, backorder settings, and discontinuation status.
8. Package dimensions, shipping weight, fragile handling, restricted destinations, return class, warranty terms, and package contents.
9. SEO title, description, slug, canonical handling, social image, redirects, and index controls.
10. Related products, accessories, substitutions, recommendation overrides, and bundle component definitions.
11. Visibility by channel or future market, launch/removal schedules, draft preview, change history, and approval workflows.
12. Downloadable import templates, CSV export, dry run import, row validation, bulk editing, conflict detection, progress, resumable jobs, and error exports.

### 5.2 Product publishing workflow

Choose a product type, add photos and essential details, create variants, enter prices and stock, select browsing placement, preview mobile and desktop, resolve readiness warnings, then publish or schedule. Save drafts automatically with a visible saved state.

Publication blockers include missing required price, duplicate SKU, invalid variant combinations, invalid tax configuration for the merchant, absent required declarations, and broken primary media. Optional descriptions and merchandising enhancements are warnings. Policy rules are versioned so staff can understand why a product is blocked.

Publication updates a public product projection, search index, collection memberships, sitemap queue, and cache invalidation jobs. A failure in a secondary job becomes a visible retryable publishing issue. Do not expose half published media or draft attributes.

### 5.3 Safe deletion, import, and history

Archive any product referenced by orders. Hard deletion is reserved for unused drafts with a recovery window. A category, page, or collection deletion cannot cascade into product deletion. Preserve stable IDs for historical reporting.

Imports use explicit create/update modes and match by stable ID or SKU. Show a field mapping, validation report, before/after sample, expected row count, and duplicate handling. Protect stock imports with version checks or an inventory adjustment import rather than blindly setting balances. Escape spreadsheet formula injection in exports. Changes record actor, source file/job, reason, old/new values, and timestamp.

## 6. Accounts, authentication, and privacy controls

Recommend prominent guest checkout, Google sign in through Firebase, and email/password with secure recovery. Offer Firebase email link sign in as an alternative after testing delivery, quotas, and device handoff. Phone authentication is optional where it improves completion enough to justify SMS cost and abuse exposure. Do not force account creation just to buy. [S15, S18, S19]

After checkout, offer to save the order to an account. Link only after the customer proves control of the verified contact or a secure order access capability. Never attach old guest orders to a new user solely because an unverified email string matches. Provider linking requires reauthentication and collision handling.

Profile fields include name, verified email, phone with verification state, addresses, defaults, preferences, and loyalty if enabled. Gender and date of birth are optional, purpose limited, and omitted by default. Buying clothes does not require demographic profiling.

Account pages expose order history, shipment details, cancellations, return requests, refunds, wishlists, saved products, recent security activity, sign out of other sessions, correction requests, data export, and account deletion. Customer notes used by staff are access controlled and factual.

Use secure server sessions where appropriate, HttpOnly cookies, secure cookie flags, session rotation, CSRF protections, expiration, and server side token verification. Reauthenticate for contact changes, data export, account deletion, and sensitive staff actions. Admin accounts require MFA and role checks. A remembered login is not a permanent unprotected session.

Do not store raw card numbers, CVV, UPI PINs, bank passwords, or authentication secrets. Saved payment conveniences must use Razorpay supported tokenisation with applicable consent and account eligibility, or be omitted. Provider tokens remain sensitive.

Guest order access uses an opaque high entropy token with restricted scope and expiration, with revalidation for sensitive actions. Order number plus phone number is not sufficient authorisation. Provide an authenticated recovery route; do not expose an order search endpoint that leaks customer data.

## 7. Cart, checkout, and pricing

### 7.1 Recommended customer flow

Cart, contact and address, delivery and payment choice, review payable total, place order, payment or COD confirmation. A compact single page or short step flow can both work; test field clarity and recovery instead of insisting that one page is always better.

Keep guest checkout visible. Use address autofill hints, correct mobile keyboards, persistent labels, inline validation, retained input, optional billing address, and an optional GST business billing section. Show charges before payment. Coupons should not dominate the page. Do not preselect marketing consent.

Cart actions support quantity edits, variant replacement, removal with undo, save for later, stock changes, coupon messages, shipping estimates, and account merge. A merge must not double quantities silently or restore products the customer deliberately removed.

### 7.2 Server pricing contract

The browser sends variant IDs, quantities, destination, and promotion requests. The server calculates current price, discount allocation, shipping, COD fee if any, tax, gift/store credit usage if enabled, and final payable amount. It returns a quote ID, version, expiry, and an itemised explanation.

On place order, revalidate serviceability, stock, price version, coupon usage, delivery restrictions, and quote expiry. If the total changed, ask the shopper to review it. Never charge a changed total without agreement.

Each checkout attempt has an idempotency key. Persist the request fingerprint and result. Reusing a key with different input is rejected. The same button pressed twice returns the same order rather than making a second sale.

Stock is normally reserved at place order or payment start, not every time a product enters a cart. Reservation duration is configurable per payment method. Manual verification has a separate operational deadline. Expiration is enforced by transaction logic and a sweeper, not by assuming database TTL deletion happens exactly on time.

### 7.3 Price and promotion calculations

Use explicit discount stacking rules, maximum benefit, applicable items, date and timezone, usage limits, customer eligibility, and exclusions. Allocate order discounts proportionally with deterministic rounding so partial refunds have an explainable basis. Store the calculation version and line allocations.

Gift cards, store credit, loyalty, and coupons are different instruments. Their balance or usage changes need reservation, commit, release, and reversal semantics. A gift card sale should not automatically be counted as product revenue and its redemption counted again. Have finance approve tax and liability treatment before enabling it.

Acceptance example: two devices attempt to redeem the last coupon use or final stock unit. At most one succeeds. The other receives a clear recoverable message without a duplicate charge.

## 8. Payments, reconciliation, and financial controls

### 8.1 Razorpay workflow

1. Create our pending order and reservation transactionally. Create the corresponding Razorpay order from the server with the expected amount and currency.
2. Open supported Razorpay checkout methods based on the merchant's actual activation. UPI, cards, net banking, and wallets are not all guaranteed merely because the SDK is installed.
3. Treat the browser callback as a signal. Verify its signature on the server using our stored provider order ID, then obtain authoritative payment state. Verify amount, currency, order binding, and capture status. [S16]
4. Verify webhook signatures against the raw request body. Deduplicate provider events, persist receipt, acknowledge promptly, and process through durable jobs. Expect duplicates and events arriving out of order. [S17]
5. Mark the order paid only after the appropriate confirmed/captured state. An authorised payment is not a settled bank deposit. Commit inventory allocation and create the fulfilment task exactly once in effect.
6. If callback or webhook delivery is delayed, display “Checking payment” and reconcile through provider fetches. Do not ask the customer to pay again while the first attempt may already have succeeded.
7. Reconcile unresolved payments, refunds, disputes, and settlements on a schedule. Provide a manual reconciliation screen for operations.

Do not make provider calls inside a Firestore transaction callback, which may retry. First persist intent, execute the external operation, then reconcile the result. If creation times out, search or reconcile the original attempt before blindly creating another provider operation.

### 8.2 Manual UPI QR workflow

Show the merchant verified QR, payee name, UPI ID where appropriate, exact amount, order reference, payment deadline, and verification expectations. Store QR configuration versions and approval history. A mobile shopper may need to save the QR or use another device; explain this and keep Razorpay UPI as a convenient alternative.

After payment, allow the shopper to submit a transaction reference, payment time, and optional screenshot. Label the order “Payment submitted, awaiting verification.” A screenshot and typed UTR are claims, not proof.

Finance checks the actual merchant bank record outside the application, or imports an authorised statement file. Match amount, reference, date, account, and prior usage. Record evidence reference, verifier, verified time, and outcome. Restrict bank files and screenshots to authorised staff. No staff member should be able to mark payment verified merely by editing a general order status.

Handle amount mismatch, duplicate reference, reused screenshot, unmatched bank entry, reversal, missing proof, expired reservation, and late payment. A late confirmed payment must enter a paid but unallocated exception if stock has already been sold. Resolve through replenishment with customer agreement or refund, not negative stock.

Use a manual verification queue with ageing and an internal response target. Display realistic operating hours to the customer. Static QR payment confirmation cannot become automatic without an allowed bank or payment feed.

### 8.3 COD workflow

Validate COD eligibility by PIN code, cart amount, product restrictions, and recorded risk rules. Explain any COD fee before placement. Staff may confirm suspicious orders manually. Do not require an unsupported automated OTP service.

Track COD due, collected by courier, remittance expected, remitted, short remittance, disputed, or written off with authority. Delivery confirmation does not mean money reached the bank. Reconcile courier statements and bank receipts. A delivery refusal can trigger NDR or RTO while payment remains uncollected.

### 8.4 Payment and refund records

Keep separate payment attempts, receipts, refund requests, provider refunds, manual outgoing transfers, settlement batches, fees, and disputes. Every record references an order and, where applicable, original payment and line allocations.

Refund initiation is not completion. For Razorpay, persist the refund intent and provider reference, handle unknown outcomes, and confirm through supported provider state/reconciliation. For manual UPI and COD, staff perform a bank refund outside our code and record authorised destination and transfer evidence. Ordinary gateway refunds cannot refund unrelated COD cash. Do not assume RazorpayX payout access is included in a gateway account.

Refund amounts cannot exceed captured/verified funds minus completed and pending refunds. Reserve refund capacity before submission to prevent simultaneous duplicate refunds. Approval thresholds are configurable. A failed refund releases or reviews its reserved amount according to verified outcome.

Keep an evidence and deadline queue for chargebacks and payment disputes. Settlement reports reconcile gross receipts, refunds, fees, tax on fees, adjustments, and net bank deposit. Dashboard labels distinguish sales, customer payments, money awaiting settlement, and bank receipts.

## 9. Order lifecycle and state model

A single status field is insufficient. Store independent dimensions, derive a customer friendly summary, and retain an immutable event timeline.

| Dimension | Proposed states | Rules |
| --- | --- | --- |
| Order acceptance | draft, placed, awaiting_review, confirmed, on_hold, cancelled, closed | “New” is a queue view. Cancellation can apply to remaining lines only. |
| Payment attempt | created, pending, requires_action, authorised, captured, failed, expired, cancelled, unknown | One order can have several attempts. Unknown requires reconciliation. |
| Manual payment | awaiting_submission, submitted, verifying, verified, rejected, amount_mismatch, reversed | Verification requires evidence and finance permission. |
| COD receivable | due, collected, remittance_pending, remitted, short, disputed, uncollectible | Independent from shipment delivery. |
| Fulfilment | unallocated, allocated, picking, packed, ready_for_pickup, partially_fulfilled, fulfilled, cancelled | Quantities belong to lines and fulfilment groups. |
| Shipment | label_pending, booked, pickup_scheduled, picked_up, in_transit, out_for_delivery, delivered, delivery_failed, delayed, lost, damaged, rto_initiated, rto_in_transit, rto_received, cancelled | A printed label is not a shipped parcel. Source evidence matters. |
| Return | requested, under_review, approved, rejected, pickup_pending, in_transit, received, inspecting, accepted, partially_accepted, rejected_after_inspection, closed, cancelled | State and quantity per returned item. |
| Exchange | requested, approved, stock_reserved, awaiting_original, inspecting, replacement_processing, replacement_shipped, completed, rejected, cancelled | Create a linked replacement order. |
| Refund | requested, awaiting_approval, approved, submitted, processing, succeeded, failed, unknown, cancelled | Partial/full is the amount relationship, not the only status. |
| Dispute | opened, evidence_due, submitted, won, lost, closed | Do not erase the original payment history. |

Use a transition service that checks current version, permissions, line quantities, payment requirements, policy version, and stock effects. Every transition records actor, reason, previous state, new state, server time, and source. Staff cannot arbitrarily jump from placed to delivered without the relevant shipment workflow or an exceptional correction permission.

### 9.1 Standard order workflow

Customer places order, payment is verified or COD accepted, inventory is allocated, the warehouse picks and packs, staff books the courier manually, records AWB and genuine label, confirms pickup, updates shipment milestones, confirms delivery, then finance reconciles funds and closes outstanding tasks. Reviews become eligible after delivery. The order remains available for returns during the applicable window.

### 9.2 Exceptions that must work

1. Cancellation before payment releases holds; cancellation after payment creates a refund obligation; after shipment it follows return/interception rules.
2. Partial shipment preserves remaining quantities and shows multiple tracking numbers.
3. Short pick creates an inventory discrepancy and a customer resolution task.
4. One line delivered and another lost must not become “all delivered.”
5. Payment succeeds after cancellation or reservation expiry: reconcile, hold fulfilment, then refund or agree a new allocation.
6. Address changes after confirmation require eligibility checks, rate/tax recalculation where relevant, and customer acceptance. After courier handoff, use an exception workflow.
7. RTO returns to a quarantine/inspection state before resale.
8. Wrong item delivery creates a support case, return/replacement records, and inventory adjustments.
9. Lost shipments and insurance claims have evidence, claim deadlines, expected recovery, and writeoff approval.
10. An order amendment preserves previous versions and financial documents; it never silently overwrites an issued invoice.

## 10. Beginner friendly Super Admin Dashboard

### 10.1 Navigation and landing screen

Use eight main areas: Today, Orders, Products, Stock, Customers, Website, Growth, and Reports. Finance, Team, Settings, and System Health remain clearly reachable but permission scoped. Search is always available.

Today shows actionable cards: orders to pack, payments to verify, return decisions, delayed deliveries, low stock, support replies due, and yesterday's exceptions. Sales cards use plain labels and comparison periods. Avoid a wall of charts with no next action.

Each queue row explains the problem, age, customer or item, responsible person, and next action. Saved views include Unpaid, Pack today, Missing tracking, Refunds waiting, and Needs attention. Counts must match the filters and show freshness.

### 10.2 Interaction rules

Use visible labels, familiar words, large controls, consistent placement, examples in forms, and progressive disclosure. Aim for 44 CSS pixel touch controls where practical; WCAG's minimum target rules and exceptions differ from that design target. [S27]

Guided forms have sensible defaults and preserve work. Autosave drafts, not irreversible payment actions. Display “Saved,” “Saving,” or “Could not save, retry.” Use optimistic interfaces only when rollback is safe. Financial and stock operations show pending until confirmed.

Provide keyboard shortcuts and command search for experienced staff, alongside clickable controls. Search should find orders, products, customers, settings, and actions only within the user's permissions. Recent actions, favourites, configurable cards, help panels, sample data in a clearly marked training environment, and short task tutorials reduce learning burden.

Dangerous actions use specific confirmation text showing the consequence, amount, and affected records. “Refund ₹1,299 to the original payment method” is more useful than “Are you sure?” Routine reversible changes get undo. Financial transfers get a corrective workflow, not a misleading undo button.

### 10.3 Common task designs

| Task | Proposed shortest understandable workflow | Safety or completion condition |
| --- | --- | --- |
| Add product | Products, Add, guided essential fields, preview, publish | Required data and SKU checks pass. |
| Change price | Find product, edit price, review effect, save/schedule | Open checkout quotes revalidate. |
| Update stock | Scan/search SKU, choose location, add/remove/count, reason, save | Append inventory movement; no silent overwrite. |
| Process order | Orders to pack, open, pick, verify, pack | Variant and quantity scan checks. |
| Print invoice | Order, Documents, Print/download | Correct immutable issued document. |
| Mark shipped | Order shipment, AWB and courier, pickup evidence, confirm | Shipment handed over, not merely labelled. |
| Approve return | Returns queue, item evidence, eligibility, approve | Pickup task and customer status created. |
| Issue refund | Return/order, amount and destination, approve, submit | Server amount cap and reconciliation. |
| Create discount | Growth, New offer, type, scope, dates, preview | Stacking and usage checks. |
| Change banner | Website, select banner in preview, replace, preview, publish | Mobile crop, alt text, link, and schedule valid. |
| Add category | Products, Categories, Add, parent, preview, publish | No cycle or conflicting slug. |
| Check sales | Today, Sales detail | Date, revenue definition, cancellations and refunds explained. |
| Find customer | Global search, permitted identifier, profile | Sensitive fields masked by role. |
| Check low stock | Stock, Running low | Available units and incoming stock shown separately. |

Do not promise a fixed click count for every scenario. Measure whether first time users complete these tasks accurately with minimal assistance. Proposed release gate: at least 90% successful completion of routine tasks in a representative usability round, no unrecovered critical financial errors, and clear recovery for mistakes. Set time benchmarks after baseline testing.

### 10.4 Advanced administration

Include bulk actions with dry run previews, saved filters, export jobs, approval inbox, staff task assignment, financial holds, catalog health, failed automation runs, webhook history, audit logs, job retries, data freshness, system notices, feature flags, and business configuration history. Super admin access does not bypass logging or validation.

## 11. Built in CMS and website editor

### 11.1 Editing model

Use structured page documents and reusable section schemas rendered by our React components. Each page has templates, sections, and blocks, stable identifiers, data bindings, and versioned content. Store draft and published revisions separately. Do not expose arbitrary JavaScript or unrestricted HTML to everyday editors.

The editor provides a page tree, live preview, selected element controls, mobile/tablet/desktop preview, locale preview, and explicit Draft and Published labels. Dynamic product fields link to catalogue records rather than duplicated text. Changing a product price in the CMS should open the product price workflow.

### 11.2 Section library

Support hero, image with text, category tiles, featured collection, curated product grid, new arrivals, best sellers, recommendation row, promotion strip, announcement bar, trust information, brand story, editorial cards, size/care guide, FAQ accordion, contact block, newsletter preference form where delivery is available, review summary, and accessible video.

Every eligible section supports add, edit, remove, hide, duplicate, reorder, schedule, and restore. Controls include images, crops, focal points, headings, body text, CTA labels, validated links, products, collections, background, spacing presets, alignment, and responsive behaviour. A section can be restricted to compatible page templates.

Homepage Sections 1 through 12 are ordinary editable instances, not hardcoded exceptions. The owner can have fewer or more within an enforced performance budget. Sections receive friendly names such as “Summer banner” and persistent section IDs for analytics.

### 11.3 Global and page specific settings

Edit header, logo, search presentation, announcement bars, footer, contact details, social links, navigation, mega menus, typography tokens, colour tokens, and button styles. Global changes show their affected pages before publication.

Manage category, collection, product template, campaign, editorial, FAQ, policy, contact, and help pages. Support reusable global blocks and detached copies, with an explicit explanation of whether an edit changes one page or every use. A page deletion must not delete referenced products or media still used elsewhere.

### 11.4 Publication workflow

Edit draft, autosave, validate, preview, optionally request approval, publish now or schedule in Asia/Kolkata. Publication creates an immutable release manifest containing page revisions, menu revisions, theme tokens, and dependency references. Switch the live pointer atomically after validation. Schedule start and optional expiry with a declared fallback release.

Validate broken links, missing alt text, inaccessible contrast, invalid headings, required policies, empty collections, oversized media, schedule conflicts, and unavailable featured products. Performance warnings should explain the likely impact.

Maintain revision history with author, diff, reason, preview, restore as new draft, and rollback to a compatible release. Support undo/redo within editing sessions. Detect concurrent edits through version checks; show conflicts rather than silently accepting the last save.

Analytics uses page_revision_id, section_id, section_revision_id, and banner_id so an owner can compare old and new content honestly. A CMS rollback never rolls back orders or payments.

## 12. Inventory, procurement, and warehouse management

### 12.1 Quantity model

For each variant and location, maintain physical on hand, reserved for unpaid checkout, allocated to accepted orders, unavailable/quarantine/damaged, and available to promise. Incoming and in transit stock are separate until physically received.

Proposed invariant: available_to_promise = on_hand minus reserved minus allocated minus unavailable, with explicit policy for safety stock inside unavailable. Each physical unit belongs to only one of these on hand buckets. Incoming is not added twice. Backorders are recorded separately and never disguised as physical stock.

Every change is an immutable stock movement: receipt, reservation, release, allocation, shipment, return quarantine, restock, damage, count correction, transfer out, transfer in, or writeoff. A balance projection can be rebuilt and reconciled against the ledger. Use transaction checks for availability. [S02, S08, S22]

### 12.2 Procurement and receiving

Maintain supplier profiles, contact, lead time, supplier SKU, purchase price, purchase orders, expected delivery, partial receipts, damaged receipts, and supplier returns. Draft a PO, approve if required, record manual transmission, receive against expected quantities, scan variants, inspect, accept into a bin, record discrepancies, and close the balance when resolved.

Landed cost may include freight and other allocated costs. Preserve the costing method and history; finance chooses weighted average or another appropriate policy. If cost is missing, mark profit unknown rather than pretending it is zero.

### 12.3 Warehouses and operations

Support multiple locations, bins, receiving/quarantine/dispatch areas, staff location scope, low stock thresholds, reorder points, safety stock, stock age, cycle counts, blind counts, variance approval, and barcode printing/scanning. Track serial or batch information only where the product requires it.

Warehouse transfers have request, approved, picked, dispatched, in transit, partly received, received, and discrepancy states. Deduct from origin at dispatch; add to destination only on receipt. Do not count the same transfer as available at both warehouses.

Pick lists group eligible orders by location. Staff scan bin and SKU, confirm quantity, record a short pick, choose packaging, capture weight and dimensions, print packing slip and invoice, attach an actual courier label, and confirm handoff. Provide manual scan fallback and printer failure recovery. Packing slips may omit prices for gifts without changing invoices.

### 12.4 Stock alerts and backorders

Show unavailable sizes, expected replenishment if reliable, back in stock interest, and low stock tasks. Backorders and preorders are Optional, with clear availability dates, customer agreement, allocation priority, and cancellation/refund handling. Do not enable unlimited overselling by default.

## 13. Shipping and fulfilment under the restricted service list

The platform owns shipping rules and records. Staff still need a courier relationship to move physical goods. That commercial relationship is unavoidable even when no courier API is connected.

Maintain zones, PIN tables, weight/price thresholds, free shipping rules, COD fees, shipping tax treatment, package types, carrier contracts, service names, and estimated transit windows. Rates are versioned manual tables, with actual carrier charges reconciled later. Volumetric weight uses the carrier's applicable divisor rather than one universal constant.

Our code may recommend a courier from recorded cost, eligibility, reliability, and capacity, but it cannot book that courier or know current capacity without an authorised feed. Staff book externally, then enter AWB, pickup date, label, and cost. Validate AWB uniqueness and use an allowlisted public tracking link template.

CSV imports should support tracking milestones, shipment charges, NDR, RTO, and COD remittance. Record source, event time, received time, and import job. Duplicate events are ignored; older imported events cannot regress delivered shipments automatically. Manually entered delivery status is labelled as such.

NDR creates a case with failure reason, customer contact attempt, corrected instructions, reattempt decision, deadline, and eventual delivery or RTO. RTO is an inbound physical flow, not a refund button. Refund eligibility depends on payment and policy.

Support partial fulfilment and split shipments. Show separate delivery estimates and tracking. Keep the quoted customer shipping charge separate from actual package cost. Advanced allocation can minimise splits subject to available stock and serviceability, but correctness comes before a theoretical optimal route.

Automatic labels, pickup, tracking, serviceability, rate shopping, and COD feeds are **deferred external integrations**, not included automation. Their future adapter contracts are defined in section 27.

## 14. Returns, exchanges, refunds, and warranty

### 14.1 Eligibility and request

Persist the policy version applied to each order line. Evaluate delivery date, return window, product class, condition requirements, quantity already returned, and applicable customer rights. Hygiene restrictions and final sale rules need clear pre purchase disclosure and cannot override mandatory remedies for defective or misdescribed goods.

Customer chooses item, quantity, reason, preferred remedy, and optional supporting images. Do not demand images for every simple size exchange. Show whether pickup or self shipping is available and disclose any lawful charge before submission. Assign a case reference and status.

### 14.2 Operational flow

Staff review eligibility, approve or explain rejection with an appeal/support route, arrange pickup manually or provide self shipping instructions, record tracking, receive into quarantine, inspect condition, and record acceptance by line. Attach evidence for discrepancies. Decide restock, repair, supplier return, damaged stock, or writeoff.

A return decision and refund are separate. An accepted item creates a refund obligation or exchange credit according to the chosen remedy. Calculate refund from original line allocations, original tax, refundable delivery charges, and lawful policy adjustments. Display an itemised breakdown.

### 14.3 Exchanges

Reserve the replacement variant for a defined period, create a linked replacement order, calculate any price difference, and track collection/refund of that difference. Standard exchange ships after accepted inspection. Advance exchange is Optional and requires a separate risk and recovery policy.

Handle replacement out of stock, partial acceptance, customer cancelling the exchange, missed pickup, and lost return parcels. Never close an exchange merely because the original item arrived.

### 14.4 Fraud and fairness

Use factual signals such as repeated reference reuse, inconsistent return quantities, or serial mismatch. Human review handles ambiguous cases. Do not automatically block customers because of locality, language, gender, or an unexplained AI score. Record the decision basis and permit correction.

Warranty/defect claims outside a normal return window need their own support path, manufacturer documents, and repair/replacement/refund resolution. Product recalls require affected SKU/batch identification, customer contact tasks, stop sale, and remedy tracking.

## 15. Staff, permissions, and approvals

| Role | Typical permissions | Restricted by default |
| --- | --- | --- |
| Owner | Business settings, staff, approvals, finance oversight | Still uses MFA and audit logs; no silent history deletion. |
| Manager | Orders, service exceptions, operational reports | Bank destination changes and owner transfer. |
| Product manager | Catalogue, categories, media, pricing proposals | Refund execution and customer bulk export. |
| Warehouse | Assigned location stock, receiving, pick/pack, shipments | Product cost, financial settings, broad customer data. |
| Support | Tickets, relevant orders, return proposals, saved replies | Unrestricted refunds, full bank data, permission changes. |
| Marketing | CMS drafts, campaigns, consent based segments | Payments, stock adjustments, secret credentials. |
| Finance | Verification, refunds, settlements, invoices, reports | Arbitrary storefront content and role escalation. |
| Analyst/read only | Approved reports and masked exports | Mutations and personal data without separate permission. |

Define granular actions such as product.publish, price.change, stock.adjust, refund.request, refund.approve, refund.execute, customer.export, cms.publish, and staff.manage. Add location and field scope. Enforce permissions on the server, including exports, analytics drilldowns, direct database access, and AI tools.

Use two person approval where practical for bank/QR changes, large refunds, large stock writeoffs, mass price changes, and sensitive exports. A sole proprietor can use explicit owner override with reauthentication and an audit reason rather than an impossible approval deadlock.

Staff lifecycle: invite, verify, assign role and location, enrol MFA, activate, review periodically, suspend, revoke sessions, and offboard. Prevent accidental loss of the last owner. Record login history, role changes, approval actions, and failed sensitive access. Recovery procedures must be tested.

## 16. Customer management and support

The customer workspace contains verified identifiers, addresses, orders, spending, average order value, returns, refunds, open tickets, factual notes, tags, segments, communication consent, loyalty, and risk review status. Show source and calculation period for lifetime value. Distinguish realised contribution from predicted lifetime value.

Segments use explainable rules such as first order, repeat buyer, lapsed buyer, product interest, or refund history. Preview counts and excluded users. Marketing eligibility is evaluated again at send time; a segment membership is not consent.

Build a help centre with FAQs, search, topic pages, contact forms, order linked tickets, attachments, saved replies, internal notes, assignments, priority, status, escalation, and service deadlines. Live chat is Important only when staff can actually respond; otherwise provide asynchronous messaging with an honest response expectation.

Ticket states: new, assigned, waiting_for_staff, waiting_for_customer, escalated, resolved, reopened, and closed. Store public messages separately from internal notes. An order context panel lets agents see the relevant payment, parcel, and return information without showing unnecessary finance fields.

Support analytics: first response, resolution time, backlog age, repeated contact, reopen rate, issue type, and optional satisfaction. Business hours and paused waiting periods must be disclosed in metric definitions. Grievance deadlines should use the applicable statutory clock, not an arbitrary support pause.

## 17. Promotions, loyalty, and growth

Build discount codes and automatic discounts with percentage, fixed amount, free shipping, category/product scope, minimum spend, quantity thresholds, buy one get one, bundles, dates, customer groups, usage limits, budgets, and exclusions. A deterministic engine produces an explainable best eligible offer or an explicit configured stacking result.

Promotion preview should test a sample cart, show margin impact when costs exist, identify conflicting campaigns, and explain why a code fails. Reserve limited coupon uses at checkout and release abandoned attempts. Prevent gift card purchases from exploiting unintended discount loops.

Loyalty is Important or Optional depending on repeat buying patterns. Use an append only points ledger, pending points until appropriate delivery/return conditions, expiry terms, reversal on refunds, and a clear cash equivalent. Store credit and gift cards require liability accounting and secure redemption tokens.

Referral and affiliate systems are Optional. Track attribution, fraud review, commission eligibility after return windows, reversals, payable balance, and manual payout reconciliation. Do not reward self referrals or pay commission on cancelled orders.

Campaigns can be scheduled across homepage content, collections, offers, onsite messages, and consented push. Email/SMS/WhatsApp campaign delivery remains blocked under current dependencies. Prepare templates, audience previews, frequency caps, exclusions, unsubscribe controls, and a future delivery adapter, but never report drafts as delivered campaigns.

Abandoned checkout recovery should preserve a secure resumable cart and current price revalidation. Offer an onsite return prompt or eligible push message. External recovery messages need an allowed transport and appropriate consent. Suppress recovery after purchase, cancellation, opt out, or expiry.

## 18. Reviews, questions, and notifications

### 18.1 Reviews and customer content

Support star ratings, written reviews, optional photos/videos, helpful votes, verified purchase tags, replies, reporting, and moderation. A verified purchase badge requires an actual eligible order relationship. Review requests become due after delivery, not after payment alone.

Moderation states include pending, published, rejected with reason, flagged, and removed. Do not suppress genuine negative reviews simply because they are negative. Prevent duplicate submissions, spam, exposed personal information, and unsafe uploads. Product questions can be answered by authorised staff or customers with attribution and moderation.

Review analytics includes rating distribution, recurring issues, fit feedback, verified share, and moderation backlog. Review summaries show their source set and must not invent consensus.

### 18.2 Notification centre and channel matrix

| Event group | In site | Firebase push | Email/SMS/WhatsApp under current rules |
| --- | --- | --- | --- |
| Authentication, recovery | Yes | Optional security notice | Firebase supported authentication messages only. |
| Login/security alerts | Yes | Optional | General external alerts require an allowed transport. |
| Orders and payments | Yes, with timeline | Consented, supported devices | Manual communication or deferred transport. |
| Shipment and delivery | Yes, showing update source | Consented | No automatic carrier or messaging feed. |
| Cancellation, return, refund | Yes | Consented | Manual or deferred. |
| Back in stock/price drop | Yes when user follows item | Consented | Deferred outbound delivery. |
| Cart recovery/promotions | Preference controlled | Explicitly opted in | Deferred, never repurpose authentication SMS. |

Store notification intent, template version, recipient/channel preference, deduplication key, delivery attempt, provider result where available, retry count, and expiry. Separate created, sent, delivered, and read; do not infer delivery from submission. Keep sensitive order details out of lock screen push content.

## 19. Search, discovery, and personalisation

### 19.1 Search behaviour

Provide instant suggestions after a short debounce, keyboard navigation, recent searches on the device, popular queries, category suggestions, product suggestions, and clear query submission. Search product names, brand, type, SKU where relevant, synonyms, and selected attributes. Do not make private tags searchable publicly.

Build a maintained synonym dictionary for terms such as tee/T shirt and trousers/pants, with reviewed Hindi and transliterated vocabulary where useful. Typo tolerance must avoid changing meaningful size or SKU queries. Show the corrected interpretation and allow the original query.

Filters are type specific: size, colour, price, material, fit, availability, brand, shoe size system, bag capacity, and other meaningful attributes. Include counts, selected chips, clear all, shareable URLs, and a mobile filter drawer that preserves state. Hide irrelevant facets instead of producing dozens of empty controls. Sorting includes relevance, newness, price, popularity, and rating when enough data exists; label promoted results.

Zero result recovery first relaxes clearly identified constraints, then suggests related terms or categories. Distinguish no matching products from matching products with no stock. Offer a support or product request path. Track both zero results and searches that produce results but no useful engagement.

### 19.2 Search implementation decision

Use an internal SearchService interface. Evaluate Firestore Enterprise Native text indexes and search stages for permitted infrastructure. Current documentation supports text search and explicit relevance scoring; the 2026 announcement described some new search capabilities as preview, so verify present edition, region, release status, SDK support, and guarantees for our project. [S23]

Do not equate full text matching with a complete commerce search engine. Prototype synonyms, prefix suggestions, typo handling, facet counts, stock filtering, relevance tuning, pagination stability, and query cost on a realistic catalogue. Relevance must be explicitly requested where required rather than assuming default score order.

If Enterprise cannot satisfy the workload, implement a bounded custom index and search worker on the permitted hosting with snapshots in Storage and updates through our jobs. This is a substantial engineering subsystem requiring replication, memory budgets, index versioning, and recovery. Do not download an entire large catalogue to every browser or scan every Firestore product on each keystroke. A separate hosted search SaaS is not a hidden fallback.

Use versioned public search projections, asynchronous updates, rebuild jobs, active index pointers, freshness monitoring, and deterministic stock revalidation at checkout. Search availability hints are not stock reservations.

### 19.3 Recommendations

Essential recommendations are manually related products and compatible accessories. Important improvements are similar products by attributes, local recently viewed, and frequently bought together based on real completed orders. Filter unavailable or ineligible products and avoid recommending the item already purchased when that is unhelpful.

Advanced segment or account personalisation requires useful data, preference controls, evaluation, and fallback. Compare against a simple bestseller or curated baseline. Personalised offers should have explainable eligibility. Avoid covert individual price discrimination and recommendations based on sensitive inferred traits.

## 20. AI with NVIDIA Nemotron

AI is an assistant, not an authority for money, stock, law, or product truth. The permitted free endpoint is a conditional optional dependency: confirm current access terms and production permission, available model modalities, rate limits, retention terms, and quotas before enabling it. Free development access does not establish a production SLA. [S21]

| Feature | Value and design | Priority |
| --- | --- | --- |
| Description and SEO drafts | Transform supplied facts into editable text; show source facts | Important |
| Tags and category suggestions | Suggest existing valid IDs with confidence and manual approval | Important |
| Alt text | Useful only if the chosen model supports images or reliable visual facts are supplied; human review | Important, capability conditional |
| Support reply drafts | Retrieve permitted policy and order facts; cite internal source; agent sends | Important |
| Natural language admin search | Convert request to allowlisted filters; show interpreted query | Important |
| Analytics explanation | Explain computed numbers, period, denominator, and freshness | Important |
| Sales summary | Summarise authoritative reports, with links to evidence | Important |
| Review/return themes | Aggregate deidentified feedback, show sample size and uncertainty | Advanced |
| Inventory warnings | Deterministic thresholds first; AI may explain them | Essential rules, Optional AI |
| Demand forecast | Use validated statistical forecasting and backtesting, not LLM guessing | Advanced |
| Fraud decisions | Rules and human review first; model signals require evaluation and fairness controls | Advanced |
| Natural language product search | Extract constrained attributes and budget; show editable filters | Advanced |
| Fully autonomous refunds, stock changes, prices, or publishing | Financial and reputational risk exceeds ordinary benefit | Unnecessary |
| Chatbot required to navigate the shop | Makes ordinary buying depend on an unreliable interface | Unnecessary |

Implement a server proxy, secret protection, request budget, queue, timeout, retry with limits, circuit breaker, cache for reusable nonsensitive drafts, schema validated output, prompt version, and usage logs. A failed AI request returns to a normal form. Do not silently switch to an unapproved provider.

Retrieve only data the user may access. Redact payment, address, contact, and personal information unless specifically necessary and approved for that processing. Treat product descriptions, reviews, uploaded files, and model output as untrusted input. Prompt injection cannot grant tools extra permissions. Every proposed mutation uses the same authenticated command API as a human action and requires the applicable review.

## 21. First party analytics: the main business intelligence system

This is a product subsystem, not a few counters attached to buttons. It contains an event contract, collection SDK, ingestion endpoint, consent rules, identity handling, durable storage, deduplication, transformations, metric definitions, entity dashboards, and reconciliation.

### 21.1 Three distinct data layers

1. **Business truth:** orders, line items, verified receipts, refunds, stock movements, costs, and settlements. Written by trusted server workflows.
2. **Observed behaviour:** page and component impressions, clicks, searches, cart interaction, checkout steps, and campaign context. Browser events can be blocked, duplicated, delayed, or forged.
3. **Derived reporting:** aggregates, funnels, attribution, cohorts, and explanations. Rebuildable from permitted retained source data with a calculation version.

Purchase totals must never depend on a thank you page being viewed. A server confirmed order can exist even if the browser closes. Browser purchase notifications are optional diagnostics and deduplicated against the business event.

### 21.2 Entity identity and placement

Every category, collection, product, variant, banner, page, section, important CTA, search result, and recommendation placement has a stable ID. Text labels are display metadata, not identity. Reordering the homepage does not create a new logical section, but editing content creates a new revision.

A product card event includes the product and variant where relevant, list/placement ID, position, category or collection context, CMS revision, and impression ID. This distinguishes a product seen in search from the same product seen in a homepage row.

### 21.3 Minimum event envelope

```json
{
  "event_id": "random_unique_event_id",
  "schema_version": 1,
  "event_name": "product_card_click",
  "occurred_at": "2026-09-27T05:30:00Z",
  "received_at": "server_assigned",
  "session_id": "pseudonymous_session",
  "anonymous_id": "consented_browser_identifier_or_null",
  "user_id": "server_derived_if_authenticated",
  "consent_version": "privacy_v3",
  "consent_scope": "analytics",
  "page_view_id": "page_instance",
  "page_id": "home",
  "page_revision_id": "revision_12",
  "section_id": "featured_shirts",
  "section_revision_id": "revision_4",
  "entity_type": "product",
  "entity_id": "product_123",
  "variant_id": "variant_black_m",
  "placement_id": "home_featured_grid",
  "position": 3,
  "impression_id": "impression_456",
  "journey_id": "consented_journey_or_null",
  "cart_id": "opaque_cart_id_or_null",
  "checkout_id": "opaque_checkout_id_or_null",
  "campaign_id": "validated_campaign_or_null",
  "source": "web",
  "properties": {"ui_action": "open_product"}
}
```

Fields vary by event and have a strict allowlist. Do not collect form contents, passwords, address text, payment data, arbitrary DOM text, full query strings, or private URLs. Derive authenticated identity on the server rather than trusting a supplied user_id. Remove URL parameters that can contain secrets or personal information. Search text gets length limits, redaction, and restricted access.

### 21.4 Event dictionary

| Event family | Events | Authority and interpretation |
| --- | --- | --- |
| Navigation | page_view, category_view, collection_view | Client observed route/content views. |
| Exposure | section_impression, banner_impression, product_card_impression, cta_impression | Visibility based, not merely HTML rendered. |
| Interaction | category_click, collection_click, product_card_click, banner_click, cta_click | Link to the relevant impression when possible. |
| Product | product_view, variant_select, size_guide_open, availability_check | Product view is different from card exposure. |
| Search | search_submit, search_results_view, search_result_click, search_zero_results, search_refine | Capture query ID, result count, position, filters, and engine version. |
| Cart | cart_add_requested, cart_add_succeeded, cart_remove_succeeded, cart_quantity_changed | Distinguish button intention from successful server mutation. |
| Saved | wishlist_add, wishlist_remove, save_for_later | Guest and account scope clearly marked. |
| Checkout | checkout_started, checkout_step_view, checkout_validation_failed, shipping_selected, payment_method_selected | Error codes are allowlisted and contain no form values. |
| Payment | payment_attempt_created, payment_pending, payment_failed, payment_verified | Trusted state transitions from server/provider/manual approval. |
| Order | order_placed, order_confirmed, order_cancelled, order_line_fulfilled | Exactly one effective business event per transition. |
| After sale | delivery_recorded, return_requested, return_accepted, exchange_completed, refund_succeeded | Server records with source and item quantities. |
| Retention | review_submitted, support_ticket_created, repeat_order_confirmed | Business records, with consent checks for cross journey analysis. |

Instrument important controls with a semantic tracking component. Do not record every keypress or every DOM click by default. That creates privacy risk and noisy data without meaningful product decisions.

### 21.5 Measurement definitions

Proposed impression rule: at least 50% of the component visible for at least one second in an active tab, once per entity/placement/page view. This is our declared convention, not a universal standard. Very tall sections need a representative visible anchor or separate subcomponent metrics. Record the measurement version.

A click counts when an intentional supported interaction activates the element. Deduplicate duplicate listeners, not genuinely repeated actions. Keep total clicks separate from unique clickers and click bearing impressions.

| Metric | Definition for our dashboard |
| --- | --- |
| Views | Eligible entity view events after bot and duplicate filters. |
| Visible impressions | Eligible visibility events using the documented convention. |
| Total clicks | Accepted click events, including legitimate repeat clicks. |
| Unique visitors | Distinct consented identifiers within the selected period; known accounts and anonymous browsers are labelled. This is not a count of all human people. |
| Impression CTR | Impressions with at least one linked click divided by eligible impressions. |
| Unique click rate | Distinct observed clickers divided by distinct observed viewers, using the same identity and date scope. |
| Click frequency | Total clicks divided by impressions; may exceed 100%, so do not label it standard CTR. |
| Product add to cart rate | Observed product viewers who successfully added it divided by observed product viewers, within the declared window. |
| Product purchase rate | Observed product viewers with attributed confirmed purchases divided by observed viewers; show unattributed purchases separately. |
| Store conversion | Purchasing eligible sessions divided by eligible observed sessions; not all server orders divided by an incomplete traffic count. |
| Cart abandonment | Eligible cart cohorts without a confirmed order within the chosen window; classify still active and manual verification pending separately. |
| Checkout abandonment | Eligible checkout cohorts without confirmation within the chosen window; report technical failures separately. |
| Search zero result rate | Search submissions with zero matching results divided by accepted submissions. |
| Search usefulness | Result click/add/purchase rates and reformulations; results existing is not proof of usefulness. |
| Repeat purchase rate | Customers with at least two qualifying orders divided by purchasing customers in the declared cohort/window. |

Proposed default session timeout is 30 minutes of inactivity. Proposed cart/checkout observation window is 24 hours, with a later seven day recovery view. These are configurable reporting conventions, not universal abandonment facts. Exclude staff, test traffic, known bots, and synthetic monitors with explicit rules.

Daily unique counts cannot be summed to obtain monthly uniques. Compute distinct period membership or merge compatible cardinality sketches with disclosed approximation error. Anonymous browser resets and different devices cause uncertainty. Never use fingerprinting to pretend identity is perfect.

### 21.6 Revenue, category attribution, and profitability

Maintain separate measures: order value placed, confirmed merchandise sales, recognised revenue under the merchant's accounting policy, customer cash receipts, and net bank settlement. COD placed orders are not collected money. Tax is not merchant revenue.

Recommended management net merchandise sales equals recognised item sales excluding tax, less allocated discounts and recognised returns. Keep shipping income, shipping cost, payment fees, COD fees, packaging cost, return logistics, COGS, and recoveries as separate components. Contribution margin is not net profit; net profit also needs operating expenses and the approved accounting basis.

Each order line snapshots its primary reporting category and taxonomy version. Allocate its revenue once to that primary category; parent rollups include descendants. Products in multiple collections may receive assisted credit in several collection reports, but those reports are explicitly nonadditive. Do not sum them into total revenue.

Persist item cost and discount/tax allocation used for reporting, plus refund reversals. Allow current taxonomy and historical taxonomy views, labelled separately. Category moves must not silently rewrite historical reports. Return rates use mature delivery cohorts and distinguish units, orders, and value.

### 21.7 Banner and journey attribution

Capture consented internal campaign context from homepage banner to category/list to product to cart line to checkout to order. Preserve both first touch and last eligible internal touch. Proposed default: last eligible internal click within seven days receives primary attributed credit; direct/no observed touch remains unattributed. Assisted views are shown separately and never added to primary revenue.

A banner sale report means “sales attributed under this rule,” not “sales caused by this banner.” Changing attribution rules changes reported allocations, not the order ledger. Compare versions with an experiment only when sample size, random assignment, and a stable outcome definition justify it.

Journey view follows observed events such as Homepage > Category > Product > Cart > Checkout > Payment > Order. Show skipped steps, repeat visits, device changes only when lawfully linked, failed payment loops, and missing observations. Do not force all purchases into a linear funnel.

### 21.8 Collection, ingestion, storage, and processing

Our SDK batches permitted events and flushes on a short interval, page visibility changes, or sendBeacon where supported. Use bounded retry storage, payload limits, event IDs, and consent rechecks. Loss is possible; telemetry must never block checkout.

Our HTTPS ingestion endpoint validates schema, timestamps, allowed entities, session scope, size, and rate. It assigns received_at, filters obvious abuse, and writes durable records before acknowledging acceptance. Browser events cannot create trusted financial events. Keep anonymous collection endpoints separate from privileged admin commands.

At launch, use partitioned event documents with random IDs and carefully selected indexes. Aggregate through idempotent jobs into entity/day/placement metrics. Shard high traffic counters. Never update one product or one global daily document synchronously for every visitor event.

For larger volumes, retain compacted raw event partitions in Cloud Storage and process them with our hosting/Firebase workers. Use immutable batch manifests, checksums, event deduplication, transformation versions, and checkpoints. Firestore stores serving aggregates, bounded recent sessions, and job state. Avoid unbounded dashboard scans or a new SaaS warehouse dependency.

Proposed raw behavioural retention is 90 days, subject to approved purpose and legal review; aggregates can be retained longer only if appropriately deidentified. Financial records have a separate statutory policy. Access restrictions and deletion propagation include staged events, exports, identifiers, backups, and derived person level profiles.

Aim for behaviour dashboard freshness within five minutes at normal load and mark stale reports visibly. Financial totals follow committed business records, with a reconciliation timestamp. Exactly once processing is an effect achieved through idempotency and deduplication, not a guarantee that the transport delivers once.

### 21.9 Owner dashboard and entity performance tabs

Every product, category, collection, banner, and major page section gets a Performance tab. Show views, visible impressions, clickers, total clicks, click rate, successful cart additions/removals, wishlist additions, checkout entries, confirmed orders, attributed sales, and net returns where meaningful.

Example explanation: “Many shoppers viewed this product, but few added it to their cart. Size M was unavailable during most of this period.” Link to the evidence. Do not invent a causal explanation from correlation.

Reports cover revenue, contribution, orders, AOV, payment success, refunds, returns, fulfilment time, NDR/RTO, COD outstanding, stock age, sell through, stockouts, suppliers, customer cohorts, devices, consent coverage, traffic sources, campaign results, searches, and category/product performance. Geographic analysis uses coarse legitimate geography such as delivery state for orders, not covert precise location.

Show selected period, timezone, comparison, metric definition, sample size, data coverage, exclusions, attribution window, and freshness. Provide accessible tables, CSV exports with permissions, and plain language summaries. Google Analytics differences are expected because consent, identity, blocking, timezone, session rules, and attribution differ.

### 21.10 Analytics acceptance tests

1. One visible banner, one click, one paid order creates one eligible exposure, one click bearing impression, and one attributed order under the selected rule.
2. Rendering a banner below the fold without visibility creates no impression.
3. A repeated webhook and duplicate browser event do not double revenue or behavioural counts.
4. A customer refusing analytics can still buy; the financial order is counted, but no hidden journey is fabricated.
5. A COD order is reported separately from COD collected and remitted.
6. A partial refund reverses correct line, category, discount, and tax amounts without deleting the original sale.
7. An archived product or reordered section retains historical performance.
8. Daily uniques of 100 and 100 with 50 shared IDs produce 150 two day uniques, not 200.
9. Out of order events and late uploads are handled by the documented event time policy and backfill window.
10. Dashboard monetary totals reconcile to the trusted order/refund ledger; missing events show data quality alerts.

## 22. SEO and public product discovery

Generate crawlable HTML for public product, category, collection, and editorial pages. Use meaningful titles, descriptions, headings, breadcrumbs, canonical URLs, product images, social previews, internal links, XML sitemaps, and redirects. Archived products need a deliberate retained information page, relevant redirect, or genuine removal status; never redirect every unavailable product to the homepage.

Use Product and Offer data, genuine AggregateRating/Review data where eligible, ProductGroup for variants where appropriate, BreadcrumbList, and business policy information according to Google's supported formats. A generic category does not acquire a guaranteed rich result simply through a made up category schema type. Structured data must match visible price, availability, and review content. [S29]

Variants need stable addressable selections. Choose canonical treatment consistently with the actual single page or separate variant page design. Filtering and sorting create duplicate URL risks; define a small allowlist of valuable indexable landing pages and a crawl/index policy for the remaining facets. Do not assume robots.txt blocking alone removes an indexed URL or lets a crawler see a noindex directive. [S30]

Use real pagination links even when enhancing with load more. Keep out of stock pages informative when replenishment is expected. Add hreflang only for real localised equivalents. Generate share images from genuine product information. Search engine tools or product feed submissions are optional external operational tools, not hidden application dependencies.

CMS SEO controls include preview, canonical warnings, redirects after slug changes, sitemap inclusion, noindex for drafts and internal search pages where appropriate, broken link reports, and publication validation. Structured data does not guarantee rankings or rich result appearance.

## 23. Performance and accessibility

### 23.1 Proposed performance targets

Measure actual Indian mobile traffic and representative slower devices. Core Web Vitals good thresholds are LCP at most 2.5 seconds, INP at most 200 milliseconds, and CLS at most 0.1, evaluated at the 75th percentile. [S26]

Our initial engineering targets, to validate by load testing, are search API p95 below 500 ms, ordinary catalogue API p95 below 400 ms, internal checkout quote p95 below 800 ms, and durable webhook acknowledgement p95 below two seconds. These exclude uncontrolled bank/customer interaction and are not provider promises.

Use responsive image derivatives, modern formats with fallbacks, explicit dimensions, carefully prioritised hero images, lazy loading below the fold, code splitting, small client component boundaries, server rendering, and cacheable public content. Avoid lazy loading the main above the fold image. Prefer CSS motion with reduced motion support; no decorative 3D.

### 23.2 Cache and freshness policy

Public catalogue and CMS pages can use hosting CDN and Next.js cache/revalidation. Choose cache tags and revision keys for products, collections, pages, and menus. Invalidate on publish, archive, price change, and relevant stock availability changes. Multi instance deployments need coordinated cache behaviour. [S31]

Never publicly cache account pages, private order data, admin responses, personalised tokens, or checkout quotes. Public stock can be slightly stale, but server reservation is authoritative. If stock or payment authority is unavailable, prevent new commitment rather than invent success.

### 23.3 Accessibility acceptance

Target WCAG 2.2 AA for both storefront and admin. Test keyboard navigation, focus order and visibility, skip links, form labels, meaningful errors, screen reader announcements, contrast, text zoom, reflow, accessible dialogs, descriptive links, image alternatives, captions, touch targets, and reduced motion. Authentication should permit password managers and paste. Drag interactions require keyboard/button alternatives. [S27]

Tables need headers; charts need readable data tables and noncolour distinctions. Filters announce result changes without excessive interruption. Payment handoff needs focus recovery and an accessible fallback support route. Test with assistive technology and people, not only an automated score.

## 24. Security, privacy, fraud, and Indian compliance

### 24.1 Application security requirements

Use server enforced object and function authorisation. Knowing an order ID never grants access. Firebase Admin SDK calls bypass client Security Rules, so backend code and IAM must enforce permissions independently. Separate public catalogue projections from private supplier, cost, customer, and payment data. [S28]

Secure cookies, session rotation, CSRF controls, CSP, output encoding, sanitised rich text, parameter validation, dependency updates, secret management, and TLS are Essential. Rate limit login, search, checkout, coupon testing, uploads, and analytics separately. Use Firebase compatible App Check where appropriate after verifying its underlying provider; it is not a substitute for authorisation or payment verification.

Validate upload size, type by content, dimensions, duration, and ownership. Quarantine untrusted media; decode/reencode supported images, strip location metadata, scan where feasible on our infrastructure, and reject active content or unsafe SVG. Private evidence uses authorised access, not permanent public links. Remote image imports need SSRF protections and an allowlist.

Protect logs from secrets and personal data. Record security relevant events with retention and access policies. Separate production, staging, and development projects; use synthetic or masked test data. Rotate provider secrets, review IAM, require MFA for staff, and revoke sessions on role changes.

Fraud rules can review velocity, repeated failed payments, duplicate references, unusual quantities, repeated COD refusals, and suspicious account changes. Avoid automatically rejecting ordinary shared households or legitimate customers from a PIN code. Human review and appeal are part of the workflow.

### 24.2 India compliance register

This is an implementation register, not a legal opinion. Merchant registration, product class, operating model, turnover, and launch date determine applicability. A qualified Indian legal/tax reviewer should sign off configuration before trading. Do not hardcode tax rates or regulatory thresholds from this document.

| Area | Build requirement | Evidence and applicability |
| --- | --- | --- |
| Consumer protection | Business identity, contacts, accurate total price, clear delivery/return/refund terms, grievance officer details, complaint tracking | Ecommerce Rules and official consumer guidance. Complaint acknowledgement within 48 hours and redress within one month are stated requirements. [S24] |
| Fair selling | No fabricated scarcity, hidden add ons, prechecked purchases, disguised ads, fake reviews, or obstructive cancellation | Dark Patterns Guidelines, 2023. Review purchase and promotion flows. [S25] |
| Packaged goods | Structured declaration fields, including applicable manufacturer/packer/importer identity, generic name, quantity, MRP, consumer contact, origin, and other product specific requirements | Legal Metrology rules and amendments. Online and package requirements are not identical. Validate current product category applicability. [S32] |
| Product standards | Product compliance documents, supplier evidence, stop sale and recall controls | Review BIS/QCO and other sector rules for actual goods, particularly when expanding product classes. |
| GST | Merchant registration mode, tax classification, place of supply, invoice/credit note records and exports | Configure with the merchant's accountant; invoice particulars are addressed by GST rules. [S33] |
| Electronic invoice/reporting | Store applicability, IRN/acknowledgement data and official documents when required; manual export/import route | An internally generated PDF is not IRP reporting. Current authorised IRP guidance identifies a 30 day reporting limit for AATO ₹10 crore and above from April 2025; mandate applicability is a separate test. [S34] |
| Privacy | Purpose specific notices, data minimisation, appropriate consent, correction, deletion, grievance and breach processes | DPDP Act and Rules have phased commencement. Track dates provision by provision. [S35, S36] |
| Children's data | Appropriate age/guardian workflow if serving children; avoid behavioural tracking or targeted advertising directed at children where restricted | Design to the applicable DPDP protections, with legal review of exceptions and commencement. [S36] |
| Security incident response | Incident owner, evidence preservation, reporting decision, legal clock, log policy | Review CERT-In applicability and reporting directions, including covered incident categories. [S37] |
| Marketing communications | Channel consent, opt out, suppression, sender/template registration where required | SMS/WhatsApp/email delivery is deferred; compliance review is required before enabling a new transport. |
| Payment information | Hosted/provider payment handling, tokenisation only where supported, no raw card/CVV/UPI PIN storage | Razorpay contracts and applicable payment requirements; provider use does not remove merchant responsibilities. |

The DPDP commencement notification provides immediate, one year, and eighteen month stages from Gazette publication. As of this research date, do not describe every substantive obligation as already in force. Build the privacy controls now and maintain a dated compliance checklist against the official notification rather than relying on a news headline saying the law is fully operational. [S35]

### 24.3 Privacy engineering

Separate essential checkout processing, optional behaviour analytics, personalisation, marketing, and security processing. For optional analytics/personalisation, use clear choice and honour withdrawal. Where a different legal basis or exception is relied on, document it rather than quietly classifying all tracking as essential.

Keep a consent ledger with notice version, purpose, time, channel, source, and withdrawal. Do not bundle marketing with purchase agreement. Avoid collecting date of birth or gender without a concrete purpose. Do not fingerprint visitors to bypass refusal.

Account deletion is a workflow: reauthenticate, identify data, separate legally required financial retention from removable profile/behaviour data, stop marketing, revoke sessions, delete or deidentify appropriate records, notify completion in the available channel, and preserve a minimal request audit. Legal holds need a reason and review date. Exports require secure, expiring authorised downloads.

Choose appropriate Indian regions where available for operational data and latency, but do not claim Firebase guarantees all identity, telemetry, support, or AI processing stays in India. Document actual processing locations and subprocessors. A domestic deployment choice is not a blanket legal conclusion about localisation.

## 25. Tax, invoices, accounting, and money model

Configure legal entity, business address, GSTIN if registered, registration type, dispatch locations, financial year, invoice series, HSN classifications, effective dated rates, place of supply logic, and tax inclusive/exclusive behaviour. Indian consumer prices should clearly show the payable tax inclusive amount where applicable.

Server calculations determine the appropriate CGST/SGST or IGST treatment using the actual supply facts and accountant approved rules. Do not infer it solely from a browser location. Support billing details and GSTIN input for business customers, with syntax checks and a separate verification status. A syntactically valid GSTIN is not proof of active registration.

Invoices snapshot supplier/recipient particulars, number and issue date, items, quantity, HSN where applicable, taxable values, discounts, tax rates and amounts, place of supply where required, shipping and other charges, total, and relevant references. Use unique fiscal series with safe allocation and void records. Issued numbers are not casually reused. [S33]

Keep invoice, credit note, debit note where applicable, refund receipt, delivery challan where applicable, and payment receipt as separate document types. An unregistered or composition/exempt scenario may require a different document rather than a tax invoice. Finance must configure that distinction.

A refund may require a credit note and tax adjustment under the applicable rules; it does not simply delete the invoice. Preserve original and corrective documents, revision evidence, and reporting period. Export sales, returns, tax, settlement, receivable, fee, and inventory valuation reports with a documented chart of mappings for the accountant.

If electronic invoicing or an e way bill applies, staff use the official system and import the acknowledgement/document. Block dispatch when a legally required document is missing. Future direct official APIs are outside the current service list unless separately permitted. Never generate a lookalike government QR and call it compliant.

Gift cards, store credit, affiliate payables, COD receivables, gateway settlements, shipping recoveries, and supplier balances need distinct ledgers. This operational subledger is not automatically a complete general accounting system. Provide accountant ready exports before considering a custom full general ledger.

## 26. Technical architecture and data model

### 26.1 Recommended architecture

Start with a modular monolith: one coherent codebase with isolated domain modules, a storefront, an admin application, command APIs, query APIs, and background workers. Split deployment units where needed for security and workload, without starting with dozens of microservices.

| Layer | Recommended implementation | Reason |
| --- | --- | --- |
| Public web | Next.js App Router and React, semantic HTML, CSS | Crawlable content and selective interactivity. |
| Admin | React/Next.js authenticated workspace | Shared design system, distinct permission boundary. |
| Backend | Our Node.js domain services in Firebase Functions and/or allowed hosting compute | Trusted calculations and transition rules. |
| Identity | Firebase Authentication; suitable Identity Platform features | Avoid custom identity infrastructure. |
| Operational database | Firestore with explicit transaction and index design | Fits the required service boundary. |
| Media/documents | Cloud Storage, private/public separation, generated derivatives | Controlled uploads, stable references, authorised documents. |
| Search | Internal service, Firestore Enterprise prototype or our hosted index | No external search SaaS. |
| Jobs | Durable outbox and retryable workers; Firebase task/scheduled functions where suitable | Reliable asynchronous effects. |
| Cache/CDN | Hosting CDN and Next.js supported caching | Cache public reads while keeping authoritative writes. |
| Analytics | Our ingestion, Firestore aggregates, Storage partitions, own workers | Own behavioural and business metrics. |
| Payments | Razorpay adapter plus manual UPI/COD services | Separate provider and internal lifecycle. |
| AI | Server only Nemotron adapter | Optional bounded dependency. |
| Monitoring | Hosting/Firebase logs and metrics plus our operational health views | No mandatory error monitoring SaaS. |

Firebase scheduling, task queues, functions, and hosting may provision supporting Google Cloud infrastructure with separate billing. Document enabled resources and IAM. Do not install a Firebase extension that quietly introduces an unapproved vendor.

### 26.2 Domain boundaries

Catalogue owns product facts and publication. Pricing owns quotes and promotion calculations. Inventory owns movements and reservations. Checkout coordinates quotes and orders. Payments owns attempts and reconciliation. Orders owns accepted line commitments. Fulfilment owns packages and shipment facts. Returns owns reverse logistics. CMS owns content releases. CRM/support owns interactions. Analytics owns observations and reports. Identity/access controls all domains.

No domain edits another domain's authoritative ledger directly. Use commands and durable events. A read projection can duplicate display data, but it has an owner, version, refresh process, and rebuild mechanism.

### 26.3 Core entities and relationships

| Entity group | Main records | Important relationships and fields |
| --- | --- | --- |
| Merchant | stores, legal_entities, locations, settings_versions | Currency, timezone, tax mode, policy references. |
| Catalogue | products, variants, product_types, attributes, media_assets | Product to many variants; unique SKU claim; schema and publication version. |
| Discovery | categories, category_memberships, collections, collection_rules, menus | Parent IDs, ancestry, canonical reporting category, rule versions. |
| Content | pages, page_revisions, section_revisions, release_manifests | Immutable revisions and atomic published release pointer. |
| Customers | customers, addresses, preferences, consent_records, privacy_requests | Auth UID mapping, verification states, restricted fields. |
| Shopping | carts, cart_lines, quotes, checkout_attempts | Version, expiry, currency, calculation snapshot, idempotency key. |
| Orders | orders, order_lines, order_events, amendments | Immutable purchase snapshots and remaining quantities. |
| Inventory | stock_balances, stock_movements, reservations, allocations | Variant/location, movement source, expiry, quantity, sequence/version. |
| Procurement | suppliers, purchase_orders, receipts, transfers, counts | Expected and received quantities, cost, approval, discrepancy. |
| Payments | payment_attempts, payment_receipts, manual_payment_submissions | Order binding, provider IDs, amount, state, reconciliation evidence. |
| Finance | refunds, settlements, settlement_lines, disputes, ledger_entries | Original payment, pending refund cap, signed amount, reconciliation. |
| Fulfilment | fulfilments, packages, shipments, shipment_events, manifests | Order line allocations, carrier, AWB, source, cost, evidence. |
| Reverse logistics | return_requests, return_lines, inspections, exchange_links | Policy snapshot, original/replacement order, quantity dispositions. |
| Documents | invoices, credit_notes, document_files | Fiscal sequence, immutable issue snapshot, private file reference. |
| Growth | promotions, redemption_holds, loyalty_entries, gift_balances, campaigns | Rule version, eligibility, balances, expiry, reversal reference. |
| Support | tickets, public_messages, internal_notes, review_records, questions | Order/customer links, access scope, moderation state. |
| Access | staff_memberships, roles, permissions, approvals, audit_events | Actor, scope, before/after, reason, reauthentication context. |
| Reliability | outbox, inbox, jobs, leases, dead_letters, idempotency_records | Event ID, attempt, checkpoint, next retry, payload hash. |
| Analytics | events, session_summaries, identity_links, metric_rollups, manifests | Consent, entity/revision, attribution, calculation version, freshness. |

Split unbounded arrays such as order history, reviews, events, and messages into documents/subcollections. Use random internal IDs to avoid sequential write hotspots; human order numbers are separate fields. Avoid large documents with all variants or all events embedded. [S22]

### 26.4 Invariants and transaction boundaries

1. A sellable SKU has one active unique registry entry within the merchant.
2. A quote and all order lines share a declared currency and server calculation version.
3. Normal reservations cannot reduce available stock below zero.
4. Shipped plus cancelled quantities cannot exceed ordered quantity, accounting for explicit amendments.
5. Returned quantities cannot exceed eligible delivered quantity minus prior accepted returns.
6. Completed plus pending refunds cannot exceed verified refundable receipts.
7. A provider payment is bound to at most one internal payment receipt/order association unless an explicit supported allocation model exists.
8. Every irreversible state change has an audit/event record and idempotency protection.
9. Published content points only to valid approved revisions.
10. Analytics mutations cannot modify financial truth.

Checkout transaction should validate bounded cart lines, reserve stock and coupon/credit usage, persist order intent, and write an outbox event atomically where supported. Bound cart size to tested transaction limits. Payment success consumes the reservation into allocation once. Shipping reduces physical stock and allocation once. Returns enter unavailable stock before approved restocking.

External systems cannot participate in a Firestore atomic transaction. Use a saga: persist intent, perform side effect, record outcome, retry/reconcile unknown results, and run a compensating action if needed. Do not promise a distributed exactly once transaction. [S22]

### 26.5 Query and index planning

Define queries before screen implementation: orders by operational queue/time/location; products by publication/type/category; stock by location and alert state; tickets by assignee/status; refunds by state/age; and reports by entity/date.

Use appropriate composite indexes, cursor pagination, bounded page sizes, denormalised public projections, and precomputed aggregates. Exempt unnecessary large fields from indexing where supported. Watch hot documents, wide index fanout, contention, and expensive scans. Staff list screens should not open unrestricted realtime listeners to the entire business database.

## 27. API contracts, integrations, and automation

### 27.1 API style

Use versioned REST/JSON command and query endpoints initially. GraphQL is Optional if several clients later require flexible read composition. It is not necessary just to appear modern. Publish an OpenAPI contract, validation schemas, error catalogue, authentication requirements, pagination conventions, and idempotency semantics.

| Endpoint example | Purpose | Key controls |
| --- | --- | --- |
| GET /api/v1/catalog/products | Public filtered catalogue | Published fields only, bounded queries. |
| GET /api/v1/search | Suggestions/results | Query limits, index version, cache rules. |
| POST /api/v1/carts/{id}/lines | Add/change item | Ownership/capability, cart version, variant validation. |
| POST /api/v1/checkout/quote | Calculate payable total | Trusted prices, tax, shipping, promotion engine. |
| POST /api/v1/orders | Place order | Idempotency, quote version, reservation transaction. |
| POST /api/v1/payments/razorpay/start | Create payment attempt | Bound order, amount/currency validation. |
| POST /api/v1/payments/manual/submit | Submit UPI claim | Order access, private evidence, no auto verification. |
| POST /api/v1/webhooks/razorpay | Receive provider event | Raw signature, dedupe, durable inbox. |
| POST /api/v1/admin/payments/{id}/verify | Verify manual payment | Finance role, evidence, audit. |
| POST /api/v1/admin/orders/{id}/commands | Approved state transitions | Action allowlist, version, policy and permission checks. |
| POST /api/v1/returns | Request return | Ownership, quantity, policy snapshot. |
| POST /api/v1/admin/refunds | Create refund intent | Approval, cap, idempotency, reconciliation. |
| POST /api/v1/admin/content/releases | Publish CMS release | Validation, permission, revision conflict check. |
| POST /api/v1/events | Behaviour ingestion | Consent, schema, rate limits, no trusted purchase creation. |
| GET /api/v1/admin/reports/entities/{id} | Performance tab | Scope, period limits, defined metrics. |

Errors contain code, plain language message, field details where safe, retryability, and request ID. Never return stack traces or another customer's existence. Bulk jobs return a job reference and per row result report. Mutations carry expected_version to avoid overwriting concurrent changes.

### 27.2 Adapter boundaries

Define PaymentProvider, ShippingProvider, NotificationTransport, SearchService, AIProvider, TaxReportingAdapter, AccountingExport, and AnalyticsSink interfaces. Only permitted implementations are enabled. A manual shipping adapter supports entry/import; it does not pretend to be a live courier API.

Future integrations with Delhivery, Shiprocket, CRM, accounting, ERP, warehouse systems, marketplaces, email, SMS, or Meta remain deferred. Document needed commands/events, credentials, consent implications, reconciliation, error handling, and removal behaviour. Do not build an external app marketplace before an actual partner need.

### 27.3 Own automation engine

Use event or schedule, conditions, action, approval policy, retry policy, and run history. Supported initial actions include create task, change an eligible internal status, alert staff, publish an approved scheduled release, generate a report, or send an allowed notification.

Examples: low available stock creates a reorder task; unpaid reservation expires and releases; manual UPI pending beyond the operating target escalates; delivered order enables review; refund unknown creates reconciliation; old NDR becomes urgent; campaign expiry restores the nominated content release.

Prevent loops with event lineage, maximum chain depth, deduplication, and per rule rate limits. Include dry run, rule version, pause/kill switch, permission scope, and failed run replay. A refund or bank destination change never becomes an unrestricted automation action.

## 28. Infrastructure, scale, and reliability

### 28.1 Workload model and capacity gates

Capacity claims require measurements. Proposed qualification stages are examples, not promised service limits: launch tests with 10,000 products/100,000 variants; a growth test with 100,000 products/1,000,000 variants; and traffic tests based on expected page views, event volume, concurrent checkout attempts, and peak orders. Revise these to actual business needs before procurement.

Test skew, not only averages: a flash sale on one variant is much harder than evenly distributed purchases. Load tests must include inventory contention, webhook bursts, search facets, bulk imports, CMS release invalidation, and analytics backlog at the same time.

Use hosting autoscaling where available, controlled worker concurrency, bounded queues, admission control, and backpressure. For severe contention, introduce per SKU serialized allocation or tested stock token partitioning with strict conservation. Randomly sharding counters alone does not solve overselling.

### 28.2 Durable background jobs

Jobs include media transformation, import/export, catalogue projection, search indexing, invoice generation, scheduled publication, reservation expiry, payment reconciliation, shipment imports, notifications, analytics aggregation, backups, and privacy deletion.

Each job has an ID, type, input version, attempts, next_run_at, lease expiry, checkpoint, status, and failure reason. Workers are idempotent and safe after a crash. A scheduler wakes due work; a sweeper recovers expired leases. Use exponential backoff with jitter, bounded attempts, a dead letter queue, operator replay, and rate limits appropriate to each provider.

Store outbox events in the same transaction as the business mutation when possible. An asynchronous worker delivers them. This prevents a successful order from losing its downstream fulfilment or analytics task because a process crashed between two writes.

### 28.3 Monitoring and operating objectives

Proposed initial availability objective: 99.9% monthly for core internal checkout APIs, with provider failures reported separately. Track request failures, latency, reservation conflicts, stuck payments, duplicate provider events, webhook lag, queue age, search freshness, stock discrepancies, refund backlog, analytics coverage, and backup success.

Expose actionable staff health notices and deeper engineering metrics. Structured logs carry request/order/job correlation IDs without full personal records. Cost alerts, Firebase quotas, hosting limits, storage growth, and NVIDIA throttling require visible operational ownership.

### 28.4 Backup, disaster recovery, and failover

Back up database records, media, rules, indexes, IAM/configuration, source release identifiers, and secrets recovery procedures separately. Enable supported point in time recovery and scheduled backups with retention and permissions matched to the selected edition. Test restore into an isolated environment and verify order/payment/stock consistency.

Proposed recovery targets are RPO at most 15 minutes and RTO at most four hours for core operations, subject to infrastructure verification and a measured restore drill. Do not advertise them until achieved. Payment providers remain an external reconciliation source after recovery.

Choose regional/multiregional options consciously. Replication is not backup, and a backup is not an automatic failover plan. During a database outage, serve safe cached browsing where possible and pause new orders. After restoration, reconcile payments made near the incident, prevent repeated refunds, replay outbox work safely, and communicate affected orders.

### 28.5 Deployment and change safety

Use distinct environments, versioned migrations, schema compatibility, feature flags, automated build checks, dependency scanning, staged rollout, and a tested rollback. Never deploy an irreversible migration and assume a frontend rollback restores old data. Long imports and backfills use resumable jobs with progress and pause controls.

Keep business configuration reviewable and exportable. The owner should not need access to raw infrastructure consoles for routine work, while engineering still owns operational response and releases.

## 29. Mobile, languages, and international readiness

Build a responsive mobile first website and a usable mobile admin for quick stock updates, order review, photo upload, and support. Complex bulk editing can remain optimised for larger screens, but the mobile interface should explain that clearly rather than hiding unfinished work.

An installable PWA is Important if repeat customers or warehouse users benefit. Cache safe public assets and provide an offline explanation. Never let an offline page imply a payment succeeded, stock was reserved, or a stale price is final. Clear private caches on sign out. Push support and installation behaviour vary by device and browser, so capability detect and offer a functional nonpush path.

A native application is Optional, justified by repeat usage, reliable scanning/device integration, store distribution, deeper push requirements, or measured limitations of the web experience. Use the same authenticated domain APIs. Do not build separate business logic and inventories for web and mobile. Native delivery introduces app store and platform dependencies requiring an explicit scope decision.

International readiness should exist in the model without pretending international operations are enabled. Keep currency on every money record, locale on content, country on addresses, and market specific price/policy/availability rules. Never mix currencies in totals without a declared reporting conversion basis.

International launch needs verified payment account capability, customs documentation, shipping contracts, duties and Incoterms where applicable, returns arrangements, tax advice, customer disclosures, and regional privacy rules. Use manually maintained exchange rates with effective dates if no FX API is allowed, or fixed regional price books. Distinguish display currency from charged and settled currency. Enable countries only after their operational checklist passes.

## 30. Complete customer and staff journeys

### 30.1 Customer scenarios

| Journey | Sequence | Failure/recovery requirement |
| --- | --- | --- |
| New guest purchase | Landing page, category/search, product, variant, cart, guest details, delivery, Razorpay, confirmation, tracking, delivery | Input preserved; unknown payment reconciled; no forced signup. |
| Manual UPI buyer | Checkout, QR instructions, bank payment, reference/evidence, verification pending, verified order | Clear waiting state; amount mismatch and late payment handled. |
| COD buyer | Eligibility, final total, place order, confirmation, shipment, collection, delivery | NDR/reschedule/refusal handled without claiming bank remittance. |
| Returning customer | Sign in, saved address, wishlist/reorder, current variant/price check, checkout | Old order prices/stock are not silently reused. |
| Product discovery | Search, synonym/correction, facet, comparison if useful, size guide, product selection | Zero results offer recovery; unavailable sizes remain explicit. |
| Cancellation | Open eligible order, select remaining items, see consequence, confirm, refund tracking if paid | Atomic quantity checks prevent cancelling already shipped units. |
| Return | Delivered order, eligible item, reason, optional evidence, request, approval, pickup, inspection, refund | Rejection explained; appeal route; partial acceptance supported. |
| Exchange | Choose replacement size, eligibility, reservation, original return, inspection, replacement shipment | Replacement stock expiry and price difference have clear handling. |
| Review and repeat purchase | Delivery, review request in allowed channel, moderated review, optional follow/reorder | Genuine negative feedback preserved; return status does not erase history. |
| Privacy request | Account settings, identity verification, export/deletion request, status, completion | Legal retention explained; marketing suppressed promptly. |

### 30.2 Internal journeys

| Role | Start of work | Main flow | Completion and handoff |
| --- | --- | --- | --- |
| Owner | Today dashboard | Review sales, cash due, exceptions, approvals, low stock | Assign tasks and confirm finance/operations resolution. |
| Manager | Needs attention queue | Prioritise late orders, short picks, NDR, returns | Resolve exception with evidence and customer communication task. |
| Product manager | Drafts/catalogue health | Add/import, validate variants/media/declarations, preview, publish | Search/CMS projections updated or failure queued. |
| Warehouse receiver | Expected receipts | Scan PO delivery, inspect, count, receive, bin | Stock available only after acceptance; discrepancy to procurement. |
| Warehouse dispatcher | Orders to pack | Pick, scan, pack, documents, courier booking, handoff | Shipment event recorded; tracking task created. |
| Support agent | Assigned tickets | Verify access, inspect order context, reply, propose remedy | Resolution recorded; finance/warehouse handoff if needed. |
| Marketing | Campaign calendar | Select products, create offer/content, preview audience, approve, schedule | Measure engagement and attributed sales with caveats. |
| Finance | Verification and reconciliation | Verify UPI, match settlements/COD, approve refunds, export tax | Close matched items; unresolved differences remain visible. |
| Administrator | Access review | Invite/role/MFA, audit, suspend, recovery | Sessions revoked where needed; last owner protected. |
| Engineer/operator | Health and job dashboard | Inspect latency, failed jobs, reconciliation, backup restore | Replay safely, record incident, verify recovery. |

## 31. Requirements added beyond the original list

| Missing or underemphasised requirement | Why it matters | Proposed treatment |
| --- | --- | --- |
| Product and policy snapshots | Current edits must not alter past customer promises | Essential immutable order line references and snapshots. |
| Payment disputes and chargebacks | A successful charge can later be contested | Essential evidence/deadline queue and finance ledger. |
| Bank settlement and COD remittance | Sales do not equal cash in the bank | Essential reconciliation and outstanding balances. |
| Inventory reservation expiry races | Late payment can arrive after stock release | Essential paid/unallocated exception and compensation. |
| Outbox/inbox and idempotency | Retries are normal across distributed systems | Essential duplicate safe processing and replay. |
| Lost/damaged shipment claims | Physical logistics has failures outside normal returns | Essential exception records, evidence, remedy and recovery. |
| Procurement discrepancies | Received goods may differ from purchase orders | Important partial receipts and supplier claims. |
| Warranty and recalls | Defects may require action after the usual return window | Important workflow; Essential if product risk requires it. |
| Package and landed cost | Profit estimates otherwise omit major costs | Important cost snapshots and reconciliation. |
| Content release manifests | Multiple page/menu edits must publish consistently | Essential atomic release and compatible rollback. |
| Concurrent editing conflicts | Staff can overwrite each other's work | Essential version checks and conflict resolution. |
| Accessibility in administration | The owner and staff need usable controls too | Essential WCAG oriented testing across both surfaces. |
| Data quality and metric dictionary | Misleading metrics cause bad business decisions | Essential definitions, freshness, coverage, and reconciliation. |
| Consent and identifier lifecycle | Owning tracking does not remove privacy obligations | Essential purpose controls, withdrawal, and deletion propagation. |
| Export safety and permissions | CSVs can leak data or execute spreadsheet formulas | Essential scoped exports and safe escaping. |
| Operational staffing | Manual verification and courier updates take time | Essential queue ownership, operating hours, and escalation. |
| Training and recovery | Novices need to learn without financial mistakes | Essential guided help; Important safe training environment. |
| Feature kill switches | A failing campaign or integration needs fast containment | Essential pause controls that preserve audit history. |
| Backup restoration evidence | A successful backup job does not prove recovery | Essential restore rehearsal and reconciliation. |
| Ownership handover | A store must survive staff and developer changes | Essential documentation, role transfer, credential recovery. |
| Catalog migration and redirects | Moving from an old store can lose traffic and history | Optional migration plan with mapping, dry run, and reconciliation. |
| Store pickup and offline sales | Physical stores may share the same stock | Optional pickup flow and manual sales entry; POS integration deferred. |
| Gifting | Gifts need message, packaging, and privacy choices | Optional gift note/wrap and packing slip controls. |
| Restricted products and destinations | A general physical goods catalogue can grow into regulated categories | Essential classification and launch checklist before enabling such goods. |
| Business continuity without AI/GA | Core operations cannot depend on optional tools | Essential graceful disablement and deterministic workflows. |

## 32. Feature prioritisation and rationale

Priority applies to complete usable workflows, including errors, permissions, and reports. A launch “refund feature” without reconciliation is incomplete. Optional means conditional, not inferior. Features blocked by service restrictions remain blocked regardless of priority.

### 32.1 Essential: launch

| Feature family | Included scope | Why Essential |
| --- | --- | --- |
| Storefront | Homepage, category/collection listings, product pages, search baseline, filters, cart, checkout, policies, help | Customers need to discover, trust, and buy. |
| Catalogue | Product/variant CRUD, archive/restore, media, prices, tax facts, SKUs, category/menu management, bulk baseline | Owner must maintain actual sellable goods. |
| Website editor | Core sections, header/footer, navigation, drafts, preview, publish, revisions, rollback | Routine content changes must not need a developer. |
| Identity | Guest checkout, Google/email authentication, recovery, order access, staff MFA | Purchase convenience and protected accounts. |
| Payments | Razorpay, manual UPI verification, COD, failure recovery, refunds, reconciliation | Required payment methods must be financially reliable. |
| Orders | Independent lifecycle dimensions, line quantities, cancellation, timelines, documents | Prevents state confusion and enables support. |
| Inventory | Variant/location stock model, reservations, movement history, adjustments, low stock | Avoids selling unavailable stock. One active warehouse is acceptable initially. |
| Fulfilment | Pick/pack, manual courier/AWB, tracking updates, partial shipment support, NDR/RTO queues | Physical orders need reliable dispatch and exception handling. |
| Returns | Eligibility, requests, inspection, refunds, basic exchanges, status | Required customer remedies and financial correctness. |
| Admin | Task queues, guided forms, search, quick actions, clear errors, drafts, audit trail | Owner can operate the business safely. |
| Support | FAQs, order linked tickets, internal notes, manual communication workflow | Customers need help even without external messaging APIs. |
| Promotions | Basic coupons/automatic offers, dates, limits, stacking rules | Common retail need with misuse protection. |
| Analytics | First party event contract, core entity metrics, funnel, financial totals, coverage controls | Required ownership of commerce insight. |
| Security/compliance | RBAC, upload protection, logs, privacy choices, product declarations, tax configuration | Prevents avoidable harm and launch blockers. |
| Reliability | Idempotency, jobs, reconciliation, backups, recovery, monitoring | Failure paths are normal production behaviour. |
| Accessibility/performance | Responsive flows, keyboard access, readable forms, measured performance | Required for ordinary mobile shoppers and novice staff. |

### 32.2 Important: soon after launch

| Feature family | Included scope | Why next |
| --- | --- | --- |
| Retention | Wishlist sync, recently viewed, back in stock interest, reorder | Useful after basic buying works. |
| Discovery | Better synonyms, typo handling, search analytics, related products | Improve conversion using observed demand. |
| Catalogue operations | Rich bulk tools, advanced import mapping, scheduled launches, supplier details | Reduce repetitive work as catalogue grows. |
| CMS | More section types, campaign calendar, reusable blocks, approval workflow | Supports frequent merchandising safely. |
| Procurement | Purchase orders, partial receiving, counts, stock age | Improves stock planning and margin reliability. |
| Reviews/questions | Photo reviews, moderation, replies, fit feedback, requests | Builds useful evidence once real orders exist. |
| CRM/support | Segments, saved replies, SLA dashboards, staffed chat | Better service without adopting an external CRM. |
| Analytics | Cohorts, category/revision comparisons, returns and margin drilldowns | Turns reliable source data into better decisions. |
| AI assistance | Reviewed copy, classification, support drafts, report explanation | Saves time without controlling transactions. |
| PWA and locale | Installability, useful consented push, reviewed Hindi interface | Validate demand and support capability first. |

### 32.3 Advanced: mature platform

| Feature family | Included scope | Why later |
| --- | --- | --- |
| Warehouse optimisation | Multi warehouse allocation, wave picking, transfer optimisation | Requires scale and correct stock foundations. |
| Forecasting | Demand forecasting, stockout adjustment, seasonality, reorder recommendations | Needs sufficient clean history and backtesting. |
| Personalisation | Segment/account recommendations, measured experiments | Requires consent, sample size, and baseline comparisons. |
| BI | Large event compaction, flexible cohort jobs, attribution comparisons | Workload and decision value should justify complexity. |
| Fraud modelling | Evaluated risk models with human review | Data quality, bias, and false positives matter. |
| Enterprise controls | Delegated budgets, complex approvals, granular field/location rules | More staff and financial exposure justify added controls. |
| Operations scale | Sophisticated traffic admission, partitioned allocation, recovery automation | Introduce after measured contention or reliability need. |

### 32.4 Optional: business dependent

Gift cards, store credit beyond basic remedies, loyalty, referrals, affiliates, B2B price books, store pickup, local delivery fleet, offline sales entry, subscriptions, preorders, backorders, gift wrap, comparison tools, serial/batch tracking, native apps, multiple currencies, international shipping, and regional price books.

Enable each only with a named owner, customer benefit, operational policy, finance treatment, and acceptance tests. A native app or loyalty programme is not proof that the store is mature.

### 32.5 Unnecessary or over engineered by default

Decorative 3D, mandatory shopping chatbot, autonomous refunds, AI invented product claims, blockchain order tracking, a custom payment gateway, custom cryptography, an external app marketplace, microservices for every feature, unrestricted drag anything website editing, collecting every keystroke, unlimited raw behavioural retention, real time recalculation of every report, and a new full ERP/general ledger before export workflows fail.

Avoid hidden provider substitutions, unpaid free API assumptions, a single status for the entire order, one global analytics counter, and treating a screenshot as proof of payment. These are design errors rather than advanced features.

### 32.6 Dependency blocked capabilities

Automated courier booking/tracking, outbound WhatsApp, general SMS, transactional/marketing email delivery, direct accounting/ERP/marketplace synchronisation, automatic bank feed verification, government reporting APIs, and a third party analytics warehouse are not active deliverables under the current allowed service list. Their manual alternatives are included. Enabling them later requires an explicit service policy change.

## 33. Development milestones and reviewable outputs

| Milestone | Concrete outputs | Exit gate |
| --- | --- | --- |
| M0: decisions and research validation | Business rules, service boundary, compliance register, representative catalogue, UX task scripts | Merchant model and manual operating responsibilities confirmed. |
| M1: architecture and design foundation | Domain schema, API contracts, design system, permissions, environments, event dictionary | Threat review; stock/payment prototypes and search edition spike pass. |
| M2: catalogue and CMS | Products/variants, media, categories, navigation, public pages, editor and release history | Owner adds a real representative product and safely publishes/rolls back content. |
| M3: identity and commerce | Guest/account flow, quote engine, cart, three payment methods, order creation | Payment retries, webhook duplication, concurrency, and late payment scenarios pass. |
| M4: physical operations | Inventory, pick/pack, courier manual workflow, tracking, returns/exchanges/refunds | A complete test order reaches delivery and a partial refund with reconciled stock/money. |
| M5: owner operations and analytics | Today queues, CRM/support, invoices, permissions, entity dashboards, financial reports | Novice task tests pass; analytics and finance reconcile. |
| M6: launch hardening | Performance, accessibility, security, recovery, policies, runbooks, training | Launch acceptance checklist signed; restore drill and incident simulation completed. |
| M7: growth release | Better discovery, reviews, procurement, cohorts, consented push, useful AI | Benefits measured against baseline; optional services remain disabled unless allowed. |
| M8: mature operations | Multi warehouse optimisation, forecasting, experiments, international readiness | Each capability has demonstrated demand, clean data, and operational capacity. |

This sequence does not discard advanced requirements. It establishes the correctness and data that later features depend on. No calendar estimates are invented without team capacity and workload assumptions.

## 34. Acceptance, testing, and release quality

### 34.1 Core functional scenarios

Test representative shirts, shoes, accessories, bundles if enabled, multiple size systems, invalid combinations, archived categories, scheduled publication, CSV errors, broken media, and concurrent product edits. Verify mobile and desktop paths, guest/account merge, forgotten password, account linking, and unauthorised object access.

Test all payment methods across success, failure, timeout, customer closing the browser, duplicate callbacks, delayed webhooks, wrong amount, wrong currency, reused reference, partial refund, refund failure, and dispute. Never use real customer financial actions as casual tests.

Test last unit contention, coupon last use contention, mixed cart availability, reservation expiry, late payment, short pick, split shipments, RTO, lost parcel, partial return, exchange out of stock, and interrupted manual import.

### 34.2 Invariant and integration testing

Use unit tests for money allocation, tax configuration logic, policy evaluation, state transitions, and idempotency. Use emulator/integration tests for Firebase rules and transactions. Use provider sandbox contract tests and recorded sanitised fixtures for webhooks. Use end to end tests for key journeys. Property based tests are particularly useful for money and quantity conservation.

An order's original totals plus explicit adjustments must reconcile with receipts, outstanding balances, and refunds. Inventory opening balance plus movements must equal closing balance. Approval rules must not be bypassable through another endpoint or AI interface.

### 34.3 Nonfunctional verification

Run accessibility checks plus manual keyboard/screen reader tests, mobile performance tests, workload/contended SKU tests, vulnerability review, upload abuse tests, rate limiting tests, backup restore, worker crash/replay, provider outage simulation, and analytics consent/deduplication validation.

Test a novice owner with real tasks and unfamiliar data. Observe errors and hesitation. Do not accept “the developer can do it quickly” as evidence that the dashboard is usable.

### 34.4 Launch checklist

1. Business identity, support/grievance contacts, service area, shipping tables, return policy, tax configuration, and required declarations are complete.
2. Razorpay live credentials and merchant activation are verified; test/live environments cannot be confused.
3. Manual UPI QR and payee are independently verified; verification owner and working hours are set.
4. Courier booking, tracking updates, COD reconciliation, and manual refunds have named staff and runbooks.
5. Staff permissions, MFA, recovery, and last owner protection are tested.
6. Checkout and return error paths pass, not only happy paths.
7. Financial and inventory reports reconcile for the qualification dataset.
8. Optional analytics respects choice and shows coverage gaps; GA is not required for business reports.
9. Backups restore successfully; incident and refund reconciliation procedures work.
10. Core flows meet agreed performance/accessibility gates on representative devices.
11. AI failure and disabled AI do not break shopping or administration.
12. Blocked notification/integration features are labelled unavailable rather than falsely functional.

## 35. Decision register, risks, and operational ownership

| Decision or risk | Recommended default | What remains to validate |
| --- | --- | --- |
| Business model | One merchant, multiple staff/locations | Any marketplace or consignment requirement. |
| Tax setup | Configurable with accountant signoff | Registration, HSN/rates, invoice series, reporting applicability. |
| Firebase edition/search | Prototype Enterprise search through internal interface | Region, release status, features, cost, latency, fallback feasibility. |
| Hosting | Next.js compatible hosting with private backend and workers | Supported runtime, CDN/cache coordination, job resources and regions. |
| AI access | Optional, disabled until terms/access verified | Free endpoint commercial permission, quotas, model modalities, data handling. |
| Manual payment | Bank checked by finance before fulfilment | Verification hours, bank statement format, approval thresholds. |
| Shipping | Manual carrier operations and CSV imports | Contracts, valid labels, service tables, staffing, evidence quality. |
| Messaging | In site and supported consented FCM | Whether a future email/WhatsApp/SMS transport will be permitted. |
| Returns | Product class rules, transparent windows, legal remedies preserved | Merchant policy, reverse pickup coverage, inspection standards. |
| Auth | Guest plus Google/email; staff TOTP | Quotas, recovery UX, Identity Platform configuration. |
| Languages | English; reviewed Hindi next | Actual customer demand and support capacity. |
| Analytics | Purpose limited first party collection, financial truth separate | Retention, identity policy, metric windows, legal review. |
| Recovery | Proposed RPO 15 minutes/RTO four hours | Measured restore and reconciliation evidence. |
| Scale | Instrument and qualify realistic workloads | Actual catalogue, peak concurrency, events/day, order volume. |
| Owner usability | Guided tasks with advanced controls available | Representative novice testing and iterative refinements. |

Assign Product/UX to workflow clarity; Engineering to correctness and reliability; Operations to stock, shipping and returns; Finance to payments, refunds, tax and reconciliation; Support to communication and grievances; and the Owner to policy, access and exception approvals. A small team may combine roles, but responsibilities must remain explicit.

Before implementation, produce UI wireframes, entity schemas, state transition tables, API specifications, event contracts, access matrices, and test fixtures from this blueprint. Business facts still needing confirmation should become configuration decisions, not invented defaults embedded in code.

## 36. Coverage map to the original brief

| Original requirement area | Main blueprint sections |
| --- | --- |
| 1. Indian target market | 4, 7, 8, 13, 24, 25 |
| 2. Customer website | 3, 4, 6, 7, 9, 14, 30 |
| 3. Product management | 5, 12, 26 |
| 4. Categories/collections/navigation | 3, 11, 19 |
| 5. Accounts/authentication | 6, 15, 24 |
| 6. Cart/checkout | 7, 8 |
| 7. Order lifecycle | 9, 14 |
| 8. Super Admin Dashboard | 10, 15, 16, 21, 26 |
| 9. CMS/editor | 11 |
| 10. Beginner administration | 10, 30, 34 |
| 11. Inventory/warehouses | 12 |
| 12. Shipping/fulfilment | 13 |
| 13. Returns/exchanges/refunds | 8, 14 |
| 14. Staff permissions | 15 |
| 15. CRM | 16 |
| 16. Marketing/promotions | 17 |
| 17. Reviews/UGC | 18 |
| 18. Notifications | 1, 18 |
| 19. Search | 19 |
| 20. Personalisation | 19 |
| 21. AI | 20 |
| 22. Analytics/BI and expanded custom tracking | 21 |
| 23. SEO | 22 |
| 24. Performance | 23, 28 |
| 25. Security/privacy/fraud | 24 |
| 26. Tax/invoices | 25 |
| 27. International commerce | 29 |
| 28. APIs/integrations/automation | 27 |
| 29. Mobile/PWA/native | 29 |
| 30. Support | 16 |
| 31. Scale/infrastructure | 26, 28 |
| 32. Competitor research | 2 and source register |
| 33. Complete journeys | 30 |
| 34. Missing requirements | 31 |
| 35. Five priority groups | 32 |
| 36. Required stack | 1, 26 |
| Final restrictions, payments, and owned analytics | 1, 8, 21, 27 |

## Research source register

Sources were accessed or retrieved through web research on 27 September 2026. Links below support the specific referenced capability or rule. Our implementation recommendations are original synthesis. Documentation can change; legal applicability, service limits, activation, and preview status must be rechecked before launch. No competitor account was hands on tested during this research.

### Commerce, CMS, fulfilment, and usability

**S01. Shopify sections and editor.** [Sections and blocks](https://help.shopify.com/en/manual/online-store/themes/theme-structure/sections-and-blocks), [theme editor overview](https://help.shopify.com/en/manual/online-store/themes/customizing-themes/theme-editor/features-overview), and [theme architecture](https://shopify.dev/docs/storefronts/themes/architecture). Evidence for structured page editing, previews, and global section groups.

**S02. Shopify inventory.** [Inventory states](https://help.shopify.com/en/manual/products/inventory/fundamentals/inventory-states) and [adjustment history](https://help.shopify.com/en/manual/products/inventory/adjusting-inventory/adjustment-history). Evidence for distinctions between physical, available, committed, unavailable, and incoming quantities.

**S03. WooCommerce variants.** [Variable products](https://woocommerce.com/document/variable-product/). Evidence for variation level product options, prices, images, and stock.

**S04. WooCommerce orders.** [Managing orders](https://woocommerce.com/document/managing-orders/) and [single order editing](https://woocommerce.com/document/managing-orders/view-edit-or-add-an-order/). Evidence for operational order detail and refund workflows.

**S05. BigCommerce Page Builder.** [Page Builder documentation](https://docs.bigcommerce.com/developer/docs/storefront/stencil/content/page-builder) and [widgets overview](https://docs.bigcommerce.com/developer/docs/admin/widgets-and-scripts/guide/overview). Evidence for schema configured widgets and placement regions.

**S06. Wix Stores.** [Feature overview](https://support.wix.com/en/article/wix-stores-an-overview-of-store-features), [setup steps](https://support.wix.com/en/article/wix-stores-the-10-essential-steps-to-creating-your-online-store), and [inventory](https://support.wix.com/en/article/wix-stores-about-inventory-management). Evidence for guided setup, product presentation, and stock management.

**S07. Ecwid.** [Product variations](https://support.ecwid.com/hc/en-us/articles/207100299-Product-variations) and [inventory introduction](https://support.ecwid.com/hc/en-us/articles/4402494390162-Intro-to-product-inventory). Evidence for variant stock/SKU handling and documented variation media extension dependency.

**S08. Adobe Commerce.** [Source selection and reservations](https://experienceleague.adobe.com/en/docs/commerce-admin/inventory/basics/selection-reservations), [order status and reservations](https://experienceleague.adobe.com/en/docs/commerce-admin/inventory/basics/order-status), and [inventory guide](https://experienceleague.adobe.com/en/docs/commerce-admin/inventory/guide-overview). Evidence for inventory reservation and source workflows.

**S09. Salesforce.** [Business Manager introduction](https://trailhead.salesforce.com/it/content/learn/modules/cc-digital-for-developers/cc-business-manager) and [roles and permissions](https://trailhead.salesforce.com/es-MX/content/learn/modules/b2c-configure-users-roles-permissions/b2c-admin-configure-roles-permissions). Evidence for merchandising versus administration and functional permissions. Some retrieved URLs use locale prefixes; the surfaced documentation supplied the cited workflow details.

**S10. Webflow Ecommerce.** [Product options and variants](https://help.webflow.com/hc/en-us/articles/33961334531347-Create-product-options-and-variants) and [CSV import/export](https://help.webflow.com/hc/en-us/articles/33961361857811-Import-export-Ecommerce-products-and-variants). Evidence for variant generation, item limit coupling, and product import workflow.

**S11. Squarespace.** [Managing inventory](https://support.squarespace.com/hc/en-us/articles/205811228-Managing-inventory). Evidence for product panel, visibility, mobile differences, and documented store page deletion effects.

**S12. WordPress.** [Site Editor](https://wordpress.org/documentation/article/site-editor/) and [revisions](https://wordpress.org/documentation/article/revisions/). Evidence for structured site editing and content recovery.

**S13. Shiprocket.** [Operational dashboard](https://www.shiprocket.in/multi-functional-dashboard/) and [NDR explanation](https://support.shiprocket.in/support/solutions/articles/43000664209-what-is-ndr-). Workflow reference only; no subscription or integration is proposed.

**S14. Delhivery.** [Help centre](https://help.delhivery.com/), [developer portal](https://help.delhivery.com/docs/client-developer-portal-1), [NDR](https://help.delhivery.com/docs/exception-ndr), and [COD remittance](https://help.delhivery.com/docs/cod-remittance). Evidence for distinct carrier operational capabilities and feeds that would require external integration.

**S15. Baymard Institute.** [Checkout usability findings](https://baymard.com/research-articles/current-state-of-checkout-ux), [prominent guest checkout](https://baymard.com/research-articles/make-guest-checkout-prominent), and [delayed account creation](https://baymard.com/research-articles/delayed-account-creation). Primary usability research, not a measured conversion forecast for this store.

### Payments, Firebase, AI, security, and web engineering

**S16. Razorpay Standard Checkout.** [Integration steps](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/). Evidence for server side order binding and signature verification.

**S17. Razorpay webhooks.** [Validate and test webhooks](https://razorpay.com/docs/webhooks/validate-test/) and [payment dashboard actions](https://razorpay.com/docs/payments/payments/dashboard/). Evidence for webhook validation and payment/capture/settlement distinctions. Our internal ledger and retry designs are recommendations.

**S18. Firebase authentication.** [Email link authentication](https://firebase.google.com/docs/auth/web/email-link-auth), [provider linking](https://firebase.google.com/docs/auth/web/account-linking), and [authentication limits](https://firebase.google.com/docs/auth/limits). Evidence for supported identity workflows and quota considerations.

**S19. Firebase MFA.** [TOTP MFA](https://firebase.google.com/docs/auth/web/totp-mfa). Evidence that this web MFA capability requires the Identity Platform upgrade/configuration.

**S20. Firebase email transport.** [Trigger Email extension](https://firebase.google.com/docs/extensions/official/firestore-send-email). Evidence that arbitrary email delivery requires an SMTP service; Firebase auth mail is not a general marketing transport.

**S21. NVIDIA.** [API access page](https://build.nvidia.com/settings/api-keys) and [model catalogue](https://build.nvidia.com/models). The access page describes free serverless APIs for development. Production permission, account quota, service guarantees, and model modality remain validation items; no fixed free quota is asserted.

**S22. Firestore correctness and scale.** [Transactions](https://firebase.google.com/docs/firestore/manage-data/transactions) and [best practices](https://firebase.google.com/docs/firestore/best-practices). Evidence for atomic operations, retry awareness, and avoiding hotspots. The proposed commerce schema is not supplied by Firebase.

**S23. Firestore search.** [Text search documentation](https://firebase.google.com/docs/firestore/enterprise/text-search?hl=en), [Enterprise overview](https://firebase.google.com/docs/firestore/enterprise/overview-enterprise-edition-modes?hl=en), and [Cloud Next 2026 announcement](https://firebase.blog/posts/2026/04/cloud-next-2026-announcements). Evidence for edition specific text search and the need to distinguish pipeline availability from search feature release status.

**S26. Core Web Vitals.** [Web Vitals guidance](https://web.dev/articles/vitals). Source for the LCP, INP, CLS definitions and good threshold targets.

**S27. W3C.** [WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/), [minimum target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum), and [enhanced target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced). Evidence for accessibility requirements and the distinction between minimum and enhanced touch targets.

**S28. OWASP.** [API security risks](https://devguide.owasp.org/en/07-training-education/07-api-top-ten/). Reference for object/function authorisation and API risk review.

**S29. Google Search Central structured data.** [Product data](https://developers.google.com/search/docs/appearance/structured-data/product), [variants](https://developers.google.com/search/docs/appearance/structured-data/product-variants), and [ecommerce structured data](https://developers.google.com/search/docs/specialty/ecommerce/include-structured-data-relevant-to-ecommerce). Source for supported product/variant markup and visibility alignment.

**S30. Google Search Central ecommerce architecture.** [URL structure](https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites) and [navigation structure](https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure). Reference for crawlable navigation, variants, and managing duplicate URLs.

**S31. Next.js.** [Self hosting](https://nextjs.org/docs/app/guides/self-hosting) and [CDN caching](https://nextjs.org/docs/app/guides/cdn-caching). Evidence for deployment/cache coordination requirements. Select and lock a supported stable framework version during implementation.

### Indian official and authorised regulatory sources

**S24. Consumer protection.** [Department of Consumer Affairs rules register](https://consumeraffairs.gov.in/pages/consumer-protection-acts), [Ecommerce Rules PDF](https://consumeraffairs.gov.in/public/upload/files/E%20commerce%20rules_1732703966.pdf), and [PIB grievance guidance](https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=1843143&lang=2&reg=48). The PDF was indexed but direct retrieval failed during research; the complaint deadlines were also verified in official PIB guidance. Use the consolidated applicable rules and amendments for legal signoff.

**S25. Dark patterns.** [Guidelines for Prevention and Regulation of Dark Patterns, 2023](https://consumeraffairs.gov.in/public/upload/files/The%20Guidelines%20for%20Prevention%20and%20Regulation%20of%20Dark%20Patterns%2C%202023_1732707717.pdf). Official source for deceptive interface regulation.

**S32. Legal Metrology.** [Official ecommerce declaration FAQ](https://consumeraffairs.gov.in/public/upload/admin/cmsfiles/whatsnews/FAQs_for_smooth_implementation_of_GSR_629E_dated_23.6.2017_whatsnews.pdf) and [packaged commodities compilation](https://consumeraffairs.gov.in/public/upload/admin/cmsfiles/whatsnews/Book_on_Legal_Metrology_Packaged_Commodities_Rules%2C2011_with_all_amendments_whatsnews.pdf). Supports online declaration requirements; older compilations must be checked against later amendments and product specific rules.

**S33. GST invoice requirements.** [CBIC invoice guidance](https://cbic-gst.gov.in/gst-invoice-rules.html) and [CGST rules compilation](https://cbic-gst.gov.in/pdf/01062021-CGST-Rules-2017-Part-A-Rules.pdf). Used for document field foundations, not as a current consolidated rate table or final applicability opinion.

**S34. Authorised Invoice Registration Portal.** [IRIS IRP prerequisites and current reporting notice](https://einvoice6.gst.gov.in/content/kb/prerequisites/). This is a GST authorised IRP operated by a provider, not the legislature. It documents the cited reporting restriction; applicability must be checked against current official notifications and merchant facts.

**S35. DPDP official commencement.** [MeitY Rules page](https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa) and [G.S.R. 843(E) commencement notification](https://www.meity.gov.in/static/uploads/2025/11/c56ceae6c383460ca69577428d36828b.pdf). The notification was opened and confirms staged commencement. Do not confuse the Rules notification with all substantive duties being immediately effective.

**S36. DPDP substantive framework.** [DPDP Act, 2023](https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf) and [official Rules overview](https://www.pib.gov.in/PressNoteDetails.aspx?ModuleId=3&NoteId=156054&lang=1&reg=3). Supports privacy and child protection planning, read together with commencement dates and final notified rules.

**S37. Cybersecurity incident obligations.** [Government AI governance reference discussing CERT-In requirements](https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc2025115685601.pdf) and [CERT-In directions](https://www.cert-in.org.in/PDF/CERT-In_Directions_70B_28.04.2022.pdf). Direct retrieval of the latter timed out during this research. The official overview references six hour reporting and 180 day log retention; implementation must verify covered entities, reportable incident categories, location/retention requirements, and current directions rather than applying one blanket rule to every event.
