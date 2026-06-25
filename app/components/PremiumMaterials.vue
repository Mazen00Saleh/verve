<template>
  <section
    v-if="primaryImage"
    class="relative bg-luxury-warm-beige/20 py-10 sm:py-12 md:py-14"
  >
    <div class="page-container">
      <div class="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-10">
        <div class="order-2 mx-auto mb-12 w-full max-w-sm sm:max-w-md lg:order-1 lg:mx-0 lg:mb-16 lg:max-w-[22rem] xl:max-w-md">
          <div class="relative">
            <CatalogImage
              :src="primaryImage"
              alt="Premium materials and craftsmanship"
              aspect="4/5"
              :overlay="false"
              :hover-scale="false"
              size="feature"
              priority
              container-class="relative z-0"
            />
            <div
              v-if="secondaryImage"
              class="absolute -bottom-6 -right-4 z-20 hidden aspect-[4/5] w-2/3 overflow-hidden border-4 border-luxury-ivory shadow-lg md:block lg:-bottom-8 lg:-right-5"
            >
              <CatalogImage
                :src="secondaryImage"
                alt="Texture details"
                aspect="4/5"
                :overlay="false"
                :hover-scale="false"
                size="accent"
              />
            </div>
          </div>
        </div>

        <div class="order-1 lg:order-2">
          <span class="section-eyebrow">Uncompromising Quality</span>
          <h2 class="section-title mb-4 text-2xl sm:mb-5 sm:text-3xl md:text-4xl">
            Premium Materials &amp; Masterful Craftsmanship
          </h2>
          <p class="section-intro mb-4 text-sm sm:mb-5 sm:text-base">
            Every roll of wallpaper and yard of fabric we produce reflects our dedication to excellence. We source only the finest raw materials, from pure silks and natural linens to sustainable, heavy-weight paper stocks.
          </p>
          <p class="section-intro mb-6 text-sm sm:mb-7 sm:text-base">
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
const props = defineProps<{
  images: string[]
}>()

const primaryImage = computed(() => props.images[0] ?? '')
const secondaryImage = computed(() => props.images[1] ?? '')
</script>
