export const SITE_NAME = 'Verve'
export const DEFAULT_OG_IMAGE = '/images/verve-logo.webp'

export type PageSeoType = 'website' | 'article' | 'product'

export function normalizeCanonicalPath(path: string): string {
  if (!path || path === '/') {
    return '/'
  }

  return path.replace(/\/$/, '')
}

export function toAbsoluteUrl(siteUrl: string, pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl
  }

  const origin = siteUrl.replace(/\/$/, '')
  const normalized = normalizeCanonicalPath(pathOrUrl)

  return normalized === '/' ? origin : `${origin}${normalized}`
}

export function truncateDescription(text: string, maxLength = 160): string {
  const trimmed = text.trim().replace(/\s+/g, ' ')

  if (!trimmed) {
    return ''
  }

  if (trimmed.length <= maxLength) {
    return trimmed
  }

  const slice = trimmed.slice(0, maxLength - 1)
  const lastSpace = slice.lastIndexOf(' ')

  return `${(lastSpace > 100 ? slice.slice(0, lastSpace) : slice).trimEnd()}…`
}

export function buildCanonicalPath(path: string, page?: number): string {
  const normalized = normalizeCanonicalPath(path)

  if (page && page > 1) {
    return `${normalized}?page=${page}`
  }

  return normalized
}

type BreadcrumbItem = {
  name: string
  path: string
}

export function buildBreadcrumbJsonLd(siteUrl: string, items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(siteUrl, item.path),
    })),
  }
}

export function buildOrganizationJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: toAbsoluteUrl(siteUrl, '/'),
    logo: toAbsoluteUrl(siteUrl, DEFAULT_OG_IMAGE),
    description: 'Luxury wallpapers, fabrics, and wallcoverings for sophisticated interiors across the MENA region.',
  }
}

export function buildWebSiteJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${SITE_NAME} Luxury Interiors`,
    url: toAbsoluteUrl(siteUrl, '/'),
  }
}

export function buildProductJsonLd(options: {
  siteUrl: string
  name: string
  sku: string
  description?: string
  image?: string
  path: string
}) {
  const payload: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: options.name,
    sku: options.sku,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    url: toAbsoluteUrl(options.siteUrl, options.path),
  }

  if (options.description) {
    payload.description = options.description
  }

  if (options.image) {
    payload.image = toAbsoluteUrl(options.siteUrl, options.image)
  }

  return payload
}

export function buildLocalBusinessJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE_NAME,
    url: toAbsoluteUrl(siteUrl, '/contact'),
    image: toAbsoluteUrl(siteUrl, DEFAULT_OG_IMAGE),
    email: 'info@verve-group.com',
    telephone: ['+96265925041', '+962790202838'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Verve Building No.(67), Prs. Alia St, Al-Swaifyeh',
      addressLocality: 'Amman',
      addressCountry: 'JO',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'],
        opens: '10:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Thursday',
        opens: '10:00',
        closes: '19:00',
      },
    ],
  }
}
