import type { Product } from '~/types/catalog'
import { PAGINATION } from '~/config/pagination'
import { fetchCategoryBySlug, fetchCollectionBySlug } from '~/composables/useCatalogLookup'
import { buildPaginatedResult, getPaginationRange, normalizePage, parsePageQuery, type PaginatedResult } from '~/utils/pagination'
import { toSlug } from '~/utils/slug'

function mapProduct(row: {
  id: string
  name: string
  description: string | null
  primary_image: string | null
}): Product {
  return {
    id: row.id,
    name: row.name,
    sku: toSlug(row.name),
    image: row.primary_image ?? '',
    description: row.description ?? '',
    secondaryImages: [],
    mockupImages: [],
  }
}

async function fetchProductsPage(
  collectionId: string,
  page: number,
): Promise<PaginatedResult<Product>> {
  const pageSize = PAGINATION.products
  const client = useSupabaseClient()
  const { from, to } = getPaginationRange(page, pageSize)

  const { data, error, count } = await client
    .from('products')
    .select('id, name, description, primary_image, created_at', { count: 'exact' })
    .eq('collection_id', collectionId)
    .order('created_at', { ascending: true })
    .range(from, to)

  if (error) {
    throw error
  }

  const total = count ?? 0
  const normalizedPage = normalizePage(page, total, pageSize)

  return buildPaginatedResult(
    (data ?? []).map(mapProduct),
    total,
    normalizedPage,
    pageSize,
  )
}

export function usePaginatedProducts(categorySlug: string, collectionSlug: string) {
  const route = useRoute()
  const router = useRouter()
  const currentPage = computed(() => parsePageQuery(route.query.page))

  const result = useAsyncData(
    () => `paginated-products-${categorySlug}-${collectionSlug}-${currentPage.value}`,
    async () => {
      const category = await fetchCategoryBySlug(categorySlug)

      if (!category) {
        return {
          category: null,
          collection: null,
          ...buildPaginatedResult<Product>([], 0, currentPage.value, PAGINATION.products),
        }
      }

      const collection = await fetchCollectionBySlug(category.id, collectionSlug)

      if (!collection) {
        return {
          category,
          collection: null,
          ...buildPaginatedResult<Product>([], 0, currentPage.value, PAGINATION.products),
        }
      }

      const products = await fetchProductsPage(collection.id, currentPage.value)

      return {
        category,
        collection,
        ...products,
      }
    },
    { watch: [currentPage] },
  )

  watch(() => result.data.value, async (data) => {
    if (!data || data.total === 0) {
      return
    }

    if (currentPage.value > data.totalPages) {
      await router.replace({
        path: route.path,
        query: { ...route.query, page: String(data.totalPages) },
      })
    }
  })

  return result
}
