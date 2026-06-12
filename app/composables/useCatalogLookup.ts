import type { Collection } from '~/data/catalog'
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

function mapCollectionSummary(row: {
  id: string
  name: string
  description: string | null
  image_url: string | null
  category_id: string | null
}): CollectionSummary {
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

export async function fetchCategoryBySlug(slug: string): Promise<CategorySummary | null> {
  const client = useSupabaseClient()

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
  categoryId: string,
  slug: string,
): Promise<CollectionSummary | null> {
  const client = useSupabaseClient()

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
