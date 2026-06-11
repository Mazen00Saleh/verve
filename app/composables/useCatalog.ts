import type { Category, Collection, Product } from '~/data/catalog'
import { categories as staticCategories } from '~/data/catalog'
import { toSlug } from '~/utils/slug'

type DbProductImage = {
  url: string
  order_index: number | null
}

type DbProduct = {
  id: string
  name: string
  description: string | null
  primary_image: string | null
  product_images: DbProductImage[] | null
}

type DbCollection = {
  id: string
  name: string
  description: string | null
  image_url: string | null
  products: DbProduct[] | null
}

type DbCategory = {
  id: string
  name: string
  description: string | null
  image_url: string | null
  collections: DbCollection[] | null
}

function mapProduct(product: DbProduct): Product {
  const sortedImages = [...(product.product_images ?? [])].sort(
    (a, b) => (a.order_index ?? 0) - (b.order_index ?? 0),
  )

  return {
    name: product.name,
    sku: toSlug(product.name),
    image: product.primary_image ?? sortedImages[0]?.url ?? '',
  }
}

function mapCollection(collection: DbCollection): Collection {
  const description = collection.description ?? ''

  return {
    title: collection.name,
    slug: toSlug(collection.name),
    description,
    longDescription: description,
    heroImage: collection.image_url ?? '',
    products: (collection.products ?? []).map(mapProduct),
  }
}

function mapCategory(category: DbCategory): Category {
  return {
    title: category.name,
    slug: toSlug(category.name),
    description: category.description ?? '',
    image: category.image_url ?? '',
    collections: (category.collections ?? []).map(mapCollection),
  }
}

async function fetchCategoriesFromSupabase(): Promise<Category[]> {
  const client = useSupabaseClient()

  const { data, error } = await client
    .from('categories')
    .select(`
      id,
      name,
      description,
      image_url,
      collections (
        id,
        name,
        description,
        image_url,
        products (
          id,
          name,
          description,
          primary_image,
          product_images (
            url,
            order_index
          )
        )
      )
    `)
    .order('created_at', { ascending: true })

  if (error) {
    console.warn('[useCatalog] Supabase fetch failed, using static catalog:', error.message)
    return []
  }

  if (!data?.length) {
    return []
  }

  return (data as DbCategory[]).map(mapCategory)
}

export function useCatalog() {
  return useAsyncData('catalog', async () => {
    const fromSupabase = await fetchCategoriesFromSupabase()
    return fromSupabase.length > 0 ? fromSupabase : staticCategories
  })
}
