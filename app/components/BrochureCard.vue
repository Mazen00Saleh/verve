<template>
  <button
    type="button"
    class="catalog-card group relative block w-full min-w-0 overflow-hidden text-left"
    @click="$emit('open', brochure)"
  >
    <CatalogImage
      :src="brochure.coverImage"
      :alt="brochure.title"
      aspect="3/4"
      :overlay="false"
      :hover-scale="true"
      size="card"
      container-class="shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-500 sm:group-hover:-translate-y-1 sm:group-hover:shadow-[0_12px_36px_rgba(0,0,0,0.12)]"
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
        {{ brochure.title }}
      </span>
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
