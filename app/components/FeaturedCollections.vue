<template>
  <section class="bg-luxury-ivory py-16 sm:py-20 md:py-24">
    <div class="page-container">
      <div class="mb-10 flex flex-col items-start justify-between gap-6 md:mb-16 md:flex-row md:items-end">
        <div class="max-w-2xl">
          <span class="section-eyebrow">Curated Selection</span>
          <h2 class="section-title">Featured Collections</h2>
          <p class="section-intro mt-4 max-w-xl text-sm sm:text-base">
            A rotating selection of standout collections, refreshed daily from our full catalog.
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
        :empty="!featuredCollections.length"
        empty-title="Collections coming soon"
        empty-message="New collections will appear here once they are published."
      >
        <div class="catalog-grid lg:grid-cols-3">
          <NuxtLink
            v-for="collection in featuredCollections"
            :key="`${collection.categorySlug}-${collection.slug}`"
            :to="`/collections/${collection.categorySlug}/${collection.slug}`"
            class="catalog-card group block"
          >
            <CatalogImage
              :src="collection.heroImage"
              :alt="collection.title"
              aspect="3/4"
              overlay
            />
            <div class="catalog-card-body">
              <p class="catalog-card-eyebrow">
                {{ collection.categoryTitle }}
              </p>
              <h3 class="catalog-card-title">
                {{ collection.title }}
              </h3>
              <p class="catalog-card-description">
                {{ collection.description }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </PageState>

      <div class="mt-10 text-center md:hidden">
        <NuxtLink to="/collections" class="btn-outline">
          View All Collections
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { FeaturedCollection } from '~/data/catalog'

const { data: categories, pending, error } = await useCatalog()

const errorMessage = computed(() => error.value?.message ?? null)

const featuredCollections = computed<FeaturedCollection[]>(() => {
  if (!categories.value?.length) {
    return []
  }

  return getFeaturedCollections(categories.value, 3)
})
</script>
