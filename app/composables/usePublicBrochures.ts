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

async function fetchBrochuresFromSupabase(): Promise<PublicBrochure[]> {
  const client = useSupabaseClient()

  const { data, error } = await client
    .from('brochures')
    .select('id, name, description, file_url, image_url, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.warn('[usePublicBrochures] Supabase fetch failed:', error.message)
    return []
  }

  return (data ?? []).map(mapBrochure)
}

export function usePublicBrochures() {
  return useAsyncData('public-brochures', fetchBrochuresFromSupabase)
}
