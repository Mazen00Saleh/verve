<template>
  <NuxtLink :to="`/collections/${category.slug}`" class="catalog-card group block">
    <CatalogImage
      :src="category.image"
      :alt="category.title"
      aspect="4/3"
      overlay
    />
    <div class="catalog-card-body mx-auto text-center">
      <h2 class="catalog-card-title">{{ category.title }}</h2>
      <span class="catalog-card-cta">Discover Category</span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Category } from '~/data/catalog'

defineProps<{
  category: Category
}>()
</script>
