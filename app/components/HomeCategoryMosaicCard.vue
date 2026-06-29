<template>
  <NuxtLink
    :to="to"
    class="group relative block h-full w-full min-h-[180px] overflow-hidden bg-neutral-200"
    :class="$attrs.class"
  >
    <CatalogImage
      v-if="category.image"
      :src="category.image"
      :alt="label"
      aspect="auto"
      object-fit="cover"
      :overlay="false"
      :hover-scale="true"
      :priority="priority"
      size="mosaic"
      container-class="absolute inset-0 h-full w-full"
      image-class="absolute inset-0 h-full w-full"
    />
    <div
      v-else
      class="absolute inset-0 bg-luxury-warm-beige/40"
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

    <div class="absolute bottom-4 left-4 z-10 flex items-center gap-3 md:bottom-5 md:left-5 lg:bottom-6 lg:left-6">
      <span class="h-7 w-px shrink-0 bg-white md:h-8" aria-hidden="true" />
      <span class="font-sans text-sm font-medium tracking-wide text-white drop-shadow-sm md:text-base lg:text-lg">
        {{ label }}
      </span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Category } from '~/types/catalog'

const props = defineProps<{
  category: Category
  label: string
  to?: string
  priority?: boolean
}>()

const to = computed(() => props.to ?? `/collections/${props.category.slug}`)

defineOptions({
  inheritAttrs: false,
})
</script>
