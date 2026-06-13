<template>
  <div class="page-shell">
    <div class="page-container">
      <div class="page-back">
        <NuxtLink :to="`/collections/${category?.slug}/${collection?.slug}`" class="back-link group">
          <svg class="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Collection
        </NuxtLink>
      </div>

      <PageState
        :pending="pending"
        :error-message="errorMessage"
        :empty="!product"
        empty-title="Product not found"
        empty-message="This product may have been removed or is not yet available."
      >
        <template v-if="category && collection && product">
          <div class="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <div class="relative aspect-square w-full select-none border border-neutral-100 bg-luxury-warm-beige/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div
                class="relative h-full w-full cursor-zoom-in overflow-hidden"
                @mouseenter="isZooming = true"
                @mouseleave="isZooming = false"
                @mousemove="handleMouseMove"
              >
                <img
                  ref="mainImageRef"
                  :src="activeImage"
                  :alt="product.name"
                  class="h-full w-full object-cover transition-opacity duration-300"
                  loading="eager"
                  fetchpriority="high"
                  decoding="async"
                  width="800"
                  height="800"
                  @load="onMainImageLoad"
                >

                <div
                  v-if="isZooming"
                  class="pointer-events-none absolute border border-luxury-brass bg-black/10 shadow-[0_0_8px_rgba(0,0,0,0.1)] transition-transform duration-75"
                  :style="{
                    width: `${LENS_SIZE}px`,
                    height: `${LENS_SIZE}px`,
                    left: `${lensX}px`,
                    top: `${lensY}px`,
                  }"
                />
              </div>

              <div
                v-if="isZooming && zoomPanelStyle"
                class="absolute left-[105%] top-0 z-30 hidden h-[480px] w-[480px] overflow-hidden border border-neutral-200 bg-white shadow-2xl xl:block"
              >
                <img
                  :src="activeImage"
                  alt=""
                  class="pointer-events-none absolute max-w-none select-none"
                  :style="zoomPanelStyle"
                >
              </div>
            </div>

            <div class="space-y-8 lg:sticky lg:top-32 lg:space-y-10">
              <div>
                <h1 class="mb-1 font-serif text-3xl uppercase tracking-wider text-luxury-matte-black sm:text-4xl md:text-5xl">
                  {{ product.name }}
                </h1>
                <p class="font-sans text-xs uppercase tracking-widest text-luxury-muted">
                  {{ category.title }} · Verve
                </p>
              </div>

              <div v-if="variants.length > 1" class="space-y-4 border-t border-neutral-100 pt-4">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-semibold uppercase tracking-widest text-luxury-charcoal">
                    Variations
                  </span>
                  <span class="font-serif text-xs italic text-luxury-brass-contrast">
                    {{ selectedVariant.label }}
                  </span>
                </div>
                <div class="flex flex-wrap gap-3 sm:gap-4">
                  <button
                    v-for="(variant, idx) in variants"
                    :key="variant.id"
                    type="button"
                    :class="[
                      'relative h-16 w-16 overflow-hidden border transition-all duration-300 sm:h-20 sm:w-20',
                      selectedVariantIdx === idx ? 'border-neutral-900 ring-1 ring-neutral-900' : 'border-neutral-200 hover:border-neutral-400',
                    ]"
                    :title="variant.label"
                    @click="selectedVariantIdx = idx"
                  >
                    <img
                      :src="variant.image"
                      :alt="variant.label"
                      class="h-full w-full object-cover"
                    >
                  </button>
                </div>
              </div>

              <div class="py-2 font-mono text-xs uppercase tracking-widest text-luxury-charcoal">
                Reference:
                <span class="ml-2 font-sans font-semibold text-luxury-matte-black">
                  {{ product.sku }}
                </span>
              </div>

              <p
                v-if="product.description"
                class="border-t border-neutral-100 pt-4 text-sm font-light leading-relaxed text-luxury-charcoal"
              >
                {{ product.description }}
              </p>
            </div>
          </div>

          <div v-if="mockups.length" class="mt-16 border-t border-neutral-200 pt-12 sm:mt-20 sm:pt-16">
            <h3 class="mb-8 text-center text-xs font-semibold uppercase tracking-widest text-luxury-charcoal sm:mb-12">
              Room Inspirations
            </h3>
            <div
              class="mx-auto grid max-w-6xl grid-cols-1 items-end gap-6 sm:gap-8"
              :class="mockupGridClass"
            >
              <div
                v-for="(mockup, index) in mockups"
                :key="`${mockup}-${index}`"
                :class="mockupItemClass(index)"
              >
                <CatalogImage
                  :src="mockup"
                  :alt="`Room inspiration ${index + 1}`"
                  :aspect="mockupAspect(index)"
                  :overlay="false"
                />
              </div>
            </div>
          </div>
        </template>
      </PageState>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const categorySlug = route.params.category as string
const collectionSlug = route.params.collection as string
const productSlug = route.params.product as string

const { data: categories, pending, error } = await useCatalog()

const errorMessage = computed(() => error.value?.message ?? null)

