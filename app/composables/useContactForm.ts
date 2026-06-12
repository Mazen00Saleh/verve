import { FunctionsHttpError } from '@supabase/supabase-js'
import { getErrorMessage } from '~/utils/errors'

export type ContactFormInput = {
  name: string
  email: string
  message: string
  website?: string
}

async function getInvokeErrorMessage(error: unknown): Promise<string> {
  if (error instanceof FunctionsHttpError) {
    try {
      const body = await error.context.json() as { error?: string }

      if (body?.error) {
        return body.error
      }
    } catch {
      // Fall through to generic message below.
    }
  }

  return getErrorMessage(error)
}

export function useContactForm() {
  const supabase = useSupabaseClient()

  const submitting = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)

  async function submit(payload: ContactFormInput): Promise<boolean> {
    submitting.value = true
    error.value = null
    success.value = false

    try {
      const { data, error: invokeError } = await supabase.functions.invoke('contact-form', {
        body: payload,
      })

      if (invokeError) {
        error.value = await getInvokeErrorMessage(invokeError)
        return false
      }

      if (data?.error) {
        error.value = String(data.error)
        return false
      }

      success.value = true
      return true
    } catch (submitError) {
      error.value = await getInvokeErrorMessage(submitError)
      return false
    } finally {
      submitting.value = false
    }
  }

  function reset() {
    error.value = null
    success.value = false
  }

  return {
    submitting: readonly(submitting),
    error: readonly(error),
    success: readonly(success),
    submit,
    reset,
  }
}
