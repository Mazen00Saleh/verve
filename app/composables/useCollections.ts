import type { Tables, TablesInsert, TablesUpdate } from '~/types/database.types'
import { getErrorMessage } from '~/utils/errors'
import { collectUrls } from '~/utils/storage'

export type Collection = Tables<'collections'>

export type CollectionWithCategory = Collection & {
  categories: Pick<Tables<'categories'>, 'name'> | null
}

type CollectionTree = Collection & {
  products: Array<{
    primary_image: string | null
    product_images: Array<{ url: string }>
  }>
}

export function useCollections() {
  const supabase = useSupabaseClient()
  const { deleteByUrls } = useFileUpload()

  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll(): Promise<CollectionWithCategory[]> {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('collections')
        .select('*, categories (name)')
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      return (data ?? []) as CollectionWithCategory[]
    } catch (fetchError) {
      error.value = getErrorMessage(fetchError)
      return []
    } finally {
      loading.value = false
    }
  }

  async function fetchOne(id: string): Promise<Collection | null> {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('collections')
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

  async function create(payload: TablesInsert<'collections'>): Promise<Collection | null> {
    loading.value = true
    error.value = null

    try {
      const { data, error: createError } = await supabase
        .from('collections')
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

  async function update(id: string, payload: TablesUpdate<'collections'>): Promise<Collection | null> {
    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase
        .from('collections')
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
      const { data: collectionTree, error: fetchError } = await supabase
        .from('collections')
        .select(`
          image_url,
          products (
            primary_image,
            product_images (url)
          )
        `)
        .eq('id', id)
        .maybeSingle()

      if (fetchError) {
        throw fetchError
      }

      if (collectionTree) {
        const urls = collectCollectionMediaUrls(collectionTree as CollectionTree)
        await deleteByUrls(urls)
      }

      const { error: deleteError } = await supabase
        .from('collections')
        .delete()
        .eq('id', id)

      if (deleteError) {
        throw deleteError
      }

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

function collectCollectionMediaUrls(collection: CollectionTree): string[] {
  const urls: Array<string | null | undefined> = [collection.image_url]

  for (const product of collection.products ?? []) {
    urls.push(product.primary_image)

    for (const image of product.product_images ?? []) {
      urls.push(image.url)
    }
  }

  return collectUrls(urls)
}
