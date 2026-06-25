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
                  :src="mainImageSrc"
                  :alt="product.sku"
                  class="h-full w-full object-cover transition-opacity duration-300"
                  loading="eager"
                  fetchpriority="high"
                  decoding="async"
                  width="1200"
                  height="1200"
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

            </div>

            <div class="space-y-8 lg:sticky lg:top-32 lg:space-y-10">
              <div v-if="variants.length > 1" class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-semibold uppercase tracking-widest text-luxury-charcoal">
                    Variations
                  </span>
                  <span class="text-xs italic text-luxury-brass-contrast">
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
                    <CatalogImage
                      :src="variant.image"
                      :alt="variant.label"
                      aspect="square"
                      :overlay="false"
                      :hover-scale="false"
                      size="thumbnail"
                      container-class="h-full w-full"
                    />
                  </button>
                </div>
              </div>

              <div
                v-if="isZooming && zoomPanelStyle"
                class="relative hidden h-[480px] w-[480px] overflow-hidden border border-neutral-200 bg-white shadow-2xl xl:block"
              >
                <img
                  :src="zoomImageSrc"
                  alt=""
                  class="pointer-events-none absolute max-w-none select-none"
                  :style="zoomPanelStyle"
                >
              </div>

              <p
                v-if="product.description"
                class="border-t border-neutral-100 pt-4 text-sm font-light leading-relaxed text-luxury-charcoal"
              >
                {{ product.description }}
              </p>
            </div>
          </div>

          <ProductRoomInspiration
            :images="product.mockupImages"
            :product-name="product.name"
          />
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

const { data: detail, pending, error } = await useProductDetail(categorySlug, collectionSlug, productSlug)

if (detail.value === null) {
  throw createError({ statusCode: 404, statusMessage: 'Product not found' })
}

const errorMessage = computed(() => error.value?.message ?? null)
const category = computed(() => detail.value?.category ?? null)
const collection = computed(() => detail.value?.collection ?? null)
const product = computed(() => detail.value?.product ?? null)

const $img = useImage()

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
const mainImageSrc = computed(() =>
  activeImage.value
    ? $img(activeImage.value, { width: 1200, quality: 100, format: 'webp' })
    : '',
)
const zoomImageSrc = computed(() =>
  activeImage.value
    ? $img(activeImage.value, { width: 1920, quality: 100, format: 'webp' })
    : '',
)

watch(product, () => {
  selectedVariantIdx.value = 0
})

const LENS_SIZE = 260
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
    product.value
      ? `${product.value.sku} | Verve Luxury Interiors`
      : 'Product | Verve Luxury Interiors',
  ),
  link: computed(() => {
    const href = mainImageSrc.value
    if (!href) {
      return []
    }

    return [{ rel: 'preload', as: 'image', href, fetchpriority: 'high' }]
  }),
})
</script>
