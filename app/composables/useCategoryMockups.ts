import { fetchCategoryBySlug } from '~/composables/useCatalogLookup'

export type CategoryMockupImage = {
  url: string
  createdAt: string | null
  orderIndex: number
}

type DbMockupRow = {
  url: string
  order_index: number | null
  products: {
    created_at: string | null
  } | {
    created_at: string | null
  }[] | null
}

function sortMockups(mockups: CategoryMockupImage[]) {
  return [...mockups].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0

    if (bTime !== aTime) {
      return bTime - aTime
    }

    return b.orderIndex - a.orderIndex
  })
}

function normalizeProduct(row: DbMockupRow) {
  if (!row.products) {
    return null
  }

  return Array.isArray(row.products) ? row.products[0] ?? null : row.products
}

async function fetchMockupsForCategory(categoryId: string): Promise<CategoryMockupImage[]> {
  const client = useSupabaseClient()

  const { data, error } = await client
    .from('product_images')
    .select(`
      url,
      order_index,
      products!inner (
        created_at,
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

  return sortMockups((data ?? []).map(row => ({
    url: row.url,
    createdAt: normalizeProduct(row as DbMockupRow)?.created_at ?? null,
    orderIndex: row.order_index ?? 0,
  })))
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
