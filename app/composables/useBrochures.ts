import type { Tables, TablesInsert, TablesUpdate } from '~/types/database.types'
import type { AdminFetchFilters } from '~/types/adminList'
import { PAGINATION } from '~/config/pagination'
import { applyNameSearch } from '~/utils/adminFilters'
import { getErrorMessage } from '~/utils/errors'
import { buildPaginatedResult, getPaginationRange, type PaginatedResult } from '~/utils/pagination'
import { collectUrls } from '~/utils/storage'

export type Brochure = Tables<'brochures'>

export function useBrochures() {
  const supabase = useSupabaseClient()

  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchPage(
    page: number,
    pageSize = PAGINATION['admin-brochures'],
    filters: AdminFetchFilters = {},
  ): Promise<PaginatedResult<Brochure>> {
    const { from, to } = getPaginationRange(page, pageSize)

    let query = supabase
      .from('brochures')
      .select('*', { count: 'exact' })

    query = applyNameSearch(query, 'name', filters.search)

    const { data, error: fetchError, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to)

    if (fetchError) {
      throw fetchError
    }

    return buildPaginatedResult(data ?? [], count ?? 0, page, pageSize)
  }

  async function fetchAll(): Promise<Brochure[]> {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('brochures')
        .select('*')
        .order('created_at', { ascending: false })

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

  async function fetchOne(id: string): Promise<Brochure | null> {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('brochures')
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

  async function create(payload: TablesInsert<'brochures'>): Promise<Brochure | null> {
    loading.value = true
    error.value = null

    try {
      const { data, error: createError } = await supabase
        .from('brochures')
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

  async function update(id: string, payload: TablesUpdate<'brochures'>): Promise<Brochure | null> {
    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase
        .from('brochures')
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
      const { data: brochure, error: fetchError } = await supabase
        .from('brochures')
        .select('image_url')
        .eq('id', id)
        .maybeSingle()

      if (fetchError) {
        throw fetchError
      }

      if (!brochure) {
        return false
      }

      const { error: deleteError } = await supabase
        .from('brochures')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw deleteError
      }

      const { deleteByUrls } = useFileUpload()
      await deleteByUrls(collectUrls([brochure.image_url]))

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
