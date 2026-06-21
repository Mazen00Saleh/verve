import type { SupabaseClient } from '@supabase/supabase-js'
import type { PublicBrochure } from '~/types/catalog'
import { PAGINATION } from '~/config/pagination'
import { formatBrochureDate } from '~/utils/format-date'
import { buildPaginatedResult, getPaginationRange, normalizePage, parsePageQuery, type PaginatedResult } from '~/utils/pagination'
import { toSlug } from '~/utils/slug'

function mapBrochure(row: {
  id: string
  name: string
  description: string | null
  file_url: string | null
  image_url: string | null
  created_at: string | null
}): PublicBrochure {
  return {
    id: row.id,
    title: row.name,
    description: row.description ?? '',
    fileUrl: row.file_url ?? '',
    date: formatBrochureDate(row.created_at),
    slug: toSlug(row.name),
    coverImage: row.image_url ?? '',
  }
}

async function fetchBrochuresPage(
  client: SupabaseClient,
  page: number,
): Promise<PaginatedResult<PublicBrochure>> {
  const pageSize = PAGINATION.brochures
  const { from, to } = getPaginationRange(page, pageSize)

  const { data, error, count } = await client
    .from('brochures')
    .select('id, name, description, file_url, image_url, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    throw error
  }

  const total = count ?? 0
  const normalizedPage = normalizePage(page, total, pageSize)

  return buildPaginatedResult(
    (data ?? []).map(mapBrochure),
    total,
    normalizedPage,
    pageSize,
  )
}

export function usePaginatedBrochures() {
  const client = useSupabaseClient()
  const route = useRoute()
  const router = useRouter()

  const currentPage = computed(() => parsePageQuery(route.query.page))

  const result = useAsyncData(
    () => `paginated-brochures-${currentPage.value}`,
    () => fetchBrochuresPage(client, currentPage.value),
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
