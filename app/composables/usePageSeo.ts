import type { MaybeRefOrGetter } from 'vue'
import {
  DEFAULT_OG_IMAGE,
  type PageSeoType,
  toAbsoluteUrl,
  truncateDescription,
} from '~/utils/seo'

type JsonLdValue = Record<string, unknown> | Record<string, unknown>[]

export type PageSeoOptions = {
  title: MaybeRefOrGetter<string>
  description?: MaybeRefOrGetter<string | undefined>
  path?: MaybeRefOrGetter<string | undefined>
  image?: MaybeRefOrGetter<string | undefined>
  type?: PageSeoType
  noindex?: MaybeRefOrGetter<boolean>
  jsonLd?: MaybeRefOrGetter<JsonLdValue | null | undefined>
}

export function usePageSeo(options: PageSeoOptions) {
  const route = useRoute()
  const { public: { siteUrl } } = useRuntimeConfig()

  const resolvedTitle = computed(() => toValue(options.title))
  const resolvedDescription = computed(() => {
    const description = toValue(options.description)

    return description ? truncateDescription(description) : undefined
  })
  const resolvedPath = computed(() => toValue(options.path) ?? route.path)
  const resolvedImage = computed(() => toValue(options.image) ?? DEFAULT_OG_IMAGE)
  const resolvedType = options.type ?? 'website'
  const resolvedNoindex = computed(() => Boolean(toValue(options.noindex)))

  const canonicalUrl = computed(() => toAbsoluteUrl(siteUrl, resolvedPath.value))
  const absoluteImageUrl = computed(() => toAbsoluteUrl(siteUrl, resolvedImage.value))

  useSeoMeta({
    title: resolvedTitle,
    description: resolvedDescription,
    ogTitle: resolvedTitle,
    ogDescription: resolvedDescription,
    ogImage: absoluteImageUrl,
    ogUrl: canonicalUrl,
    ogType: resolvedType,
    ogSiteName: 'Verve Luxury Interiors',
    twitterCard: 'summary_large_image',
    twitterTitle: resolvedTitle,
    twitterDescription: resolvedDescription,
    twitterImage: absoluteImageUrl,
    robots: computed(() => (resolvedNoindex.value ? 'noindex, nofollow' : 'index, follow')),
  })

  useHead({
    link: computed(() => [
      { rel: 'canonical', href: canonicalUrl.value },
    ]),
    script: computed(() => {
      const jsonLd = toValue(options.jsonLd)

      if (!jsonLd) {
        return []
      }

      const entries = Array.isArray(jsonLd) ? jsonLd : [jsonLd]

      return entries.map((entry) => ({
        type: 'application/ld+json',
        innerHTML: JSON.stringify(entry),
      }))
    }),
  })
}

export function useAdminSeo(title: MaybeRefOrGetter<string>) {
  useSeoMeta({
    title,
    robots: 'noindex, nofollow',
  })

  useHead({
    title,
  })
}
