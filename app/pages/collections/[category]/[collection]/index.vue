<template>
  <div class="page-shell">
    <div class="page-container">
      <div class="page-back">
        <NuxtLink :to="`/collections/${categorySlug}`" class="back-link group">
          <svg class="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Collections
        </NuxtLink>
      </div>

      <PageState
        :pending="pending"
        :error-message="errorMessage"
        :empty="!pending && !collection"
        empty-title="Collection not found"
        empty-message="This collection may have been removed or is not yet available."
        :retry="refresh"
      >
        <template v-if="category && collection">
          <h1 class="sr-only">{{ collection.title }}</h1>
          <CatalogGridSkeleton v-if="pending" grid-class="md:grid-cols-3" />

          <PageState
            v-else
            :empty="total === 0"
            empty-title="No products yet"
            empty-message="Products for this collection will appear here once published."
            wrapper-class="py-16"
          >
            <div class="catalog-grid md:grid-cols-3">
              <ProductCard
                v-for="(product, index) in items"
                :key="product.id"
                :product="product"
                :category-slug="category.slug"
                :collection-slug="collection.slug"
                :priority="page === 1 && index === 0"
              />
            </div>

            <Pagination
              :current-page="page"
              :total-pages="totalPages"
              :total-items="total"
              :page-size="pageSize"
              item-label="products"
              @page-change="setPage"
            />
          </PageState>
        </template>
      </PageState>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const categorySlug = route.params.category as string
const collectionSlug = route.params.collection as string
const { public: { siteUrl } } = useRuntimeConfig()

const { data, pending, error, refresh } = await usePaginatedProducts(categorySlug, collectionSlug)
const { setPage, pageSize } = useRoutePagination('products')

if (data.value) {
  if (!data.value.category) {
    throw createError({ statusCode: 404, statusMessage: 'Category not found' })
  }

  if (!data.value.collection) {
    throw createError({ statusCode: 404, statusMessage: 'Collection not found' })
  }
}

const errorMessage = computed(() => error.value?.message ?? null)
const category = computed(() => data.value?.category ?? null)
const collection = computed(() => data.value?.collection ?? null)
const items = computed(() => data.value?.items ?? [])
const total = computed(() => data.value?.total ?? 0)
const page = computed(() => data.value?.page ?? 1)
const totalPages = computed(() => data.value?.totalPages ?? 1)

const seoTitle = computed(() =>
  collection.value && category.value
    ? `${collection.value.title} | ${category.value.title} | Verve Luxury Interiors`
    : 'Collection | Verve Luxury Interiors',
)

const seoDescription = computed(() => {
  if (collection.value?.description) {
    return collection.value.description
  }

  return `Discover ${collection.value?.title ?? 'this'} from Verve's ${category.value?.title ?? 'luxury'} range — curated wallpapers, fabrics, and wallcoverings.`
})

usePageSeo({
  title: seoTitle,
  description: seoDescription,
  path: computed(() => buildCanonicalPath(`/collections/${categorySlug}/${collectionSlug}`, page.value)),
  image: computed(() => collection.value?.heroImage || undefined),
  jsonLd: computed(() => {
    if (!category.value || !collection.value) {
      return null
    }

    return buildBreadcrumbJsonLd(siteUrl, [
      { name: 'Home', path: '/' },
      { name: 'Collections', path: '/collections' },
      { name: category.value.title, path: `/collections/${categorySlug}` },
      { name: collection.value.title, path: `/collections/${categorySlug}/${collectionSlug}` },
    ])
  }),
})
</script>
