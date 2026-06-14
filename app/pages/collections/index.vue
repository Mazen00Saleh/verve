<template>
  <div class="page-shell">
    <div class="page-container py-8 sm:py-12 md:py-16">
      <div class="mb-12 text-center sm:mb-16">
        <span class="section-eyebrow">Catalog</span>
        <h1 class="section-title">Our Collections</h1>
        <div class="section-title-divider" />
      </div>

      <PageState
        :pending="pending"
        :error-message="errorMessage"
        :empty="!pending && total === 0"
        empty-title="No collections yet"
        empty-message="Our catalog is being curated. Please check back soon."
        :retry="refresh"
      >
        <CatalogGridSkeleton v-if="pending" grid-class="lg:grid-cols-3" />

        <template v-else>
          <div class="catalog-grid lg:grid-cols-3">
            <CollectionCard
              v-for="(collection, index) in items"
              :key="`${collection.categorySlug}-${collection.slug}`"
              :collection="collection"
              :category-slug="collection.categorySlug"
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
        </template>
      </PageState>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data, pending, error, refresh } = await usePaginatedAllCollections()
const { setPage, pageSize } = useRoutePagination('collections')

const errorMessage = computed(() => error.value?.message ?? null)
const items = computed(() => data.value?.items ?? [])
const total = computed(() => data.value?.total ?? 0)
const page = computed(() => data.value?.page ?? 1)
const totalPages = computed(() => data.value?.totalPages ?? 1)

useHead({
  title: 'Collections | Verve Luxury Interiors',
})
</script>
