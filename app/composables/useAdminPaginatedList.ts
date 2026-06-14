import { PAGINATION, type PaginationResource } from '~/config/pagination'
import type { AdminFetchFilters } from '~/types/adminList'
import { getErrorMessage } from '~/utils/errors'
import { buildPaginatedResult, parsePageQuery, type PaginatedResult } from '~/utils/pagination'

export function useAdminPaginatedList<T>(
  resource: PaginationResource,
  fetchPage: (page: number, pageSize: number, filters: AdminFetchFilters) => Promise<PaginatedResult<T>>,
  filters: Ref<AdminFetchFilters> | ComputedRef<AdminFetchFilters>,
) {
  const route = useRoute()
  const router = useRouter()
  const { setPage, pageSize } = useRoutePagination(resource)
  const currentPage = computed(() => parsePageQuery(route.query.page))
  const filterKey = computed(() => JSON.stringify(toValue(filters)))
  const listError = ref<string | null>(null)

  const { data, pending, error, refresh } = useAsyncData(
    () => `admin-${resource}-${currentPage.value}-${filterKey.value}`,
    async () => {
      try {
        listError.value = null
        return await fetchPage(currentPage.value, pageSize, toValue(filters))
      } catch (fetchError) {
        listError.value = getErrorMessage(fetchError)
        return buildPaginatedResult([], 0, currentPage.value, pageSize)
      }
    },
    { watch: [currentPage, filterKey] },
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
    listError,
    refresh,
    setPage,
    pageSize,
  }
}
