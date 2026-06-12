import type { Category, Collection, FeaturedCollection, Product } from '~/data/catalog'
import { pickDailyRandom } from '~/utils/shuffle'
import { toSlug } from '~/utils/slug'

type DbProductImage = {
  url: string
  order_index: number | null
  type: string | null
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

function sortImages(images: DbProductImage[]): DbProductImage[] {
  return [...images].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
}

function mapProduct(product: DbProduct): Product {
  const sortedImages = sortImages(product.product_images ?? [])
  const secondaryImages = sortedImages
    .filter(image => image.type === 'secondary')
    .map(image => image.url)
  const mockupImages = sortedImages
    .filter(image => image.type === 'mockup')
    .map(image => image.url)
  const fallbackGallery = sortedImages
    .filter(image => image.type !== 'mockup')
    .map(image => image.url)

  return {
    id: product.id,
    name: product.name,
    sku: toSlug(product.name),
    image: product.primary_image ?? fallbackGallery[0]?.url ?? '',
    description: product.description ?? '',
    secondaryImages,
    mockupImages,
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
            order_index,
            type
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

export function flattenCollections(categories: Category[]): FeaturedCollection[] {
  return categories.flatMap(category =>
    category.collections.map(collection => ({
      ...collection,
      categorySlug: category.slug,
      categoryTitle: category.title,
    })),
  )
}

export function getFeaturedCategories(categories: Category[], count = 2): Category[] {
  const withImages = categories.filter(category => category.image)

  if (!withImages.length) {
    return pickDailyRandom(categories, count, 'featured-categories')
  }

  return pickDailyRandom(withImages, count, 'featured-categories')
}

export function getFeaturedCollections(categories: Category[], count = 3): FeaturedCollection[] {
  const allCollections = flattenCollections(categories).filter(collection => collection.heroImage)

  if (!allCollections.length) {
    return pickDailyRandom(flattenCollections(categories), count, 'featured-collections')
  }

  return pickDailyRandom(allCollections, count, 'featured-collections')
}

export function getHeroSlides(categories: Category[], count = 3) {
  const featured = getFeaturedCollections(categories, count)

  return featured.map(collection => ({
    title: collection.title,
    description: collection.description,
    leftImage: collection.heroImage,
    rightImage: collection.products[0]?.image || collection.heroImage,
    link: `/collections/${collection.categorySlug}/${collection.slug}`,
  }))
}

export function useCatalog() {
  return useAsyncData('catalog', async () => {
    const fromSupabase = await fetchCategoriesFromSupabase()

    if (fromSupabase.length > 0) {
      return fromSupabase
    }

    const { categories } = await import('~/data/catalog')
    return categories
  })
}
