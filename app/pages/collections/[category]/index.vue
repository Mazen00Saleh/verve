<template>
  <div class="pt-32 bg-luxury-ivory min-h-screen pb-24">
    <div class="container mx-auto px-6 lg:px-12">
      <!-- Top Left Back Button -->
      <div class="mb-12">
        <NuxtLink 
          to="/collections" 
          class="inline-flex items-center text-xs uppercase tracking-widest text-luxury-matte-black hover:text-luxury-brass transition-colors duration-300 group"
        >
          <svg class="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Categories
        </NuxtLink>
      </div>

      <!-- Category Header -->
      <div class="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
        <span class="text-luxury-brass uppercase tracking-[0.3em] text-[10px] font-semibold mb-4 block">Category</span>
        <h1 class="text-4xl md:text-5xl font-serif text-luxury-matte-black mb-6">{{ category.title }}</h1>
        <div class="w-12 h-[1px] bg-luxury-brass/30 mx-auto mt-8"></div>
      </div>

      <!-- Collections List -->
      <div class="mt-8">

        <!-- Grid of Collections -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <NuxtLink 
            v-for="(coll, index) in category.collections" 
            :key="index" 
            :to="`/collections/${category.slug}/${coll.slug}`"
            class="group block"
          >
            <!-- Collection Image Cover -->
            <div class="relative overflow-hidden aspect-[4/5] bg-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] mb-6">
              <img 
                :src="coll.heroImage" 
                :alt="coll.title" 
                class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              />
              <div class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
            </div>
            
            <!-- Collection details -->
            <div class="text-center">
              <h3 class="text-xl font-serif text-luxury-matte-black group-hover:text-luxury-brass transition-colors duration-300">
                {{ coll.title }}
              </h3>
              <p class="text-xs text-luxury-charcoal/60 font-light mt-2 max-w-sm mx-auto">
                {{ coll.description }}
              </p>
              <span class="inline-block text-[11px] uppercase tracking-widest text-luxury-matte-black border-b border-luxury-matte-black pb-0.5 mt-4 group-hover:text-luxury-brass group-hover:border-luxury-brass transition-colors">
                Explore Products
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { categories } from '~/data/catalog'

const route = useRoute()
const categorySlug = route.params.category as string

// Find current category
const category = categories.find(cat => cat.slug === categorySlug)

if (!category) {
  throw createError({ statusCode: 404, statusMessage: 'Category not found' })
}

useHead({
  title: `${category.title} Collections | Verve Luxury Interiors`
})
</script>
