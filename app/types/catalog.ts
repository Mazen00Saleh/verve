export interface Product {
  id: string
  name: string
  sku: string
  image: string
  description: string
  secondaryImages: string[]
  mockupImages: string[]
}

export interface Collection {
  title: string
  slug: string
  description: string
  longDescription: string
  heroImage: string
  products: Product[]
}

export interface Category {
  title: string
  slug: string
  description: string
  image: string
  collections: Collection[]
}

export interface FeaturedCollection extends Collection {
  categorySlug: string
  categoryTitle: string
}

export interface PublicBrochure {
  id: string
  title: string
  description: string
  fileUrl: string
  date: string
  slug: string
  coverImage: string
}
