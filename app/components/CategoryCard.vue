<template>
  <NuxtLink
    :to="`/collections/${category.slug}`"
    class="catalog-card group block"
    :class="{ 'relative overflow-hidden': compact }"
  >
    <template v-if="compact">
      <CatalogImage
        :src="category.image"
        :alt="category.title"
        aspect="4/5"
        :overlay="false"
        :hover-scale="true"
        size="card"
      />

      <div
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.22)_100%)]"
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent transition-opacity duration-500 group-hover:from-black/65"
        aria-hidden="true"
      />
      <div
        class="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent"
        aria-hidden="true"
      />

      <div class="absolute bottom-4 left-4 z-10 flex items-center gap-3 md:bottom-5 md:left-5">
        <span class="h-7 w-px shrink-0 bg-white md:h-8" aria-hidden="true" />
        <span class="font-sans text-sm font-medium tracking-wide text-white drop-shadow-sm md:text-base">
          {{ category.title }}
        </span>
      </div>
    </template>

    <template v-else>
      <CatalogImage
        :src="category.image"
        :alt="category.title"
        aspect="4/3"
        overlay
      />
      <div class="catalog-card-body mx-auto text-center">
        <h2 class="catalog-card-title">{{ category.title }}</h2>
      </div>
    </template>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Category } from '~/types/catalog'

defineProps<{
  category: Category
  compact?: boolean
}>()
</script>
