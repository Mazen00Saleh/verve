# Cloudflare Performance Optimizations

This document records the performance audit and optimizations applied to the Verve Nuxt application for Cloudflare Pages deployment via GitHub.

## Architecture Summary

| Aspect | Configuration |
|--------|---------------|
| **Rendering** | Hybrid SSR — public catalog SSR with edge SWR; marketing pages prerendered; admin SPA (`ssr: false`) |
| **Deployment** | GitHub → Cloudflare Pages; `nitro.preset: cloudflare-pages` with `nodeCompat` |
| **Data layer** | Direct Supabase queries via composables + `useAsyncData` (no Nitro API routes) |
| **Caching** | Edge SWR on public CMS routes; long-cache static assets; admin uncached |

### Route rendering matrix

| Route | Strategy | Cache TTL |
|-------|----------|-----------|
| `/` | SWR | 300 s |
| `/about`, `/contact` | Prerender | Build-time static |
| `/collections`, `/collections/**` | SWR | 300 s |
| `/inspiration`, `/inspiration/**` | SWR | 600 s |
| `/admin/**` | SPA | None |
| `/_nuxt/**`, `/_ipx/**`, `/images/**` | Static headers | 1 year |

---

## Deployment (GitHub → Cloudflare Pages)

No Wrangler config or extra build script is required in the repo. Nitro generates the Worker output during `npm run build` (`nitro.cloudflare.deployConfig: true` writes `dist/_worker.js/wrangler.json` automatically).

**Cloudflare Pages dashboard settings:**

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Environment variables | `NUXT_PUBLIC_SUPABASE_URL`, `NUXT_PUBLIC_SUPABASE_KEY` |

Push to the connected GitHub branch to trigger a production or preview deploy.

**Not used (removed as redundant):**

- Root `wrangler.jsonc` — only needed for manual `wrangler pages deploy` CLI; ignored when Nitro generates deploy config
- `build:pages` npm script — preset is already `cloudflare-pages` in `nuxt.config.ts`

---

## Changes Made

### 1. `nuxt.config.ts` — Cloudflare preset & edge caching

**What changed:**
- Added `nitro.preset: 'cloudflare-pages'` with `cloudflare.deployConfig` and `nodeCompat`
- Enabled `experimental.payloadExtraction` and `experimental.renderJsonPayloads`
- Replaced `/` prerender with `swr: 300` so CMS updates appear without rebuilds
- Added SWR rules for catalog and inspiration routes
- Prerendered `/about` and `/contact` (no Supabase)
- Added `/brochures` → `/inspiration` redirect rule

**Why:** Builds a Cloudflare Pages–compatible Worker on every CI build. SWR caches rendered HTML at the CDN and revalidates in the background.

**Expected benefit:** TTFB −40–70% on cache hits; Supabase requests −80%+ on warm traffic.

---

### 2. `app/composables/useCatalogLookup.ts` — Product detail query split

**What changed:** `fetchProductDetail` now:
1. Resolves category and collection (unchanged)
2. Fetches only `id, name` for products in the collection
3. Loads full product + `product_images` for the matched product only

Also exported `useCategoryBySlug()` for future deduplication.

**Why:** Previously loaded `product_images` for every product in a collection to find one slug match — expensive on large collections.

---

### 3. `app/composables/usePublicHeroSlides.ts` — Batched primary image lookup

**What changed:** Replaced 3 sequential per-collection queries with one `fetchPrimaryProductImagesByCollection` using `.in('collection_id', ids)`.

**Why:** Hero fallback path had an N+1 query pattern when CMS slides are empty.

---

### 4. `app/composables/useBrochureBySlug.ts` — Targeted brochure fetch

**What changed:** New composable that resolves brochure by slug with a lightweight `id, name` index query, then fetches the full row by ID.

**Why:** `/inspiration/:slug` previously loaded every brochure.

---

### 5. `app/pages/inspiration/[slug].vue` — Use targeted composable

**What changed:** Switched from `usePublicBrochures()` + client filter to `useBrochureBySlug(slug)`.

---

### 6. `app/composables/useCategoryMockups.ts` — Mockup limit & ordering

**What changed:** Added `.limit(PAGINATION.mockups)` (100), stable `order_index` / `url` ordering, and `id` for list keys.

**Why:** Bounded server response; predictable gallery order.

---

### 7. `app/config/pagination.ts` — Gallery constants

**What changed:** Added `mockups: 100` and `galleryBatch: 12`.

**Why:** Server fetch cap and client-side batch size for the gallery grid.

---

### 8. `app/components/CategoryMockupMasonry.vue` — Gallery UX (frontend-only)

**What changed:** Natural CSS-column masonry, client batch loading (12 images per scroll), lightbox modal.

**Why:** Better UX without extra Supabase round-trips — all mockups still arrive in one SSR fetch; batches only control DOM and image requests in the browser.

---

### 9. `app/pages/contact.vue` — Deferred Google Maps iframe

**What changed:** Wrapped the Maps iframe in `<ClientOnly>` with a loading fallback.

---

### 10. `app/pages/about.vue` — Correct image dimensions

**What changed:** Updated `width`/`height` to match the actual asset; removed misleading `srcset` hint.

---

### 11. `.gitignore` — Build artifacts

**What changed:** Added `.wrangler` (local Wrangler cache if used for previews).

---

## Validation

- `npm run build` — **passed** with `cloudflare-pages` preset
- Nitro output: `dist/_worker.js/`, `dist/_routes.json`, `dist/_headers`
- No linter errors on modified TypeScript/Vue files

---

## Performance Impact Estimates

| Metric | Before (est.) | After (est.) |
|--------|---------------|--------------|
| TTFB (catalog, cache hit) | 300–800 ms | 50–150 ms |
| LCP (homepage) | 1.5–2.5 s | 1.2–2.0 s |
| HTML cache hit rate | ~0% | 60–85% |
| Supabase requests (repeat visit) | 3–7/page | 0–1/page |
| Product detail data transfer | All products + images | 1 product + images |
| Navigation payload | Baseline | −10–20% (payload extraction) |
| Gallery first paint | All images requested | First 12 images + lazy batches |

---

## Intentionally Not Implemented

| Recommendation | Reason |
|----------------|--------|
| Root `wrangler.jsonc` / `build:pages` | Redundant with GitHub → Cloudflare Pages + Nitro `deployConfig` |
| `slug` DB columns | Requires migration; two-step product lookup is sufficient for now |
| Nitro `/server/api` cache layer | Page-level SWR already caches rendered HTML with embedded data |
| Cloudflare KV query cache | Added complexity; SWR on HTML is simpler |
| Remove global page transitions | UX preference; marginal perf gain |
| `select('*')` in admin composables | Admin is SPA-only; no public impact |
| Cloudflare Images provider | Requires CF Images subscription; IPX in Worker is adequate |
| Hyperdrive for Supabase | Supabase has built-in pooling; extra infra not justified |
| Server-side gallery pagination | One bounded query (100) is simpler; client batches handle scroll UX |

---

## Future Improvements

1. **Add `slug` columns** to `categories`, `collections`, and `products` — indexed lookups instead of in-memory filtering.
2. **Supabase webhook → cache purge** — if CMS updates must appear within seconds, add a purge endpoint rather than relying on SWR TTL.
3. **Server-side gallery pagination** — if categories exceed 100 mockups, paginate in Supabase instead of client-only batching.
4. **Tune SWR TTLs** — increase to 900–1800 s if 5-minute staleness is acceptable for catalog content.
