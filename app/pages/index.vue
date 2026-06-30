<template>
  <div class="-mt-px">
    <h1 class="sr-only">Verve | Luxury Wallpapers &amp; Fabrics</h1>
    <HeroSection />
    <HomeCategories />
    <LazyPremiumMaterials hydrate-on-visible />
    <LazyPartnerLogos hydrate-on-visible />
  </div>
</template>

<script setup lang="ts">
const { public: { siteUrl } } = useRuntimeConfig()

usePageSeo({
  title: 'Verve | Luxury Wallpapers & Fabrics',
  description: 'Discover Verve: the pinnacle of luxury wallpapers, fabrics, posters, and wallcoverings for sophisticated spaces.',
  path: '/',
  jsonLd: computed(() => [
    buildOrganizationJsonLd(siteUrl),
    buildWebSiteJsonLd(siteUrl),
  ]),
})
</script>
