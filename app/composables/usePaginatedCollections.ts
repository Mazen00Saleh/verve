import type { Collection } from '~/types/catalog'
import { PAGINATION } from '~/config/pagination'
import { fetchCategoryBySlug } from '~/composables/useCatalogLookup'
import { buildPaginatedResult, getPaginationRange, normalizePage, parsePageQuery, type PaginatedResult } from '~/utils/pagination'
import { toSlug } from '~/utils/slug'

function mapCollection(row: {
  id: string
  name: string
  description: string | null
  image_url: string | null
}): Collection {
  const description = row.description ?? ''

  return {
    title: row.name,
    slug: toSlug(row.name),
    description,
    longDescription: description,
    heroImage: row.image_url ?? '',
    products: [],
  }
}

async function fetchCollectionsPage(
  client: ReturnType<typeof useSupabaseClient>,
  categoryId: string,
  page: number,
): Promise<PaginatedResult<Collection>> {
  const pageSize = PAGINATION.collections
  const { from, to } = getPaginationRange(page, pageSize)

  const { data, error, count } = await client
    .from('collections')
    .select('id, name, description, image_url, created_at', { count: 'exact' })
    .eq('category_id', categoryId)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    throw error
  }

  const total = count ?? 0
  const normalizedPage = normalizePage(page, total, pageSize)

  return buildPaginatedResult(
    (data ?? []).map(mapCollection),
    total,
    normalizedPage,
    pageSize,
  )
}

export function usePaginatedCollections(categorySlug: string) {
  const client = useSupabaseClient()
  const route = useRoute()
  const router = useRouter()
  const currentPage = computed(() => parsePageQuery(route.query.page))

  const result = useAsyncData(
    () => `paginated-collections-${categorySlug}-${currentPage.value}`,
    async () => {
      const category = await fetchCategoryBySlug(client, categorySlug)

      if (!category) {
        return {
          category: null,
          ...buildPaginatedResult<Collection>([], 0, currentPage.value, PAGINATION.collections),
        }
      }

      const collections = await fetchCollectionsPage(client, category.id, currentPage.value)

      return {
        category,
        ...collections,
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
