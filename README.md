# Verve

Verve is a luxury interiors catalog and CMS built with Nuxt and Supabase.

The repository includes:
- a public marketing/catalog website
- an authenticated admin panel for content management
- Supabase-backed database/auth/storage

## Tech Stack

- Nuxt 4 (Vue 3 + TypeScript)
- Tailwind CSS
- Supabase (Database, Auth, Storage, Edge Functions)
- Nuxt Image (`@nuxt/image`)

## Requirements

- Node.js 20+
- npm
- A Supabase project

## Environment Variables

Copy `.env.example` to `.env` and fill values:

```bash
cp .env.example .env
```

Required at runtime:
- `NUXT_PUBLIC_SUPABASE_URL`
- `NUXT_PUBLIC_SUPABASE_KEY`

Server-side/ops variables:
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- `RESEND_API_KEY` (optional, for contact email sending)
- `CONTACT_TO_EMAIL` (optional)
- `CONTACT_FROM_EMAIL` (optional)

## Local Development

```bash
npm install
npm run dev
```

App URL: `http://localhost:3000`

Other scripts:

```bash
npm run build
npm run preview
npm run generate
```

## Project Structure

```text
app/
  assets/css/              Global styles and shared utility classes
  components/              Public UI components
  components/admin/        Admin UI components
  composables/             Data access and business logic
  config/                  App configuration (pagination, etc.)
  layouts/                 Public/admin layouts
  middleware/              Route guards (admin auth)
  pages/                   Public + admin routes
  types/                   Generated Supabase database types
  utils/                   Shared helpers

supabase/
  functions/contact-form/  Contact form edge function
  migrations/              SQL migrations
  seed/catalog.sql         Seed SQL
```

## Public Routes

- `/`
- `/collections`
- `/collections/:category`
- `/collections/:category/:collection`
- `/collections/:category/:collection/:product`
- `/collections/:category/gallery`
- `/inspiration`
- `/inspiration/:slug`
- `/brochures`
- `/about`
- `/contact`

## Admin Routes

- `/admin/login`
- `/admin`
- `/admin/categories`
- `/admin/collections`
- `/admin/products`
- `/admin/brochures`
- `/admin/hero-slides`
- `/admin/brand-logos`
- `/admin/contact`

Admin access is protected by `app/middleware/admin.global.ts` and `useAdminAuth()`.
Users must have `profiles.role = 'admin'`.

## Data Model (High Level)

Primary hierarchy:

```text
categories -> collections -> products -> product_images
```

Additional entities:
- `brochures`
- `hero_slides`
- `brand_logos`
- `contact_submissions`
- `profiles`

## Image Behavior

### Public rendering

Public images are rendered via Nuxt Image (`NuxtImg` / `useImage`) and transformed to WebP.

### Product detail + zoom

In `app/pages/collections/[category]/[collection]/[product].vue`:
- main preview uses transformed image around `1200w`
- zoom preview uses transformed image around `1920w`
- zoom panel pans a transformed image (not tiled server crops)
- zoom preview panel appears under Variations on desktop

### Admin upload lifecycle

Admin uploaders compress and upload selected files to Supabase Storage.

Current behavior:
- selecting files uploads to Storage
- removing from the form queues a deletion
- storage deletion executes only when save/create is submitted
- canceling without save does not flush queued deletions

## Delete/Cascade Behavior

Parent delete flows are explicit in composables and include storage cleanup:

- deleting a **collection** removes child `product_images`, then child `products`, then collection media URLs from storage, then the collection row
- deleting a **category** removes nested `product_images`, `products`, `collections`, related media URLs from storage, then the category row

## Supabase Notes

- Keep service role keys server-side only
- Apply SQL migrations before testing new database features
- Contact edge function is at `supabase/functions/contact-form/index.ts`

## Deployment

Build for production:

```bash
npm run build
npm run preview
```

Before deploying, set the required environment variables in your hosting environment and confirm the production build succeeds.