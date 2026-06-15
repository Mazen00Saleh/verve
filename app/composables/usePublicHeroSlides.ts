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

async function fetchHeroSlidesFromSupabase(): Promise<PublicHeroSlide[]> {
  const client = useSupabaseClient()

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

async function fetchPrimaryProductImage(collectionId: string): Promise<string | null> {
  const client = useSupabaseClient()

  const { data, error } = await client
    .from('products')
    .select('primary_image')
    .eq('collection_id', collectionId)
    .not('primary_image', 'is', null)
    .order('created_at', { ascending: true })
    .limit(1)

  if (error) {
    return null
  }

  return data?.[0]?.primary_image ?? null
}

async function fetchHeroFallbackFromSupabase(): Promise<PublicHeroSlide[]> {
  const client = useSupabaseClient()

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

  await Promise.all(picked.map(async (collection) => {
    const primaryImage = await fetchPrimaryProductImage(collection.id)
    if (primaryImage) {
      collection.rightImage = primaryImage
    }
  }))

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

async function fetchPublicHeroSlides(): Promise<PublicHeroSlide[]> {
  const cmsSlides = await fetchHeroSlidesFromSupabase()
  if (cmsSlides.length) {
    return cmsSlides
  }

  return fetchHeroFallbackFromSupabase()
}

export function usePublicHeroSlides() {
  return useAsyncData('public-hero-slides', fetchPublicHeroSlides)
}
