# Website Integration Architecture Plan

## 1. Current Website Architecture
The current website relies heavily on dynamic, client-side regex parsing of raw scraped text.
- **Data Flow:** Data is injected globally via `<script>` tags loading `window.SMEAR_PACKAGES` and `window.SMEAR_TESTS`, with a fallback to `fetch('./public/data/packages.json')`.
- **Package Schema:** Uses a legacy schema where critical information (prices, profiles, FAQs) is embedded as raw HTML strings inside `sourceData.preview_content` and `sourceData.detailed_content`. `src/package-detail.js` runs complex regex parsing (`parseDetailedContent`) at runtime to build the UI.
- **Test Schema:** Simple structure but requires regex to extract numeric prices from strings like `"₹ 1500"`.
- **Cart Schema:** Handled locally in `src/cart.js`. If a price is omitted, it coerces to `0` (`price || 0`) and calculates totals as integers.
- **Categories:** Hardcoded mappings in `src/packages.js` map legacy category strings to emojis and colors.

## 2. Target Architecture
The goal is a strict separation of concerns where the website acts purely as a presentation layer for the fully normalized Smear catalog JSON.
- **Authoritative Data:** The website will consume `smear-packages.json`, `smear-tests.json`, and `smear-categories.json` via asynchronous `fetch()`.
- **No Regex Parsing:** All regex logic for prices, discounts, profiles, and FAQs will be completely stripped from the JavaScript.
- **Null Price Handling:** The UI will dynamically adapt to `null` pricing.

## 3. Integration Plan

### Packages & Tests Integration
- **`src/packages.js`**: Modify to `fetch('public/data/smear-packages.json')`. Delete `extractPrice()` and `extractDiscount()`. Use `pkg.price` and `pkg.discount` directly.
- **`src/package-detail.js`**: Delete `parseDetailedContent()`. Render the page directly by iterating over `pkg.profiles` and `pkg.faqs` which are already arrays of objects.
- **`src/blood-tests.js`**: Modify to `fetch('public/data/smear-tests.json')`. Replace references to `test.test_name` with `test.name`. Render the price directly or gracefully fall back if `null`.

### Search & Filter Integration
- **`src/global-search.js`**: Re-wire to point to the new JSON files. Update property lookups to use the new standardized keys (`name`, `category_id`, `id`).

### Pagination Plan
- **`src/blood-tests.js`**: The existing client-side pagination (slicing into 48-item chunks) is highly performant and requires no structural changes, only data mapping updates.

### Cart null Price Handling
- **`src/cart.js`**: 
  - Stop coercing falsy prices to `0`. Store `null` directly.
  - **UI Render**: If `price === null`, render "Price available at lab".
  - **WhatsApp Builder**: If `price === null`, append "— To be confirmed" instead of "— ₹0".
  - **Total**: Display the sum of known prices and append "+ pending items" if any items lack a price.

### Image Strategy
- The normalized data intentionally sets `image_url: null` to avoid source site contamination. 
- The existing codebase already includes a high-quality SVG placeholder mechanism (defined in `packages.js` and `package-detail.html`). We will rely exclusively on this neutral placeholder.

## 4. File Migration Strategy

**Files to Modify:**
1. `src/cart.js`
2. `src/packages.js`
3. `src/package-detail.js`
4. `src/blood-tests.js`
5. `src/global-search.js`

**Files to Remain Unchanged (HTML/CSS intact):**
- `packages.html`, `package-detail.html`, `blood-tests.html`, `shop.html`, `index.html`
- `src/styles/*`

**Files to Deprecate (Safe to delete post-migration):**
- `public/data/packages.json`, `public/data/packages.js`
- `public/data/package-categories.json`, `public/data/package-categories.js`
- `public/data/health-tests.json`
- `src/content/packages.js`, `src/content/tests.js`

## 5. Rollback & Risks
- **Rollback:** Fully client-side. Overwrite the `/src` folder with the pre-migration git commit, and restore the legacy data files in `/public/data`.
- **Risks:** 
  - **Legacy Cart State**: Existing users may have legacy BookMyTest package IDs cached in `localStorage`. The cart rendering logic must gracefully handle `undefined` lookups to prevent crashes.
  - **Category UI Mapping**: New normalized category IDs must be appended to the `CAT_ICONS` dictionary in `packages.js` to ensure they receive proper colors/emojis.
