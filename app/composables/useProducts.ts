import type { Tables, TablesInsert } from '~/types/database.types'
import { getErrorMessage } from '~/utils/errors'
import { collectUrls } from '~/utils/storage'

export type Product = Tables<'products'>
export type ProductImage = Tables<'product_images'>
export type ProductImageType = 'secondary' | 'mockup'

export type ProductWithRelations = Product & {
  collections: { name: string; categories: { name: string } | null } | null
  product_images: ProductImage[]
}

export interface ProductFormInput {
  collection_id: string
  name: string
  description: string
  primaryImageUrl?: string | null
  secondaryImageUrls?: string[]
  mockupImageUrls?: string[]
}

export interface ProductUpdateInput extends ProductFormInput {
  removedImageIds?: string[]
}

export function useProducts() {
  const supabase = useSupabaseClient()
  const { deleteByUrl, deleteByUrls } = useFileUpload()

  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll(): Promise<ProductWithRelations[]> {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select(`
          *,
          collections (
            name,
            categories (name)
          ),
          product_images (*)
        `)
        .order('created_at', { ascending: false })

      if (fetchError) {
        throw fetchError
      }

      return (data ?? []) as ProductWithRelations[]
    } catch (fetchError) {
      error.value = getErrorMessage(fetchError)
      return []
    } finally {
      loading.value = false
    }
  }

  async function fetchOne(id: string): Promise<ProductWithRelations | null> {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select(`
          *,
          collections (
            name,
            categories (name)
          ),
          product_images (*)
        `)
        .eq('id', id)
        .maybeSingle()

      if (fetchError) {
        throw fetchError
      }

      if (data?.product_images) {
        data.product_images.sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
      }

      return data as ProductWithRelations | null
    } catch (fetchError) {
      error.value = getErrorMessage(fetchError)
      return null
    } finally {
      loading.value = false
    }
  }

  async function create(input: ProductFormInput): Promise<Product | null> {
    loading.value = true
    error.value = null

    try {
      const { data: product, error: createError } = await supabase
        .from('products')
        .insert({
          collection_id: input.collection_id,
          name: input.name.trim(),
          description: input.description.trim() || null,
          primary_image: input.primaryImageUrl ?? null,
        })
        .select()
        .single()

      if (createError) {
        throw createError
      }

      const galleryRows = buildGalleryRows(
        product.id,
        input.secondaryImageUrls ?? [],
        input.mockupImageUrls ?? [],
      )

      if (galleryRows.length) {
        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(galleryRows)

        if (imagesError) {
          throw imagesError
        }
      }

      return product
    } catch (createError) {
      error.value = getErrorMessage(createError)
      return null
    } finally {
      loading.value = false
    }
  }

  async function update(id: string, input: ProductUpdateInput, existing: ProductWithRelations): Promise<Product | null> {
    loading.value = true
    error.value = null

    try {
      const removedImages = (existing.product_images ?? []).filter(image =>
        input.removedImageIds?.includes(image.id),
      )

      if (removedImages.length) {
        await deleteByUrls(removedImages.map(image => image.url))

        const { error: removeImagesError } = await supabase
          .from('product_images')
          .delete()
          .in('id', removedImages.map(image => image.id))

        if (removeImagesError) {
          throw removeImagesError
        }
      }

      const nextPrimaryImage = input.primaryImageUrl ?? existing.primary_image

      if (
        nextPrimaryImage !== existing.primary_image
        && existing.primary_image
        && !removedImages.some(image => image.url === existing.primary_image)
      ) {
        await deleteByUrl(existing.primary_image)
      }

      const { data: product, error: updateError } = await supabase
        .from('products')
        .update({
          collection_id: input.collection_id,
          name: input.name.trim(),
          description: input.description.trim() || null,
          primary_image: nextPrimaryImage,
        })
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      const remainingImages = (existing.product_images ?? []).filter(image =>
        !input.removedImageIds?.includes(image.id),
      )

      const galleryRows = buildGalleryRows(
        id,
        input.secondaryImageUrls ?? [],
        input.mockupImageUrls ?? [],
        remainingImages.length,
      )

      if (galleryRows.length) {
        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(galleryRows)

        if (imagesError) {
          throw imagesError
        }
      }

      return product
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
      const existing = await fetchOne(id)

      if (existing) {
        const urls = collectUrls([
          existing.primary_image,
          ...(existing.product_images ?? []).map(image => image.url),
        ])

        await deleteByUrls(urls)
      }

      const { error: deleteError } = await supabase
        .from('products')
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

  function buildGalleryRows(
    productId: string,
    secondaryImageUrls: string[],
    mockupImageUrls: string[],
    startIndex = 0,
  ): TablesInsert<'product_images'>[] {
    const rows: TablesInsert<'product_images'>[] = []
    let orderIndex = startIndex

    for (const url of secondaryImageUrls) {
      rows.push({
        product_id: productId,
        url,
        type: 'secondary',
        order_index: orderIndex++,
      })
    }

    for (const url of mockupImageUrls) {
      rows.push({
        product_id: productId,
        url,
        type: 'mockup',
        order_index: orderIndex++,
      })
    }

    return rows
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
