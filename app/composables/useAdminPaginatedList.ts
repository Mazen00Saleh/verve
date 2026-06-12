import { PAGINATION, type PaginationResource } from '~/config/pagination'
import { parsePageQuery, type PaginatedResult } from '~/utils/pagination'

export function useAdminPaginatedList<T>(
  resource: PaginationResource,
  fetchPage: (page: number, pageSize: number) => Promise<PaginatedResult<T>>,
) {
  const route = useRoute()
  const router = useRouter()
  const { setPage, pageSize } = useRoutePagination(resource)
  const currentPage = computed(() => parsePageQuery(route.query.page))

  const { data, pending, error, refresh } = useAsyncData(
    () => `admin-${resource}-${currentPage.value}`,
    () => fetchPage(currentPage.value, pageSize),
    { watch: [currentPage] },
  )

  watch(() => data.value, async (result) => {
    if (!result || result.total === 0) {
      return
    }

    if (currentPage.value > result.totalPages) {
      await router.replace({
        path: route.path,
        query: { ...route.query, page: String(result.totalPages) },
      })
    }
  })

  const items = computed(() => data.value?.items ?? [])
  const total = computed(() => data.value?.total ?? 0)
  const page = computed(() => data.value?.page ?? 1)
  const totalPages = computed(() => data.value?.totalPages ?? 1)

  return {
    items,
    total,
    page,
    totalPages,
    pending,
    error,
    refresh,
    setPage,
    pageSize,
  }
}
