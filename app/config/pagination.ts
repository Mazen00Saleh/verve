export const PAGINATION = {
  collections: 12,
  products: 12,
  brochures: 12,
} as const

export type PaginationResource = keyof typeof PAGINATION
