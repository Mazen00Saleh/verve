import type { FeaturedCollection } from '~/data/catalog'
import { flattenCollections } from '~/composables/useCatalog'
import { PAGINATION } from '~/config/pagination'
import { buildPaginatedResult, getPaginationRange, normalizePage, parsePageQuery, type PaginatedResult } from '~/utils/pagination'
import { toSlug } from '~/utils/slug'

function mapCollectionRow(row: {
  id: string
  name: string
  description: string | null
  image_url: string | null
  categories: { name: string } | null
}): FeaturedCollection {
  const description = row.description ?? ''
  const categoryTitle = row.categories?.name ?? ''

  return {
    title: row.name,
    slug: toSlug(row.name),
    description,
    longDescription: description,
    heroImage: row.image_url ?? '',
    products: [],
    categorySlug: toSlug(categoryTitle),
    categoryTitle,
  }
}

async function fetchAllCollectionsFromSupabase(page: number): Promise<PaginatedResult<FeaturedCollection> | null> {
  const pageSize = PAGINATION.collections
  const client = useSupabaseClient()
  const { from, to } = getPaginationRange(page, pageSize)

  const { data, error, count } = await client
    .from('collections')
    .select(`
      id,
      name,
      description,
      image_url,
      created_at,
      categories (name)
    `, { count: 'exact' })
    .order('created_at', { ascending: true })
    .range(from, to)

  if (error) {
    throw error
  }

  const total = count ?? 0

  if (total === 0) {
    return null
  }

  const normalizedPage = normalizePage(page, total, pageSize)

  return buildPaginatedResult(
    (data ?? []).map(row => mapCollectionRow(row as {
      id: string
      name: string
      description: string | null
      image_url: string | null
      categories: { name: string } | null
    })),
    total,
    normalizedPage,
    pageSize,
  )
}

async function fetchAllCollectionsFromCatalog(page: number): Promise<PaginatedResult<FeaturedCollection>> {
  const pageSize = PAGINATION.collections
  const { from, to } = getPaginationRange(page, pageSize)
  const { categories } = await import('~/data/catalog')
  const all = flattenCollections(categories)
  const items = all.slice(from, to + 1)

  return buildPaginatedResult(items, all.length, page, pageSize)
}

async function fetchAllCollectionsPage(page: number): Promise<PaginatedResult<FeaturedCollection>> {
  const fromSupabase = await fetchAllCollectionsFromSupabase(page)

  if (fromSupabase) {
    return fromSupabase
  }

  return fetchAllCollectionsFromCatalog(page)
}

export function usePaginatedAllCollections() {
  const route = useRoute()
  const router = useRouter()
  const currentPage = computed(() => parsePageQuery(route.query.page))

  const result = useAsyncData(
    () => `paginated-all-collections-${currentPage.value}`,
    () => fetchAllCollectionsPage(currentPage.value),
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
