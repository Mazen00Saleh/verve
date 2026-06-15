<template>
  <section class="bg-luxury-ivory py-10 sm:py-12 md:py-16">
    <PageState
      :pending="pending"
      :error-message="errorMessage"
      :empty="!mosaicItems.length"
      empty-title="Categories coming soon"
      empty-message="Our catalog is being prepared. Please check back shortly."
      wrapper-class="page-container"
    >
      <div class="page-container grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:grid-rows-2 md:gap-3 md:min-h-[560px] lg:min-h-[680px] xl:min-h-[720px]">
        <HomeCategoryMosaicCard
          v-for="(item, index) in mosaicItems"
          :key="item.slot"
          :category="item.category"
          :label="item.label"
          :to="`/collections/${item.category.slug}/gallery`"
          :priority="index < 2"
          :class="item.className"
        />
      </div>
    </PageState>
  </section>
</template>

<script setup lang="ts">
import { buildMosaicGalleryItems } from '~/utils/homeCategoryMosaic'

const { data: categories, pending, error } = await useCategorySummaries()

const errorMessage = computed(() => error.value?.message ?? null)

const mosaicItems = computed(() => buildMosaicGalleryItems(categories.value ?? []))
</script>
