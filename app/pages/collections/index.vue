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

usePageSeo({
  title: 'Collections | Verve Luxury Interiors',
  description: 'Browse Verve luxury wallpaper and fabric collections by category — curated wallcoverings and textiles for sophisticated residential and commercial interiors.',
  path: '/collections',
})
</script>
