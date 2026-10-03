# Ecommerce Store - for Indians: UI UX

Research and design specification. Prepared 27 September 2026.

**Familiar commerce. Premium presentation. Local identity.**

## 1. Design decision and evidence method

Build a recognisable shopping interface with a restrained visual shell, expressive product photography, selective promotions, and short stories supported by real business evidence. Products, prices, search, delivery information, and checkout remain easy to find. The business becomes memorable through its people, location, expertise, and products in use.

Myntra is the primary merchandising benchmark, Amazon India the primary discovery and utility benchmark, and Flipkart the primary category and value communication benchmark. Nykaa contributes product evaluation and beauty navigation patterns. Croma contributes focused product presentation and responsive art direction. FirstCry contributes family shopping and use case navigation.

### Evidence labels

* **Observed (O):** visible in one of the 20 supplied screenshots. Screenshot IDs below are the evidence references.
* **Research (R):** supported by a linked external source in Section 4 and the source register.
* **Recommendation (D):** a proposed design decision for this platform. It is not a measured conversion result.
* **Unknown (U):** behaviour or detail the screenshots cannot establish.

All numerical layout specifications after the audit are design targets, not measurements of competitor CSS. Image dimensions are actual file dimensions. Positions in the audit are approximate screenshot pixels. Browser chrome, screenshot scaling, device pixel ratio, font rendering, and zoom can change apparent sizes. The small mobile files do not establish original CSS viewport widths.

All 20 images were inspected individually before web research. They cover six stores: Myntra (5), Amazon India (5), Flipkart (4), Nykaa (2), Croma (2), FirstCry (2). The collection does not include a complete checkout, filter drawer, search suggestion state, or full product listing page. The Nykaa desktop image is a product detail page, not a homepage. Most repeated tiles elsewhere are category or campaign links, not purchasable SKU cards.

Static evidence cannot establish automatic rotation, timing, hover activation, accessibility semantics, performance, conversion rate, personalisation logic, or whether a displayed claim is true. Visible controls support discussion of their affordances only. Brand logos identify the apparent stores; screenshot authenticity and the underlying offers were not independently audited. Product names and prices shown in images are visual evidence, not verified current retail facts.

### Main decisions

| Area | Decision | Basis |
| --- | --- | --- |
| Hero | One static, editable campaign with a real product or product in use | Myntra's clear campaign hierarchy, Croma's focus, carousel research |
| Search | Large visible input on desktop and mobile | All six stores expose search; Amazon and Flipkart give it priority |
| Category discovery | Shortcuts near the top, then contextual product sections | Myntra category grids and mobile benchmark patterns |
| Homepage rhythm | Commerce, discovery, products, story, related products, evidence, further discovery | Platform requirement, informed by the audit |
| Palette | Retain all three proposed colours with restricted gold use | Calculated contrast, Section 5 |
| Storytelling | Two concise modules by default, each linked to relevant products | Local credibility requirement; avoid an About page replacing shopping |
| Motion | Immediate usable content, quiet feedback, one optional story effect | Performance and accessibility constraints |
| Personalisation | Reorder one recommendation section, preserve the shared catalogue and navigation | Predictability and privacy recommendation |
| Promotions | One dominant campaign per viewport; honest conditions near claims | Audit shows how competing promotion surfaces accumulate |

## 2. Screenshot register and individual analysis

### 2.1 Myntra, highest priority

#### M1. Desktop campaign hero

**File:** `image(20260927-054352).png`. **Dimensions:** 1918 × 912.

**O, layout:** A white header approximately 90 screenshot pixels high spans the viewport. Logo sits near the left margin; seven category entries occupy the middle left; a wide pale search field occupies much of the right half. Profile, Wishlist, and Bag combine thin outline icons with text. Below the header, a large first purchase coupon spans almost the full content width with roughly 78 pixel side margins. The hero begins around y292 and ends around y792. Its image is effectively full width. Five small pagination dots separate it from the next promotion.

**O, hero hierarchy:** Two fashion models on the left show actual outfits. The large fwd mark occupies the centre; the right side contains the audience statement, a large under ₹999 price anchor, and a white Shop Now button. The warm yellow campaign field links the three zones. The upper coupon uses even larger white promotional type on orange. A vertical discount tab interrupts the right edge.

**O, typography and density:** Navigation is compact, bold, uppercase sans serif. Hero typography uses an oversized price and brand mark, a medium campaign statement, and a clear CTA. There are several simultaneous type scales because the header, coupon, hero, and edge tab each have their own hierarchy. Whitespace separates these groups, but promotional content occupies most of the first screen.

**Interpretation:** The audience, category, price ceiling, and action are understandable quickly. Models communicate clothing more effectively than an abstract brand statement. The fixed price ceiling gives a budget shopper an immediate route. The coupon competes with the campaign and adds a second acquisition message before product exploration. The image contains products, but no individual SKU prices, reviews, variants, or quick add controls appear.

**D, adopt:** Campaign specificity, recognisable departments, labelled account actions, wide search, product in use imagery, and a strong price proposition when applicable.

**D, modify:** Use a 32 pixel announcement instead of a giant coupon, place campaign copy in HTML, replace edge promotions with an Offers link, and keep the hero short enough to reveal category shortcuts. Use our own photography and typography. Do not imitate the fwd identity or artwork.

**U:** Dot controls suggest multiple slides but do not prove automatic rotation. Menu hover, search suggestions, sticky behaviour at this position, and image loading are unobservable.

#### M2. Mobile festive landing

**File:** `image(20260927-054534).png`. **Dimensions:** 289 × 609.

**O, structure:** A compact top row contains hamburger, logo, heart, and bag. A PIN location row and full width search follow. A flat ₹300 offer strip precedes a festive fashion hero. The hero has two models, event branding, early access wording, and a small Shop Now treatment. Many small pagination dots sit beneath it. Sponsor tiles and a cashback strip precede two rows of small category images. Bottom navigation visibly contains Home, fwd Under ₹999, and Profile.

**O, visual rhythm:** Search and location are compact; the coupon, hero, sponsor row, payment offer, and category tiles form a continuous promotional stack. Warm orange and gold artwork communicates a sale event. Small product images carry category recognition when text is difficult to read at this supplied resolution.

**Interpretation:** This is a deliberate mobile composition, not simply the wide desktop hero reduced in size. Broad fashion assortment appears within one screenshot. However, sponsorship and bank messaging consume room that a local business needs for product clarity and service evidence. Numerous dots are difficult to target individually. The bespoke fwd destination assumes familiarity with Myntra's sub brand.

**D, adopt:** Persistent search visibility, product imagery in shortcuts, mobile specific campaign art, and labelled bottom navigation. **Modify:** Six core shortcuts, one offer message, larger tap areas, fewer navigation destinations. **Reject:** Sponsorship strips and a sub brand tab without a real customer need. Use ordinary labels such as Categories and Cart.

**U:** Tap target size in CSS pixels, gesture handling, and whether the bottom bar is fixed are not provable from this single image. Its placement supports a bottom navigation pattern.

#### M3. Desktop category entry and bank promotion

**File:** `image(20260927-055702).png`. **Dimensions:** 1917 × 914.

**O, layout:** The header remains at the top in this scrolled screenshot. A bank discount banner consumes roughly the next 200 pixels. A widely tracked Shop by Category heading precedes a substantial whitespace interval. Six tall image tiles run across the page with generous gaps. Visible categories include Ethnic Wear, Casual Wear, Men's Activewear, Women's Activewear, Western Wear, and Sportswear.

**O, tiles:** Each tile combines lifestyle photography, a peach frame, a pale caption panel, category name, large percentage range, and repeated Shop Now wording. There are no SKU names, review counts, price comparisons, wishlist buttons, or sizes. These are category campaign cards. A vertical coupon tab and a lower right notification promotion occupy the edge simultaneously.

**Interpretation:** A consistent frame makes different product families scannable. Category and savings together answer both “what can I buy?” and “why open this?”. The separate activewear routes help shoppers narrow scope. The large bank banner and heading gap delay the actual category images. The overlapping promotion surfaces compete with the final tile.

**D, adopt:** A unified category card system and explicit category destinations. **Modify:** Use six desktop tiles with 16 to 24 pixel gaps, restrained captions, one optional verified offer line, and a compact service or offer strip. Category label remains more important than discount. **Reject:** Multiple floating campaign prompts and repeated discount typography dominating every card.

**U:** Header placement is consistent with stickiness across these images, but scroll transition timing is not established. Notification trigger and dismissal persistence are unknown.

#### M4. Desktop category grid continuation

**File:** `image(20260927-055713).png`. **Dimensions:** 1917 × 902.

**O:** Six columns continue without a new section title. The first complete visible row contains Loungewear, Innerwear, Lingerie, Watches, Grooming, and Beauty & Makeup. The next row begins with children, footwear, accessories, and workwear imagery. Different photographic compositions fit a common portrait card structure. Product only photography appears alongside model photography. Discount ranges and “up to” claims use the same visual prominence. The side coupon persists; the lower right surface is now a small bell icon.

**Interpretation:** Consistency reduces the effort needed to inspect a large assortment. Switching from apparel to watches and grooming broadens perceived range. However, the repeated six column rows make categories equally loud and can become monotonous. A category image containing several products could imply a bundle if its destination is unclear. “Up to” differs materially from a blanket discount and needs precise landing page qualification.

**D, adopt:** Cross category consistency and product appropriate image treatment. **Modify:** End the first category module after one or two rows; give the rest a View all categories route. Insert a short business proof module before repeating product grids. Use descriptive category names and preserve discount qualifiers. **Reject:** Copying all catalogue departments onto a small local store homepage merely to resemble a marketplace.

**U:** No individual item price or review information can be inferred from these tiles. The changed bell state does not reveal how or why the larger notification closed.

#### M5. Desktop breadth and inclusive categories

**File:** `image(20260927-055725).png`. **Dimensions:** 1917 × 918.

**O:** The same six column grid now shows Home Decor, Handbags, Headphones & Speakers, Jewellery, Size Inclusive Styles, and Inclusive Styles. Another row begins below. Warm interiors, accessory still lifes, electronics, jewellery details, and models coexist inside the same border treatment. The two inclusive destinations are separate but their names do not fully explain how their scopes differ. The persistent coupon and bell occupy the right edge.

**Interpretation:** Size inclusive representation makes assortment visible instead of hiding it in filters. The broader home and technology categories demonstrate range. Yet two similar labels can create uncertainty. A customer should not have to infer the intended audience only from the model's appearance. Full image cards also need useful text equivalents.

**D, adopt:** Representative people and visibly available size ranges. **Modify:** Label destinations concretely, for example “Women's sizes XL to 5XL” only if that range is actually sold. Keep size filters available throughout the appropriate departments. Use “All sizes” or a catalogue accurate label rather than making larger sizes feel detached from ordinary shopping. **Reject:** Irrelevant departments, token representation, and discount claims unsupported by current stock.

**Myntra conclusion:** Use its repeated discovery opportunities and campaign clarity. Reduce the number of simultaneous promotion channels. Our premium quality must come from photography, readability, truthful product detail, and consistent spacing, not from hiding the prices Myntra makes easy to notice.

### 2.2 Amazon India, second priority

#### A1. Desktop festival and discovery entry

**File:** `image(20260927-054416).png`. **Dimensions:** 1918 × 919.

**O, header:** A dark utility header places logo, delivery location, a very wide search field with scope selector, language, account, returns and orders, and cart on one line. A second dark navigation row exposes departments, deals, coupons, and festival branding. Delivery to Delhi 110001 is explicit. The search button has a distinct warm background and magnifier.

**O, content:** A horizontal track of tall campaign panels fills most of the first screen below the navigation. Approximately five panels and part of a sixth are visible. Headings use strong white type on saturated fields: cashback, under ₹399 categories, starting ₹199 home finds, under ₹499 sports shoes. Each panel mixes image, campaign wording, delivery and return promises, bank offers, and conditions. A pause control appears on the first panel and a right arrow at the edge. Four framed discovery modules begin below.

**Interpretation:** Search serves a specific purchase intent immediately. Location establishes a fulfilment context. Price thresholds make heterogeneous categories comparable at a glance. The next row signals continued exploration. However, repeated bank strips and fine print compete with the products; product evaluation information remains absent. These are merchandising panels, not full product cards.

**D, adopt:** Search prominence, location awareness, visible orders access through Account, budget routes, and titled discovery modules. **Modify:** One campaign instead of a wall of parallel campaigns, a single clear offer conditions link, and service claims derived from the current store and SKU. **Reject:** Unrelated ecosystem navigation and repeating universal “easy returns” if category exceptions exist.

**U:** Pause indicates a playback control but not its timing or whether it controls animation, video, or track movement. No conclusion about measured speed or conversion follows.

#### A2. Mobile tall promotion

**File:** `image(20260927-054538).png`. **Dimensions:** 288 × 611.

**O:** Logo, menu, sign in, and cart occupy a dark top row. Search gets its own full width row. Category, Deals, and Sell links follow, then location. A large cashback panel takes most of the remaining viewport; a portion of the next card is visible. The image in the first panel mixes a person, phone shape, and changing product style composition. A pause icon and bank strip are visible. A Prime Video image begins below, with a sign in prompt near the bottom.

**Interpretation:** Search stays easy to recognise even in a dense header. The partially visible next panel communicates sideways movement. The hero is so tall that specific merchandise discovery is delayed. An entertainment promotion and sign in prompt serve Amazon's ecosystem but would distract from a local retailer's purpose.

**D, adopt:** Full width mobile search and visible delivery control. **Modify:** A 300 to 360 pixel campaign with HTML copy, product focused imagery, and a shorter utility stack. **Reject:** An unrelated service advertisement and unsolicited sign in overlay. Keep guest exploration available.

**U:** The image does not establish bottom prompt trigger, persistence, or content rotation. No native app behaviour is inferred from this mobile web looking image.

#### A3. Desktop discovery matrix

**File:** `image(20260927-055815).png`. **Dimensions:** 1911 × 967, including browser chrome.

**O:** Four rounded white modules sit on a pale page background. Each contains a bold heading, right chevron, and a 2 × 2 image matrix. The modules cover event offers, most loved products, low price home items with cashback, and home essentials. Some headings wrap to two lines. Some item captions truncate. Several price labels are embedded in the image rather than separate consistent text. A second row begins below. The website header is not visible in this crop.

**Interpretation:** Grouping sixteen image destinations into four themes is easier to understand than sixteen unrelated tiles. Repetition supports scanning. “Most loved” provides a social proof frame, but no evidence or selection logic is visible. Embedded text and inconsistent captions reduce accessibility and can hide product distinctions. The event module contains a game and rewards promotion rather than four shopping categories.

**D, adopt:** One small themed matrix when it helps broad exploration, such as “Gifts under ₹1,000”. **Modify:** Use four clear subcategories with live labels and prices outside images; make the heading and View all link share a destination. **Reject:** Mystery reward mechanics as a default for a local store. Do not call selected items most loved without a defensible basis.

**U:** The modules do not establish actual personalisation. Rounded corners and borders are visible; exact radius values are not known.

#### A4. Desktop deeper discovery matrix

**File:** `image(20260927-055841).png`. **Dimensions:** 1914 × 972, including browser chrome.

