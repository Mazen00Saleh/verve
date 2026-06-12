import type { Tables, TablesInsert, TablesUpdate } from '~/types/database.types'
import { PAGINATION } from '~/config/pagination'
import { getErrorMessage } from '~/utils/errors'
import { buildPaginatedResult, getPaginationRange, type PaginatedResult } from '~/utils/pagination'
import { collectUrls } from '~/utils/storage'

export type Category = Tables<'categories'>

type CategoryTree = Category & {
  collections: Array<{
    image_url: string | null
    products: Array<{
      primary_image: string | null
      product_images: Array<{ url: string }>
    }>
  }>
}

export function useCategories() {
  const supabase = useSupabaseClient()
  const { deleteByUrls } = useFileUpload()

  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchPage(page: number, pageSize = PAGINATION['admin-categories']): Promise<PaginatedResult<Category>> {
    const { from, to } = getPaginationRange(page, pageSize)

    const { data, error: fetchError, count } = await supabase
      .from('categories')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (fetchError) {
      throw fetchError
    }

    return buildPaginatedResult(data ?? [], count ?? 0, page, pageSize)
  }

  async function fetchAll(): Promise<Category[]> {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('categories')
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

  async function fetchOne(id: string): Promise<Category | null> {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('categories')
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

  async function create(payload: TablesInsert<'categories'>): Promise<Category | null> {
    loading.value = true
    error.value = null

    try {
      const { data, error: createError } = await supabase
        .from('categories')
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

  async function update(id: string, payload: TablesUpdate<'categories'>): Promise<Category | null> {
    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await supabase
        .from('categories')
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
      const { data: categoryTree, error: fetchError } = await supabase
        .from('categories')
        .select(`
          image_url,
          collections (
            image_url,
            products (
              primary_image,
              product_images (url)
            )
          )
        `)
        .eq('id', id)
        .maybeSingle()

      if (fetchError) {
        throw fetchError
      }

      if (categoryTree) {
        const urls = collectCategoryMediaUrls(categoryTree as CategoryTree)
        await deleteByUrls(urls)
      }

      const { error: deleteError } = await supabase
        .from('categories')
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
    fetchPage,
    fetchOne,
    create,
    update,
    remove,
  }
}

function collectCategoryMediaUrls(category: CategoryTree): string[] {
  const urls: Array<string | null | undefined> = [category.image_url]

  for (const collection of category.collections ?? []) {
    urls.push(collection.image_url)

    for (const product of collection.products ?? []) {
      urls.push(product.primary_image)

      for (const image of product.product_images ?? []) {
        urls.push(image.url)
      }
    }
  }

  return collectUrls(urls)
}
