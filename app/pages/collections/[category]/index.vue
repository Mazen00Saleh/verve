<template>
  <div class="page-shell">
    <div class="page-container">
      <div class="page-back">
        <NuxtLink to="/collections" class="back-link group">
          <svg class="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Categories
        </NuxtLink>
      </div>

      <PageState
        :pending="pending"
        :error-message="errorMessage"
        :empty="!pending && !category"
        empty-title="Category not found"
        empty-message="This category may have been removed or is not yet available."
        :retry="refresh"
      >
        <template v-if="category">
          <CatalogGridSkeleton v-if="pending" grid-class="lg:grid-cols-3" />

          <PageState
            v-else
            :empty="total === 0"
            empty-title="No collections yet"
            empty-message="Collections for this category will appear here once published."
            wrapper-class="py-16"
          >
            <div class="catalog-grid lg:grid-cols-3">
              <CollectionCard
                v-for="(collection, index) in items"
                :key="collection.slug"
                :collection="collection"
                :category-slug="category.slug"
                :priority="page === 1 && index === 0"
              />
            </div>

            <Pagination
              :current-page="page"
              :total-pages="totalPages"
              :total-items="total"
              :page-size="pageSize"
              item-label="collections"
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

const { data, pending, error, refresh } = await usePaginatedCollections(categorySlug)
const { setPage, pageSize } = useRoutePagination('collections')

if (data.value && !data.value.category) {
  throw createError({ statusCode: 404, statusMessage: 'Category not found' })
}

const errorMessage = computed(() => error.value?.message ?? null)
const category = computed(() => data.value?.category ?? null)
const items = computed(() => data.value?.items ?? [])
const total = computed(() => data.value?.total ?? 0)
const page = computed(() => data.value?.page ?? 1)
const totalPages = computed(() => data.value?.totalPages ?? 1)

useHead({
  title: computed(() =>
    category.value
      ? `${category.value.title} Collections | Verve Luxury Interiors`
      : 'Collections | Verve Luxury Interiors',
  ),
})
</script>
