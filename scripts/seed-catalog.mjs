/**
 * Seeds collections, products, and brochures into Supabase.
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env (or environment).
 *
 * Usage: npm run seed
 * Alternative: run supabase/seed/catalog.sql in the Supabase SQL editor.
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const COLLECTIONS_PER_CATEGORY = 14
const PRODUCTS_PER_COLLECTION = 14
const BROCHURE_COUNT = 16

const IMAGES = [
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1617104424032-b9bd6972d0e4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1618219944342-824e40a13285?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
]

const EXTRA_COLLECTION_TITLES = [
  'Atelier Edition',
  'Pavilion Series',
  'Gallery Reserve',
  'Signature Line',
  'Maison Collection',
  'Studio Archive',
  'Northern Light',
  'Desert Bloom',
]

const BROCHURE_TITLES = [
  'General Brochure',
  'Wallcoverings Brochure',
  'Wallpaper Brochure',
  'Textile Brochure',
  'Contract Brochure',
  'Panoramique Brochure',
  'Outdoor Brochure',
  'Heritage Collection',
  'Monolith Collection',
  'Savanna Collection',
  'Classic Linen Fabrics',
  'Metallic Foils',
  'Architectural Posters',
  'Grasscloth Weaves',
  'Silk Velvet',
  'Embossed Vinyl',
]

const CATEGORY_CATALOG = [
  {
    dbName: 'Wallpapers',
    collections: [
      ['The Heritage', 'Drawing inspiration from historic archives and classical luxury.'],
      ['Monolith', 'Celebrating brutalist form and architectural simplicity.'],
      ['Savanna', 'Warm, earthy tones and patterns inspired by wild grasslands.'],
      ['Aura', 'Nebula-inspired gradients and cosmic texture prints.'],
      ['Verdant', 'Lush botanicals and detailed jungle foliage layers.'],
      ['Chroma', 'Bold color harmonies and expressive painterly pigments.'],
    ],
    productPrefix: 'WP',
  },
  {
    dbName: 'Fabrics',
    collections: [
      ['Classic Linen', 'Relaxed elegance crafted from 100% natural flax fibers.'],
      ['Silk Velvet', 'Opulent heavyweight velvets for dramatic drapery and upholstery.'],
      ['Bouclé & Tweed', 'Richly textured nubby wools and elegant woven blends.'],
      ['Sheer Drapery', 'Translucent, delicate textiles that softly filter natural light.'],
      ['Jacquard & Brocade', 'Intricately woven classical damasks and raised floral reliefs.'],
      ['Outdoor Performance', 'Weatherproof high-end canvas and moisture-resistant structures.'],
    ],
    productPrefix: 'FB',
  },
  {
    dbName: 'Posters',
    collections: [
      ['Architectural Line', 'Fine art prints focusing on geometric columns and archways.'],
      ['Botanical Silhouette', 'Pressed flora and minimalist leafy stencil silhouettes.'],
      ['Abstract Geometry', 'Intersecting shapes and neutral color block configurations.'],
      ['Minimalist Landscape', 'Calming views of coastlines, mountain ranges, and dunes.'],
      ['Monochrome Portraits', 'Expressive hand-drawn charcoal and ink figure sketches.'],
      ['Typography & Grid', 'Bauhaus and Swiss design inspired typeface arrangements.'],
    ],
    productPrefix: 'PT',
  },
  {
    dbName: 'Wall Coverings',
    collections: [
      ['Grasscloth Weaves', 'Handcrafted natural fiber wallcoverings with organic textures.'],
      ['Metallic Foils', 'Shimmering metallic finishes and textured leaf surfaces.'],
      ['Wood Veneers', 'Genuine ultra-thin wood sheeting displaying natural grains.'],
      ['Textured Cork', 'Natural sound-dampening cork sheets with metallic accents.'],
      ['Embossed Vinyl', 'High-durability wallcoverings with deep tactile reliefs.'],
      ['Suede & Leather', 'Ultra-luxurious upholstered panels and leather wall coverings.'],
    ],
    productPrefix: 'WC',
  },
]

function loadEnv() {
  const envPath = resolve(process.cwd(), '.env')
  const env = { ...process.env }

  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, 'utf8').split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const idx = trimmed.indexOf('=')
      if (idx === -1) continue
      env[trimmed.slice(0, idx)] = trimmed.slice(idx + 1).replace(/^["']|["']$/g, '')
    }
  }

  return env
}

function imageAt(index) {
  return IMAGES[index % IMAGES.length]
}

function escapeSql(value) {
  return value.replaceAll("'", "''")
}

async function main() {
  const env = loadEnv()
  const url = env.SUPABASE_URL || env.NUXT_PUBLIC_SUPABASE_URL
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    console.error('Missing SUPABASE_URL/NUXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
    process.exit(1)
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('id, name')

  if (categoriesError) throw categoriesError

  const categoryMap = new Map(categories.map(row => [row.name, row.id]))
  let collectionCount = 0
  let productCount = 0

  for (const [catIndex, catalog] of CATEGORY_CATALOG.entries()) {
    const categoryId = categoryMap.get(catalog.dbName)

    if (!categoryId) {
      console.warn(`Skipping unknown category: ${catalog.dbName}`)
      continue
    }

    const collectionRows = []

    for (let i = 0; i < COLLECTIONS_PER_CATEGORY; i++) {
      const base = catalog.collections[i % catalog.collections.length]
      const extra = EXTRA_COLLECTION_TITLES[i % EXTRA_COLLECTION_TITLES.length]
      const title = i < catalog.collections.length ? base[0] : `${extra} ${Math.floor(i / EXTRA_COLLECTION_TITLES.length) + 1}`
      const description = i < catalog.collections.length
        ? base[1]
        : `A curated ${catalog.dbName.toLowerCase()} collection designed for sophisticated interior projects.`

      collectionRows.push({
        category_id: categoryId,
        name: title,
        description,
        image_url: imageAt(catIndex * 20 + i + 3),
      })
    }

    const { data: insertedCollections, error: collectionsError } = await supabase
      .from('collections')
      .insert(collectionRows)
      .select('id, name')

    if (collectionsError) throw collectionsError

    collectionCount += insertedCollections.length

    for (const [collIndex, collection] of insertedCollections.entries()) {
      const productRows = []

      for (let p = 0; p < PRODUCTS_PER_COLLECTION; p++) {
        const sku = `${catalog.productPrefix}-${String(collIndex + 1).padStart(2, '0')}-${1001 + p}`
        productRows.push({
          collection_id: collection.id,
          name: `${collection.name} Design ${p + 1}`,
          description: `Premium ${catalog.dbName.toLowerCase()} piece from the ${collection.name} collection. Crafted for luxury residential and hospitality interiors.`,
          primary_image: imageAt(catIndex * 100 + collIndex * 20 + p),
        })
      }

      const { error: productsError } = await supabase
        .from('products')
        .insert(productRows)

      if (productsError) throw productsError
      productCount += productRows.length
    }
  }

  const brochureRows = BROCHURE_TITLES.map((name, index) => ({
    name,
    description: `Explore the ${name} — premium Verve catalog and inspiration file.`,
    file_url: 'https://online.fliphtml5.com/pyly/zdhs',
    image_url: imageAt(index + 5),
  }))

  const { error: brochuresError } = await supabase
    .from('brochures')
    .insert(brochureRows)

  if (brochuresError) throw brochuresError

  console.log(`Seeded ${collectionCount} collections, ${productCount} products, and ${brochureRows.length} brochures.`)
}

main().catch((error) => {
  console.error('Seed failed:', error.message || error)
  process.exit(1)
})
