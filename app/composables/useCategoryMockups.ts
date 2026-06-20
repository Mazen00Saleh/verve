import { fetchCategoryBySlug } from '~/composables/useCatalogLookup'

export type CategoryMockupImage = {
  url: string
}

async function fetchMockupsForCategory(categoryId: string): Promise<CategoryMockupImage[]> {
  const client = useSupabaseClient()

  const { data, error } = await client
    .from('product_images')
    .select(`
      url,
      products!inner (
        collections!inner (
          category_id
        )
      )
    `)
    .eq('type', 'mockup')
    .eq('products.collections.category_id', categoryId)

  if (error) {
    console.warn('[useCategoryMockups] Supabase fetch failed:', error.message)
    return []
  }

  return (data ?? []).map(row => ({ url: row.url }))
}

async function loadCategoryMockups(categorySlug: string) {
  const category = await fetchCategoryBySlug(categorySlug)

  if (!category) {
    return { category: null, mockups: [] as CategoryMockupImage[] }
  }

  const mockups = await fetchMockupsForCategory(category.id)

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
  return useAsyncData(
    `category-mockups-${categorySlug}`,
    () => loadCategoryMockups(categorySlug),
  )
}
