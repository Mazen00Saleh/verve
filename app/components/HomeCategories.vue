<template>
  <section class="bg-luxury-ivory py-16 sm:py-20 md:py-24">
    <div class="page-container">
      <div class="mb-10 flex flex-col items-start justify-between gap-6 md:mb-16 md:flex-row md:items-end">
        <div class="max-w-2xl">
          <span class="section-eyebrow">Explore by Category</span>
          <h2 class="section-title">Our Categories</h2>
          <p class="section-intro mt-4 max-w-xl text-sm sm:text-base">
            A rotating pair of categories from our catalog — refreshed daily to highlight different parts of the collection.
          </p>
        </div>
        <NuxtLink
          to="/collections"
          class="hidden border-b border-luxury-matte-black pb-1 text-sm uppercase tracking-widest transition-colors hover:border-luxury-brass hover:text-luxury-brass md:inline-block"
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
        <div class="catalog-grid mx-auto max-w-5xl">
          <CategoryCard
            v-for="category in featuredCategories"
            :key="category.slug"
            :category="category"
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
import type { Category } from '~/data/catalog'

const { data: categories, pending, error } = await useCatalog()

const errorMessage = computed(() => error.value?.message ?? null)

const featuredCategories = computed<Category[]>(() => {
  if (!categories.value?.length) {
    return []
  }

  return getFeaturedCategories(categories.value, 2)
})
</script>
