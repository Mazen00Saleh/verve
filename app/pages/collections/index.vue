<template>
  <div class="page-shell">
    <div class="page-container py-8 sm:py-12 md:py-16">
      <div class="mb-12 text-center sm:mb-16">
        <span class="section-eyebrow">Catalog</span>
        <h1 class="section-title mb-4">Our Categories</h1>
        <p class="section-intro mx-auto max-w-2xl text-sm sm:text-base">
          Explore our range of premium wallpapers, fabrics, posters, and wallcoverings, each comprising unique curated collections.
        </p>
      </div>

      <PageState
        :pending="pending"
        :error-message="errorMessage"
        :empty="!categories?.length"
        empty-title="No categories yet"
        empty-message="Our catalog is being curated. Please check back soon."
        :retry="refresh"
      >
        <div class="catalog-grid lg:gap-x-16 lg:gap-y-24">
          <CategoryCard
            v-for="category in categories"
            :key="category.slug"
            :category="category"
          />
        </div>
      </PageState>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: categories, pending, error, refresh } = await useCatalog()

const errorMessage = computed(() => error.value?.message ?? null)

useHead({
  title: 'Categories | Verve Luxury Interiors',
})
</script>
