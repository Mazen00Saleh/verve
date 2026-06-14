import type { AdminFetchFilters } from '~/types/adminList'

export function escapeIlike(value: string) {
  return value.replace(/[%_\\]/g, '\\$&')
}

export function buildIlikePattern(search: string) {
  return `%${escapeIlike(search.trim())}%`
}

export function hasAdminFilters(filters: AdminFetchFilters) {
  return Boolean(
    filters.search?.trim()
    || filters.categoryId
    || filters.collectionId
    || filters.status
    || filters.active,
  )
}

type FilterableQuery = {
  ilike: (column: string, pattern: string) => FilterableQuery
  or: (filters: string) => FilterableQuery
  eq: (column: string, value: string | boolean) => FilterableQuery
}

export function applyNameSearch<T extends FilterableQuery>(query: T, column: string, search?: string) {
  if (!search?.trim()) {
    return query
  }

  return query.ilike(column, buildIlikePattern(search))
}

export function applyContactSearch<T extends FilterableQuery>(query: T, search?: string) {
  if (!search?.trim()) {
    return query
  }

  const pattern = buildIlikePattern(search)
  return query.or(`name.ilike.${pattern},email.ilike.${pattern},message.ilike.${pattern}`)
}
