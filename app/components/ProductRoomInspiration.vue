<template>
  <section
    v-if="images.length"
    class="mt-16 border-t border-neutral-100 pt-12 sm:mt-20 sm:pt-16"
  >
    <div class="mb-8 text-center sm:mb-10">
      <h2 class="section-eyebrow">Room Inspiration</h2>
    </div>

    <div class="mx-auto flex max-w-6xl flex-wrap items-start justify-center gap-3 sm:gap-4 lg:gap-5">
      <button
        v-for="(url, index) in images"
        :key="`${url}-${index}`"
        type="button"
        class="group relative w-[calc(50%-0.375rem)] rounded-sm bg-luxury-warm-beige/20 text-left sm:w-[calc(33.333%-0.67rem)] lg:w-[calc(25%-0.9375rem)]"
        :aria-label="`View room inspiration ${index + 1} for ${productName}`"
        @click="openModal(index)"
      >
        <CatalogImage
          :src="url"
          :alt="`${productName} room inspiration ${index + 1}`"
          aspect="auto"
          :overlay="false"
          :hover-scale="true"
          size="mockup"
          container-class="rounded-sm"
          image-class="rounded-sm"
        />
      </button>
    </div>

    <Transition name="gallery-fade">
      <div
        v-if="activeIndex !== null"
        class="fixed inset-0 z-50 flex items-center justify-center bg-luxury-matte-black/90 p-4 backdrop-blur-md sm:p-6 md:p-10"
        role="dialog"
        aria-modal="true"
        :aria-label="`Room inspiration preview for ${productName}`"
        @click.self="closeModal"
      >
        <button
          type="button"
          class="absolute right-4 top-4 z-10 flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-luxury-brass-light transition-colors hover:text-white sm:right-6 sm:top-6"
          aria-label="Close preview"
          @click="closeModal"
        >
          <span>Close</span>
          <Icon name="lucide:x" size="16" />
        </button>

        <button
          v-if="canGoPrev"
          type="button"
          class="absolute left-2 top-1/2 z-10 -translate-y-1/2 p-2 text-white/90 transition-colors hover:text-white sm:left-4"
          aria-label="Previous image"
          @click.stop="goPrev"
        >
          <Icon name="lucide:chevron-left" size="32" />
        </button>

        <button
          v-if="canGoNext"
          type="button"
          class="absolute right-2 top-1/2 z-10 -translate-y-1/2 p-2 text-white/90 transition-colors hover:text-white sm:right-4"
          aria-label="Next image"
          @click.stop="goNext"
        >
          <Icon name="lucide:chevron-right" size="32" />
        </button>

        <div class="relative flex max-h-[85vh] w-full max-w-5xl items-center justify-center">
          <img
            v-if="activeImage"
            :src="modalImageSrc"
            :alt="`${productName} room inspiration ${activeIndex! + 1}`"
            class="max-h-[85vh] w-auto max-w-full object-contain"
            decoding="async"
          >
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  images: string[]
  productName: string
}>()

const activeIndex = ref<number | null>(null)
const $img = useImage()

const activeImage = computed(() =>
  activeIndex.value !== null ? props.images[activeIndex.value] ?? null : null,
)

const modalImageSrc = computed(() => {
  if (!activeImage.value) {
    return ''
  }

  return $img(activeImage.value, {
    width: 1600,
    quality: 100,
    format: 'webp',
  })
})

const canGoPrev = computed(() => activeIndex.value !== null && activeIndex.value > 0)
const canGoNext = computed(() =>
  activeIndex.value !== null && activeIndex.value < props.images.length - 1,
)

function openModal(index: number) {
  activeIndex.value = index
  setBodyScrollLocked(true)
}

function closeModal() {
  activeIndex.value = null
  setBodyScrollLocked(false)
}

function goPrev() {
  if (activeIndex.value !== null && activeIndex.value > 0) {
    activeIndex.value -= 1
  }
}

function goNext() {
  if (activeIndex.value !== null && activeIndex.value < props.images.length - 1) {
    activeIndex.value += 1
  }
}

function setBodyScrollLocked(locked: boolean) {
  if (typeof document === 'undefined') {
    return
  }

  document.body.classList.toggle('overflow-hidden', locked)
}

function onKeydown(event: KeyboardEvent) {
  if (activeIndex.value === null) {
    return
  }

  if (event.key === 'Escape') {
    closeModal()
  } else if (event.key === 'ArrowLeft') {
    goPrev()
  } else if (event.key === 'ArrowRight') {
    goNext()
  }
}

watch(() => props.images, () => {
  closeModal()
})

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  setBodyScrollLocked(false)
})
</script>

<style scoped>
.gallery-fade-enter-active,
.gallery-fade-leave-active {
  transition: opacity 0.3s ease;
}

.gallery-fade-enter-from,
.gallery-fade-leave-to {
  opacity: 0;
}
</style>
