import type { H3Event } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { toSlug } from '~/utils/slug'

type SitemapEntry = {
  path: string
  priority?: string
  changefreq?: string
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function buildSitemapXml(baseUrl: string, entries: SitemapEntry[]): string {
  const origin = baseUrl.replace(/\/$/, '')
  const urls = entries.map((entry) => {
    const loc = entry.path === '/' ? origin : `${origin}${entry.path}`
    const lines = [`  <url>`, `    <loc>${escapeXml(loc)}</loc>`]

    if (entry.changefreq) {
      lines.push(`    <changefreq>${escapeXml(entry.changefreq)}</changefreq>`)
    }

    if (entry.priority) {
      lines.push(`    <priority>${escapeXml(entry.priority)}</priority>`)
    }

    lines.push('  </url>')

    return lines.join('\n')
  })

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
  ].join('\n')
}

function entry(path: string, priority?: string, changefreq?: string): SitemapEntry {
  return { path, priority, changefreq }
}

export async function getSitemapPaths(event: H3Event): Promise<SitemapEntry[]> {
  const client = await serverSupabaseClient(event)
  const entries = new Map<string, SitemapEntry>([
    ['/', entry('/', '1.0', 'weekly')],
    ['/about', entry('/about', '0.8', 'monthly')],
    ['/contact', entry('/contact', '0.8', 'monthly')],
    ['/collections', entry('/collections', '0.9', 'weekly')],
    ['/inspiration', entry('/inspiration', '0.8', 'weekly')],
  ])

  const addEntry = (path: string, priority = '0.6', changefreq = 'weekly') => {
    entries.set(path, entry(path, priority, changefreq))
  }

  const { data: categories, error: categoriesError } = await client
    .from('categories')
    .select('name')

  if (categoriesError) {
    console.warn('[sitemap] categories fetch failed:', categoriesError.message)
  } else {
    for (const category of categories ?? []) {
      const categorySlug = toSlug(category.name)
      addEntry(`/collections/${categorySlug}`, '0.7')
      addEntry(`/collections/${categorySlug}/gallery`, '0.6')
    }
  }

  const { data: collections, error: collectionsError } = await client
    .from('collections')
    .select('name, categories (name)')

  if (collectionsError) {
    console.warn('[sitemap] collections fetch failed:', collectionsError.message)
  } else {
    for (const collection of collections ?? []) {
      const categoryName = (collection.categories as { name: string } | null)?.name ?? ''
      const categorySlug = toSlug(categoryName)
      const collectionSlug = toSlug(collection.name)

      if (categorySlug) {
        addEntry(`/collections/${categorySlug}/${collectionSlug}`)
      }
    }
  }

  const { data: products, error: productsError } = await client
    .from('products')
    .select('name, collections (name, categories (name))')

  if (productsError) {
    console.warn('[sitemap] products fetch failed:', productsError.message)
  } else {
    for (const product of products ?? []) {
      const collection = product.collections as {
        name: string
        categories: { name: string } | null
      } | null

      const categorySlug = toSlug(collection?.categories?.name ?? '')
      const collectionSlug = toSlug(collection?.name ?? '')
      const productSlug = toSlug(product.name)

      if (categorySlug && collectionSlug) {
        addEntry(`/collections/${categorySlug}/${collectionSlug}/${productSlug}`, '0.5')
      }
    }
  }

  const { data: brochures, error: brochuresError } = await client
    .from('brochures')
    .select('name')

  if (brochuresError) {
    console.warn('[sitemap] brochures fetch failed:', brochuresError.message)
  } else {
    for (const brochure of brochures ?? []) {
      addEntry(`/inspiration/${toSlug(brochure.name)}`, '0.6')
    }
  }

  return [...entries.values()].sort((a, b) => a.path.localeCompare(b.path))
}
