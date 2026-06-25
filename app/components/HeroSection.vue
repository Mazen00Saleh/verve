<template>
  <div class="relative w-full">
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
              <img
                :src="heroImageUrl(slide.leftImage, 1200)"
                alt=""
                aria-hidden="true"
                class="absolute inset-0 block h-full w-full object-cover object-center transition-transform duration-[8000ms] ease-out"
                :style="{
                  transform: currentSlide === index ? 'scale(1.05)' : 'scale(1.15)',
                }"
                :loading="index === 0 ? 'eager' : 'lazy'"
                :fetchpriority="index === 0 ? 'high' : 'auto'"
                decoding="async"
                width="1200"
              >
              <div class="absolute inset-0 bg-black/10" />
              <div class="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-luxury-ivory/60 to-transparent md:h-28" />
            </div>

            <div
              class="relative z-20 flex w-full flex-col justify-center bg-luxury-ivory px-8 py-16 text-left transition-all duration-1000 delay-300 sm:px-12 md:w-[40%] lg:w-[26%] lg:px-16"
              :style="{
                transform: currentSlide === index ? 'translateY(0)' : 'translateY(20px)',
                opacity: currentSlide === index ? '1' : '0',
              }"
            >
              <div class="flex min-h-[280px] flex-col justify-center space-y-6 sm:min-h-[300px]">
                <h2
                  class="line-clamp-3 min-h-[4.5rem] text-2xl uppercase leading-tight tracking-wide text-luxury-matte-black transition-all duration-700 delay-500 sm:min-h-[5.25rem] sm:text-3xl lg:min-h-[6rem] lg:text-4xl"
                  :style="{
                    transform: currentSlide === index ? 'translateY(0)' : 'translateY(15px)',
                    opacity: currentSlide === index ? '1' : '0',
                  }"
                >
                  {{ slide.title }}
                </h2>
                <p
                  class="line-clamp-4 min-h-[4.5rem] text-xs font-light leading-relaxed text-luxury-charcoal transition-all duration-700 delay-700 sm:min-h-[5rem] sm:text-sm"
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

            <div class="relative h-full min-w-0 flex-grow overflow-hidden">
              <img
                :src="heroImageUrl(slide.rightImage, 2400)"
                :alt="slide.title"
                class="absolute inset-0 block h-full w-full object-cover object-center transition-transform duration-[8000ms] ease-out"
                :style="{
                  transform: currentSlide === index ? 'scale(1)' : 'scale(1.1)',
                }"
                :loading="index === 0 ? 'eager' : 'lazy'"
                :fetchpriority="index === 0 ? 'high' : 'auto'"
                decoding="async"
                width="2400"
              >
              <div class="absolute inset-0 bg-black/[0.03]" />
              <div class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-luxury-ivory/70 via-luxury-ivory/15 to-transparent md:h-32" />
            </div>
          </div>
        </div>

        <button
          v-if="slides.length > 1"
          type="button"
          class="absolute left-4 top-1/2 z-30 -translate-y-1/2 p-2 text-white/90 transition-all duration-300 hover:scale-110 hover:text-white sm:left-6"
          aria-label="Previous slide"
          @click="prevSlide"
        >
          <Icon name="lucide:chevron-left" size="32" />
        </button>

        <button
          v-if="slides.length > 1"
          type="button"
          class="absolute right-4 top-1/2 z-30 -translate-y-1/2 p-2 text-white/90 transition-all duration-300 hover:scale-110 hover:text-white sm:right-6"
          aria-label="Next slide"
          @click="nextSlide"
        >
          <Icon name="lucide:chevron-right" size="32" />
        </button>

        <div v-if="slides.length > 1" class="absolute bottom-10 right-6 z-30 hidden items-center space-x-3 sm:flex md:bottom-12 md:right-12">
          <button
            v-for="(_, index) in slides"
            :key="index"
            type="button"
            :class="[
              'h-1.5 rounded-full transition-all duration-300',
              currentSlide === index ? 'w-6 bg-luxury-brass-light' : 'w-1.5 bg-white/70 hover:bg-white',
            ]"
            :aria-label="`Go to slide ${index + 1}`"
            @click="selectSlide(index)"
          />
        </div>

        <div
          class="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-28 bg-gradient-to-b from-transparent via-luxury-ivory/45 to-luxury-ivory sm:h-32 md:h-36"
          aria-hidden="true"
        />
      </template>
    </section>

    <div
      v-if="!pending && !errorMessage && slides.length"
      class="flex justify-center bg-luxury-ivory pt-10 pb-2 sm:pt-12 sm:pb-2 md:pt-16 md:pb-2"
      aria-hidden="true"
    >
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: slidesData, pending, error } = await usePublicHeroSlides()

const slides = computed(() => slidesData.value ?? [])
const errorMessage = computed(() => error.value?.message ?? null)

const $img = useImage()
const lcpImage = computed(() => slides.value[0]?.rightImage ?? null)

function heroImageUrl(src: string, width: number) {
  return $img(src, {
    width,
    quality: 100,
    format: 'webp',
  })
}

useHead({
  link: computed(() => {
    const src = lcpImage.value
    if (!src) {
      return []
    }

    return [{
      rel: 'preload',
      as: 'image',
      href: heroImageUrl(src, 2400),
      fetchpriority: 'high',
    }]
  }),
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
