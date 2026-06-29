<template>
  <div>
    <div class="page-shell collections-page-shell">
      <div class="page-container collections-page-container">
        <h1 class="collections-page-title">
          COLLECTIONS
        </h1>

        <PageState
          :pending="pending"
          :error-message="errorMessage"
          :empty="!pending && !categoryList.length"
          empty-title="Categories coming soon"
          empty-message="Our catalog is being prepared. Please check back shortly."
          :retry="refresh"
        >
          <CatalogGridSkeleton v-if="pending" :count="4" grid-class="grid-cols-2 lg:grid-cols-4" />

          <div v-else class="catalog-grid grid-cols-2 lg:grid-cols-4 animate-fade-in">
            <CategoryCard
              v-for="category in categoryList"
              :key="category.slug"
              :category="category"
              compact
            />
          </div>
        </PageState>
      </div>
    </div>

    <LazyPartnerLogos hydrate-on-visible />
  </div>
</template>

<script setup lang="ts">
const { data: categories, pending, error, refresh } = await useCategorySummaries()

const errorMessage = computed(() => error.value?.message ?? null)
const categoryList = computed(() => categories.value ?? [])

useHead({
  title: 'Collections | Verve Luxury Interiors',
})
</script>

<style scoped>
.collections-page-shell {
  @apply min-h-0 pb-0 pt-0;
}

.collections-page-container {
  @apply pb-8 sm:pb-10 md:pb-12;
}

.collections-page-title {
  @apply my-8 text-center font-sans text-xl font-medium text-luxury-matte-black sm:my-10 sm:text-2xl md:my-12;
}
</style>
