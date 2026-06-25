import type { SupabaseClient } from '@supabase/supabase-js'
import type { PublicBrochure } from '~/types/catalog'
import { formatBrochureDate } from '~/utils/format-date'
import { toSlug } from '~/utils/slug'

function mapBrochure(row: {
  id: string
  name: string
  description: string | null
  file_url: string | null
  image_url: string | null
  created_at: string | null
}): PublicBrochure {
  return {
    id: row.id,
    title: row.name,
    description: row.description ?? '',
    fileUrl: row.file_url ?? '',
    date: formatBrochureDate(row.created_at),
    slug: toSlug(row.name),
    coverImage: row.image_url ?? '',
  }
}

async function fetchBrochureBySlug(
  client: SupabaseClient,
  slug: string,
): Promise<PublicBrochure | null> {
  const { data: index, error: indexError } = await client
    .from('brochures')
    .select('id, name')

  if (indexError) {
    console.warn('[useBrochureBySlug] Supabase index fetch failed:', indexError.message)
    return null
  }

  const matched = (index ?? []).find(row => toSlug(row.name) === slug)
  if (!matched) {
    return null
  }

  const { data, error } = await client
    .from('brochures')
    .select('id, name, description, file_url, image_url, created_at')
    .eq('id', matched.id)
    .maybeSingle()

  if (error) {
    console.warn('[useBrochureBySlug] Supabase fetch failed:', error.message)
    return null
  }

  return data ? mapBrochure(data) : null
}

export function useBrochureBySlug(slug: string) {
  const client = useSupabaseClient()

  return useAsyncData(
    `brochure-by-slug-${slug}`,
    () => fetchBrochureBySlug(client, slug),
  )
}
