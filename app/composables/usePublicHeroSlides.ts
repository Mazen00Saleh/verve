import type { SupabaseClient } from '@supabase/supabase-js'
import { pickDailyRandom } from '~/utils/shuffle'
import { toSlug } from '~/utils/slug'

export type PublicHeroSlide = {
  id: string
  title: string
  description: string
  leftImage: string
  rightImage: string
  link: string
  ctaLabel: string
}

const HERO_CTA_LINK = '/collections'
const HERO_CTA_LABEL = 'Explore Collections'

type HeroCollectionCandidate = {
  id: string
  title: string
  slug: string
  description: string
  heroImage: string
  categorySlug: string
  rightImage: string
}

async function fetchHeroSlidesFromSupabase(client: SupabaseClient): Promise<PublicHeroSlide[]> {
  const { data, error } = await client
    .from('hero_slides')
    .select('id, title, description, left_image_url, right_image_url')
    .eq('is_active', true)
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) {
    console.warn('[usePublicHeroSlides] Supabase fetch failed:', error.message)
    return []
  }

  return (data ?? []).map(row => ({
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    leftImage: row.left_image_url,
    rightImage: row.right_image_url,
    link: HERO_CTA_LINK,
    ctaLabel: HERO_CTA_LABEL,
  }))
}

async function fetchPrimaryProductImagesByCollection(
  client: SupabaseClient,
  collectionIds: string[],
): Promise<Map<string, string>> {
  if (!collectionIds.length) {
    return new Map()
  }

  const { data, error } = await client
    .from('products')
    .select('collection_id, primary_image')
    .in('collection_id', collectionIds)
    .not('primary_image', 'is', null)
    .order('created_at', { ascending: true })

  if (error) {
    return new Map()
  }

  const imagesByCollection = new Map<string, string>()
  for (const row of data ?? []) {
    if (!imagesByCollection.has(row.collection_id) && row.primary_image) {
      imagesByCollection.set(row.collection_id, row.primary_image)
    }
  }

  return imagesByCollection
}

async function fetchHeroFallbackFromSupabase(client: SupabaseClient): Promise<PublicHeroSlide[]> {
  const { data, error } = await client
    .from('collections')
    .select(`
      id,
      name,
      description,
      image_url,
      categories (name)
    `)
    .not('image_url', 'is', null)
    .order('created_at', { ascending: true })
    .limit(30)

  if (error || !data?.length) {
    return []
  }

  const pool: HeroCollectionCandidate[] = data.map(row => ({
    id: row.id,
    title: row.name,
    slug: toSlug(row.name),
    description: row.description ?? '',
    heroImage: row.image_url ?? '',
    categorySlug: toSlug(row.categories?.name ?? ''),
    rightImage: row.image_url ?? '',
  }))

  const picked = pickDailyRandom(pool, 3, 'hero-fallback')
  const primaryImages = await fetchPrimaryProductImagesByCollection(
    client,
    picked.map(collection => collection.id),
  )

  for (const collection of picked) {
    const primaryImage = primaryImages.get(collection.id)
    if (primaryImage) {
      collection.rightImage = primaryImage
    }
  }

  return picked.map((collection, index) => ({
    id: `catalog-fallback-${index}`,
    title: collection.title,
    description: collection.description,
    leftImage: collection.heroImage,
    rightImage: collection.rightImage || collection.heroImage,
    link: `/collections/${collection.categorySlug}/${collection.slug}`,
    ctaLabel: HERO_CTA_LABEL,
  }))
}

async function fetchPublicHeroSlides(client: SupabaseClient): Promise<PublicHeroSlide[]> {
  const cmsSlides = await fetchHeroSlidesFromSupabase(client)
  if (cmsSlides.length) {
    return cmsSlides
  }

  return fetchHeroFallbackFromSupabase(client)
}

export function usePublicHeroSlides() {
  const client = useSupabaseClient()

  return useAsyncData('public-hero-slides', () => fetchPublicHeroSlides(client))
}
