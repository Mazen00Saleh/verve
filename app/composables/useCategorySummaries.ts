import type { SupabaseClient } from '@supabase/supabase-js'
import type { Category } from '~/types/catalog'
import { mapCategorySummary } from '~/utils/catalogMappers'

async function fetchCategorySummaries(client: SupabaseClient): Promise<Category[]> {
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
  const client = useSupabaseClient()

  return useAsyncData('category-summaries', () => fetchCategorySummaries(client))
}
