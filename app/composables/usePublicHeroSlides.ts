export type PublicHeroSlide = {
  id: string
  title: string
  description: string
  leftImage: string
  rightImage: string
  link: string
  ctaLabel: string
}

function mapHeroSlide(row: {
  id: string
  title: string
  description: string | null
  left_image_url: string
  right_image_url: string
  link_url: string
  cta_label: string
}): PublicHeroSlide {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    leftImage: row.left_image_url,
    rightImage: row.right_image_url,
    link: row.link_url,
    ctaLabel: row.cta_label,
  }
}

async function fetchHeroSlidesFromSupabase(): Promise<PublicHeroSlide[]> {
  const client = useSupabaseClient()

  const { data, error } = await client
    .from('hero_slides')
    .select('id, title, description, left_image_url, right_image_url, link_url, cta_label')
    .eq('is_active', true)
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) {
    console.warn('[usePublicHeroSlides] Supabase fetch failed:', error.message)
    return []
  }

  return (data ?? []).map(mapHeroSlide)
}

export function usePublicHeroSlides() {
  return useAsyncData('public-hero-slides', fetchHeroSlidesFromSupabase)
}
