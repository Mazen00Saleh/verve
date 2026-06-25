<template>
  <div class="-mt-px">
    <HeroSection />
    <HomeCategories />
    <LazyPremiumMaterials :images="premiumImages" hydrate-on-visible />
    <LazyPartnerLogos hydrate-on-visible />
  </div>
</template>

<script setup lang="ts">
const { data: premiumMaterialImages } = await usePremiumMaterialImages()

const premiumImages = computed(() => premiumMaterialImages.value ?? [])

useHead({
  title: 'Verve | Luxury Wallpapers & Fabrics',
  meta: [
    { name: 'description', content: 'Discover Verve: the pinnacle of luxury wallpapers, fabrics, posters, and wallcoverings for sophisticated spaces.' },
  ],
})
</script>
