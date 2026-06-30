import type { SupabaseClient } from '@supabase/supabase-js'
import type { Collection, Product } from '~/types/catalog'
import { mapCollectionSummary, mapProduct, type DbProduct } from '~/utils/catalogMappers'
import { toSlug } from '~/utils/slug'

export type CategorySummary = {
  id: string
  title: string
  slug: string
  description: string
  image: string
}

export type CollectionSummary = Collection & {
  id: string
  categoryId: string
}

export type ProductDetailResult = {
  category: CategorySummary
  collection: CollectionSummary
  product: Product
}

const PRODUCT_DETAIL_SELECT = `
  id,
  name,
  description,
  primary_image,
  product_images (
    url,
    order_index,
    type
  )
`

function mapCategorySummary(row: {
  id: string
  name: string
  description: string | null
  image_url: string | null
}): CategorySummary {
  return {
    id: row.id,
    title: row.name,
    slug: toSlug(row.name),
    description: row.description ?? '',
    image: row.image_url ?? '',
  }
}

export async function fetchCategoryBySlug(
  client: SupabaseClient,
  slug: string,
): Promise<CategorySummary | null> {
  const { data, error } = await client
    .from('categories')
    .select('id, name, description, image_url')

  if (error) {
    throw error
  }

  const row = (data ?? []).find(category => toSlug(category.name) === slug)
  return row ? mapCategorySummary(row) : null
}

export async function fetchCollectionBySlug(
  client: SupabaseClient,
  categoryId: string,
  slug: string,
): Promise<CollectionSummary | null> {
  const { data, error } = await client
    .from('collections')
    .select('id, name, description, image_url, category_id')
    .eq('category_id', categoryId)

  if (error) {
    throw error
  }

  const row = (data ?? []).find(collection => toSlug(collection.name) === slug)
  return row ? mapCollectionSummary(row) : null
}

async function fetchProductById(
  client: SupabaseClient,
  productId: string,
): Promise<DbProduct | null> {
  const { data, error } = await client
    .from('products')
    .select(PRODUCT_DETAIL_SELECT)
    .eq('id', productId)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data as DbProduct | null
}

export async function fetchProductDetail(
  client: SupabaseClient,
  categorySlug: string,
  collectionSlug: string,
  productSlug: string,
): Promise<ProductDetailResult | null> {
  const categoryRow = await fetchCategoryBySlug(client, categorySlug)
  if (!categoryRow) {
    return null
  }

  const collectionRow = await fetchCollectionBySlug(client, categoryRow.id, collectionSlug)
  if (!collectionRow) {
    return null
  }

  // Lightweight slug lookup — avoids loading product_images for every product in the collection.
  const { data: productIndex, error: indexError } = await client
    .from('products')
    .select('id, name')
    .eq('collection_id', collectionRow.id)

  if (indexError) {
    throw indexError
  }

  const matchedProduct = (productIndex ?? []).find(product => toSlug(product.name) === productSlug)
  if (!matchedProduct) {
    return null
  }

  const productRow = await fetchProductById(client, matchedProduct.id)
  if (!productRow) {
    return null
  }

  return {
    category: categoryRow,
    collection: collectionRow,
    product: mapProduct(productRow),
  }
}

export function useProductDetail(
  categorySlug: string,
  collectionSlug: string,
  productSlug: string,
) {
  const client = useSupabaseClient()

  return useAsyncData(
    `product-${categorySlug}-${collectionSlug}-${productSlug}`,
    () => fetchProductDetail(client, categorySlug, collectionSlug, productSlug),
  )
}
