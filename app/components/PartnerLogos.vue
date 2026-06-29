<template>
  <section class="relative overflow-hidden border-b border-t border-luxury-warm-beige bg-luxury-ivory py-10 md:py-12">
    <div class="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-32 bg-gradient-to-r from-luxury-ivory to-transparent" />
    <div class="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-32 bg-gradient-to-l from-luxury-ivory to-transparent" />

    <div v-if="brands?.length" class="relative">
      <button
        type="button"
        class="absolute left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white/95 text-luxury-charcoal shadow-sm transition-colors hover:border-luxury-brass hover:text-luxury-matte-black md:left-4"
        aria-label="Scroll brands left"
        @click="scrollBy(-1)"
      >
        <Icon name="lucide:chevron-left" size="20" />
      </button>

      <button
        type="button"
        class="absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white/95 text-luxury-charcoal shadow-sm transition-colors hover:border-luxury-brass hover:text-luxury-matte-black md:right-4"
        aria-label="Scroll brands right"
        @click="scrollBy(1)"
      >
        <Icon name="lucide:chevron-right" size="20" />
      </button>

      <div class="overflow-hidden">
        <div
          ref="trackRef"
          class="flex w-max will-change-transform"
          :style="{ transform: `translateX(${offset}px)` }"
        >
          <div v-for="n in 2" :key="n" class="flex items-center gap-12 px-8 md:gap-16">
            <NuxtImg
              v-for="(brand, i) in brands"
              :key="`${n}-${brand.id}-${i}`"
              :src="brand.src"
              :alt="brand.name"
              width="352"
              sizes="176px"
              fit="inside"
              format="webp"
              quality="85"
              class="h-10 w-auto max-w-[9.5rem] shrink-0 object-contain md:h-12 md:max-w-[11rem]"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data: brands } = await usePublicBrandLogos()

const trackRef = ref<HTMLElement | null>(null)
const offset = ref(0)
const singleSetWidth = ref(0)

const SCROLL_DURATION_MS = 200_000
const MANUAL_SCROLL_PX = 280

let rafId: number | null = null
let lastTimestamp: number | null = null
let resizeObserver: ResizeObserver | null = null

function measureTrack() {
  if (!trackRef.value) {
    return
  }

  singleSetWidth.value = trackRef.value.scrollWidth / 2
  normalizeOffset()
}

function normalizeOffset() {
  if (singleSetWidth.value <= 0) {
    return
  }

  while (offset.value <= -singleSetWidth.value) {
    offset.value += singleSetWidth.value
  }

  while (offset.value > 0) {
    offset.value -= singleSetWidth.value
  }
}

function tick(timestamp: number) {
  if (lastTimestamp === null) {
    lastTimestamp = timestamp
  }

  const delta = timestamp - lastTimestamp
  lastTimestamp = timestamp

  if (singleSetWidth.value > 0) {
    const speed = singleSetWidth.value / SCROLL_DURATION_MS
    offset.value -= speed * delta
    normalizeOffset()
  }

  rafId = requestAnimationFrame(tick)
}

function scrollBy(direction: -1 | 1) {
  offset.value -= direction * MANUAL_SCROLL_PX
  normalizeOffset()
}

watch(brands, async () => {
  await nextTick()
  measureTrack()
}, { immediate: true })

onMounted(() => {
  measureTrack()
  rafId = requestAnimationFrame(tick)

  if (trackRef.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      measureTrack()
    })
    resizeObserver.observe(trackRef.value)
  }

  window.addEventListener('resize', measureTrack, { passive: true })
})

onUnmounted(() => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
  }

  resizeObserver?.disconnect()
  window.removeEventListener('resize', measureTrack)
})
</script>
