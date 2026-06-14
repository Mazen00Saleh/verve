export type AdminFetchFilters = {
  search?: string
  categoryId?: string
  collectionId?: string
  status?: string
  active?: 'active' | 'hidden'
}

export type AdminListSelectFilter = {
  key: keyof AdminFetchFilters
  label: string
  options: Array<{ value: string, label: string }>
  allLabel?: string
}
