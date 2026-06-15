import type { Category } from '~/types/catalog'
import { mapCategorySummary } from '~/utils/catalogMappers'

export async function fetchCategorySummaries(): Promise<Category[]> {
  const client = useSupabaseClient()

  const { data, error } = await client
    .from('categories')
    .select('id, name, description, image_url')
    .order('created_at', { ascending: true })

  if (error) {
    console.warn('[useCategorySummaries] Supabase fetch failed:', error.message)
    return []
  }

  return (data ?? []).map(mapCategorySummary)
}

export function useCategorySummaries() {
  return useAsyncData('category-summaries', fetchCategorySummaries)
}
