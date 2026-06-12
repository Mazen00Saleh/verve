<template>
  <section class="bg-luxury-ivory py-16 sm:py-20 md:py-24">
    <div class="page-container">
      <div class="mb-10 flex flex-col items-start justify-between gap-6 md:mb-16 md:flex-row md:items-end">
        <div class="max-w-2xl">
          <span class="section-eyebrow">Explore by Category</span>
          <h2 class="section-title">Our Categories</h2>
          <p class="section-intro mt-4 max-w-xl text-sm sm:text-base">
            Browse our full range of wallpapers, fabrics, wall coverings, and posters.
          </p>
        </div>
        <NuxtLink
          to="/collections"
          class="hidden border-b border-luxury-matte-black pb-1 text-sm uppercase tracking-widest transition-colors hover:border-luxury-brass-contrast hover:text-luxury-brass-contrast md:inline-block"
        >
          View All
        </NuxtLink>
      </div>

      <PageState
        :pending="pending"
        :error-message="errorMessage"
        :empty="!featuredCategories.length"
        empty-title="Categories coming soon"
        empty-message="Our catalog is being prepared. Please check back shortly."
      >
        <div class="home-categories-grid mx-auto max-w-7xl">
          <CategoryCard
            v-for="category in featuredCategories"
            :key="category.slug"
            :category="category"
            compact
          />
        </div>
      </PageState>

      <div class="mt-10 text-center md:hidden">
        <NuxtLink to="/collections" class="btn-outline">
          View All Categories
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data: categories, pending, error } = await useCatalog()

const errorMessage = computed(() => error.value?.message ?? null)

const featuredCategories = computed<Category[]>(() => categories.value ?? [])
</script>

<style scoped>
.home-categories-grid {
  @apply grid grid-cols-4 gap-2 sm:gap-4 md:gap-6;
}

.home-categories-grid :deep(.catalog-card-body) {
  @apply mt-1 sm:mt-2;
}

.home-categories-grid :deep(.catalog-card-title) {
  @apply text-[10px] sm:text-xs md:text-sm;
}

.home-categories-grid :deep(.catalog-card-cta) {
  @apply hidden;
}
</style>
