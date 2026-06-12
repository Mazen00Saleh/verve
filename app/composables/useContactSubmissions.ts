import type { Tables, TablesUpdate } from '~/types/database.types'
import { getErrorMessage } from '~/utils/errors'

export type ContactSubmission = Tables<'contact_submissions'>

export function useContactSubmissions() {
  const supabase = useSupabaseClient()

  const loading = ref(false)
  const error = ref<string | null>(null)

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
    updateStatus,
  }
}
