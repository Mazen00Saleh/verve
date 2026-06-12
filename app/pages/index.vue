<template>
  <div>
    <HeroSection />
    <LazyPartnerLogos hydrate-on-visible />
    <LazyFeaturedCollections hydrate-on-visible />
    <LazyHomeCategories hydrate-on-visible />
    <LazyPremiumMaterials hydrate-on-visible />
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Verve | Luxury Wallpapers & Fabrics',
  meta: [
    { name: 'description', content: 'Discover Verve: the pinnacle of luxury wallpapers, fabrics, posters, and wallcoverings for sophisticated spaces.' },
  ],
})
</script>
