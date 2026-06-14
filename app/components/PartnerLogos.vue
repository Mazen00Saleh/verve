<template>
  <section class="relative overflow-hidden border-b border-t border-luxury-warm-beige bg-luxury-ivory py-10 md:py-12">
    <div class="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-32 bg-gradient-to-r from-luxury-ivory to-transparent" />
    <div class="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-32 bg-gradient-to-l from-luxury-ivory to-transparent" />

    <div class="flex w-max animate-scroll">
      <div v-for="n in 2" :key="n" class="flex items-center gap-12 px-8 md:gap-16">
        <img
          v-for="(brand, i) in brands"
          :key="`${n}-${brand.slug}-${i}`"
          :src="brand.src"
          :alt="brand.name"
          :width="brand.width"
          :height="brand.height"
          class="h-10 w-auto max-w-[9.5rem] shrink-0 object-contain md:h-12 md:max-w-[11rem]"
          loading="lazy"
          decoding="async"
        >
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import brandLogos from '~/data/brand-logos.json'

const brands = brandLogos
</script>
