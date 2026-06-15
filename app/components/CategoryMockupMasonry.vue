<template>
  <div
    class="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4 lg:gap-5"
    :class="columnClass"
  >
    <NuxtImg
      v-for="(mockup, index) in mockups"
      :key="`${mockup.url}-${index}`"
      :src="mockup.url"
      :alt="alt ? `${alt} ${index + 1}` : ''"
      width="800"
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      fit="inside"
      format="webp"
      quality="80"
      class="mb-3 h-auto w-full break-inside-avoid rounded-sm sm:mb-4"
      loading="lazy"
      decoding="async"
    />
  </div>
</template>

<script setup lang="ts">
import type { CategoryMockupImage } from '~/composables/useCategoryMockups'

defineProps<{
  mockups: CategoryMockupImage[]
  alt?: string
  columnClass?: string
}>()
</script>
