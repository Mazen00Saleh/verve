<template>
  <NuxtLink
    :to="`/collections/${categorySlug}/${collectionSlug}/${product.sku.toLowerCase()}`"
    class="catalog-card group block"
  >
    <div class="relative">
    <CatalogImage
      :src="product.image"
      :alt="product.sku"
      aspect="square"
      :priority="priority"
      size="card"
        container-class="shadow-[0_4px_20px_rgba(0,0,0,0.04)] bg-luxury-warm-beige/10"
        hover-scale
      />
      <div class="absolute inset-0 flex flex-col items-center justify-center bg-luxury-matte-black/40 p-6 text-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <span class="border border-white/60 px-5 py-2.5 text-[11px] uppercase tracking-widest text-white transition-colors duration-300 hover:bg-white hover:text-luxury-matte-black">
          View Details
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Product } from '~/types/catalog'

defineProps<{
  product: Product
  categorySlug: string
  collectionSlug: string
  priority?: boolean
}>()
</script>
