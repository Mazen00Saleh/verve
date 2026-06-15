<template>
  <button
    type="button"
    class="catalog-card group block w-full min-w-0 text-left"
    @click="$emit('open', brochure)"
  >
    <CatalogImage
      :src="brochure.coverImage"
      :alt="brochure.title"
      aspect="3/4"
      :overlay="false"
      size="card"
      container-class="shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-500 sm:group-hover:-translate-y-1 sm:group-hover:shadow-[0_12px_36px_rgba(0,0,0,0.12)]"
    />
    <div class="catalog-card-body">
      <h3 class="catalog-card-title">
        {{ brochure.title }}
      </h3>
    </div>
  </button>
</template>

<script setup lang="ts">
import type { PublicBrochure } from '~/types/catalog'

defineProps<{
  brochure: PublicBrochure
}>()

defineEmits<{
  open: [brochure: PublicBrochure]
}>()
</script>
