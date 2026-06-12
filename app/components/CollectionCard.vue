<template>
  <NuxtLink
    :to="`/collections/${categorySlug}/${collection.slug}`"
    class="catalog-card group block"
  >
    <CatalogImage
      :src="collection.heroImage"
      :alt="collection.title"
      aspect="4/5"
      overlay
      container-class="shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
    />
    <div class="catalog-card-body text-center">
      <h3 class="catalog-card-title">{{ collection.title }}</h3>
      <span class="catalog-card-cta">Explore Products</span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Collection } from '~/data/catalog'

defineProps<{
  collection: Collection
  categorySlug: string
}>()
</script>
