import type { Category, Product } from '~/types/catalog'
import { toSlug } from '~/utils/slug'

export type DbProductImage = {
  url: string
  order_index: number | null
  type: string | null
}

export type DbProduct = {
  id: string
  name: string
  description: string | null
  primary_image: string | null
  product_images: DbProductImage[] | null
}

export function sortImages(images: DbProductImage[]): DbProductImage[] {
  return [...images].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
}

export function mapProduct(product: DbProduct): Product {
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
    image: product.primary_image ?? fallbackGallery[0] ?? '',
    description: product.description ?? '',
    secondaryImages,
    mockupImages,
  }
}

export function mapCategorySummary(row: {
  id: string
  name: string
  description: string | null
  image_url: string | null
}): Category {
  return {
    title: row.name,
    slug: toSlug(row.name),
    description: row.description ?? '',
    image: row.image_url ?? '',
    collections: [],
  }
}

export function mapCollectionSummary(row: {
  id: string
  name: string
  description: string | null
  image_url: string | null
  category_id: string | null
}) {
  const description = row.description ?? ''

  return {
    id: row.id,
    categoryId: row.category_id ?? '',
    title: row.name,
    slug: toSlug(row.name),
    description,
    longDescription: description,
    heroImage: row.image_url ?? '',
    products: [],
  }
}
