import type { Tables, TablesInsert, TablesUpdate } from '~/types/database.types'
import { getErrorMessage } from '~/utils/errors'
import { collectUrls } from '~/utils/storage'

export type HeroSlide = Tables<'hero_slides'>

export function useHeroSlides() {
  const supabase = useSupabaseClient()

  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll(): Promise<HeroSlide[]> {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('hero_slides')
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

  async function fetchOne(id: string): Promise<HeroSlide | null> {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('hero_slides')
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

  async function create(payload: TablesInsert<'hero_slides'>): Promise<HeroSlide | null> {
    loading.value = true
    error.value = null

    try {
      const { data, error: createError } = await supabase
        .from('hero_slides')
        .insert(payload)
        .select()
        .single()

      if (createError) {
        throw createError
      }

      await clearNuxtData('public-hero-slides')
      return data
    } catch (createError) {
      error.value = getErrorMessage(createError)
      return null
    } finally {
      loading.value = false
    }
  }

  async function update(id: string, payload: TablesUpdate<'hero_slides'>): Promise<HeroSlide | null> {
    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase
        .from('hero_slides')
        .update(payload)
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      await clearNuxtData('public-hero-slides')
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
      const { data: slide, error: fetchError } = await supabase
        .from('hero_slides')
        .select('left_image_url, right_image_url')
        .eq('id', id)
        .maybeSingle()

      if (fetchError) {
        throw fetchError
      }

      if (!slide) {
        return false
      }

      const { error: deleteError } = await supabase
        .from('hero_slides')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw deleteError
      }

      const { deleteByUrls } = useFileUpload()
      await deleteByUrls(collectUrls([slide.left_image_url, slide.right_image_url]))
      await clearNuxtData('public-hero-slides')

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
    fetchOne,
    create,
    update,
    remove,
  }
}
