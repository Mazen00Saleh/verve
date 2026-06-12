<template>
  <section class="relative h-[70vh] min-h-[520px] w-full overflow-hidden bg-luxury-matte-black sm:h-[75vh] lg:h-[80vh]">
    <PageState
      v-if="pending"
      :pending="true"
      loading-text="Loading hero..."
      wrapper-class="flex h-full items-center justify-center"
    />

    <PageState
      v-else-if="errorMessage"
      :error-message="errorMessage"
      wrapper-class="flex h-full items-center justify-center px-6"
    />

    <template v-else-if="slides.length">
      <div class="relative h-full w-full">
        <div
          v-for="(slide, index) in slides"
          :key="slide.id"
          :class="[
            'absolute inset-0 flex h-full w-full flex-row items-stretch transition-opacity duration-1000 ease-in-out',
            currentSlide === index ? 'pointer-events-auto z-10 opacity-100' : 'pointer-events-none z-0 opacity-0',
          ]"
        >
          <div class="relative hidden h-full w-[22%] overflow-hidden lg:block">
            <div
              class="h-full w-full bg-cover bg-center transition-transform duration-[8000ms] ease-out"
              :style="{
                backgroundImage: `url(${slide.leftImage})`,
                transform: currentSlide === index ? 'scale(1.05)' : 'scale(1.15)',
              }"
            />
            <div class="absolute inset-0 bg-black/10" />
          </div>

          <div
            class="relative z-20 flex w-full flex-col justify-center bg-luxury-ivory px-6 py-12 text-left transition-all duration-1000 delay-300 sm:px-10 md:w-[40%] md:py-16 lg:w-[26%] lg:px-16"
            :style="{
              transform: currentSlide === index ? 'translateY(0)' : 'translateY(20px)',
              opacity: currentSlide === index ? '1' : '0',
            }"
          >
            <div class="space-y-5 sm:space-y-6">
              <h2
                class="font-serif text-3xl uppercase leading-tight tracking-wide text-luxury-matte-black transition-all duration-700 delay-500 sm:text-4xl lg:text-5xl"
                :style="{
                  transform: currentSlide === index ? 'translateY(0)' : 'translateY(15px)',
                  opacity: currentSlide === index ? '1' : '0',
                }"
              >
                {{ slide.title }}
              </h2>
              <p
                class="text-xs font-light leading-relaxed text-luxury-charcoal transition-all duration-700 delay-700 sm:text-sm"
                :style="{
                  transform: currentSlide === index ? 'translateY(0)' : 'translateY(15px)',
                  opacity: currentSlide === index ? '1' : '0',
                }"
              >
                {{ slide.description }}
              </p>
              <NuxtLink
                :to="slide.link"
                class="btn-outline inline-block transition-all duration-700 delay-1000"
                :style="{
                  transform: currentSlide === index ? 'translateY(0)' : 'translateY(15px)',
                  opacity: currentSlide === index ? '1' : '0',
                }"
              >
                {{ slide.ctaLabel }}
              </NuxtLink>
            </div>
          </div>

          <div class="relative h-full flex-grow overflow-hidden">
            <div
              class="h-full w-full bg-cover bg-center transition-transform duration-[8000ms] ease-out"
              :style="{
                backgroundImage: `url(${slide.rightImage})`,
                transform: currentSlide === index ? 'scale(1)' : 'scale(1.1)',
              }"
            />
            <div class="absolute inset-0 bg-black/[0.03]" />
          </div>
        </div>
      </div>

      <button
        v-if="slides.length > 1"
        type="button"
        class="absolute left-4 top-1/2 z-30 -translate-y-1/2 p-2 text-white/50 transition-all duration-300 hover:scale-110 hover:text-white sm:left-6"
        aria-label="Previous slide"
        @click="prevSlide"
      >
        <Icon name="lucide:chevron-left" size="32" />
      </button>

      <button
        v-if="slides.length > 1"
        type="button"
        class="absolute right-4 top-1/2 z-30 -translate-y-1/2 p-2 text-white/50 transition-all duration-300 hover:scale-110 hover:text-white sm:right-6"
        aria-label="Next slide"
        @click="nextSlide"
      >
        <Icon name="lucide:chevron-right" size="32" />
      </button>

      <div v-if="slides.length > 1" class="absolute bottom-6 right-6 z-30 hidden items-center space-x-3 sm:flex md:bottom-8 md:right-12">
        <button
          v-for="(_, index) in slides"
          :key="index"
          type="button"
          :class="[
            'h-1.5 rounded-full transition-all duration-300',
            currentSlide === index ? 'w-6 bg-luxury-brass' : 'w-1.5 bg-white/40 hover:bg-white/70',
          ]"
          :aria-label="`Go to slide ${index + 1}`"
          @click="selectSlide(index)"
        />
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import type { PublicHeroSlide } from '~/composables/usePublicHeroSlides'

const { data: cmsSlides, pending: cmsPending, error: cmsError } = await usePublicHeroSlides()
const { data: categories, pending: catalogPending, error: catalogError } = await useCatalog()

const pending = computed(() => cmsPending.value || catalogPending.value)
const errorMessage = computed(() => cmsError.value?.message ?? catalogError.value?.message ?? null)

const slides = computed<PublicHeroSlide[]>(() => {
  if (cmsSlides.value?.length) {
    return cmsSlides.value
  }

  if (!categories.value?.length) {
    return []
  }

  return getHeroSlides(categories.value, 3).map((slide, index) => ({
    id: `catalog-fallback-${index}`,
    title: slide.title,
    description: slide.description,
    leftImage: slide.leftImage,
    rightImage: slide.rightImage,
    link: slide.link,
    ctaLabel: 'Explore Collection',
  }))
})

const currentSlide = ref(0)
let autoplayTimer: ReturnType<typeof setInterval> | null = null

const startAutoplay = () => {
  if (import.meta.server) {
    return
  }

  stopAutoplay()

  if (slides.value.length <= 1) {
    return
  }

  autoplayTimer = setInterval(() => {
    nextSlide()
  }, 8000)
}

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

const nextSlide = () => {
  if (!slides.value.length) {
    return
  }

  currentSlide.value = (currentSlide.value + 1) % slides.value.length
}

const prevSlide = () => {
  if (!slides.value.length) {
    return
  }

  currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length
}

const selectSlide = (index: number) => {
  currentSlide.value = index
  startAutoplay()
}

watch(slides, (value) => {
  currentSlide.value = 0

  if (import.meta.client) {
    if (value.length > 1) {
      startAutoplay()
    } else {
      stopAutoplay()
    }
  }
}, { immediate: true })

onMounted(() => {
  if (slides.value.length > 1) {
    startAutoplay()
  }
})

onUnmounted(() => {
  stopAutoplay()
})
</script>
