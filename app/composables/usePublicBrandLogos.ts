export type PublicBrandLogo = {
  id: string
  name: string
  src: string
}

function mapBrandLogo(row: {
  id: string
  name: string
  logo_url: string
}): PublicBrandLogo {
  return {
    id: row.id,
    name: row.name,
    src: row.logo_url,
  }
}

async function fetchBrandLogosFromSupabase(): Promise<PublicBrandLogo[]> {
  const client = useSupabaseClient()

  const { data, error } = await client
    .from('brand_logos')
    .select('id, name, logo_url')
    .order('order_index', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) {
    console.warn('[usePublicBrandLogos] Supabase fetch failed:', error.message)
    return []
  }

  return (data ?? []).map(mapBrandLogo)
}

export function usePublicBrandLogos() {
  return useAsyncData('public-brand-logos', fetchBrandLogosFromSupabase)
}
