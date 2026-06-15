import { pickDailyRandom } from '~/utils/shuffle'

async function fetchPremiumMaterialImages(): Promise<string[]> {
  const client = useSupabaseClient()

  const { data, error } = await client
    .from('collections')
    .select('image_url')
    .not('image_url', 'is', null)
    .order('created_at', { ascending: true })
    .limit(24)

  if (error) {
    console.warn('[usePremiumMaterialImages] Supabase fetch failed:', error.message)
    return []
  }

  const urls = (data ?? [])
    .map(row => row.image_url)
    .filter((url): url is string => Boolean(url))

  if (urls.length >= 2) {
    return pickDailyRandom(urls, 2, 'premium-materials')
  }

  return urls
}

export function usePremiumMaterialImages() {
  return useAsyncData('premium-material-images', fetchPremiumMaterialImages)
}
