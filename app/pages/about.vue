<template>
  <div class="page-shell">
    <div class="page-container py-8 sm:py-12 md:py-16">
      <div class="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
        <span class="section-eyebrow">Our Heritage</span>
        <h1 class="section-title">
          A Legacy of <span class="italic font-light">Elegance</span>
        </h1>
        <div class="section-title-divider" />
      </div>

      <div class="mx-auto mb-12 max-w-6xl sm:mb-16">
        <picture class="block w-full">
          <source
            srcset="/images/about-hero.webp 4500w"
            sizes="(min-width: 1152px) 1152px, 100vw"
            type="image/webp"
          >
          <img
            src="/images/about-hero.jpg"
            srcset="/images/about-hero.jpg 4500w"
            sizes="(min-width: 1152px) 1152px, 100vw"
            alt="Verve Exclusive Home Collection"
            class="h-auto w-full"
            width="4500"
            height="2130"
            loading="eager"
            fetchpriority="high"
            decoding="async"
          >
        </picture>
      </div>

      <p class="section-intro mx-auto mb-14 max-w-3xl text-center text-sm sm:mb-16 sm:text-base">
        Today, Verve is recognized as one of the largest suppliers of furnishing fabrics and wallpapers in the region. Our philosophy remains unchanged: to constantly evolve and innovate while preserving the core values of quality, creativity, and integrity that have defined us since 2006. We are not just supplying materials; we are crafting experiences that shape the spaces where life happens.
      </p>

      <div class="mx-auto grid max-w-5xl grid-cols-1 gap-12 md:grid-cols-2 md:gap-x-16 md:gap-y-0">
        <article class="border-t border-neutral-200 pt-8">
          <h2 class="mb-4 font-serif text-2xl text-luxury-matte-black sm:text-3xl">
            What We Do
          </h2>
          <p class="text-sm font-light leading-relaxed text-luxury-charcoal sm:text-base">
            Take a step through the gateway to inspired interiors. By offering a style-packed diversity of fabrics for curtains, blinds, upholstery and wallcoverings – not to mention a range of truly stunning wallpapers – Verve Group can always support and assist with enticing new ideas for home interiors. So if you’re stuck for inspiration, visit our showroom and get the look, touch and feel of our endless fabric wallpaper, wall-covering collections!
          </p>
        </article>

        <article class="border-t border-neutral-200 pt-8">
          <h2 class="mb-4 font-serif text-2xl text-luxury-matte-black sm:text-3xl">
            What We Offer
          </h2>
          <p class="text-sm font-light leading-relaxed text-luxury-charcoal sm:text-base">
            A top notch and super elite fabric provider offer an Exquisite taste, elevated quality and a refined sense of luxury – these are the principals on which verve was founded. Using modern and classic references as a starting point but always infusing them with an elegant, contemporary touch, ‘verve Group’ describes the ebullience of our past endeavors. It sketches the outline of our future. A collective through more than ten quintessentially luxury interior brands, We aim and succeed in providing a variety of Lavish, Opulent and exquisite luxury brands that are specialized in Fabric, Wall-coverings and Wallpaper to match different styles and tastes giving you a feel of your perfect home!
          </p>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'About | Verve Luxury Interiors',
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: '/images/about-hero.webp',
      type: 'image/webp',
      imagesrcset: '/images/about-hero.webp 4500w',
      imagesizes: '(min-width: 1152px) 1152px, 100vw',
    },
  ],
})
</script>
