import type { AdminFetchFilters } from '~/types/adminList'
import { hasAdminFilters } from '~/utils/adminFilters'

export function useAdminListFilters(
  options: {
    searchPlaceholder?: string
    selectKeys?: Array<keyof AdminFetchFilters>
  } = {},
) {
  const route = useRoute()
  const router = useRouter()

  const searchInput = ref(typeof route.query.q === 'string' ? route.query.q : '')
  const debouncedSearch = ref(searchInput.value)

  const selectValues = reactive<Record<string, string>>({})

  for (const key of options.selectKeys ?? []) {
    const queryValue = route.query[key]
    selectValues[key] = typeof queryValue === 'string' ? queryValue : ''
  }

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  watch(searchInput, (value) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    debounceTimer = setTimeout(() => {
      debouncedSearch.value = value
    }, 300)
  })

  const filters = computed<AdminFetchFilters>(() => {
    const next: AdminFetchFilters = {}
    const search = debouncedSearch.value.trim()

    if (search) {
      next.search = search
    }

    if (selectValues.categoryId) {
      next.categoryId = selectValues.categoryId
    }

    if (selectValues.collectionId) {
      next.collectionId = selectValues.collectionId
    }

    if (selectValues.status) {
      next.status = selectValues.status
    }

    if (selectValues.active === 'active' || selectValues.active === 'hidden') {
      next.active = selectValues.active
    }

    return next
  })

  const hasActiveFilters = computed(() => hasAdminFilters(filters.value))

  async function syncQuery() {
    const query: Record<string, string> = {}

    if (debouncedSearch.value.trim()) {
      query.q = debouncedSearch.value.trim()
    }

    for (const key of options.selectKeys ?? []) {
      const value = selectValues[key]

      if (value) {
        query[key] = value
      }
    }

    await router.replace({ path: route.path, query })
  }

  watch(filters, async () => {
    await syncQuery()
  })

  function setSelectValue(key: string, value: string) {
    selectValues[key] = value
  }

  async function clearFilters() {
    searchInput.value = ''
    debouncedSearch.value = ''

    for (const key of options.selectKeys ?? []) {
      selectValues[key] = ''
    }
  }

  onBeforeUnmount(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
  })

  return {
    searchInput,
    selectValues,
    filters,
    hasActiveFilters,
    searchPlaceholder: options.searchPlaceholder ?? 'Search...',
    setSelectValue,
    clearFilters,
  }
}
