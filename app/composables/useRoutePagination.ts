import { PAGINATION, type PaginationResource } from '~/config/pagination'
import { parsePageQuery } from '~/utils/pagination'

export function useRoutePagination(resource: PaginationResource) {
  const route = useRoute()
  const router = useRouter()
  const pageSize = PAGINATION[resource]

  const currentPage = computed(() => parsePageQuery(route.query.page))

  async function setPage(page: number) {
    const nextPage = Math.max(1, page)
    const query = { ...route.query }

    if (nextPage === 1) {
      delete query.page
    } else {
      query.page = String(nextPage)
    }

    await router.push({ path: route.path, query })

    if (import.meta.client) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  async function resetPage() {
    if (!route.query.page) {
      return
    }

    const query = { ...route.query }
    delete query.page
    await router.replace({ path: route.path, query })
  }

  return {
    currentPage,
    pageSize,
    setPage,
    resetPage,
  }
}
