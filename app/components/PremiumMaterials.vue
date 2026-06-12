<template>
  <section class="relative bg-luxury-warm-beige/20 py-16 sm:py-20 md:py-24">
    <div class="page-container">
      <div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div class="relative order-2 lg:order-1">
          <CatalogImage
            :src="primaryImage"
            alt="Premium materials and craftsmanship"
            aspect="4/5"
            :overlay="false"
            :hover-scale="false"
          />
          <div
            v-if="secondaryImage"
            class="absolute -bottom-6 -right-4 hidden aspect-square w-2/3 overflow-hidden border-8 border-luxury-ivory md:block lg:-bottom-8 lg:-right-8"
          >
            <CatalogImage
              :src="secondaryImage"
              alt="Texture details"
              aspect="square"
              :overlay="false"
              :hover-scale="false"
            />
          </div>
        </div>

        <div class="order-1 lg:order-2">
          <span class="section-eyebrow">Uncompromising Quality</span>
          <h2 class="section-title mb-6 sm:mb-8">
            Premium Materials &amp; Masterful Craftsmanship
          </h2>
          <p class="section-intro mb-5 text-base sm:mb-6 sm:text-lg">
            Every roll of wallpaper and yard of fabric we produce reflects our dedication to excellence. We source only the finest raw materials, from pure silks and natural linens to sustainable, heavy-weight paper stocks.
          </p>
          <p class="section-intro mb-8 text-base sm:mb-10 sm:text-lg">
            Our artisans employ time-honored techniques alongside cutting-edge technology to create textures that demand to be touched and colors that captivate the eye.
          </p>
          <NuxtLink to="/about" class="btn-outline">
            Discover Our Story
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data: categories } = await useCatalog()

const catalogImages = computed(() => {
  if (!categories.value?.length) {
    return []
  }

  const images: string[] = []

  for (const category of categories.value) {
    if (category.image) {
      images.push(category.image)
    }

    for (const collection of category.collections) {
      if (collection.heroImage) {
        images.push(collection.heroImage)
      }

      for (const product of collection.products) {
        if (product.image) {
          images.push(product.image)
        }
      }
    }
  }

  return images
})

const primaryImage = computed(() => catalogImages.value[0] ?? '')
const secondaryImage = computed(() => catalogImages.value[1] ?? '')
</script>