const category = computed(() => categories.value?.find(item => item.slug === categorySlug))
const collection = computed(() =>
  category.value?.collections.find(item => item.slug === collectionSlug),
)
const product = computed(() =>
  collection.value?.products.find(item => item.sku.toLowerCase() === productSlug),
)

const variants = computed(() => {
  if (!product.value) {
    return []
  }

  const images = [product.value.image, ...product.value.secondaryImages].filter(Boolean)
  const uniqueImages = [...new Set(images)]

  return uniqueImages.map((image, index) => ({
    id: `${product.value!.id}-${index}`,
    image,
    label: index === 0 ? 'Primary' : `Variation ${index}`,
  }))
})

const selectedVariantIdx = ref(0)
const selectedVariant = computed(() => variants.value[selectedVariantIdx.value] ?? { label: 'Primary', image: '' })
const activeImage = computed(() => selectedVariant.value.image || product.value?.image || '')

const mockups = computed(() => product.value?.mockupImages ?? [])

const mockupGridClass = computed(() =>
  mockups.value.length === 1 ? 'md:grid-cols-1' : 'md:grid-cols-12',
)

function mockupItemClass(index: number) {
  if (mockups.value.length === 1) {
    return 'md:col-span-12'
  }

  return index === 0 ? 'md:col-span-5' : 'md:col-span-7'
}

function mockupAspect(index: number): '3/4' | '4/3' {
  if (mockups.value.length === 1) {
    return '4/3'
  }

  return index === 0 ? '3/4' : '4/3'
}

watch(product, () => {
  selectedVariantIdx.value = 0
})

watch([pending, categories], () => {
  if (!pending.value && categories.value) {
    if (!category.value) {
      throw createError({ statusCode: 404, statusMessage: 'Category not found' })
    }

    if (!collection.value) {
      throw createError({ statusCode: 404, statusMessage: 'Collection not found' })
    }

    if (!product.value) {
      throw createError({ statusCode: 404, statusMessage: 'Product not found' })
    }
  }
})

const LENS_SIZE = 180
const PANEL_SIZE = 480
const ZOOM_RATIO = PANEL_SIZE / LENS_SIZE

type CoverMetrics = {
  scale: number
  renderedW: number
  renderedH: number
  offsetX: number
  offsetY: number
  containerW: number
  containerH: number
}

const isZooming = ref(false)
const lensX = ref(0)
const lensY = ref(0)
const mainImageRef = ref<HTMLImageElement | null>(null)
const coverMetrics = ref<CoverMetrics | null>(null)

const zoomPanelStyle = computed(() => {
  const metrics = coverMetrics.value

  if (!metrics) {
    return null
  }

  const zoomW = metrics.renderedW * ZOOM_RATIO
  const zoomH = metrics.renderedH * ZOOM_RATIO
  const lensCenterX = lensX.value + LENS_SIZE / 2
  const lensCenterY = lensY.value + LENS_SIZE / 2
  const naturalX = (lensCenterX - metrics.offsetX) / metrics.scale
  const naturalY = (lensCenterY - metrics.offsetY) / metrics.scale
  const centerXInZoom = naturalX * metrics.scale * ZOOM_RATIO
  const centerYInZoom = naturalY * metrics.scale * ZOOM_RATIO

  return {
    width: `${zoomW}px`,
    height: `${zoomH}px`,
    left: `${PANEL_SIZE / 2 - centerXInZoom}px`,
    top: `${PANEL_SIZE / 2 - centerYInZoom}px`,
  }
})

function updateCoverMetrics() {
  const image = mainImageRef.value

  if (!image?.naturalWidth || !image.naturalHeight) {
    coverMetrics.value = null
    return
  }

  const { width, height } = image.getBoundingClientRect()
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
  const renderedW = image.naturalWidth * scale
  const renderedH = image.naturalHeight * scale

  coverMetrics.value = {
    scale,
    renderedW,
    renderedH,
    offsetX: (width - renderedW) / 2,
    offsetY: (height - renderedH) / 2,
    containerW: width,
    containerH: height,
  }
}

function onMainImageLoad() {
  updateCoverMetrics()
}

function handleMouseMove(event: MouseEvent) {
  if (!mainImageRef.value) {
    return
  }

  const { left, top, width, height } = mainImageRef.value.getBoundingClientRect()
  const pxX = event.clientX - left
  const pxY = event.clientY - top

  lensX.value = Math.max(0, Math.min(width - LENS_SIZE, pxX - LENS_SIZE / 2))
  lensY.value = Math.max(0, Math.min(height - LENS_SIZE, pxY - LENS_SIZE / 2))
}

watch(activeImage, () => {
  coverMetrics.value = null
})

watch(isZooming, (zooming) => {
  if (zooming) {
    updateCoverMetrics()
  }
})

useHead({
  title: computed(() =>
    product.value && collection.value
      ? `${product.value.name} | ${collection.value.title} | Verve Luxury Interiors`
      : 'Product | Verve Luxury Interiors',
  ),
  link: computed(() => {
    const href = activeImage.value
    if (!href) {
      return []
    }

    return [{ rel: 'preload', as: 'image', href, fetchpriority: 'high' }]
  }),
})
</script>
