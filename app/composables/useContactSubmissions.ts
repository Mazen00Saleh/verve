import type { Tables, TablesUpdate } from '~/types/database.types'
import { PAGINATION } from '~/config/pagination'
import { getErrorMessage } from '~/utils/errors'
import { buildPaginatedResult, getPaginationRange, type PaginatedResult } from '~/utils/pagination'

export type ContactSubmission = Tables<'contact_submissions'>

export function useContactSubmissions() {
  const supabase = useSupabaseClient()

  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchPage(page: number, pageSize = PAGINATION['admin-contact']): Promise<PaginatedResult<ContactSubmission>> {
    const { from, to } = getPaginationRange(page, pageSize)

    const { data, error: fetchError, count } = await supabase
      .from('contact_submissions')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (fetchError) {
      throw fetchError
    }

    return buildPaginatedResult(data ?? [], count ?? 0, page, pageSize)
  }

  async function fetchAll(): Promise<ContactSubmission[]> {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('contact_submissions')
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

  async function updateStatus(id: string, status: TablesUpdate<'contact_submissions'>['status']): Promise<boolean> {
    loading.value = true
    error.value = null

    try {
      const { error: updateError } = await supabase
        .from('contact_submissions')
        .update({ status })
        .eq('id', id)

      if (updateError) {
        throw updateError
      }

      return true
    } catch (updateError) {
      error.value = getErrorMessage(updateError)
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
    updateStatus,
  }
}
