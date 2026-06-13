<template>
  <div class="page-shell">
    <div class="page-container">
      <div class="mb-10 sm:mb-12">
        <NuxtLink to="/collections" class="back-link group">
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
          <div class="mx-auto mb-14 max-w-3xl animate-fade-in text-center sm:mb-20">
            <span class="section-eyebrow">Collection</span>
            <h1 class="section-title mb-4 sm:mb-6">{{ collection.title }}</h1>
            <p class="section-intro mx-auto max-w-xl text-sm sm:text-base">
              {{ collection.description }}
            </p>
            <div class="mx-auto mt-8 h-px w-12 bg-luxury-brass/30" />
          </div>

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

const { data, pending, error, refresh } = await usePaginatedProducts(categorySlug, collectionSlug)
const { setPage, pageSize } = useRoutePagination('products')

const errorMessage = computed(() => error.value?.message ?? null)
const category = computed(() => data.value?.category ?? null)
const collection = computed(() => data.value?.collection ?? null)
const items = computed(() => data.value?.items ?? [])
const total = computed(() => data.value?.total ?? 0)
const page = computed(() => data.value?.page ?? 1)
const totalPages = computed(() => data.value?.totalPages ?? 1)

watch([pending, data], () => {
  if (!pending.value && data.value) {
    if (!data.value.category) {
      throw createError({ statusCode: 404, statusMessage: 'Category not found' })
    }

    if (!data.value.collection) {
      throw createError({ statusCode: 404, statusMessage: 'Collection not found' })
    }
  }
})

useHead({
  title: computed(() =>
    collection.value && category.value
      ? `${collection.value.title} | ${category.value.title} | Verve Luxury Interiors`
      : 'Collection | Verve Luxury Interiors',
  ),
})
</script>
