<template>
  <NuxtLink
    :to="`/collections/${categorySlug}/${collection.slug}`"
    class="catalog-card group block"
  >
    <CatalogImage
      :src="collection.heroImage"
      :alt="collection.title"
      aspect="4/5"
      :priority="priority"
      size="card"
      overlay
      container-class="shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
    />
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Collection } from '~/types/catalog'

defineProps<{
  collection: Collection
  categorySlug: string
  priority?: boolean
}>()
</script>
