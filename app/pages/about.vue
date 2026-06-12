<template>
  <div class="page-shell">
    <div class="page-container py-8 sm:py-12 md:py-16">
      <div class="max-w-4xl mx-auto text-center mb-24">
        <span class="text-luxury-brass uppercase tracking-[0.3em] text-xs font-semibold mb-6 block">Our Heritage</span>
        <h1 class="text-5xl md:text-7xl font-serif text-luxury-matte-black mb-8 leading-tight">A Legacy of <span class="italic font-light">Elegance</span></h1>
        <p class="text-luxury-charcoal text-lg font-light leading-relaxed">
           Today, Verve is recognized as one of the largest suppliers of furnishing fabrics and wallpapers in the region. Our philosophy remains unchanged: to constantly evolve and innovate while preserving the core values of quality, creativity, and integrity that have defined us since 2006. We are not just supplying materials; we are crafting experiences that shape the spaces where life happens.
        </p>
      </div>

      <div class="mb-24 grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
        <div class="overflow-hidden">
          <CatalogImage
            :src="heroImage"
            alt="Design Studio"
            aspect="4/5"
            :overlay="false"
            :hover-scale="false"
            image-class="grayscale-[20%]"
          />
        </div>
        <div class="space-y-6">
          <h2 class="text-3xl font-serif text-luxury-matte-black">What We Do</h2>
          <p class="text-luxury-charcoal font-light leading-relaxed">
            Take a step through the gateway to inspired interiors. By offering a style-packed diversity of fabrics for curtains, blinds, upholstery and wallcoverings – not to mention a range of truly stunning wallpapers – Verve Group can always support and assist with enticing new ideas for home interiors. So if you’re stuck for inspiration, visit our showroom and get the look, touch and feel of our endless fabric wallpaper, wall-covering collections!
          </p>
          <h2 class="text-3xl font-serif text-luxury-matte-black">What We Offer</h2>
          <p class="text-luxury-charcoal font-light leading-relaxed">
            A top notch and super elite fabric provider offer an Exquisite taste, elevated quality and a refined sense of luxury – these are the principals on which verve was founded. Using modern and classic references as a starting point but always infusing them with an elegant, contemporary touch, ‘verve Group’ describes the ebullience of our past endeavors. It sketches the outline of our future. A collective through more than ten quintessentially luxury interior brands, We aim and succeed in providing a variety of Lavish, Opulent and exquisite luxury brands that are specialized in Fabric, Wall-coverings and Wallpaper to match different styles and tastes giving you a feel of your perfect home!  
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: categories } = await useCatalog()

const heroImage = computed(() => categories.value?.[0]?.image ?? '')

useHead({
  title: 'About | Verve Luxury Interiors',
})
</script>
