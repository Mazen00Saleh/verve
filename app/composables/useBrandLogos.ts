import type { Tables, TablesInsert, TablesUpdate } from '~/types/database.types'
import type { AdminFetchFilters } from '~/types/adminList'
import { PAGINATION } from '~/config/pagination'
import { applyNameSearch } from '~/utils/adminFilters'
import { getErrorMessage } from '~/utils/errors'
import { buildPaginatedResult, getPaginationRange, type PaginatedResult } from '~/utils/pagination'
import { collectUrls } from '~/utils/storage'

export type BrandLogo = Tables<'brand_logos'>

export function useBrandLogos() {
  const supabase = useSupabaseClient()

  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchPage(
    page: number,
    pageSize = PAGINATION['admin-brand-logos'],
    filters: AdminFetchFilters = {},
  ): Promise<PaginatedResult<BrandLogo>> {
    const { from, to } = getPaginationRange(page, pageSize)

    let query = supabase
      .from('brand_logos')
      .select('*', { count: 'exact' })

    query = applyNameSearch(query, 'name', filters.search)

    const { data, error: fetchError, count } = await query
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: true })
      .range(from, to)

    if (fetchError) {
      throw fetchError
    }

    return buildPaginatedResult(data ?? [], count ?? 0, page, pageSize)
  }

  async function fetchAll(): Promise<BrandLogo[]> {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('brand_logos')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: true })

      if (fetchError) {
        throw fetchError
      }

      return data ?? []
    } catch (fetchError) {
      error.value = getErrorMessage(fetchError)
      return []
    } finally {
      loading.value = false
    }
  }

  async function fetchOne(id: string): Promise<BrandLogo | null> {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('brand_logos')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (fetchError) {
        throw fetchError
      }

      return data
    } catch (fetchError) {
      error.value = getErrorMessage(fetchError)
      return null
    } finally {
      loading.value = false
    }
  }

  async function create(payload: TablesInsert<'brand_logos'>): Promise<BrandLogo | null> {
    loading.value = true
    error.value = null

    try {
      const { data, error: createError } = await supabase
        .from('brand_logos')
        .insert(payload)
        .select()
        .single()

      if (createError) {
        throw createError
      }

      return data
    } catch (createError) {
      error.value = getErrorMessage(createError)
      return null
    } finally {
      loading.value = false
    }
  }

  async function update(id: string, payload: TablesUpdate<'brand_logos'>): Promise<BrandLogo | null> {
    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase
        .from('brand_logos')
        .update(payload)
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      return data
    } catch (updateError) {
      error.value = getErrorMessage(updateError)
      return null
    } finally {
      loading.value = false
    }
  }

  async function remove(id: string): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      const { data: brandLogo, error: fetchError } = await supabase
        .from('brand_logos')
        .select('logo_url')
        .eq('id', id)
        .maybeSingle()

      if (fetchError) {
        throw fetchError
      }

      if (!brandLogo) {
        return false
      }

      const { error: deleteError } = await supabase
        .from('brand_logos')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw deleteError
      }

      const { deleteByUrls } = useFileUpload()
      await deleteByUrls(collectUrls([brandLogo.logo_url]))

      return true
    } catch (deleteError) {
      error.value = getErrorMessage(deleteError)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    fetchAll,
    fetchPage,
    fetchOne,
    create,
    update,
    remove,
  }
}
