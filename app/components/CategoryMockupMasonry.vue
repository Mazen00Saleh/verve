<template>
  <div>
    <div
      class="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4 lg:gap-5"
      :class="columnClass"
    >
      <button
        v-for="(mockup, index) in visibleMockups"
        :key="mockup.id"
        type="button"
        class="group relative mb-3 block w-full break-inside-avoid rounded-sm bg-luxury-warm-beige/20 text-left sm:mb-4"
        :aria-label="alt ? `View ${alt} ${index + 1}` : `View image ${index + 1}`"
        @click="openModal(index)"
      >
        <NuxtImg
          :src="mockup.url"
          :alt="alt ? `${alt} ${index + 1}` : ''"
          :width="mockupPreset.width"
          :sizes="mockupPreset.sizes"
          fit="inside"
          format="webp"
          class="h-auto w-full rounded-sm transition-transform duration-500 group-hover:scale-[1.02]"
          :loading="index < initialBatch ? 'eager' : 'lazy'"
          decoding="async"
        />
        <div
          class="pointer-events-none absolute inset-0 rounded-sm bg-black/0 transition-colors duration-300 group-hover:bg-black/10"
          aria-hidden="true"
        />
      </button>
    </div>

    <div
      v-if="hasMore"
      ref="sentinelRef"
      class="flex items-center justify-center py-10"
      aria-hidden="true"
    >
      <span class="text-xs uppercase tracking-widest text-luxury-muted">Loading more…</span>
    </div>

    <Transition name="gallery-fade">
      <div
        v-if="activeIndex !== null"
        class="fixed inset-0 z-50 flex items-center justify-center bg-luxury-matte-black/90 p-4 backdrop-blur-md sm:p-6 md:p-10"
        role="dialog"
        aria-modal="true"
        :aria-label="alt ? `${alt} preview` : 'Image preview'"
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
            v-if="activeMockup"
            :src="modalImageSrc"
            :alt="alt ? `${alt} ${activeIndex! + 1}` : ''"
            class="max-h-[85vh] w-auto max-w-full object-contain"
            decoding="async"
          >
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { CategoryMockupImage } from '~/composables/useCategoryMockups'
import { PAGINATION } from '~/config/pagination'
import { getImagePreset } from '~/utils/imageSizes'

const props = defineProps<{
  mockups: CategoryMockupImage[]
  alt?: string
  columnClass?: string
}>()

const initialBatch = PAGINATION.galleryBatch
const mockupPreset = getImagePreset('mockup')
const visibleCount = ref(initialBatch)
const sentinelRef = ref<HTMLElement | null>(null)
const activeIndex = ref<number | null>(null)

const $img = useImage()

const visibleMockups = computed(() => props.mockups.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < props.mockups.length)

const activeMockup = computed(() =>
  activeIndex.value !== null ? props.mockups[activeIndex.value] ?? null : null,
)

const modalImageSrc = computed(() => {
  if (!activeMockup.value) {
    return ''
  }

  return $img(activeMockup.value.url, {
    width: 1600,
    quality: 100,
    format: 'webp',
  })
})

const canGoPrev = computed(() => activeIndex.value !== null && activeIndex.value > 0)
const canGoNext = computed(() =>
  activeIndex.value !== null && activeIndex.value < props.mockups.length - 1,
)

function loadMore() {
  if (!hasMore.value) {
    return
  }

  visibleCount.value = Math.min(visibleCount.value + initialBatch, props.mockups.length)
}

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
  if (activeIndex.value !== null && activeIndex.value < props.mockups.length - 1) {
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

watch(() => props.mockups, () => {
  visibleCount.value = initialBatch
  closeModal()
})

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (typeof IntersectionObserver === 'undefined') {
    visibleCount.value = props.mockups.length
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some(entry => entry.isIntersecting)) {
        loadMore()
      }
    },
    { rootMargin: '200px' },
  )

  watch(sentinelRef, (element) => {
    observer?.disconnect()

    if (element) {
      observer?.observe(element)
    }
  }, { immediate: true })

  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  observer?.disconnect()
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
