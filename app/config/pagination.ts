export const PAGINATION = {
  collections: 12,
  products: 12,
  brochures: 12,
  'admin-categories': 15,
  'admin-collections': 15,
  'admin-products': 15,
  'admin-brochures': 15,
  'admin-brand-logos': 15,
  'admin-hero-slides': 15,
  'admin-contact': 10,
} as const

export type PaginationResource = keyof typeof PAGINATION
