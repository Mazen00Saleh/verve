<template>
  <div class="page-shell">
    <div class="page-container py-8 sm:py-12 md:py-16">
      <div class="mb-12 text-center sm:mb-16">
        <span class="section-eyebrow">Catalog</span>
        <h1 class="section-title">Explore By Category</h1>
        <div class="section-title-divider" />
      </div>

      <PageState
        :pending="pending"
        :error-message="errorMessage"
        :empty="!mosaicItems.length"
        empty-title="Categories coming soon"
        empty-message="Our catalog is being prepared. Please check back shortly."
        :retry="refresh"
      >
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:grid-rows-2 md:gap-3 md:min-h-[560px] lg:min-h-[680px] xl:min-h-[720px] animate-fade-in">
          <HomeCategoryMosaicCard
            v-for="(item, index) in mosaicItems"
            :key="item.slot"
            :category="item.category"
            :label="item.label"
            :priority="index < 2"
            :class="item.className"
          />
        </div>
      </PageState>
    </div>
  </div>
</template>

<script setup lang="ts">
import { buildMosaicGalleryItems } from '~/utils/homeCategoryMosaic'

const { data: categories, pending, error, refresh } = await useCategorySummaries()

const errorMessage = computed(() => error.value?.message ?? null)
const mosaicItems = computed(() => buildMosaicGalleryItems(categories.value ?? []))

useHead({
  title: 'Collections | Verve Luxury Interiors',
})
</script>
