<template>
  <div class="pt-32 bg-luxury-ivory min-h-screen pb-24">
    <div class="container mx-auto px-6 lg:px-12">
      <!-- Top Left Back Button -->
      <div class="mb-12">
        <NuxtLink 
          :to="`/collections/${category.slug}/${collection.slug}`" 
          class="inline-flex items-center text-xs uppercase tracking-widest text-luxury-matte-black hover:text-luxury-brass transition-colors duration-300 group"
        >
          <svg class="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Collection
        </NuxtLink>
      </div>

      <!-- Main Layout: Symmetrical 2-Column Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        <!-- Left Column: Main Image & Zoom Magnifier -->
        <div class="relative w-full aspect-square bg-luxury-warm-beige/10 border border-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] select-none">
          <div 
            class="relative w-full h-full overflow-hidden cursor-zoom-in"
            @mouseenter="isZooming = true"
            @mouseleave="isZooming = false"
            @mousemove="handleMouseMove"
          >
            <img 
              ref="mainImageRef"
              :src="activeImage" 
              :alt="product.name" 
              class="w-full h-full object-cover transition-opacity duration-300" 
            />
            
            <!-- Square magnifying lens overlay on top of main image -->
            <div 
              v-if="isZooming"
              class="absolute border border-luxury-brass bg-black/10 pointer-events-none shadow-[0_0_8px_rgba(0,0,0,0.1)] transition-transform duration-75"
              :style="{
                width: '180px',
                height: '180px',
                left: `${lensX}px`,
                top: `${lensY}px`
              }"
            ></div>
          </div>

          <!-- Floating zoom display box on the right -->
          <div 
            v-if="isZooming"
            class="absolute left-[105%] top-0 w-[480px] h-[480px] z-30 border border-neutral-200 bg-white overflow-hidden hidden xl:block shadow-2xl"
          >
            <img 
              :src="activeImage" 
              class="max-w-none absolute pointer-events-none"
              :style="{
                width: '300%', /* 3x zoom level */
                height: '300%',
                left: `-${zoomX * 2}%`,
                top: `-${zoomY * 2}%`
              }"
            />
          </div>
        </div>

        <!-- Right Column: Product details and Swatch selector -->
        <div class="space-y-10 lg:sticky lg:top-32">
          <!-- Title & Subtitle -->
          <div>
            <h1 class="text-4xl md:text-5xl font-serif tracking-wider text-luxury-matte-black mb-1 uppercase">{{ product.name }}</h1>
            <p class="text-xs uppercase tracking-widest text-luxury-charcoal/60 font-sans">
              {{ category.title }} VERVE
            </p>
          </div>

          <!-- Colorway/Variants selector (Pattern Swatches) -->
          <div class="space-y-4 pt-4 border-t border-neutral-100">
            <div class="flex justify-between items-center">
              <span class="text-xs uppercase tracking-widest text-luxury-charcoal font-semibold">
                Variations
              </span>
              <span class="text-xs italic text-luxury-brass font-serif">{{ selectedVariant.name }}</span>
            </div>
            <div class="flex flex-wrap gap-4">
              <button 
                v-for="(variant, idx) in variants" 
                :key="idx" 
                @click="selectedVariantIdx = idx"
                :class="[
                  'w-20 h-20 border transition-all duration-300 relative overflow-hidden flex items-center justify-center p-0.5',
                  selectedVariantIdx === idx ? 'border-neutral-900 ring-1 ring-neutral-900' : 'border-neutral-200 hover:border-neutral-400'
                ]"
                :title="variant.name"
              >
                <img 
                  :src="variant.image" 
                  :alt="variant.name" 
                  class="w-full h-full object-cover" 
                />
              </button>
            </div>
          </div>

          <!-- SKU Code -->
          <div class="text-xs text-luxury-charcoal font-mono tracking-widest uppercase py-2">
            Reference: <span class="text-luxury-matte-black font-semibold font-sans ml-2">{{ product.sku }}-{{ selectedVariant.skuSuffix }}</span>
          </div>

          <!-- Description paragraph -->
          <p class="text-luxury-charcoal font-light leading-relaxed text-sm pt-4 border-t border-neutral-100">
            The interlaced foliage gives way to a beautiful pattern design. Its refinement has inspired couturiers and decorators alike. Silky weaves cover the base fabric with pure luxury, bringing an elegant combination of texture depth and subtle modern lusters.
          </p>



        </div>

      </div>

      <!-- Full-Width In-Room Mockups Previews below -->
      <div class="pt-16 border-t border-neutral-200 mt-20">
        <h3 class="text-xs uppercase tracking-widest text-luxury-charcoal mb-12 font-semibold text-center">Room Inspirations</h3>
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-end max-w-6xl mx-auto">
          <!-- Left close-up drapery / vertical portrait mockup (takes 5 cols) -->
          <div class="md:col-span-5 aspect-[3/4] bg-neutral-100 overflow-hidden relative shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <img :src="mockups[0]" alt="Close Up View" class="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
            <div class="absolute inset-0 bg-black/5 pointer-events-none"></div>
          </div>
          <!-- Right full room mockup (takes 7 cols) -->
          <div class="md:col-span-7 aspect-[4/3] bg-neutral-100 overflow-hidden relative shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            <img :src="mockups[1]" alt="Full Room Setting" class="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
            <div class="absolute inset-0 bg-black/5 pointer-events-none"></div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const categorySlug = route.params.category as string
