import type { SupabaseClient } from '@supabase/supabase-js'
import { PAGINATION } from '~/config/pagination'
import { fetchCategoryBySlug } from '~/composables/useCatalogLookup'

export type CategoryMockupImage = {
  id: string
  url: string
}

async function fetchMockupsForCategory(
  client: SupabaseClient,
  categoryId: string,
): Promise<CategoryMockupImage[]> {
  const { data, error } = await client
    .from('product_images')
    .select(`
      id,
      url,
      order_index,
      products!inner (
        collections!inner (
          category_id
        )
      )
    `)
    .eq('type', 'mockup')
    .eq('products.collections.category_id', categoryId)
    .order('order_index', { ascending: true })
    .order('url', { ascending: true })
    .limit(PAGINATION.mockups)

  if (error) {
    console.warn('[useCategoryMockups] Supabase fetch failed:', error.message)
    return []
  }

  return (data ?? []).map(row => ({ id: row.id, url: row.url }))
}

async function loadCategoryMockups(
  client: SupabaseClient,
  categorySlug: string,
) {
  const category = await fetchCategoryBySlug(client, categorySlug)

  if (!category) {
    return { category: null, mockups: [] as CategoryMockupImage[] }
  }

  const mockups = await fetchMockupsForCategory(client, category.id)

  return {
    category: {
      title: category.title,
      slug: category.slug,
      description: category.description,
      image: category.image,
      collections: [],
    },
    mockups,
  }
}

export function useCategoryMockups(categorySlug: string) {
  const client = useSupabaseClient()

  return useAsyncData(
    `category-mockups-${categorySlug}`,
    () => loadCategoryMockups(client, categorySlug),
  )
}
