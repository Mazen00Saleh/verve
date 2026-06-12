# Verve

Luxury interiors catalog website for wallpapers, fabrics, and wallcoverings. Public marketing site + Supabase-backed admin CMS.

**Stack:** Nuxt 4 · Vue 3 · TypeScript · Tailwind CSS · Supabase · Vercel

---

## Quick start

**Requirements:** Node.js 20+, a Supabase project

```bash
npm install
cp .env.example .env   # fill in Supabase keys
npm run dev            # http://localhost:3000
```

| Variable | Required | Purpose |
|----------|----------|---------|
| `NUXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NUXT_PUBLIC_SUPABASE_KEY` | Yes | Supabase publishable (anon) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Seed only | `npm run seed` — never commit or expose client-side |

---

## Project structure

```
app/
├── assets/css/          # Global styles (Tailwind layers)
├── components/          # Public UI components
├── components/admin/    # Admin-only components
├── composables/         # Data fetching & business logic
├── config/              # App config (pagination sizes)
├── data/catalog.ts      # Static catalog fallback (dev/offline)
├── layouts/             # default (public) · admin
├── middleware/          # Admin route protection
├── pages/               # File-based routing
│   ├── admin/           # CMS (auth required)
│   └── …                # Public pages
├── types/               # Supabase generated types
└── utils/               # Shared helpers

supabase/
├── migrations/          # SQL schema changes
├── functions/           # Edge functions (contact form)
└── seed/                # Catalog seed SQL

scripts/seed-catalog.mjs # Programmatic seed script
```

**Convention:** Data logic lives in composables (`useCategories`, `useProducts`, etc.). Pages stay thin — fetch, render, handle actions.

---

## Data model

Catalog hierarchy (managed in admin):

```
categories → collections → products → product_images
```

Other tables: `brochures`, `hero_slides`, `contact_submissions`, `profiles`

- **Public site** reads from Supabase via composables. If Supabase returns empty data, `useCatalog` falls back to `app/data/catalog.ts`.
- **Types** are in `app/types/database.types.ts`. Regenerate after schema changes via Supabase CLI.
- **RLS** is enabled. Public reads use the anon key; admin writes require an authenticated user with `profiles.role = 'admin'`.

---

## Public site

| Route | Description |
|-------|-------------|
| `/` | Homepage — hero, categories, featured collections |
| `/collections` | Category listing |
| `/collections/:category` | Collections in a category (paginated) |
| `/collections/:category/:collection` | Products in a collection (paginated) |
| `/collections/:category/:collection/:product` | Product detail |
| `/inspiration` | Brochures (paginated) |
| `/about`, `/contact` | Static content pages |

Pagination uses `?page=` query params. Page sizes are in `app/config/pagination.ts`.

---

## Admin

**URL:** `/admin` · **Login:** `/admin/login`

Protected by `app/middleware/admin.global.ts`. Access requires a Supabase Auth account with `role = 'admin'` in the `profiles` table.

| Section | Path |
|---------|------|
| Categories | `/admin/categories` |
| Collections | `/admin/collections` |
| Products | `/admin/products` |
| Brochures | `/admin/brochures` |
| Hero slides | `/admin/hero-slides` |
| Contact messages | `/admin/contact` |

All list pages are paginated via `useAdminPaginatedList`. Image uploads use Supabase Storage through `useImageUpload` / `useFileUpload`.

### Granting admin access

1. Create a user in Supabase Auth (Dashboard → Authentication).
2. Insert or update their row in `profiles` with `role = 'admin'`.

---

## Common tasks

```bash
npm run dev       # Development server
npm run build     # Production build
npm run preview   # Preview production build locally
npm run seed      # Seed catalog data (needs service role key)
```

**Seed data:** `npm run seed` or run `supabase/seed/catalog.sql` in the Supabase SQL editor. Creates collections, products, and brochures for pagination testing.

**Contact form:** Submits via Supabase Edge Function (`supabase/functions/contact-form`). Configure `RESEND_API_KEY` and email secrets in the Supabase dashboard.

**Migrations:** Apply SQL files in `supabase/migrations/` through the Supabase SQL editor or CLI before expecting new tables/features to work locally.

---

## Key patterns for contributors

- **Composables over page logic** — add `fetchPage` / CRUD methods in `app/composables/`, not inline in pages.
- **Pagination** — public lists use `useRoutePagination` + `usePaginated*` composables; admin lists use `useAdminPaginatedList`.
- **SSR-safe code** — guard browser-only APIs with `import.meta.client`. No `setInterval` / `window` during SSR.
- **Images** — use `CatalogImage` with `priority` for LCP candidates; admin uploads go through `ImageUploader`.
- **Styling** — Tailwind with custom `luxury-*` tokens in `tailwind.config.ts`. Shared classes in `app/assets/css/main.css`.
- **Slugs** — generated from names via `app/utils/slug.ts` (`toSlug`).

---

## Deployment

Hosted on **Vercel**. Set the same env vars as `.env.example` in the Vercel project settings.

```bash
npm run build   # must pass before deploying
```

`@vercel/analytics` and `@vercel/speed-insights` are included. The `package.json` overrides for `vue-router` are required for Nuxt 4 compatibility — do not remove them.