<template>
  <section class="py-24 bg-luxury-ivory">
    <div class="container mx-auto px-6 lg:px-12">
      <div class="flex flex-col md:flex-row justify-between items-end mb-16">
        <div class="max-w-2xl">
          <span class="text-luxury-brass uppercase tracking-[0.2em] text-xs font-semibold mb-4 block">Curated Selection</span>
          <h2 class="text-4xl md:text-5xl font-serif text-luxury-matte-black">Featured Collections</h2>
        </div>
        <NuxtLink to="/collections" class="hidden md:inline-block border-b border-luxury-matte-black pb-1 hover:text-luxury-brass hover:border-luxury-brass transition-colors uppercase tracking-widest text-sm">
          View All
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="(collection, index) in collections" :key="index" class="group cursor-pointer">
          <div class="relative overflow-hidden aspect-[3/4] mb-6">
            <img :src="collection.image" :alt="collection.title" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500"></div>
          </div>
          <h3 class="text-2xl font-serif text-luxury-matte-black mb-2 group-hover:text-luxury-brass transition-colors">{{ collection.title }}</h3>
          <p class="text-luxury-charcoal font-light text-sm">{{ collection.description }}</p>
        </div>
      </div>
      
      <div class="mt-12 text-center md:hidden">
        <NuxtLink to="/collections" class="btn-outline">
          View All Collections
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const collections = [
  {
    title: 'Wallpapers',
    description: 'A wide range of wallpapers with different designs and colors.',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Fabrics',
    description: 'A wide range of fabrics with different designs and colors.',
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Posters',
    description: 'A wide range of posters with different designs and colors.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  }
]
</script>