const collectionSlug = route.params.collection as string
const productSlug = route.params.product as string

const { data: categories } = await useCatalog()
const category = categories.value?.find(cat => cat.slug === categorySlug)
if (!category) {
  throw createError({ statusCode: 404, statusMessage: 'Category not found' })
}

const collection = category.collections.find(coll => coll.slug === collectionSlug)
if (!collection) {
  throw createError({ statusCode: 404, statusMessage: 'Collection not found' })
}

const product = collection.products.find(p => p.sku.toLowerCase() === productSlug)
if (!product) {
  throw createError({ statusCode: 404, statusMessage: 'Product not found' })
}

// Variants definitions (Swatches with actual images)
const variants = [
  { name: 'Antique Gold', skuSuffix: 'GD', colorHex: '#D4AF37', image: product.image },
  { name: 'Royal Emerald', skuSuffix: 'EM', colorHex: '#0B4F30', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80' },
  { name: 'Midnight Blue', skuSuffix: 'MB', colorHex: '#14213d', image: 'https://images.unsplash.com/photo-1617104424032-b9bd6972d0e4?auto=format&fit=crop&w=800&q=80' }
]

const selectedVariantIdx = ref(0)
const selectedVariant = computed(() => variants[selectedVariantIdx.value])
const activeImage = computed(() => selectedVariant.value.image)

// In-room mockup previews (Vertical close up & wider scene view)
const mockups = [
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80'
]

// Zoom implementation
const isZooming = ref(false)
const zoomX = ref(0)
const zoomY = ref(0)
const lensX = ref(0)
const lensY = ref(0)
const mainImageRef = ref<HTMLImageElement | null>(null)

const handleMouseMove = (e: MouseEvent) => {
  if (!mainImageRef.value) return
  const { left, top, width, height } = mainImageRef.value.getBoundingClientRect()
  
  // Relative coordinates inside the image container (0 to 100)
  let x = ((e.clientX - left) / width) * 100
  let y = ((e.clientY - top) / height) * 100
  
  // Constrain boundaries (0 to 100)
  x = Math.max(0, Math.min(100, x))
  y = Math.max(0, Math.min(100, y))
  
  zoomX.value = x
  zoomY.value = y
  
  // Position of the 180px lens relative to the image
  const pxX = e.clientX - left
  const pxY = e.clientY - top
  
  lensX.value = Math.max(0, Math.min(width - 180, pxX - 90))
  lensY.value = Math.max(0, Math.min(height - 180, pxY - 90))
}

useHead({
  title: `${product.name} | ${collection.title} | Verve Luxury Interiors`
})
</script>
