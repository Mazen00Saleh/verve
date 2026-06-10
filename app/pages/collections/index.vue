<template>
  <div class="pt-24 bg-luxury-ivory min-h-screen">
    <div class="container mx-auto px-6 lg:px-12 py-16">
      <div class="text-center mb-16">
        <h1 class="text-5xl font-serif text-luxury-matte-black mb-4">Our Categories</h1>
        <p class="text-luxury-charcoal font-light max-w-2xl mx-auto">Explore our range of premium wallpapers, fabrics, posters, and wallcoverings, each comprising unique curated collections.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-12 gap-y-24">
        <NuxtLink v-for="(category, index) in categories" :key="index" :to="`/collections/${category.slug}`" class="group block">
          <div class="relative overflow-hidden aspect-[4/3] mb-6">
            <img :src="category.image" :alt="category.title" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500"></div>
          </div>
          <div class="text-center">
            <h2 class="text-3xl font-serif text-luxury-matte-black mb-3 group-hover:text-luxury-brass transition-colors">{{ category.title }}</h2>
            <p class="text-luxury-charcoal font-light mb-4">{{ category.description }}</p>
            <span class="text-xs uppercase tracking-widest text-luxury-matte-black border-b border-luxury-matte-black pb-1 group-hover:border-luxury-brass group-hover:text-luxury-brass transition-colors">Discover Category</span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { categories } from '~/data/catalog'

useHead({
  title: 'Categories | Verve Luxury Interiors'
})
</script>
