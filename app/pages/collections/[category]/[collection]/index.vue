<template>
  <div class="pt-32 bg-luxury-ivory min-h-screen pb-24">
    <div class="container mx-auto px-6 lg:px-12">
      <!-- Top Left Back Button -->
      <div class="mb-12">
        <NuxtLink 
          :to="`/collections/${category.slug}`" 
          class="inline-flex items-center text-xs uppercase tracking-widest text-luxury-matte-black hover:text-luxury-brass transition-colors duration-300 group"
        >
          <svg class="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Category
        </NuxtLink>
      </div>

      <!-- Collection Header -->
      <div class="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
        <span class="text-luxury-brass uppercase tracking-[0.3em] text-[10px] font-semibold mb-4 block">Collection</span>
        <h1 class="text-4xl md:text-5xl font-serif text-luxury-matte-black mb-6">{{ collection.title }}</h1>
        <p class="text-luxury-charcoal font-light leading-relaxed text-base max-w-xl mx-auto">{{ collection.description }}</p>
        <div class="w-12 h-[1px] bg-luxury-brass/30 mx-auto mt-8"></div>
      </div>

      <!-- Collection Details & Products -->
      <div>
        <!-- Products Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <NuxtLink 
            v-for="(product, index) in collection.products" 
            :key="index" 
            :to="`/collections/${category.slug}/${collection.slug}/${product.sku.toLowerCase()}`"
            class="group block cursor-pointer"
          >
            <!-- Product image aspect-square container -->
            <div class="aspect-square overflow-hidden mb-6 relative bg-luxury-warm-beige/10 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              <img :src="product.image" :alt="product.name" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              
              <!-- Hover Overlay Details -->
              <div class="absolute inset-0 bg-luxury-matte-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-6 text-center">
                <span class="text-white text-[11px] uppercase tracking-widest border border-white/60 px-5 py-2.5 hover:bg-white hover:text-luxury-matte-black transition-colors duration-300">
                  View Details
                </span>
              </div>
            </div>
            
            <!-- Product name & SKU -->
            <div class="text-center">
              <h3 class="text-lg font-serif text-luxury-matte-black group-hover:text-luxury-brass transition-colors duration-300">
                {{ product.name }}
              </h3>
              <p class="text-xs text-luxury-charcoal/60 font-light mt-1.5 font-sans tracking-wide">
                SKU: {{ product.sku }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const categorySlug = route.params.category as string
const collectionSlug = route.params.collection as string

const { data: categories } = await useCatalog()
const category = categories.value?.find(cat => cat.slug === categorySlug)
if (!category) {
  throw createError({ statusCode: 404, statusMessage: 'Category not found' })
}

const collection = category.collections.find(coll => coll.slug === collectionSlug)
if (!collection) {
  throw createError({ statusCode: 404, statusMessage: 'Collection not found' })
}

useHead({
  title: `${collection.title} | ${category.title} | Verve Luxury Interiors`
})
</script>
