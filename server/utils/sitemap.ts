import type { H3Event } from 'h3'
import { serverSupabaseClient } from '#supabase/server'
import { toSlug } from '~/utils/slug'

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function buildSitemapXml(baseUrl: string, paths: string[]): string {
  const origin = baseUrl.replace(/\/$/, '')
  const urls = paths.map((path) => {
    const loc = path === '/' ? origin : `${origin}${path}`
    return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n  </url>`
  })

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
  ].join('\n')
}

export async function getSitemapPaths(event: H3Event): Promise<string[]> {
  const client = await serverSupabaseClient(event)
  const paths = new Set<string>([
    '/',
    '/about',
    '/contact',
    '/collections',
    '/inspiration',
  ])

  const { data: categories, error: categoriesError } = await client
    .from('categories')
    .select('name')

  if (categoriesError) {
    console.warn('[sitemap] categories fetch failed:', categoriesError.message)
  } else {
    for (const category of categories ?? []) {
      const categorySlug = toSlug(category.name)
      paths.add(`/collections/${categorySlug}`)
      paths.add(`/collections/${categorySlug}/gallery`)
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
        paths.add(`/collections/${categorySlug}/${collectionSlug}`)
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
        paths.add(`/collections/${categorySlug}/${collectionSlug}/${productSlug}`)
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
      paths.add(`/inspiration/${toSlug(brochure.name)}`)
    }
  }

  return [...paths].sort()
}