**O:** Another four module row uses mobile accessories, home products under ₹499, most loved fashion, and Bluetooth speakers as themes. Each repeats the 2 × 2 pattern. Some images show realistic environments, some cutouts on neutral fields. The fashion panel omits visible item captions, while other panels contain captions that are sometimes clipped. A business purchase tile remains visible in the row above.

**Interpretation:** A repeated structure can support multiple shopping missions. Price, popularity, and use case are all valid discovery entry points. But image only clothing recommendations can leave customers uncertain about the purchasable item. Several speakers look similar; the small captions cannot replace distinguishing attributes. Mixing business services into ordinary product discovery is not necessary for most local stores.

**D, adopt:** Distinct discovery themes and useful accessories. **Modify:** Replace repeated matrices with a true product rail for evaluation, showing names, price, and relevant rating count. Ensure recommendation titles explain their basis. **Reject:** Unlabelled image only product recommendations and indefinite repetitions of the same module.

**U:** “For you” does not prove that the panel uses personal data. Do not infer recommendation algorithms from a heading.

#### A5. Desktop footer

**File:** `image(20260927-055845).png`. **Dimensions:** 1916 × 912.

**O:** A full width Back to top strip precedes a dark four column footer. Headings group company information, social links, seller opportunities, and customer help. A lower row contains logo, language, and country selectors. A darker area contains related services, followed by conditions, privacy, advertising choices, and copyright. The footer occupies most of this viewport.

**Interpretation:** Strong contrast and grouped headings support deliberate help seeking. Returns and purchase protection are findable without an ad treatment. A customer can recognise that the site is a substantial organisation. However, much of the content exists because Amazon operates many services and a marketplace; a small retailer would look padded if it copied this structure.

**D, adopt:** Customer service grouping, returns, contact, privacy, and a clear footer boundary. **Modify:** Four focused groups plus a real store identity block, hours, address where appropriate, and relevant business details. Add language switching only when translated content and support exist. **Reject:** Affiliate and seller links that serve no actual service. A back to top link is optional, not a substitute for navigation.

**U:** No mobile footer is supplied; accordion behaviour is our recommendation, not an Amazon observation.

### 2.3 Flipkart, third priority

#### F1. Desktop discovery landing

**File:** `image(20260927-054403).png`. **Dimensions:** 1919 × 916.

**O:** Content is centred within approximately 1350 screenshot pixels, leaving broad side margins. Flipkart and Travel tabs sit above a prominent search row. Location is top right. Login, More, and Cart are text supported icon actions. An icon category strip includes many departments, with several labels truncated. The selected For You item has a blue underline. Two large rounded campaigns and part of a third are visible. Below are three smaller advertised cards with strong offer bands.

**Interpretation:** The search field is visually dominant without a dark header. Illustrated categories assist recognition, while a constrained container improves grouping. The clipped third campaign suggests more content. Several sponsored cards have small AD labels. Truncated category names are a cost of fitting too many departments into one row. A travel tab spends attention on a separate business.

**D, adopt:** Clear search, rounded campaign grouping, active category indicator, and image based discovery. **Modify:** Six to eight meaningful top level routes, no truncated department names, consistent campaign destinations, and no unused second business tab. **Reject:** Selling ad space in the default local store experience and arranging unrelated offers with no merchandising rationale.

**U:** Pagination is visible; autoplay is not established. Blue borders cannot be assumed to represent keyboard focus because no interaction history is available.

#### F2. Mobile landing

**File:** `image(20260927-054537).png`. **Dimensions:** 290 × 610.

**O:** Flipkart and Travel tabs fill the first row, followed by delivery location, wide search, and five visible illustrated department shortcuts. A large fashion campaign follows. Three small ad tiles contain luggage, study material, and a chimney, with price or savings labels. A pink tinted Trending Gadgets & Appliances panel begins below. Bottom navigation has Home, Categories, Account, and Cart.

**Interpretation:** The bottom destinations are conventional and practical. Search and top categories permit different entry strategies. Three miniature ad cards demonstrate broad range but make product details difficult to inspect. There are two category entry points: shortcuts and the complete Categories destination. That redundancy serves browsing rather than necessarily being wasteful.

**D, adopt:** Four labelled bottom destinations and persistent access to all categories. **Modify:** Remove the Travel row, shorten top chrome, use one purposeful offer card, and give actual product cards enough room. **Reject:** Tiny three across SKU cards on mobile. Three across may be suitable for simple category shortcuts only.

**U:** Fixed behaviour, safe area handling, and keyboard collision behaviour remain unknown.

#### F3. Desktop thematic product groups and local relevance

**File:** `image(20260927-055905).png`. **Dimensions:** 1919 × 969, including browser chrome.

**O:** A centred header remains visible above a scrolled content area. Search, department icons, and account controls occupy significant height. A blue Login panel is open below the account control. Trending Gadgets & Appliances contains four images with category labels and large discount claims. Popular nearby uses a different pastel surround and another four items with budget and deal captions. A campaign begins below. A section heading is partly obscured near the sticky looking header boundary.

**Interpretation:** The themed panel gives a reason for grouping. “Popular nearby” could make discovery feel locally relevant, but the screenshot does not prove a location or popularity calculation. The open Login panel shows a compact overlay instead of a full screen gate. Persistent navigation aids recovery but can hide section titles if offsets are wrong.

**D, adopt:** Contextual groups and a compact account disclosure. **Modify:** Use “Local favourites” only with real data or clearly label “Our store's picks”. Use a simple ivory or low opacity gold surface instead of a different colour for each panel. Ensure sticky offsets preserve heading visibility. **Reject:** Minimum discount claims without enough eligible stock and unexplained geographic personalisation.

**U:** Hover versus click trigger is unknown. Category tile versus product destination cannot be conclusively established from these captions alone.

#### F4. Desktop loading and footer

**File:** `image(20260927-055914).png`. **Dimensions:** 1917 × 918.

**O:** A compact category row remains beneath search near the top. Below the last visible panel is “Hang on, loading content” and a spinner. A collapsed informational row with a plus icon separates content from the footer. The footer has company, group companies, help, consumer policy, mail address, registered office, social links, and a bottom strip of business links and payment marks. Some contact information is displayed in small text.

**Interpretation:** The spinner visibly explains that more content is pending, but provides no amount or completion expectation. Its placement above the footer could create layout movement if content arrives late; the screenshot alone does not prove that movement. The address and policy detail provide accountable business identity. Payment marks provide recognition but are visually crowded.

**D, adopt:** Honest loading feedback and accessible contact and policy information. **Modify:** Use reserved skeleton dimensions, bounded content, explicit load more for a long catalogue, retry on failure, and a compact readable business footer. **Reject:** An endless spinner, inaccessible small print, and a footer that repeatedly moves away while new modules load.

### 2.4 Nykaa

#### N1. Desktop product page with account panel

**File:** `image(20260927-054630).png`. **Dimensions:** 1919 × 909.

**O:** A colourful top utility strip, main navigation with search and sign in, and a second department row precede a large first order coupon. A white account panel overlays the upper right, showing Mobile Number, a disabled looking Send OTP control, a mobile or email route, and Google sign in. The product area has breadcrumbs, left thumbnails, a main image, wishlist heart, a long descriptive title, quantity, 4.1/5, 32 ratings and 2 reviews, crossed price ₹1025, current price ₹923, 10% off, and a tax note. A support panel appears at the bottom right.

**Interpretation:** This image provides the clearest actual product evaluation evidence in the set. Quantity, tax treatment, price, and separate rating and review counts reduce uncertainty. The account overlay is readable but obscures campaign content. The giant coupon pushes product information downward. Several contact and promotional surfaces coexist.

**D:** Adopt factual product hierarchy, thumbnails, quantity, tax wording, and transparent reviews. Move acquisition offers below core product information or into a compact offer row. Open authentication only on request. Keep a single support entry. Do not infer that the panel opened automatically or on hover.

#### N2. Mobile category and seasonal bodycare

**File:** `image(20260927-054650).png`. **Dimensions:** 287 × 618.

**O:** Compact header, visible search, four scope tabs, and two rows of illustrated beauty categories lead into a tall seasonal bodycare campaign. Several bottles are clearly visible. The campaign has a discount and Shop Now. A gift threshold strip and first order coupon follow. Bottom navigation shows Home, Shop, Offers, and Account. Soft coloured fields organise merchandise.

**Interpretation:** Specific product type shortcuts help customers with a known beauty need. A seasonal concern provides context beyond discount. The free gift threshold is easy to notice but its conditions are small. Three offer surfaces follow one another.

**D:** Adopt use case and seasonal curation. Use one threshold offer at a time, with readable conditions and eligibility. Keep the first order offer accessible through Offers rather than a permanent stacked banner. Do not introduce a different UI colour for every product concern.

### 2.5 Croma

#### C1. Desktop focused product campaign

**File:** `image(20260927-054713).png`. **Dimensions:** 1919 × 913.

**O:** A black header contains logo, Menu, a wide white search field, PIN prompt, account, and cart. A large single product campaign fills almost all remaining space. The screenshot artwork reads “iPhone 18 Pro”, shows a large device over sculptural lettering, includes a starting price with bank offer qualification, and one contrasting Buy now button. Large side arrows are visible. The next offer strip is barely visible.

**Interpretation:** One subject and one CTA create clear focus and a more premium presentation than many parallel promotions. The hero communicates the specific product instantly. However, it reveals little assortment. A bank inclusive starting price can be mistaken for the unconditional price unless the ordinary price is also clear.

**D:** Adopt visual focus and a clear action. Reduce height for a multi product local store; show unconditional price first and conditional effective price second. Keep broad categories visible. Use this full focus pattern for a dedicated launch landing page, not every homepage visit. The displayed model name and price are not independently verified.

#### C2. Mobile art directed campaign

**File:** `image(20260927-054800).png`. **Dimensions:** 294 × 612.

**O:** Search occupies a separate white input on black, with a slim PIN row beneath. The product artwork is vertically recomposed, with stacked lettering behind an upright device. Price and Buy now sit below. A narrow bank benefits strip and elongated slide indicators follow. Category icons begin at the bottom.

**Interpretation:** This is strong evidence of separate mobile art direction. Shrinking the desktop image would not produce this composition. The hero remains tall, delaying category access. Offer qualification is visibly smaller than the main price.

**D:** Adopt independent mobile assets and product safe cropping. Keep terms readable and category access closer to search. Use a shorter portrait or landscape composition according to the device viewport, without distorting the actual product.

### 2.6 FirstCry

#### FC1. Desktop family fashion campaign

**File:** `image(20260927-054807).png`. **Dimensions:** 1917 × 918.

**O:** Logo and search sit left; location, stores, support, order tracking, parenting, login, shortlist, and cart form a long utility row. A yellow department bar exposes family shopping types. A centred lifestyle hero shows two children and a left offer panel with separate Club and all user percentages and coupon code. Side arrows sit far outside the image. Premium Boutiques begins beneath in a three column layout. A bottom utility strip contains shortlist, reorder, tracking, franchise, and preschool links.

**Interpretation:** Children in the clothing demonstrate audience and fit context. Separate membership terms avoid presenting one discount as universal. The navigation covers parenting missions, not just garment types. Many utility links, unrelated institutional actions, and a fixed looking lower bar add competing priorities.

**D:** Adopt parent friendly audience labels and honest offer eligibility. Keep age, size, material, and suitability in category and product journeys. Remove franchise and preschool actions unless the store actually offers them. Replace a wide coupon composition with a simpler offer and ordinary shopping CTA.

#### FC2. Mobile family shopping

**File:** `image(20260927-054814).png`. **Dimensions:** 294 × 611.

**O:** An app installation banner uses the top strip. A Shop for All selector and account, wishlist, cart icons follow. Search and PIN entry share the next area. Small offer categories precede a vertically recomposed child fashion hero. Three coupon tiles follow the hero. Baby & Kids Fashion starts above a five item bottom bar containing Shopping, Explore, Parenting, Giftables, and Beauty.

**Interpretation:** Audience selection can simplify a broad family catalogue. Real people and a mobile composition preserve campaign meaning. App promotion, category promotions, hero discounts, and coupon tiles create considerable density. Some bottom destinations are content or business areas rather than universal ecommerce tasks.

**D:** Adopt optional age or recipient selection when relevant, without blocking All products. Remove the app banner if the web experience is the actual product. Use Home, Categories, Account, Cart as the stable bottom structure; keep gift discovery in the catalogue. Never infer children's ages from unrelated account data.

## 3. Patterns to adopt, adapt, and reject by store

| Store | Adopt as a pattern | Adapt for the local platform | Avoid | Indian customer and conversion rationale | Premium and business fit |
| --- | --- | --- | --- | --- | --- |
| Myntra | Clear fashion departments, product led campaigns, repeated discovery | Smaller campaign load; real SKU cards between categories; authentic story breaks | Side coupons plus notification promotions; endless discount grids | Familiar category routes and visible value support quick browsing | Energy belongs in content, not competing interface colours |
| Amazon India | Search, delivery location, account utility, themed discovery, support footer | Smaller assortment groups, readable labels, contextual recommendations | Ecosystem ads, oversized promotion tracks, tiny repeated conditions | Known item search, budget routes, fulfilment visibility | Reliable utility supports premium trust; marketplace breadth does not need copying |
| Flipkart | Category shortcuts, labelled mobile navigation, price led groups | Honest local popularity, fewer menu items, bounded loading | Truncated navigation, arbitrary sponsored tiles, never ending loading | Simple routes for price and category shoppers | Local relevance is useful only when evidence supports it |
| Nykaa | Product facts, ratings with counts, quantity, tax note, use case curation | Compact offers and user initiated authentication | Coupon above everything; several overlays together | Product evaluation and seasonal needs reduce uncertainty | Advice should connect to purchasable, well described stock |
| Croma | Product focus, large search, responsive art direction | Shorter homepage hero and clear unconditional price | Product billboard consuming the entire first viewport | Product recognition and PIN relevance support intent | Excellent launch pattern; insufficient alone for a broad store |
| FirstCry | Family context, age and recipient discovery, clear eligibility | Simpler utility and bottom navigation | App pressure and unrelated ecosystem destinations | Parents need suitability, sizing, and straightforward savings | Warm human photography fits local identity better than more badges |

## 4. Research synthesis after the screenshot audit

Research was checked on 27 September 2026. Publication age is stated where useful; a current retrieval does not make an older study new. No paid report was accessed in full. Public findings support principles, not guaranteed conversion gains for this store.

| Research finding | Source | Relationship to screenshots | Platform decision |
| --- | --- | --- | --- |
| Product categories should be accessible in mobile navigation, without being buried behind a generic extra layer | [R1, Baymard mobile categories](https://baymard.com/research-articles/main-navigation-product-categories) | Shortcut rows appear across mobile stores | Expose departments immediately inside Categories |
| Category grouping, clickable parent scopes, and a brief hover delay improve navigation usability | [R2, Baymard navigation, 2025 benchmark](https://baymard.com/research-articles/ecommerce-navigation-best-practice) | Myntra has clear departments; Flipkart truncates many labels | Group menu links; 350 ms hover intent; direct View all route |
| Carousel controls, timing, and mobile rotation need careful treatment | [R3, Baymard carousels](https://baymard.com/research-articles/homepage-carousel) | Several supplied heroes show many dots or partial slides | Static hero by default; manual campaign switching only |
| Manageable autocomplete, clear scopes, and keyboard navigation aid search | [R4, Baymard autocomplete](https://baymard.com/research-articles/autocomplete-design) | Search is visible everywhere, but its open state is absent | Six mobile suggestions, eight desktop, named category scopes |
| Product pages need adequate and consistent information | [R5, NN/g product pages](https://www.nngroup.com/articles/ecommerce-product-pages/) | Nykaa shows several evaluation facts together | Preserve facts, sizing, delivery, and policies close to purchase |
| Luxury presentation must not sacrifice useful detail or ordinary tasks | [R6, NN/g luxury principles, 2022](https://www.nngroup.com/articles/luxury-principles-ecommerce-design/) | Croma demonstrates focus, but other screenshots expose more discovery | Distinctive imagery with conventional search, prices, and checkout |
| Irrelevant cart recommendations can undermine cross selling | [R7, Baymard cart recommendations](https://baymard.com/research-articles/product-recommendations-cart) | Homepage panels show many loosely related items | Cart recommendations must be compatible and optional |
| Alternatives and complementary products serve different needs | [R8, Baymard product suggestions](https://baymard.com/research-articles/product-page-suggestions) | Screenshot recommendations often lack explicit relationship | Separate Similar products from Goes well with |
| India's shopping growth spans middle income households, younger shoppers, and smaller cities | [R9, Bain and Flipkart, 2026](https://www.bain.com/insights/how-india-shops-online-2026/) | Main benchmarks mix price, assortment, and delivery | Test across customer confidence and device conditions, not one luxury persona |
| Indian shopping preferences vary across cohorts and regions; UPI is prominent among surveyed Gen Z digital transactors | [R10, Bain and Flipkart, 2025](https://www.bain.com/insights/how-india-shops-online-2025/) | Payment offers and PIN prompts recur | Show supported payments and location specific service without stereotyping |
| Good Core Web Vitals use LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 at the 75th percentile | [R11, Google web.dev](https://web.dev/articles/vitals) | Heavy campaign stacks create a design risk, not measured failures | Treat all three as release and field monitoring targets |
| Discoverable, prioritised LCP resources matter | [R12, Google LCP optimisation](https://web.dev/articles/optimize-lcp) | Large hero imagery is likely to dominate initial rendering | Deliver the first hero image in initial HTML; never lazy load it |
| Contrast, target size, keyboard access, and unobscured focus need explicit implementation | [R13, WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Small mobile controls and gold text need examination | Adopt WCAG 2.2 AA as a delivery target, with larger touch controls |
| Modals require deliberate focus management | [R14, WAI modal pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) | Nykaa account overlay and Flipkart login disclosure are visible | Modal focus is trapped, labelled, and restored correctly |
| Interaction animation should be suppressible when nonessential | [R15, WAI animation guidance](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) | Screenshots cannot establish motion comfort | Honour reduced motion and disable scroll effects |

Official store checks supplement the images. [Myntra's FAQ](https://www.myntra.com/faqs) exposes return and exchange help. [Flipkart's homepage](https://www.flipkart.com/) exposes delivery location, search, departments, and deal groups in the retrieved page. [Amazon India's shopping feature guide](https://www.aboutamazon.in/news/retail/amazon-shopping-app-features-best-deals) describes discovery tools including Rufus. These checks do not prove the exact campaign in an uploaded screenshot is live for every user.

**Research judgement:** Baymard's public studies largely concern major ecommerce sites, including US and European benchmarks. Bain's India reports are coauthored with Flipkart and describe markets, not causal tests of our layout. NN/g's luxury research is relevant to presentation, but our store must remain accessible to ordinary budgets. Combine these sources with local usability testing. Do not claim that a colour, animation, or story module will increase conversion by a fixed percentage.

## 5. Exact three colour system

**D:** Retain the proposed values. They produce the intended warmth without requiring additional brand colours. Photography retains natural product colours; the restriction applies to the designed interface, not to recolouring merchandise. Existing certification or payment logos should only be used in approved monochrome form if available; otherwise use text names rather than altering protected marks.

| Token | Exact value | Role | Restrictions |
| --- | --- | --- | --- |
| Ivory | `#F8F5ED` | Main canvas, card fields, light text on charcoal | Dominant surface; do not add pure white as a fourth core colour |
| Charcoal | `#18201B` | Text, navigation, buttons, icons, footer, essential borders | Default readable foreground |
| Gold | `#B28A50` | Decorative detail, small nonessential accents, gold surface behind charcoal labels | Never normal size gold text on ivory; never sole focus indicator on ivory |

Approximate WCAG contrast ratios calculated from the exact sRGB values:

| Pair | Ratio | Decision |
| --- | --- | --- |
| Charcoal and ivory | 15.28:1 | Suitable for normal text and main controls |
| Gold and ivory | 2.90:1 | Fails normal text and even the 3:1 large text threshold; also insufficient for an essential icon boundary |
| Charcoal and gold | 5.27:1 | Suitable for normal text at full opacity |

These calculated ratios use solid colours. Blended surfaces and photography require their own tests. [W3C contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) sets the applicable thresholds. Gold cannot be made accessible on ivory simply by enlarging it slightly.

Use approximately 80% to 88% ivory surfaces, 10% to 17% charcoal, and 2% to 3% gold in the designed UI as an art direction target, excluding photographs. This is a recommendation, not a research finding. A charcoal footer naturally changes the distribution over a full page.

Permitted derived surfaces: charcoal at 3% on ivory for grouping, charcoal at 12% for decorative dividers, gold at 10% on ivory for an editorial field, and charcoal at 45% for overlay backdrops. Essential input boundaries use a stronger charcoal treatment and must pass 3:1 against their surrounding surface. Muted text uses charcoal at no less than a tested readable opacity; start at 75%. Never lower opacity on an entire content container because it also reduces child text contrast.

Success, warning, and error use the same palette. Distinguish them through explicit words, different icons, border weight, and placement. For example, an outlined warning icon and “Payment not confirmed” communicates the state without introducing red. Selected states use a charcoal check and border, optionally over pale gold. Disabled controls use muted treatment plus an explanation when the cause is not obvious.

## 6. Design tokens and responsive foundation

### 6.1 Type

**D:** Use a self hosted licensed sans serif such as Inter for the interface. Use Georgia as a system serif for brief story headings, avoiding an additional font download. Inter licensing and actual supplied files must be checked during implementation. Use system sans serif until the custom font is available. If multilingual storefront content is introduced, add a script appropriate font and inspect shaping, line height, and wrapping rather than forcing Latin metrics.

| Role | Desktop size / line height | Mobile size / line height | Weight and use |
| --- | --- | --- | --- |
| Hero title | 48 / 52 px, maximum 56 / 60 on wide displays | 30 / 34 px | 600 sans serif, or 400 serif for a brand campaign |
| Section heading | 30 / 36 px | 24 / 30 px | 600 sans serif |
| Story headline | 36 / 42 px | 28 / 34 px | 400 serif, maximum three lines |
| Card heading | 18 / 24 px | 16 / 22 px | 600 |
| Body | 16 / 24 px | 16 / 24 px | 400 |
| Product title | 15 / 21 px | 14 / 20 px | 400 to 500; two visible lines |
| Price | 18 / 24 px | 16 / 22 px | 600, tabular numerals where useful |
| UI label | 14 / 20 px | 14 / 20 px | 500 to 600 |
| Supporting metadata | 13 / 18 px | 13 / 18 px | 400 to 500 |
| Rare compact label | 12 / 16 px | 12 / 16 px | Short nonessential metadata only |

Use sentence case throughout. Uppercase is reserved for short campaign eyebrows of at most three words, with no more than 0.06em tracking. Never uppercase product descriptions or error paragraphs. Line lengths: 45 to 70 characters for prose, 28 to 45 in split story sections. At 200% text zoom, allow heading wrapping and section growth rather than clipping. Body text and form inputs are at least 16 px in the standard mobile layout. Prices should not look like decorative editorial typography.

### 6.2 Geometry and tokens

| Token family | Values and rules |
| --- | --- |
| Spacing | 4, 8, 12, 16, 24, 32, 48, 64, 80, 96 px |
| Page gutter | 16 px mobile; 24 px tablet; 32 px laptop; 48 px wide desktop |
| Container | Maximum 1440 px for commerce; 1200 px for dense utility pages; 720 px prose |
| Grid | 12 columns desktop, 8 tablet, 4 mobile; 24 px desktop gap, 16 tablet, 12 mobile |
| Section gap | 64 px desktop, 40 px mobile; story transitions may use 80 and 48 respectively |
| Radius | 4 px small labels; 8 px buttons and inputs; 12 px cards; 16 px large panels |
| Border | 1 px default; 2 px selected or essential focus support |
| Shadows | None on ordinary product cards; `0 8px 24px rgb(24 32 27 / 0.10)` for overlays |
| Icons | 20 px inline; 24 px navigation; consistent 1.75 to 2 px stroke; actual hit area 44 to 48 px |
| Buttons | 48 px main height; 44 px compact; 16 to 24 px horizontal padding; allow taller wrapped labels |
| Inputs | 48 px minimum, 16 px text, persistent external label |
| Announcement | 32 px nominal; 40 px if copy wraps; never marquee |
| Desktop header | 80 px utility row plus 44 px category row |
| Mobile header | 52 px logo row plus 56 px search row; separate 28 px location row in normal flow |
| Product image | 3:4 apparel; 1:1 general goods; 4:3 furniture; consistent within each rail |
| Product grid | Four columns at ordinary desktop widths, five at 1440 px content if cards remain readable; two mobile |
| Product rail | Four desktop visible; two full mobile cards by default, next indication through explicit controls |
| Overlay sizes | Small dialog 440 px; size guide 720 px; desktop cart 440 px; mobile sheet width 100% |

### 6.3 Breakpoints and structural changes

| Viewport width | Structure |
| --- | --- |
| 320 to 359 px, small mobile | Two product columns with 12 px gap; stack original price below price if required; shortcuts scroll; no decorative story layers |
| 360 to 599 px, mobile | Two product columns; full width search; four bottom destinations; hero stacked; compact story image then copy |
| 600 to 767 px, large mobile and small tablet | Three product columns when minimum card width is maintained; shortcuts can fit more items; mobile navigation remains |
| 768 to 1023 px, tablet | Three or four product columns; compact header; click based category drawer; hero can split at 900 px if both halves remain readable |
| 1024 to 1279 px, laptop | Full desktop navigation if it fits; four product columns; 52:48 split hero; smaller utility labels |
| 1280 to 1535 px, desktop | Four or five product columns depending on content width; full mega menu; 56:44 hero image to copy |
| 1536 px and above | Container stops growing at 1440 px; generous outer margins; never stretch cards indefinitely or make hero taller just because the screen is wider |

These are initial implementation thresholds. Use container queries for cards and components, and switch navigation before labels collide. A 1024 px tablet with touch must not require hover. Do not infer interaction capability from width alone. Test 320 px, 390 px, 768 px, 1024 px, 1366 px, and 1920 px, plus text zoom and landscape.

### 6.4 Layers and motion tokens

| Layer | z index |
| --- | --- |
| Ordinary content | 0 |
| Card controls | 10 |
| Sticky header | 100 |
| Bottom navigation and sticky purchase control | 110 |
| Nonmodal menu and autocomplete | 200 |
| Modal backdrop | 400 |
| Active dialog or drawer | 410 |
| Status toast | 500 |

A toast must never cover dialog actions. Only one modal layer is active. Tooltips belong to the active layer rather than escaping behind it.

Motion durations: feedback 100 ms; controls 160 ms; menu 180 ms; drawers 240 ms; optional story reveal 400 ms. Entry easing `cubic-bezier(0.2, 0.8, 0.2, 1)`; exit `cubic-bezier(0.4, 0, 1, 1)`; scroll linked movement is directly mapped without spring lag. Menu hover intent delay of 350 ms is separate from its animation duration.

## 7. Homepage architecture in exact vertical order

**D:** The following is the canonical full homepage. Optional modules disappear without leaving blank space. Do not fill missing evidence with invented claims. A small catalogue may omit Sections 10 and 12, but keep the relative order of remaining sections. Section 9 is the second and final substantial story block; Section 13 is practical store information. Products remain before and after the story blocks.

All section heights are approximate content targets, not fixed containers. Copy wrapping, language, accessibility zoom, and product title length take priority. Section headings use the scale in Section 6. Every product module uses the product card contract in Section 10.

### 00. Announcement bar

**Purpose and content:** One current service or offer statement, such as a genuine free delivery threshold. If no meaningful message exists, omit it. Do not manufacture a sale to occupy the space.

**Desktop and mobile:** Full width charcoal surface, ivory 13 to 14 px text. Height 32 px, allowed to wrap to 40 px. One underlined “Details” link; no rotating text. Mobile copy should be approximately 45 characters before its link.

**Interaction and motion:** Details opens a compact policy sheet. Closing it returns focus. Announcement itself scrolls away and never adds a second sticky bar. No entrance animation.

**Conversion, trust, identity:** Makes useful value visible, exposes conditions, and can communicate the store's actual dispatch promise. **Admin:** Message, destination, start and end time, timezone, eligibility, priority, enabled state. Publish requires a working destination and any necessary qualification.

### 01. Header, search, and department navigation

**Desktop:** 80 px utility row with logo up to 160 px wide, search flexing from 320 to 600 px, delivery selector, Account, Wishlist, and Cart. Below, a 44 px department row contains five to seven relevant categories, New arrivals, Offers, and a quieter Our store link if space permits. Never shrink all labels to fit more departments.

**Mobile:** 52 px row with menu, compact logo, wishlist, cart. A 56 px search row follows. Location is a 28 px row in normal flow. On scroll, only the search row sticks; cart remains accessible through the bottom navigation. Search sticky state retains a small back or home affordance only where the route requires it.

**Interaction:** Logo returns home. Cart opens drawer. Department opens category route or explicit disclosure, as specified in Section 9. PIN opens a delivery sheet. Search opens suggestions. Account remains optional.

**Conversion, trust, identity:** Provides immediate familiar routes, delivery context, and stable store recognition. No entry animation or header resizing that moves content. **Admin:** Logo and alt text, department order, utility links, support route, delivery wording, supported languages. No arbitrary scripts or free positioning.

### 02. Main commerce and identity hero

**Purpose:** Explain what is sold, give one reason to shop now, and place the real business behind the products.

**Desktop:** 400 to 460 px within the main container. Image occupies about 56%, copy 44%. Product or product in use dominates the image. Ivory copy panel uses a short eyebrow, two line headline, one sentence, optional factual offer, primary CTA, and one quiet proof line. Example structure only: “[Product category], selected by [business]”; “[Current collection]”; “Shop the collection”; “[Town] store, since [verified year]”.

**Mobile:** Copy above image unless the image can carry an immediate category signal in a compact combined composition. Total 300 to 360 px at typical 390 px width. One 48 px CTA; secondary story link omitted here and available later. Image receives its own mobile crop. Text stays HTML.

**Interaction:** Shop collection opens the exact eligible collection, with campaign filter preserved. Story proof can link to the business page when it is a real link. Static by default. No scroll trapping. See Section 8 for the full campaign contract.

**Conversion, trust, identity:** Gives a concrete shopping route, authentic imagery, and a short business signature. **Admin:** Campaign title, body, desktop and mobile media, focal points, alt text, CTA, collection ID, offer ID, evidence line, schedule, expiry fallback. No invented years or customer counts.

### 03. Category shortcuts

**Purpose:** Reveal the breadth of the actual catalogue immediately after the hero.

**Desktop:** Six to eight items in one row, about 140 to 190 px total height including label and spacing. Use 88 to 112 px square images with softly rounded corners. Circular crops are allowed only for suitable centred objects and must not cut off products.

**Mobile:** Four visible shortcuts at about 72 px width in a native horizontal track. Display a fifth partial item only in this compact shortcut track to indicate continuation; provide View all categories. Labels wrap to two lines, no truncation. About 112 to 140 px high.

**Content:** Names such as Shirts, Shoes, Jewellery, Gifts, or catalogue relevant equivalents. Do not force clothing, gender, or age onto unrelated businesses. No discount on every shortcut.

**Interaction and motion:** Entire image and label form one link to a category landing page. Desktop underline and subtle image scale of 1.02 on hover; none needed on touch. Track remains usable without drag through buttons or ordinary links.

**Conversion, trust, identity:** Establishes assortment and reduces browsing effort. Photography style carries identity. **Admin:** Category IDs, sequence, image, alt text, labels, enabled state. Empty categories are excluded automatically.

### 04. Best sellers or store picks

**Purpose:** Put actual purchasable products near the top before asking the customer to read a story.

**Desktop:** Four visible cards, up to eight items total with manual next control and View all. Height roughly 480 to 580 px for apparel. Heading and explanatory line align left; controls right.

**Mobile:** Two column grid of four products rather than an invisible long rail. Height around 620 to 760 px depending on image ratio and card controls. The first row should be the immediate next product content. View all appears below. No nested vertical scrolling.

**Content:** Image, exact product name, price, applicable original price and discount, rating count when real, wishlist, and add or choose options. If no sales evidence exists, title is “Our store's picks”, not “Best sellers”.

**Interaction:** Product opens detail. Wishlist saves locally for guests. Add respects variant selection and current stock. No mandatory image entrance delay.

**Conversion, trust, identity:** Demonstrates available stock and transparent prices. Merchant curation can show expertise. **Admin:** Automated ranking window, exclusions, manual picks, title, explanatory copy, maximum count. Store best seller claims must use a documented sales basis with returns considered.

### 05. The business behind the products

**Purpose:** Answer “Who am I buying from?” after the visitor has seen merchandise.

**Desktop:** 5:7 split between genuine store or founder photography and 60 to 90 words of copy. Height 360 to 440 px. Pale gold surface or plain ivory; serif headline 36 px, body 16 px. One verified fact and one CTA.

**Mobile:** 4:3 image, headline, 40 to 60 words, one link. Total about 380 to 460 px. No sticky behaviour.

**Content:** Name, place, actual history or reason for starting, and a specific service or selection principle. CTA “Meet the people behind [business]” opens the business story page. Avoid a generic paragraph about excellence.

**Motion:** Optional image movement of at most 16 px on desktop while in view, only under the motion rules. Content remains visible without animation.

**Conversion, trust, identity:** Reduces unknown seller concern through identifiable people and location. **Admin:** Module type, authentic photo, caption, owner approved copy, evidence reference, CTA, related collection. If founder imagery is unavailable, use the real storefront or working process.

### 06. Products connected to the story

**Purpose:** Return immediately to shopping and demonstrate the previous claim.

**Desktop:** Four products in a rail, 420 to 540 px for square images or 480 to 580 for apparel. Title is specific, for example “Chosen for everyday wear”, only when that is the actual story connection.

**Mobile:** Two cards visible in a native horizontal rail, four to six items total. At 390 px, cards are approximately 173 px wide with a 12 px gap and 16 px gutters. Buttons allow pagewise movement. A small “1 of 3 groups” status is available to assistive technology, without constant live announcements while swiping.

**Content and interaction:** Full product cards, View collection, no miniature marketing banners. Product click and add behaviour match Section 04. No autoplay.

**Conversion, trust, identity:** Turns a business claim into inspectable merchandise. **Admin:** Linked collection, manual product overrides, heading, description, inventory fallback. If there are fewer than two relevant products, use a single featured product with clear detail rather than duplicate cards.

### 07. Customer evidence and service reassurance

**Purpose:** Address confidence before the next promotion.

**Desktop:** Three review cards across with a compact service row beneath. About 300 to 380 px. Each card shows a short review, product reference, date, customer approved name, and verified purchase label only if verified. Optional customer image opens an accessible gallery.

**Mobile:** One complete review and the next through a manual track, or two stacked short reviews. Service links form a 2 × 2 grid. Roughly 360 to 480 px. Do not auto rotate testimonials.

**Content:** At most three service facts: delivery details, return policy, human support. Ratings link to the full review set, including critical reviews. Google store rating is separately labelled with source and date, never mixed into product ratings.

**Interaction:** Review opens full review or product; service statement opens actual terms. No random shield badges. No testimonials means substitute a real store photo plus contact and policy evidence, not fabricated feedback.

**Conversion, trust, identity:** Shows other customers' experience and accountability. **Admin:** Review source IDs, consent status, moderation status, links, service policy IDs, source date. Cannot edit a genuine review into a different claim.

### 08. Current collection and one meaningful offer

**Purpose:** Restore campaign energy after a quieter evidence section.

**Desktop:** Two panels, 60:40. Larger collection image with short headline and Shop collection. Smaller ivory or charcoal offer panel with benefit, conditions summary, and View eligible products. About 300 to 380 px.

**Mobile:** Collection first, compact offer second, about 400 to 520 px combined. If there is no active offer, use one collection panel and omit the second.

**Content:** Seasonal, festive, occasion, or new launch curation. UI remains within three colours; photographic content supplies seasonal richness. Use charcoal offer text, not gold small print.

**Interaction and motion:** Collection opens its landing page; offer opens eligible collection or conditions sheet. Subtle image zoom on hover, no countdown unless a genuine scheduled deadline warrants one. Never require copying a code when automatic application is possible.

**Conversion, trust, identity:** Encourages further browsing without concealing eligibility. The collection reflects the business's taste. **Admin:** Collection, media, title, offer rules, schedule, legal or operational terms, stock exclusions, priority. Server evaluates eligibility.

### 09. Behind the product, craft or expertise

**Purpose:** Explain the differentiator that cannot be understood from price alone.

**Desktop:** 50:50 image and content split. One image with two or three short process steps; 440 to 560 px. Optional sticky image only when total section is no more than 1.5 viewport heights. Always include a direct shop link.

**Mobile:** One image followed by two or three numbered facts; about 420 to 540 px. No sticky sequencing or parallax. For resellers, show selection, fitting, inspection, packaging, or service, never imply manufacture.

**Content:** Evidence of workmanship, sourcing, freshness, testing, fit advice, or curation. “See the collection” opens related merchandise. A longer process page is secondary.

**Motion:** One restrained image mask reveal or a maximum 24 px parallax offset on eligible desktop devices. Text never fades away while being read. Reduced motion presents a static layout.

**Conversion, trust, identity:** Justifies value and makes expertise memorable. **Admin:** Process steps, real photos, captions, supporting evidence, product links, optional effect flag. Effects are disabled if media or performance checks fail.

### 10. New arrivals or seasonal picks

**Purpose:** Place another fresh shopping opportunity after the deeper story.

**Desktop:** Four cards, with up to eight available through manual navigation. Mobile: two column grid of four. Heights follow Section 04. New arrivals use actual published availability date, not merely an edited record timestamp.

**Content:** Choose one title appropriate to the business. Do not show Best sellers, Trending, New arrivals, and Local favourites as four near identical consecutive rails. Seasonal selections should make sense for location and catalogue.

**Interaction and animation:** Standard product links and variant aware add. No automatic rail movement. **Conversion:** Repeat visitors see meaningful change. **Trust:** Items are available and dates are honest. **Identity:** Shows the merchant's current curation. **Admin:** Product set, freshness period, collection, scheduling, exclusions. Omit if it duplicates most of an earlier rail.

### 11. Shop by need or budget

**Purpose:** Help the visitor who has not found a product category route that fits their mission.

**Desktop:** Three editorial cards across, image 4:3 plus heading and one sentence, roughly 280 to 360 px. Mobile: three stacked compact image and text rows, about 320 to 420 px. No horizontal scroll is required.

**Content:** Examples include Work essentials, Gifts under ₹1,000, Small space living, or Everyday care. Pick three catalogue relevant needs. Budget thresholds use actual eligible prices; do not lead to a page dominated by more expensive stock.

**Interaction:** Opens a saved collection with active, visible filters and a way to clear them. Simple 160 ms hover feedback. **Conversion:** Creates new entry paths. **Trust:** Landing contents match the promise. **Identity:** Shows useful advice rather than vague lifestyle claims. **Admin:** Collection rules, budget bounds, labels, images, destinations, inventory checks.

### 12. Continue browsing or recommended products

**Purpose:** Help returning customers recover progress. For a new visitor, use a curated recommendation only if it adds real variety, otherwise omit.

**Desktop:** Four visible cards, up to eight. Mobile: two visible in a manual rail. Heading includes the relationship, such as “Recently viewed” or “More from the collection you viewed”. Height about 380 to 540 px.

**Interaction:** Recently viewed has Clear history. Product links restore the product normally. No intimate inference, names in public headings, or unexplained gender assumptions. No animation on reorder because ordering is settled before rendering.

**Conversion, trust, identity:** Reduces repeated search while preserving control. Identity comes from consistent curation. **Admin:** Enablement, exclusions, maximum count, fallback collection, retention policy. Merchants cannot manually manufacture a customer's browsing history.

### 13. Visit or contact the real store

**Purpose:** Establish accountable local presence and offer human help.

**Desktop:** Real exterior or team image on one side, address, opening hours, phone, WhatsApp if supported, and delivery or pickup information on the other. About 260 to 340 px. No heavyweight interactive map on initial homepage load.

**Mobile:** Store image, address, hours, and two clear actions: Get directions and Contact us. About 320 to 420 px. A service area business without a public shop uses its legitimate support identity and service area, not a fabricated storefront.

**Interaction:** Directions opens a map link; phone uses the call action; WhatsApp opens a user initiated conversation with a short neutral message. Do not auto send. Display realistic support availability. No motion required.

**Conversion, trust, identity:** Allows reassurance and offline visits. **Admin:** Approved public address, hours, holiday exceptions, support channels, image, pickup eligibility, directions URL. Do not expose a private residence without business approval.

### 14. Footer

**Desktop:** Charcoal surface, ivory text, four groups: Shop, Customer help, Our business, Contact. Keep the real identity block prominent. Use 14 to 16 px links, 24 px line height, 48 to 64 px vertical padding. About 360 to 480 px, content dependent.

**Mobile:** Contact and policy shortcuts remain visible; remaining groups become accordions with 48 px headers. Address and business identity are readable without tiny print. Footer includes padding for bottom navigation.

**Content:** Shipping, returns, cancellation, privacy, terms, support, order tracking, relevant legal business name and GST details where applicable. Payment methods are plain text or approved marks. Include a newsletter form only if useful content and an actual communication process exist.

**Interaction and motion:** Links navigate normally, accordion expands in about 180 ms or instantly with reduced motion. Newsletter never preselects marketing consent. **Conversion:** Resolves final questions. **Trust:** Policies and contact are available. **Identity:** Business name, location, and voice conclude the page. **Admin:** Links, contact, policy versions, legal identifiers, optional newsletter copy. Publishing checks broken destinations.

## 8. Hero specification and above fold budget

### 8.1 Composition and hierarchy

**D:** Use one static hero at launch. This keeps the main route visible without asking visitors to wait. Seasonal campaigns can change the content without changing the structure. Multiple competing campaigns belong further down the page or in a dedicated Offers page.

Desktop copy order: campaign eyebrow, product category headline, one benefit sentence, unconditional price or clearly qualified offer if useful, primary CTA, short authentic business signature. Limit headline to about 45 characters and body to about 90 characters as editorial guidance, not hard truncation. Primary CTA should name the destination: “Shop festive gifts”, not “Discover more”.

Use real products at sufficient scale to recognise material, silhouette, or use. For apparel, show a real outfit and avoid cropping essential fit information. For food, show the sold portion or pack. For furniture, show scale in a room. For electronics, show the actual model and relevant connections or context. Do not invent premium materials through retouching.

Do not place text over a busy image by default. A solid ivory or charcoal copy panel is easier to maintain than a variable gradient. If text overlays an image, guarantee contrast across all responsive crops with a sufficiently opaque approved colour panel. Test the actual crop, not just the original asset.

### 8.2 Viewport examples

| Reference viewport | Top content budget | Result |
| --- | --- | --- |
| Desktop 1440 × 900 CSS px | Announcement 32, utility 80, nav 44, hero 420, gaps about 32, shortcuts about 150 | Hero products and category imagery appear before the fold; best seller heading can begin near it |
| Mobile 390 × 844 CSS px | Announcement 32, logo 52, search 56, location 28, hero 320, gaps 24, shortcuts 120, bottom nav 56 | Product and category imagery visible; beginning of best sellers may appear depending on browser chrome |
| Mobile 360 × 640 CSS px | Same useful controls; hero near 280 to 300 if copy allows | Hero product and CTA remain visible; full category row is not guaranteed above fold |

Above fold product visibility means recognisable merchandise in the hero and category imagery. Do not promise that complete SKU cards, hero, navigation, and every offer will all fit in a short phone viewport. If showing SKU prices before the fold is a business priority, test a compact 220 px campaign variant with a product row immediately after it. Never shrink body copy to force this fit.

### 8.3 Image delivery and fallback

Create separate desktop and mobile compositions, inspired by Croma C1 and C2. Use a responsive picture element with source selection, explicit dimensions, and a focal point per breakpoint. Keep the relevant product inside a defined safe area. Art direction may change the crop, not the identity or proportions of the product. Use AVIF or WebP with a compatible fallback based on actual browser support.

The first hero image is discoverable in initial HTML, eager loaded, and receives high fetch priority when it is the likely LCP element. Do not lazy load it or fetch its URL only after client JavaScript runs. Preload only when resource discovery needs it; avoid preloading both desktop and mobile assets or every campaign. Text and CTA render even if the image fails. Failure shows a neutral reserved image field, a useful category label, and the same working CTA. [R12]

### 8.4 Campaign variants and administration

Permitted variants: collection launch, seasonal curation, festive offer, local signature product, and occasion campaign. Each uses the same hierarchy and controls. A sale variant can use charcoal as the main copy panel with a small gold detail. No new UI colours are introduced for festivals.

Change when inventory, season, or offer genuinely changes. Weekly or fortnightly review is a sensible operational cadence; there is no universal research backed interval. Schedule in Asia/Kolkata for an India store by default, with the actual timezone stored. At expiry, replace with a preapproved evergreen campaign. Never leave an expired timer or a broken category route.

If stakeholders later require a campaign carousel, cap it at three slides, manual only on every device. Provide Previous and Next buttons with 44 px targets and a text counter. Pagination dots may supplement, never replace, named controls. Keep equal reserved heights. Swipe is optional, not the only mechanism. No automatic rotation means no pause control is needed. Announce the new slide after deliberate control activation, without moving focus into its content.

Personalised hero is deferred. First test one relevant category variant for a returning visitor who explicitly selected a department. Keep the brand statement, structure, and height stable. Do not change prices based on inferred wealth, gender, or personal circumstances. Anonymous fallback is always the ordinary campaign.

## 9. Navigation and search contract

### 9.1 Catalogue architecture

Choose the primary hierarchy by the business's actual range. For a mixed fashion store, a reasonable path is Women → Clothing → Shirts, with size, fit, material, occasion, and price as filters. Men and Kids use parallel structures where relevant. For a general local store, begin with product departments and use recipient or occasion as secondary routes.

Avoid forcing customers through Clothing → Upper wear → Gender → Garment → Style when a simpler route and filters can do the work. Maintain one canonical product record even if it appears in many collections. Every parent category offers View all. A small store with 30 products may need only four categories and a collection page, not a marketplace mega menu.

### 9.2 Desktop menus

Display five to seven principal routes. A category name is a link; an adjacent disclosure button opens subcategories, with clear accessible naming. Alternatively use a single disclosure button with a prominent View all category link inside. Do not give one click an ambiguous combination of navigation and menu opening.

Mega menu width follows the container, maximum about 1100 px, with three link groups and one optional editorial image. Each group has a meaningful heading and about five to eight links. No more than one promotional image. Active department gets an underline and text weight, not colour alone. Hover opens after 350 ms; pointer movement into the menu should not close it immediately. Click and keyboard always work. Escape closes and returns focus to the trigger. Menu stays within viewport and can scroll if text zoom makes it taller. No focus trap for a normal nonmodal navigation disclosure.

### 9.3 Mobile navigation

Categories opens a full height route or drawer with title, close or back control, and visible top level departments. On selecting a department, show its subcategories and View all. A clear Back to categories control restores the previous level and scroll position. Do not nest the product taxonomy under another generic Shop item.

Home, Categories, Account, Cart form the bottom navigation. Wishlist remains in the header and Account. Use 24 px icons plus 12 to 13 px labels, 56 px bar plus safe area inset. Active route uses weight, indicator, and `aria-current`. Hide the bottom bar while the search keyboard or full screen modal is active. On product detail pages, the sticky purchase bar replaces it rather than stacking a second bar. On checkout, remove shopping navigation distractions but preserve a clear Back and order context.

### 9.4 Search states and ranking

| State | Visible content and behaviour |
| --- | --- |
| Idle | Search products and categories; a real label for assistive technology, not only placeholder text |
| Focused, empty | Up to three recent searches with individual delete and Clear all; optional genuine popular queries |
| Typing | Debounce about 150 ms; cancel stale requests; six mobile or eight desktop suggestions total |
| Suggestions | Query completions first, then clearly named category scopes, then at most two product matches; brand scope only for a multi brand catalogue |
| Keyboard | Arrow keys move active suggestion, Enter selects or submits query, Escape closes, Tab follows predictable focus order |
| Loading | Keep typed query and prior useful suggestions stable; show a small text status, not an entire page skeleton |
| No suggestion | Search for the exact typed phrase remains available |
| Results | Query heading, result count, visible category scope, filters, sort, product grid |
| Corrected spelling | Show corrected result interpretation and a Search instead for original option |
| No results | Explain no matches; allow typo edit, broader category, and removal of restrictive filters; do not silently substitute unrelated products |
| Error | Preserve query and show Retry; browsing categories remains available |

This suggestion count and scope treatment follows the direction of Baymard autocomplete findings [R4]; the specific composition is our recommendation. Keep suggestion labels at 16 px on mobile with at least 48 px rows. Use bold on the suggested continuation, normal weight on the typed part. Do not pack a grid of promotional images above useful text suggestions.

Normalise common catalogue synonyms, spelling variants, plurals, and practical Hinglish transliterations where user research justifies them. Test actual local queries such as a product name spelled phonetically. Do not pretend that a semantic model can replace accurate catalogue attributes. Exact SKU and model matches outrank broad semantic similarity. Out of stock items are clearly marked and do not dominate default results.

Mobile search opens a full screen surface with search at top, Back, Clear query, and suggestions below. Preserve text on close and reopen within the visit. Keyboard opening must not cover the selected suggestion or submit control. Search page back navigation restores filters and scroll position.

Voice and image search are not launch requirements. Add voice only if recognition works for actual supported languages, editable transcription is shown, and microphone permission follows a user action. Add image search only when catalogue image matching has been tested and upload privacy is explained. Neither replaces typed search. An optional AI helper must use verified catalogue and policy data, show uncertainty, and never invent stock, warranty, ingredients, or delivery dates. Amazon's Rufus demonstrates a discovery direction, not evidence that a small store needs the same feature [official Amazon source].

## 10. Product card and product discovery system

### 10.1 Card contract

Image comes first, then one small category relevant attribute or brand if useful, a two line product name, current price, legitimate original price and saving, rating and count if available, optional variant hint, and an action. Do not show a redundant store brand above every product in a single brand store.

Default apparel image is 3:4; square for packaged goods, shoes, jewellery, and electronics unless the category requires otherwise. Furniture may use 4:3. Never mix aspect ratios within the same rail. Use contain for product cutouts and cover for approved lifestyle photographs. Do not cut off a shoe, package quantity, or furniture leg to match an arbitrary crop.

At 390 px viewport with 16 px gutters and 12 px gap, two cards are about 173 px wide. At 320 px they are about 138 px. Allow price and metadata to wrap. A mobile card needs approximately 90 to 140 px below its image depending on controls. No invisible information on hover. Desktop can show a secondary image on hover after a short intent delay, but the first image remains fully informative.

Wishlist is a separate 44 px button near the image corner with an ivory backing if required for contrast. One top left badge maximum, preferably New or an actual offer. Stock warnings belong near the purchase action and must use current variant stock. Do not cover the centre of the product with a large sale stamp.

The main image and title link to the product. Wishlist and add controls are separate buttons, not nested in the link. A card with variants says Choose size or Choose options. A single variant product can say Add to cart. Choosing an unavailable size cannot silently add a different one. Whole card click must not swallow button interaction.

Ratings use charcoal stars plus numeric score and count; a screen reader hears “4.6 out of 5 from 28 reviews”. Zero reviews shows no fabricated star treatment. Original price uses a semantic old price label and visual strike through. Savings are derived from the approved reference price; don't calculate a discount from a conditional bank price. “From ₹…” requires a currently purchasable variant at that price.

### 10.2 Discovery placement

| System | Homepage role | Category or product role | Data and controls |
| --- | --- | --- | --- |
| Category | Essential shortcuts | Full hierarchy | Inventory aware taxonomy |
| Gender | Relevant fashion routes, never compulsory identity choice | Optional scope and filters | Chosen shopping intent, not inferred identity |
| Age | Kids or gift businesses only | Age range, size, suitability | Product data; no child profile required |
| Occasion | One curated module if useful | Collection landing pages | Merchant maintained mapping |
| Price | One budget route | Filter and sort | Current eligible prices |
| Brand | Only multi brand stores with enough depth | Brand filter and brand pages | Actual catalogue brands |
| Collection | Hero plus one further campaign | Editorial collection page | Clear inclusion rules |
| Use case | Section 11 | Functional filters and guides | Evidence based suitability |
| Trending | Optional replacement for a rail | Category trending sort if defensible | Defined recent view or sales window, bot filtering |
| Best sellers | Section 04 if supported | Category best sellers | Sales basis and time window |
| New arrivals | Section 10 | New sort and filters | First available date |
| Recently viewed | Section 12 | Optional near end of product page | Clearable local history |
| Recommended for you | One explainable rail | Contextual alternatives | Preference controls and generic fallback |
| Because you viewed | Returning visitor rail | Similar items | Explicit relationship; avoid sensitive categories |
| Customers also bought | Usually not homepage | Product and cart | Sufficient real transaction evidence |
| Complete the look | Fashion collection only when useful | Product page | Exact linked items and variant selection |
| Bundles | One relevant campaign at most | Product and cart | Separate component stock and clear total savings |
| Seasonal picks | Replace another rail | Dedicated collection | Actual season, region, availability |
| Local favourites | Optional, evidence required | Local collection | Define place and popularity; otherwise Store picks |

Avoid recommending an already purchased durable item as if it were new. Consumable reorder can be useful, but wait for a reasonable customer chosen cadence. Cart cross selling uses at most two compatible supplements and never inserts an item automatically. Product page alternatives should not displace the current product's purchase controls.

## 11. Reusable local business storytelling framework

**D:** A story module contains one verifiable claim, one visual piece of evidence, one human detail, and one nearby shopping destination. It is not a generic mission statement. Default homepage allocation is two meaningful story modules, each surrounded by merchandise. Deeper history belongs on the business page.

| Module | Use when | Evidence and content | Suitable presentation | Product connection |
| --- | --- | --- | --- | --- |
| Our story | Origin explains the offer | Real starting point, place, reason, supporting photo | Short split panel | Signature collection |
| Meet the founder | Founder remains meaningfully involved | Name, role, real portrait, specific expertise | Portrait and brief quote with approval | Founder selections |
| Made locally | Products are actually made locally | Named place and process; distinguish assembly from manufacture | Workshop image and caption | Locally made product subset |
| How we make it | Process changes quality or value | Two or three actual steps | Image and numbered facts | Products made by that process |
| Why we started | A customer problem shaped the business | Concrete need and resulting product decision | 60 word editorial panel | Products solving that need |
| Our craft | Skill is distinctive | Technique, materials, time, detail photographs | Macro photograph and explanation | Relevant craft collection |
| Years of experience | History can be supported | Founding year and continuity, not summed staff ages | One understated fact within story | Established favourites |
| From our store to your home | Fulfilment care is a differentiator | Actual inspection, packing, dispatch process | Two real images and steps | Delivery or packaging information |
| Behind the product | One product has a meaningful origin | Materials, source, design or selection rationale | Feature image plus product card | Exact product |
| Our community | Local relationships are real and consented | Event, customer activity, local collaboration | Small editorial story | Related collection, if any |
| Our values | Values change operations | Concrete practice and evidence, not adjectives | Three short evidence statements | Traceable products |
| Our workshop | A real working space exists | Location, actual tools and process | Wide image with restrained depth effect | Workshop products |
| Our team | Service expertise matters | Real roles and approved photos | Two or three portraits | Advice, fitting, installation, selection |
| Milestones | History has useful customer meaning | Dates and factual events | Short timeline on business page | Keep timeline off homepage unless essential |
| Customer stories | Real experience demonstrates suitability | Consent, authentic quote, product reference | Review plus customer image | Exact purchased product |

### Industry adaptation

| Business | Strong story angle | Product evidence | Avoid |
| --- | --- | --- | --- |
| Clothing | Fit knowledge, fabric choice, tailoring or curation | Measurements, fabric details, on body photos | Implying own manufacture for bought in goods |
| Shoes | Fitting advice, construction, comfort testing | Sole, lining, size conversion, intended use | Unsupported medical comfort claims |
| Jewellery | Material sourcing and workmanship | Material details, applicable certification, scale photos | Vague purity or authenticity seals |
| Food and beverages | Ingredients, preparation, freshness | Pack size, ingredient list, storage and expiry information | Unverified health claims or misleading serving size |
| Beauty | Ingredient literacy and sourcing | Full product facts, usage, cautions | Invented clinical evidence |
| Home products | Practical selection and care | Dimensions, material, use context | Beautiful photographs without scale |
| Electronics | Selection expertise and service | Exact model, warranty source, compatibility | Unsupported authorised seller claims |
| Furniture | Construction, finish, installation | Dimensions, materials, delivery and assembly terms | Hiding delivery cost behind a story |
| Gifts | Thoughtful curation and presentation | Exact contents, personalisation limits, dispatch cutoff | Implied contents absent from the sold bundle |
| General goods | Merchant knowledge and local service | Real store, clear catalogue, practical support | Copying a craft narrative that does not exist |

Story writing rule: replace “We are passionate about quality” with an operational fact that a customer can inspect. Placeholder examples must remain unpublished until replaced with approved business facts. Use no more than one founder quote per homepage. Images must show the real store or work when presented as documentary evidence. Stock photography can illustrate a mood only when it cannot be confused with factual business evidence.

## 12. Motion and animation language

**D:** Motion confirms actions and gently adds depth. It never withholds information, takes over scroll, or makes a shopping control move away from the pointer. All content is visible and actionable before optional decorative effects initialise. Do not animate every card or reveal text word by word.

| Interaction | Proposed motion | Duration and trigger | Limits and reduced motion fallback |
| --- | --- | --- | --- |
| Page entry | No blocking transition; optional opacity on noncritical decoration | 160 ms after render | Main heading, search, and products never wait |
| Hero | Static composition; optional 6 px copy settle | 240 ms once, only after usable render | Off for reduced motion; do not begin LCP image at opacity zero |
| Hero campaign change | Short crossfade after manual action | 180 ms | Fixed dimensions, no autoplay |
| Image reveal | A single soft mask on story image | 400 ms once in view | Static image on mobile and reduced motion |
| Text reveal | Whole short block opacity only | 180 ms | No per letter, per word, or scroll dependent visibility |
| Product card | Secondary image fade, optional image scale 1.02 | 160 ms on fine pointer hover | No card translation, no hover only facts |
| Button | Background blend and subtle pressed inset | 100 to 160 ms | No spring bounce or shrinking text |
| Category | Image scale 1.02 and label underline | 160 ms | Link remains in place |
| Menu | Opacity and 4 px downward settle | 180 ms after intent delay | Keyboard opening can be immediate |
| Search opening | Surface fade, retain input position where possible | 160 ms | Keyboard response must not wait for animation |
| Wishlist | Heart changes fill, brief small scale to 1.08 | 120 ms after local save | Static filled state for reduced motion; announce Saved |
| Add to cart | Button loading then confirmation; count updates | Immediate pending, confirmation on success | No flying product image across viewport |
| Cart drawer | Slide from right desktop, rise from bottom mobile | 240 ms | Reduced motion: instant or short fade |
| Section reveal | Optional one story image only | 300 to 400 ms | No hidden commerce sections |
| Image zoom | Product gallery zoom on deliberate action | 180 ms | Close accessible; do not hijack page pinch zoom |
| Sticky header | Border or subtle shadow appears | 120 ms | No height animation or layout jump |
| Product carousel | Native scroll with optional smooth button movement | Around 200 ms | Reduced motion uses instant scroll |
| Story parallax | Image shifts no more than 24 px | Direct scroll mapping | Desktop only, no motion preference, no save data mode |
| Sticky story | Image remains while two or three facts pass | Normal scroll | Max 1.5 viewport section; static on mobile |
| Skeleton | Static low opacity shapes; optional quiet shimmer | One cycle about 1.5 s | No shimmer with reduced motion; stop when content loads |
| Toast | 6 px rise with opacity | 160 ms in, 120 ms out | Never moves underlying page; pause dismissal on focus |
| Success | Check icon and textual result | 120 ms | No confetti or full screen success animation |

### Scroll effects decision

Permit one desktop story section with restrained parallax only after the baseline page meets performance targets. Use a clipped image with a small overscan area so movement does not reveal blank edges. Avoid translating an entire high resolution page layer. Stop observers when the section is offscreen. Use transform and opacity rather than repeated layout reads and writes.

Sticky storytelling must allow ordinary wheel, keyboard, touch, and scrollbar movement. Do not require the visitor to finish a narrative before reaching the products. Do not pin a screen for several viewport lengths. Links remain clickable and focusable in the natural reading order.

**Reject vertical scroll driving horizontal product movement on the main homepage.** It conflicts with rapid scanning and may make products move past a customer who is trying to read. If an editorial collection experiments with horizontal scenes, it must provide ordinary controls, a static mobile layout, and a direct skip link. This is an optional experiment, not the default implementation.

For `prefers-reduced-motion: reduce`, disable parallax, mask animation, image scale, smooth scrolling, and directional drawer travel. Keep immediate state changes and necessary progress feedback. WAI's animation guidance supports allowing nonessential motion to be disabled [R15]. Also provide a persistent Reduce motion preference if the site uses any substantial optional story effect.

## 13. Popup and overlay policy

**D:** User initiated utility overlays are normal. Unsolicited promotional overlays are off by default. Never open a welcome, PIN, login, notification permission, and newsletter prompt together. A visitor may browse without giving a phone number.

### 13.1 Shared overlay contract

Desktop small dialog: 440 px wide, 24 px padding, maximum height 85dvh, scrollable content. Mobile utility sheet: full width, 16 to 24 px padding, maximum height 85dvh; long tasks use a full height page or dialog. Close button is always visible with a 44 px target. Primary CTA stays accessible above the keyboard and safe area. If a sticky action footer is used, reserve its height in the scrolling body.

Use an ivory surface, charcoal title and copy, and charcoal at 45% backdrop. Title is 24 px, body 16 px. Close on Escape. Backdrop click may close noncritical forms, but never discard a payment or unsaved meaningful action silently. Preserve entered data on incidental close where appropriate. Focus moves to a useful heading or first field, remains inside a modal, and returns to its trigger. The background becomes inert. The browser Back action should close mobile full screen overlays before navigating away. [R14]

Nonmodal autocomplete and account disclosures do not trap focus. Tooltip content cannot contain a task that requires interaction; use a popover for that. No overlay spawns another independent modal. If size selection opens a size guide, switch content within the same dialog with a clear Back control.

### 13.2 Overlay inventory and scheduling

| Surface | Exists? | Trigger and frequency | Content and action | Desktop / mobile |
| --- | --- | --- | --- | --- |
| Welcome offer | Inline by default | Hero or Offers page, no arrival popup | Benefit, actual eligibility, Shop eligible items | Compact card / compact strip |
| First purchase offer | Yes, if real | Customer selects offer; no repeated unsolicited prompt | Minimum spend, cap, exclusions, validity | 440 px dialog / sheet |
| Newsletter | Optional | Inline footer; user opens preferences | Value of messages, email, explicit consent | Inline form / inline form |
| Promotional email or phone capture | Off by default | Optional test only after 45 s active engagement and two product views, not on cart or checkout | One field, clear benefit, equal easy close | Small dialog / bottom sheet no taller than half screen |
| Cart drawer | Yes | Cart click; may open after successful add if chosen sitewide | Item, selected variant, quantity, subtotal, charges caveat, View cart, Checkout | 440 px side drawer / sheet or full page |
| Wishlist confirmation | Yes | Successful save, no more than one stacked message | Saved to wishlist, optional View | Nonmodal toast on both |
| Added to cart notification | Yes, choose toast or drawer | After confirmed add | Exact item and variant, View cart | Never toast and drawer simultaneously |
| Size guide | When relevant | Explicit Size guide click | Measurement table, unit switch, how to measure | 720 px dialog / full height surface |
| Delivery PIN | Yes | Explicit delivery click or check on product page | Labelled 6 digit field, result, delivery and COD status | Small dialog / sheet |
| Coupon selection | Yes | Offers click in cart or product | Eligible first, ineligible with reasons, Apply | Dialog / sheet |
| Login and sign up | Yes | Account, checkout save request, or user chosen sync | Clear benefits, supported login methods, guest path where relevant | Dialog / full screen |
| Search | Yes | Focus or explicit search action | Suggestions, clear query, submit | Anchored panel / full screen |
| Quick view | Optional, desktop only initially | Explicit Quick view control | Image, price, essential variant, product page link | 720 px dialog / mobile goes to product page |
| Back in stock | Yes for unavailable variant | User asks once for that exact variant | Email or phone, chosen channel, consent for alert only | Small dialog / sheet |
| Price drop alert | Optional later | Explicit product action | Target or current price, channel, cancellation route | Small dialog / sheet |
| Exit intent | No at launch | No pointer exit or back button interception | Use saved cart and visible wishlist instead | Not applicable |
| Abandoned cart reminder | Optional outside page | Only with appropriate consent and operational support | Real saved items and current price, no fake expiry | Never an intrusive homepage modal |
| Browser push permission | No arrival prompt | Only after user requests supported alerts | Explain benefit before browser prompt | User initiated only |

The optional capture experiment is globally capped at one unsolicited promotion per session and no more than once in 30 days per browser after dismissal. Successful signup suppresses it for that account. If storage is unavailable, err toward no unsolicited prompt. Frequency caps cannot reliably identify a person across cleared storage or devices, so do not claim perfect enforcement. Never reopen on every route change. User initiated utility dialogs are not limited by this cap.

Inline form errors remain beside the field. Transaction errors do not disappear as transient toasts. Neutral success toasts last about five seconds, pause on hover or focus, and expose a dismiss control. If an Undo action is important, ensure it remains available in the relevant page as well; avoid making a timed toast the only way to recover.

## 14. Trust system with verifiable evidence

**D:** Trust appears at the moment of uncertainty, not only in a homepage badge strip.

| Customer question | Best evidence | Where it appears | Implementation rule |
| --- | --- | --- | --- |
| Is this a real business? | Real name, storefront or team, public contact, location | Story module, store block, footer | Verify owner approved details; no stock photo presented as the store |
| Will this arrive here? | PIN specific service result and estimated range | Header selector, product, cart, checkout | Recheck at checkout; distinguish dispatch from delivery |
| Can I return it? | Product specific policy, window, exclusions, process | Product near action, cart link, footer | Do not promise universal easy returns |
| Is it genuine? | Sourcing documentation or legitimate authorisation where relevant | Product facts and supporting page | “Authentic” claim must be supportable |
| Does it fit or suit my use? | Size chart, dimensions, ingredients, compatibility, in use photos | Product page | Match the selected variant |
| Can I get help? | Real phone or WhatsApp, hours, expected response | Header help route, store block, order page | Do not promise 24/7 unless staffed |
| Do others buy here? | Genuine reviews, traceable review source, customer photos with consent | Product and review module | Separate store rating from product rating |
| Is payment understood? | Supported methods, clear payable total and status | Cart, checkout, confirmation | Payment success comes from verified status, not a screenshot |
| Who is accountable? | Legal business identity and relevant registration information | Footer, invoice and policies | Validate applicability with business records; do not invent numbers |
| What if it breaks? | Warranty provider, duration, exclusions, care | Product and order detail | Distinguish manufacturer warranty from store support |

Business age is derived from a verified founding date. Order counts use a defined successful order metric and period, excluding tests and cancellations. Never display “10,000 happy customers” from a raw page view count. Reviews need moderation for abusive or irrelevant content, but negative product experiences should not be removed merely because they are negative.

For an external Google rating, show source name, review count, and retrieval date, with a link. If no authorised data integration exists, a dated verified citation is preferable to a fake live widget. Never combine scores from different scales or contexts without transparent methodology.

UPI and COD labels signal supported options, not guaranteed eligibility. COD can depend on PIN, order value, product, and service. Show the reason if unavailable. Manual QR UPI needs a clear pending verification state; a customer pressing “I paid” does not confirm payment. Same phone checkout should not assume the customer can scan the QR displayed on that phone. Provide a supported app or payment route when available, or clear instructions and an alternative method. A payment provider flow should preserve the order and allow status recovery after returning to the store.

GST information, invoices, category certifications, food registration, and warranty obligations require validation for the actual business and products. This guide defines display locations and evidence rules, not a complete legal compliance opinion. Avoid copying another store's policy wording or legal identifiers.

## 15. Premium offer system

**D:** Offers should be easy to notice and easy to understand. Their visual volume follows importance, not the number of discounts in the database.

| Offer | Presentation | Required detail | Destination |
| --- | --- | --- | --- |
| Product discount | Current price bold; original smaller and struck; saving next line if necessary | Valid reference price, actual current saving | Product with same eligible variant |
| Category discount | One line under category title | “Up to” or minimum qualifier retained; eligible stock | Filtered collection |
| Coupon | Quiet bordered card, code if needed, Apply button | Minimum spend, cap, exclusions, expiry, combination rules | Eligible collection or cart application |
| Limited offer | Small charcoal badge and factual end date | Real schedule in store timezone | Exact offer landing page |
| Festival sale | One designed campaign using photo and approved colours | Scope, dates, terms | Festival collection |
| Deal of the day | One slot maximum | Actual dated deal, stock and eligibility | Deal product or collection |
| Bundle | Product set and total price | Included quantities, separate purchase total, saving, stock | Variant aware bundle builder |
| Free delivery | Brief message; cart remaining amount if eligible | Threshold, excluded regions or bulky items | Delivery terms |
| Cart offer | Summary close to totals | Effect on payable total; removal and failure reasons | Apply without leaving cart |
| Bank offer | Secondary effective price note | Bank, payment method, cap, minimum order, actual availability | Conditions sheet |
| First order | Inline prompt or Offers page | Definition of first order, cap, exclusions | Eligible collection |

No gold text on ivory discount badges. Use charcoal text on pale gold, or ivory on charcoal. Avoid lightning bolts, explosive shapes, and five badges on a single product. A countdown is optional and rare: show a real deadline, use a stable width, stop at zero, and remove or change the offer server side. Do not restart on refresh. Low stock means actual available stock for the selected variant, not a random number or total catalogue stock.

One dominant promotion per viewport is a review heuristic. The announcement should be short enough to coexist with a hero, not compete with it. If a hero already advertises a first order discount, do not repeat that offer in a popup, edge tab, and sticky strip. If stock or campaign eligibility changes, update the destination and message together.

## 16. Detailed component state guide

### 16.1 Universal state rules

Normal state communicates purpose before interaction. Hover is a small tonal change or underline on fine pointer devices; it cannot reveal the only price or action. Pressed state is immediate and lasts only while activating. Keyboard focus uses a 2 px charcoal ring with an ivory separating offset, reversed appropriately on charcoal backgrounds. Gold may decorate but cannot be the only focus cue.

Disabled controls cannot be activated. Show a nearby reason if the user needs to act, such as Choose a size. Loading preserves dimensions and the action label, adds a small indicator, and prevents duplicate submissions. Use `aria-busy` on the relevant region and announce completion appropriately. A disabled looking colour is not enough to communicate state. Error states explain what happened and the next available action.

### 16.2 State matrix

| Component | Normal | Hover and pressed | Focus | Disabled or loading | Mobile and motion |
| --- | --- | --- | --- | --- | --- |
| Header logo | Clear brand mark linked home | No image gymnastics; subtle opacity only | Visible ring around link | Logo remains available while data loads | Fixed dimensions, no entrance |
| Announcement | One sentence and details link | Underline details | Focus ring on link | Omit unavailable campaign | Wrap rather than marquee |
| Search input | Label, placeholder, magnifier | Border emphasis | Charcoal boundary and suggestions | Preserve query; local status | Full screen results surface; 160 ms fade |
| Mega menu | Closed disclosure | 350 ms intent, then open | Keyboard expands; current scope marked | No disabled category with hidden reason | Becomes category drawer |
| Mobile navigation | Four labelled items | Pressed tonal field | Visible ring, current item semantics | Badge loading never blocks route | Safe area, no bar bounce |
| Hero CTA | Clear destination | Small tonal change, immediate press | High contrast ring | If destination has no eligible products use approved fallback | 48 px, no delayed interactivity |
| Category card | Photo and full label | 1.02 image scale and underline | Ring around card link | Exclude empty category or show explicit unavailable state on category page | 44 px minimum target, full two line labels |
| Product card | Image, facts, separate actions | Optional second image; no card movement | Each link and button separate | Skeleton same ratio; unavailable variant marked | Two columns, no hover dependence |
| Offer card | Benefit and conditions | Border emphasis; CTA press | Link or button ring | Expired offer removed or labelled in offer history | Conditions readable, no flashing |
| Collection card | Image and destination title | Subtle image zoom | Full link ring | Fallback image retains title | Stacked or compact row |
| Story block | Image, claim, evidence, CTA | CTA underline only | Natural reading order | No story skeleton required; render stored content | Static mobile; optional desktop effect |
| Review card | Quote, source, date, product | Link underline; photo clear affordance | Gallery trigger labelled | Hide missing data, not all negative reviews | Manual track or stacked |
| Trust link | Specific factual text | Underline | Ring | Unknown service shown as Check availability | Never a row of unexplained seals |
| Primary button | Charcoal, ivory text | Charcoal opacity overlay or inset; no low contrast | Ivory gap and charcoal ring | Spinner plus original label; reason for disabled state | 48 px height; 100 ms feedback |
| Secondary button | Ivory with charcoal border | Pale charcoal fill | Charcoal ring | Muted but labelled | Equal target size to primary |
| Text link | Underlined where embedded in prose | Stronger underline | Visible ring | Do not style unavailable text as a link | Readable inline, spacing prevents wrong taps |
| Text input | External label, boundary, help | Boundary emphasis | Ring plus caret | Readonly labelled; validation progress local | 16 px font, correct keyboard type |
| Select or dropdown | Label and current selection | Clear pressed field | Keyboard operates options | Explain unavailable option | Prefer native select for simple forms |
| Tabs | Active underline and weight | Tonal hover | Arrow keys for true tab set | Loading keeps panel bounds | Horizontal scroll only if necessary; all labels available |
| Accordion | Title, state icon | Tonal header | Button semantics, expanded state | Avoid disabling access to essential content | 48 px header, 180 ms expansion |
| Carousel | Visible items and manual controls | Controls react; no auto start | Buttons operate without drag | End control disabled with clear state | Native horizontal scroll and button alternative |
| Breadcrumb | Parent links and current page | Underline links | Normal link sequence | No skeleton needed | Show useful parent rather than tiny full hierarchy |
| Badge | One short meaningful label | No hover if noninteractive | Not focusable unless action | No animation | Readable text; not colour only |
| Rating | Score and count | Review link underline | Link name describes rating | No rating if absent | Avoid tiny stars as five separate targets |
| Price | Payable item price prominent | No hidden details on hover | Not focusable unless a real offer link | Skeleton reserves width | Wrap old price below; preserve currency |
| Wishlist | Outline heart with label | Tonal backing; filled on save | Label includes product | Pending save shown; failed sync preserves local state or explains rollback | 44 px target, 120 ms optional feedback |
| Quantity stepper | Value, minus, plus | Clear pressed state | Buttons named Increase or Decrease | Disable at valid limits with explanatory text | 44 px controls, editable number where practical |
| Cart drawer | Exact variants, subtotal, checkout | Standard controls | Modal focus rules | Local quantity progress; errors next to item | Sheet or page; 240 ms max |
| Modal | Title, close, clear task | Standard controls | Trap and return focus | Preserve form input | Keyboard safe, no stacked dialogs |
| Toast | Concise result and optional action | Pause dismissal on hover | Pause while focused | Errors requiring action stay in page | Above safe area, not covering CTA |
| Footer | Grouped links and identity | Underline | Clear ring on dark | Links independent of dynamic recommendations | Contact visible, other groups accordion |

### 16.3 Empty and failure states

An empty cart states “Your cart is empty” and offers Continue shopping. It does not fill the screen with unrelated promotions. An empty wishlist explains that saving products is available without immediate purchase. A category with no stock offers relevant neighbouring categories and a clear back route. Broken product imagery keeps the product name and price visible and exposes a neutral fallback, not a misleading substitute image.

If add to cart fails, retain the selected size and quantity, explain stock or network failure, and offer Retry. Optimistic wishlist saves may update immediately because the action is reversible; failed account sync must be acknowledged. Payment confirmation cannot be optimistic. Loading failure after a reasonable timeout replaces the spinner with Retry and a useful alternative. Section F4 motivates this explicit recovery rule.

## 17. Section transitions and premium rhythm

**D:** Use consistent container edges, type, and image treatment to connect sections. Background changes are occasional signposts, not a different theme for every module.

| Transition | Treatment | Reason |
| --- | --- | --- |
| Commerce to commerce | 48 to 64 px space desktop, 32 to 40 mobile; same ivory field; clear next heading | Maintains browsing speed without visual fragmentation |
| Categories to product rail | Keep heading alignment; increase image scale from shortcut to card | Signals shift from choosing a department to evaluating products |
| Products to story | 80 px desktop gap; one pale gold field or editorial photo edge | Makes the story feel intentional without hiding commerce |
| Story to products | Repeat a phrase or material from the story in the product heading; 40 to 64 px gap | Explains why these products follow |
| Products to promotion | One contrasting charcoal panel, same radius and typography | Creates controlled energy without a new palette |
| Promotion to trust | Return to ivory, smaller heading, real review evidence | Changes from promise to verification |
| Trust to editorial | Align image and text edges with previous grid; modest serif heading | Creates a quieter reading moment |
| Store block to footer | Continuous charcoal boundary or clear 48 px pause | Makes the service and identity destination obvious |

No decorative wave dividers, repeated torn paper edges, random diagonals, or gold lines around every section. A thin gold rule can introduce the first story module but should not become a universal border. Sticky effects belong inside their section and must not overlap later headings. Use `scroll-margin-top` appropriate to the sticky header on anchor targets.

## 18. Personalisation with customer control

**D:** Personalise useful choices, not the person's identity. The homepage structure stays stable. Header categories, policies, prices, and available departments remain consistent.

| Visitor | Sensible behaviour | Avoid |
| --- | --- | --- |
| New visitor | Broad catalogue coverage, current campaign, store evidence | Guessing gender, income, or family status |
| Returning anonymous visitor | Clearable recently viewed products stored locally where appropriate | Claiming to know the person's name or household |
| Logged in customer | Saved wishlist, order access, chosen preferences | Moving checkout or menu controls based on history |
| Browsing history available | One explained related product rail | Repeating a sensitive item in public hero copy |
| Purchase history available | Compatible accessories or optional consumable reorder | Recommending the same durable item repeatedly |
| Shopping men's products | Chosen men's collection context and related items | Treating it as proof of the customer's gender |
| Shopping women's products | Same intent based approach | Excluding all other categories |
| Parent or children's shopper | User selected age range or current product context | Inferring child details or storing unnecessary child data |

Provide Clear recent history and Reset recommendations. A starting local history retention recommendation is 30 days, subject to the store's privacy policy and actual implementation. Do not collect full addresses or phone numbers merely to personalise the homepage. Use PIN only for the service purpose presented. Marketing consent is separate from order communication. No recommendation engine may change the product facts, stock, or policy.

If there is insufficient data, use a plainly labelled editorial collection. Do not use “Customers also bought” for merchant selected accessories. Suppress unavailable and duplicate products across nearby rails. Relevance should be evaluated by successful product discovery and purchases, not only clicks.

## 19. Mobile first operating rules

The mobile storefront is the main design, not a scaled desktop page. Myntra M2, Flipkart F2, Nykaa N2, Croma C2, and FirstCry FC2 demonstrate distinct mobile composition choices. Our decisions keep their familiar search and category access while reducing promotional stacking.

1. Search remains visibly present, not hidden behind a magnifier alone. The logo row can scroll away; a 56 px search row remains sticky.
2. Bottom navigation has four stable labelled destinations. Its safe area padding is reserved in the page. Wishlist remains accessible without consuming a fifth permanent tab.
3. Header and bottom chrome should not occupy more than roughly one fifth of a normal phone viewport during browsing. On very short landscape screens, reduce sticky elements and favour normal flow.
4. Product grids use two columns on ordinary phones. Category shortcuts may use four because they carry less information. Do not use a three across SKU grid with unreadable prices.
5. Hero gets its own image crop and shorter copy. No baked desktop coupon artwork shrunk to phone width.
6. Rails use native horizontal scrolling, light proximity snapping, visible controls where useful, and ordinary product links. Never hijack vertical gestures.
7. Tap targets are at least 44 px, preferably 48 px for primary actions. Leave at least 8 px between compact unrelated targets where possible.
8. No hover only quick add. Every product can be opened by a direct tap. Swatch selection never unexpectedly navigates away.
9. Sticky Add to cart exists on product pages only after the main action area scrolls out of view. It reflects selected variant and availability and replaces bottom navigation.
10. Filter and Sort on category results are clearly labelled. A filter sheet has Apply with count and Clear all. Closing without Apply preserves the previous active filter set, while drafted changes can be retained within that visit.
11. Browser Back restores the prior category, filters, query, and scroll position. Do not reset to the top of an infinite list.
12. Authentication is not required to browse, search, or maintain a local wishlist. Guest checkout remains a first class option if the operational system supports it.
13. Story text stays short, with a visible route to more detail. No mobile parallax, long pinned stories, or horizontal scenes driven by vertical scroll.
14. Keyboard appearance must not hide form errors or action buttons. Use appropriate input types but permit international names, address punctuation, and pasted values.
15. Support low bandwidth: text and essential actions appear before optional photography loads; no app install gate, auto playing video, or mandatory animation.

On mobile category pages, show the category title, count, optional subcategory chips, Filter, Sort, and products quickly. Desktop uses a left filter area when the catalogue warrants it. Do not apply a homepage sized hero to every category. Product detail pages use a gallery, factual title, rating, price, variant choices, delivery check, policy summary, and purchase action before extended storytelling.

## 20. Performance as a design constraint

**R:** Google defines good Core Web Vitals as LCP at or below 2.5 seconds, INP at or below 200 milliseconds, and CLS at or below 0.1, assessed at the 75th percentile with mobile and desktop segmentation [R11]. These are field goals, not a promise that a single laboratory run represents every customer.

**D:** The following budgets are initial engineering targets for this design, not standards imposed by Google. Adjust only with evidence and maintain the field goals.

| Area | Target and implementation rule | Verification |
| --- | --- | --- |
| Initial mobile hero | Aim 100 to 180 KB compressed; larger only if visible quality demands it | Compare actual mobile crop at 1× and 2× display density |
| Desktop hero | Aim 180 to 300 KB compressed | Inspect on large screen without downloading mobile and desktop versions together |
| Product image | Typical small card source around 20 to 50 KB; responsive sizes | Test texture and label readability, not file size alone |
| Initial images | Only hero and genuinely visible images eager loaded | Network waterfall and LCP attribution |
| Below fold images | Native lazy loading with dimensions reserved | Scroll on slow network; no collapsing placeholders |
| Initial JavaScript | Aim below 170 KB gzip for homepage route code, excluding separately justified platform overhead | Bundle report; account for total execution cost too |
| Fonts | One limited sans family, two or three necessary weights or a measured variable subset | Font download total and text layout shift |
| Video | No automatic hero video; story video behind click with poster | No video bytes before intent unless explicitly justified |
| Carousels | Native scroll and light controls where possible | No large library solely for one rail |
| Motion | Transform and opacity, no per frame layout loops | Performance trace during interaction and scrolling |
| Code splitting | Search enrichment, gallery zoom, size guide, and video loaded by route or intent | No delay that makes opening the utility feel broken |
| Long tasks | Split expensive ranking or rendering; keep interaction handlers short | Real INP attribution, not only Lighthouse score |
| Third party work | No heavy chat, social feed, or map in initial viewport | Inventory requests and execution impact |
| Layout stability | Fixed image ratios, stable header size, reserved media and skeleton bounds | CLS field data and visual inspection |
| Recovery | Visible retry on failed dynamic modules; static catalogue routes still work | Offline and flaky network simulation |

Use responsive `srcset` and `sizes` that reflect actual card widths. Serve appropriately sized images instead of a full original for every card. Keep product photography colour accurate and do not overcompress jewellery detail, fabric texture, or package text beyond usability.

Server render or otherwise deliver meaningful initial HTML for header, hero text, categories, and first products. Essential navigation must not wait for a large client application. Price and inventory must reconcile with authoritative server data before purchase. Avoid layout shifts from late personalised modules: reserve an appropriate slot, choose content before rendering where possible, or keep the current layout until the next navigation.

For fonts, use swap or optional according to the visual requirements, choose metric compatible fallbacks, and preload only the critical face if needed. Do not download a full decorative font family for a three word heading. Keep icon delivery in a small SVG set rather than an entire icon font.

A slow network user should see headings, prices, categories, and working links even if images take longer. Do not place an opaque loading screen over the whole homepage. Skeletons match the actual final layout and announce loading once, not per card. A footer remains reachable because the homepage has a finite module count.

Collect real user vitals with route, device class, and anonymous diagnostic context. Avoid recording personal data. Monitor product and checkout pages as well as homepage. Lab testing on a representative mid range Android phone and constrained network is a release check; field data validates performance after deployment.

## 21. Accessibility specification

Target WCAG 2.2 AA across storefront and checkout. The following applies the public standard and WAI patterns [R13, R14]. It is not a substitute for testing with assistive technology.

| Area | Requirement and design implementation |
| --- | --- |
| Contrast | Normal text ≥4.5:1; large text ≥3:1 under WCAG definitions; essential control graphics and boundaries ≥3:1. Gold on ivory fails even 3:1 |
| Keyboard | All actions work without a mouse; no hover only menus; logical order follows reading sequence |
| Focus | Visible on every interactive component; sticky header, purchase bar, or toast does not entirely obscure it; aim to keep it fully visible |
| Targets | WCAG 2.2 AA minimum is 24 × 24 CSS px with specified exceptions and spacing provisions; our product target is 44 to 48 px, not a claim that AA mandates 44 |
| Semantics | One main page heading, coherent heading hierarchy, landmarks, real links and buttons |
| Skip navigation | Visible on focus; skips repeated header to main content |
| Images | Product alt text identifies product and useful view; decorative images have empty alt; documentary image caption identifies actual context |
| Icons | Buttons have useful names, such as Add linen shirt to wishlist; do not rely on a heart glyph alone |
| Forms | Persistent labels, relevant autocomplete values, clear required fields, helper text, errors associated with fields |
| Error recovery | Error summary links to affected fields when a form has multiple errors; preserve valid entries |
| Modals | Labelled dialog, focus containment, Escape close when appropriate, focus return, inert background |
| Carousels | Manual buttons, current position, no required dragging, no automatic focus jumps |
| Motion | Reduced motion disables nonessential movement; no flashing campaigns |
| Zoom and reflow | Text works at 200%; page reflows at 320 CSS px except legitimately two dimensional content such as a complex table |
| Status | Announce cart and wishlist completion politely; urgent failures clearly but without repeated announcements |
| Price | Screen reader receives current price, original price, and saving in meaningful order |
| Selection | Size, colour, active tab, and stock state use text or shape as well as visual colour |
| Authentication | Allow password managers and paste; avoid memory puzzles or blocked OTP paste |
| Tables | Size charts have row and column headers, readable units, and a responsive wrapper if necessary |

A text label that merely looks like a button is insufficient. A visible button that is an unlabelled SVG is also insufficient. Test keyboard, screen reader, zoom, text spacing, reduced motion, touch, and error paths. Decorative restrained luxury is compatible with accessibility because strong typography and clear hierarchy improve both.

## 22. Conversion journeys, including customers who skip the homepage

**D:** The homepage supports several intents. It is not a compulsory sequence of persuasion. A customer can search and leave the homepage immediately, while another may need business evidence before selecting a product.

| Intent | Likely route | Homepage support | Success condition |
| --- | --- | --- | --- |
| Knows the exact item | Arrival → search → results → product → cart → checkout | Prominent search, precise suggestions | Correct available item found without reading stories |
| Browses a department | Arrival → shortcuts → category → filters → product | Clear assortment and familiar taxonomy | Relevant category reached quickly |
| Seeks an offer | Announcement or hero → eligible collection → product → cart | One clear benefit with accessible terms | Landing page and payable price match the promise |
| Is unsure about the seller | Products → business story → reviews or contact → product | Real people, store, service and policy evidence | Questions answered without leaving shopping context |
| Shops for a gift | Shop by need → budget or recipient collection → product | Meaningful use case routes | Suitable item and delivery expectation understood |
| Returns to compare | Recently viewed → product → wishlist or cart | Clearable history and stable navigation | Previous product recovered without repeating search |
| Wants local help | Store block or Help → call, directions, support | Public store identity and realistic hours | Human assistance reached deliberately |
| Comes from social or search | Product or collection landing → product facts → store evidence → cart | Compact business proof repeated on relevant pages | No forced return to homepage to understand the seller |

The common purchase path is product selection, required variant selection, delivery check, add to cart, review charges and eligibility, checkout, verified payment or COD confirmation, and accessible order status. Do not require signup before showing shipping costs. Do not put a story interstitial between Add to cart and checkout.

### Cart and checkout continuity

Cart shows exact selected variant, quantity, item price, savings, subtotal, known delivery charge, and the remaining cost status. If delivery charge needs an address or PIN, say so before payment. Coupon failure explains the reason rather than “Invalid” alone. A quantity change must recompute totals and stock. Do not retain a misleading old total while allowing payment to proceed.

Checkout uses clear progress, guest route where supported, Indian address fields, six digit PIN validation, editable city and state when necessary, optional landmark, and practical delivery contact details. Never use PIN lookup as proof of an exact address. Preserve entered data on payment failure. Show UPI, supported payment provider methods, and COD according to actual eligibility. Unsupported methods are absent or have a clear explanation when relevant.

Confirmation includes order number, item summary, payment status, delivery expectation, contact route, and invoice access when available. Manual payment pending verification is visibly different from paid. A retry must not create duplicate charges or orders. Order tracking uses clear states such as Confirmed, Packed, Shipped, Out for delivery, Delivered, or an honest exception. These interactions establish trust more strongly than a decorative shield in the homepage hero.

## 23. Super Admin content and merchandising system

**D:** Owners should edit structured content, not manipulate arbitrary page blocks and CSS. Present the homepage as numbered plain language sections matching Section 7. The owner selects a section, sees the customer preview, edits named fields, and can save a draft before publishing.

### Editing model

Each section has: stable ID, type, title, enabled state, order, audience rule if any, content fields, linked catalogue IDs, evidence references, schedule, and fallback. Offer and product data are referenced rather than copied into independent banner text. Prices rendered in product modules come from the catalogue. Image based offer text is discouraged because it can go stale separately.

Use a guided form with plain labels: Heading, Short description, Choose products, Add photo, Button text, Button destination, Start date, End date. Show a visible thumbnail and destination summary. Avoid exposing terms such as JSON, z index, hydration, or focal coordinates in the everyday editor. A simple “Move the crop” tool can set focal points visually.

### Hero schema example

```json
{
  "id": "home_hero",
  "type": "campaign",
  "enabled": true,
  "eyebrow": "Collection name",
  "heading": "Describe the actual products",
  "description": "One useful reason to shop this collection.",
  "desktopImageId": "approved_media_id",
  "mobileImageId": "approved_mobile_media_id",
  "desktopFocalPoint": { "x": 0.5, "y": 0.5 },
  "mobileFocalPoint": { "x": 0.5, "y": 0.5 },
  "imageAlt": "Describe the actual image",
  "primaryCtaLabel": "Shop the collection",
  "collectionId": "valid_collection_id",
  "offerId": null,
  "businessEvidenceId": null,
  "startsAt": null,
  "endsAt": null,
  "timezone": "Asia/Kolkata",
  "fallbackCampaignId": "approved_evergreen_campaign",
  "presentation": "split",
  "autoplay": false
}
```

This is a schema illustration. Placeholder IDs and copy must be replaced before publishing. Do not treat it as production data.

### Publish checks

| Check | Behaviour |
| --- | --- |
| Missing required media or meaningful alt text | Explain what to add; allow decorative alt only for genuinely decorative images |
| Empty campaign collection | Block active campaign or select a valid fallback |
| Expired offer | Prevent publication as active; show expiry clearly |
| Conflicting dates | Highlight fields with a plain language correction |
| Price in banner differs from catalogue | Require correction or remove hardcoded price |
| Unsupported claim | Flag proof requirement and owner verification |
| Too much text | Show wrapping warning and actual mobile preview; never silently truncate essential terms |
| Broken CTA | Block publication until a valid destination exists |
| Duplicate products across consecutive rails | Warn and suggest alternatives |
| Too many enabled promotions | Show preview warning and identify competing surfaces |
| Image file too large | Optimise automatically and show quality preview |
| Custom colour outside palette | Do not expose arbitrary colour input in ordinary templates |
| Unavailable products | Exclude or explicitly label; never silently link to a different item |

Preview at mobile and desktop sizes. Show changes side by side when practical. Provide Save draft, Preview, Publish, and Restore previous version. Publishing records who changed what and when. Schedule changes with clear timezone display. A new owner can use predefined layouts, while an advanced editor can reorder allowed modules within guardrails. Keep commerce before the first long story and products after every substantial story.

### Data and integration boundaries

The visual guide does not require a paid recommendation service, hosted CMS, map widget, or chat plugin. A coded admin and catalogue backend can implement it. Firebase can store catalogue and section records if chosen, but data architecture must enforce server side authorisation, price integrity, stock rules, and payment verification. UI checks alone are not security controls.

Third party services are only needed where the actual operation requires them, such as an authorised payment flow or communications delivery. If a feature cannot be supported reliably by the available stack, remove its promise from the UI. An AI content helper can draft text but cannot invent product specifications, business history, reviews, certifications, or policy terms.

## 24. Measurement, validation, and conversion experiments

**D:** Validate outcomes instead of assuming marketplace familiarity transfers perfectly to a new store. No conversion percentage improvement is promised by this guide.

### Practical usability study

Recruit a small mixed group of roughly 8 to 12 prospective shoppers for an initial formative round, then iterate; this is a project recommendation, not a statistically representative Indian population sample. Include confident and less confident mobile shoppers, parents where relevant, different budgets, and users of assistive technology. Use the business's actual catalogue and real constraints.

Ask participants to find a specific product, browse an unfamiliar category, identify delivery eligibility, explain an offer's conditions, select a size, find the return rule, contact the store, and complete a test checkout. Ask what they remember about the business after browsing. Avoid leading prompts such as “Did the premium design make you trust it?”. Observe errors, hesitation, abandonment, and whether prices and conditions are understood.

### Event model

| Event | Useful nonpersonal properties | Question answered |
| --- | --- | --- |
| Section impression | Section ID, position, experiment variant | Was the module actually seen? |
| Campaign click | Campaign ID, CTA, destination | Did it create useful shopping intent? |
| Category click | Category ID, source module | Which discovery routes work? |
| Search submit | Sanitised query class, result count | Are customers finding the catalogue? |
| Search suggestion select | Suggestion type and position | Do suggestions reduce effort? |
| Product impression | Product ID, list ID, position | Which items received exposure? |
| Product select | Product ID, source list | Does merchandising lead to detail views? |
| Story interaction | Story ID, linked product or business route | Does storytelling lead to informed exploration? |
| Delivery check | Outcome category, no full address | Does service uncertainty interrupt shopping? |
| Add to cart | Product ID, variant ID, source | Which routes generate intent? |
| Coupon apply | Offer ID, success or reason category | Are offer rules understandable and usable? |
| Checkout step | Step, success or error type | Where does completion fail? |
| Purchase | Order reference with appropriate privacy controls, value | Does discovery lead to completed orders? |
| Return or cancellation | Category and reason | Did the interface create wrong expectations? |

Count a section impression only after a meaningful visibility threshold, such as 50% visible for one second, as an initial measurement convention. Deduplicate within the intended reporting unit. Do not equate raw page load with a viewed section. Do not log phone numbers, addresses, free form sensitive search text, or payment details into analytics events. Separate test orders and bots from commerce reporting.

Useful metrics: successful product finding, search no result rate, category to product progression, product to cart, checkout completion, payment recovery, offer application failure, returns related to wrong expectations, support contacts, and Core Web Vitals. Story clicks alone do not prove trust. Measure purchase and task outcomes while protecting against pressure tactics that increase clicks but worsen cancellations.

### Experiments worth running

1. Static split hero versus compact hero with a product row closer to the top. Keep campaign and traffic mix comparable.
2. Four best seller products before the first story versus two, measuring discovery and business recall.
3. One short business proof line near the hero versus only lower page story evidence.
4. Inline first order offer versus no acquisition offer, comparing completed purchases and margin, not only signups.
5. Store picks versus explained recommendation rail for returning visitors.

Define primary outcome, guardrails, duration, and stopping rule before a test. Do not declare a winner from a handful of orders or repeatedly check significance until a preferred layout wins. Low traffic businesses may get more useful evidence from task testing and support feedback than underpowered A/B tests.

## 25. Anti patterns and explicit rejections

| Do not do this | Why it conflicts with the brief | Use instead |
| --- | --- | --- |
| Five banners before products | Shopping breadth and actual prices arrive too late | One hero, shortcuts, then purchasable products |
| Gold body text on ivory | Calculated contrast is insufficient | Charcoal text; gold decoration |
| Gold backgrounds everywhere | Removes hierarchy and makes the palette feel ornamental | Rare gold detail and pale tints |
| Many auto rotating carousels | Reading and tapping targets change unpredictably | Static campaigns and manual rails |
| Immediate full screen welcome gate | Blocks a customer before showing value | Inline offer or deliberate offer action |
| Constant newsletter, login, PIN and app prompts | Competing interruptions damage trust | User initiated utility overlays and global caps |
| Tiny offer terms | Customers cannot evaluate the real price | Readable summary plus full details |
| Hidden or icon only navigation | Requires learning unfamiliar controls | Familiar text labels and visible search |
| Hover only prices or actions | Fails touch and keyboard access | Persistent facts and actions |
| Heavy hero video | Risks slow rendering and wastes bandwidth | Optimised still with optional later video |
| Parallax on every section | Creates fatigue and implementation cost | One optional desktop story effect |
| Scroll hijacking | Customer loses control of shopping speed | Native vertical scroll |
| Fake timers, fake scarcity, fake reviews | Misrepresents the business | Verified stock, deadlines, and reviews |
| Huge empty space between every module | Slows practical browsing | Consistent moderate section spacing |
| Dense marketplace walls everywhere | Product distinctions and business identity disappear | Themed modules with purposeful variation |
| Many fonts and campaign colours | Breaks consistency across store and checkout | One UI font, one restrained editorial treatment, three colours |
| Desktop artwork shrunk for mobile | Small copy and poor crops | Separate mobile art direction |
| Story before any clear merchandise | Turns shopping into a corporate introduction | Products first, then short evidence |
| Product grid without context | No reason to explore that set | Clear, truthful section title and selection basis |
| Universal easy returns | Misleads when exceptions exist | Product specific policy summary |
| Artificial discount reference prices | Makes savings untrustworthy | Valid prices and accurate calculation |
| Endless loading before footer | Makes service information difficult to reach | Finite homepage, retry, explicit further browsing |
| Cloned category sprawl | Implies inventory the local shop lacks | Taxonomy sized to the actual range |
| AI generated founder or workshop shown as real | Creates false evidence | Real images or clearly illustrative artwork |
| Unexplained location personalisation | Feels intrusive and can be inaccurate | User selected PIN and transparent local scope |
| Checkout marketing interruption | Breaks the highest intent task | Quiet checkout and optional post purchase preferences |

## 26. Build acceptance checklist

### Screenshot and design fidelity

* All 20 screenshot files have individual findings in Section 2.
* Category campaign tiles are not mistaken for SKU cards.
* Observations do not claim unobserved hover, autoplay, or measured performance.
* Six stores have distinct adopt, adapt, and avoid decisions.
* The palette contains exactly the three specified core values. Derived UI surfaces use their opacity variations only.
* Full homepage order follows Section 7, with missing optional modules omitted cleanly.

### Homepage and discovery

* The first screen identifies what the store sells and includes recognisable merchandise.
* Search is visible on mobile and desktop.
* Categories can be reached without reading a story or signing in.
* The first real product section precedes the first substantial story.
* Story sections link to relevant products and use verified evidence.
* Every campaign destination matches its claim and has eligible stock.
* All cards show useful names and current prices without hover.
* No duplicate product fills multiple nearby modules solely to make the page longer.

### Interaction and resilience

* Every actionable component has normal, focus, pressed, and applicable pending and error states.
* Cart, wishlist, variant, coupon, search, and delivery failure paths are usable.
* Mobile Back restores the prior meaningful context.
* Only one modal is active and focus returns correctly.
* No unsolicited prompt opens on arrival.
* Homepage footer remains reachable without endless content insertion.
* Expired offers have a valid fallback and do not restart timers.

### Accessibility and performance

* Exact colour pairs and blended states are contrast tested.
* Keyboard and screen reader journeys cover menu, search, product selection, cart, and checkout.
* Touch targets, zoom, text wrapping, and reduced motion are verified.
* Hero has separate mobile art direction and stable dimensions.
* No hero lazy loading, blocking intro, or auto playing video.
* Field monitoring is configured for LCP, INP, and CLS, with appropriate device segmentation.
* Representative Android and constrained network checks show usable initial content and recoverable errors.

### Business and administration

* Owner can edit hero, sections, products, categories, offers, navigation, and footer through plain language fields.
* Mobile preview is available before publish.
* Business history, reviews, customer counts, policies, and payment claims are verified.
* Current price and stock remain authoritative server data.
* A previous content version can be restored.
* Analytics measures actual impressions and commerce outcomes without unnecessary personal data.

## 27. Source register and evidence limits

All links below were retrieved or found through web research on 27 September 2026. The screenshot audit is original visual analysis of the supplied files and uses the file IDs M1 to FC2 defined in Section 2. The source register supports the explicitly labelled research findings; exact layouts, budgets, section order, timings, tokens, and operational defaults are this guide's recommendations.

| ID | Source | Used for |
| --- | --- | --- |
| R1 | [Baymard: Make product categories top level on mobile](https://baymard.com/research-articles/main-navigation-product-categories) | Direct category access |
| R2 | [Baymard: Homepage and navigation best practices](https://baymard.com/research-articles/ecommerce-navigation-best-practice) | Category grouping, parent routes, hover intent |
| R3 | [Baymard: Homepage carousel requirements](https://baymard.com/research-articles/homepage-carousel) | Manual control and carousel caution |
| R4 | [Baymard: Autocomplete design](https://baymard.com/research-articles/autocomplete-design) | Manageable suggestions, scopes, keyboard behaviour |
| R5 | [Nielsen Norman Group: Ecommerce product pages](https://www.nngroup.com/articles/ecommerce-product-pages/) | Product information quality |
| R6 | [Nielsen Norman Group: Luxury principles in ecommerce](https://www.nngroup.com/articles/luxury-principles-ecommerce-design/) | Useful detail and familiar tasks within luxury presentation |
| R7 | [Baymard: Relevant cart recommendations](https://baymard.com/research-articles/product-recommendations-cart) | Compatible cross selling |
| R8 | [Baymard: Alternative and supplementary products](https://baymard.com/research-articles/product-page-suggestions) | Separating recommendation purposes |
| R9 | [Bain and Flipkart: How India Shops Online 2026](https://www.bain.com/insights/how-india-shops-online-2026/) | Current India market context; published 8 April 2026 |
| R10 | [Bain and Flipkart: How India Shops Online 2025](https://www.bain.com/insights/how-india-shops-online-2025/) | Cohort differences and UPI context |
| R11 | [Google web.dev: Web Vitals](https://web.dev/articles/vitals) | Current metrics, thresholds and percentile interpretation |
| R12 | [Google web.dev: Optimise LCP](https://web.dev/articles/optimize-lcp) | Critical image discovery and priority |
| R13 | [W3C: WCAG 2.2](https://www.w3.org/TR/WCAG22/) | Accessibility target and requirements |
| R13a | [W3C: Contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) | Contrast evaluation |
| R13b | [W3C: Target size minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) | Distinguishing minimum requirement from our larger targets |
| R14 | [WAI: Modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) | Focus and dismissal model |
| R15 | [WAI: Animation from interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) | Nonessential motion control |
| S1 | [Myntra FAQ](https://www.myntra.com/faqs) | Official support and return route check |
| S2 | [Flipkart homepage](https://www.flipkart.com/) | Official location, search and merchandising check |
| S3 | [Amazon India: Shopping tools and deals](https://www.aboutamazon.in/news/retail/amazon-shopping-app-features-best-deals) | Official discovery tools context |

No screenshot proves that a pattern caused sales, that a product claim is accurate, or that a storefront passed accessibility or performance standards. No universal Indian shopping behaviour is assumed. This specification combines observed interfaces, public research, and explicit design judgement into an original system that still needs validation against the actual catalogue, operations, and customers.

**Familiar commerce. Premium presentation. Local identity.**
