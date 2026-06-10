<template>
  <div class="bg-luxury-ivory min-h-screen pt-24">
    <div class="container mx-auto px-6 lg:px-12 py-16">
      
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
        <div class="lg:col-span-4 flex flex-col justify-center">
          <span class="text-luxury-brass uppercase tracking-[0.3em] text-xs font-semibold mb-4 block">Project Focus</span>
          <h1 class="text-4xl md:text-5xl font-serif text-luxury-matte-black mb-6">{{ project.title }}</h1>
          <p class="text-luxury-charcoal font-light leading-relaxed mb-8">
            {{ project.description }}
          </p>
          <div class="space-y-4 pt-8 border-t border-luxury-warm-beige">
            <div>
              <span class="block text-xs uppercase tracking-widest text-luxury-charcoal mb-1">Location</span>
              <span class="text-luxury-matte-black font-serif">{{ project.location }}</span>
            </div>
            <div>
              <span class="block text-xs uppercase tracking-widest text-luxury-charcoal mb-1">Designer</span>
              <span class="text-luxury-matte-black font-serif">{{ project.designer }}</span>
            </div>
          </div>
        </div>
        
        <div class="lg:col-span-8">
          <img :src="project.mainImage" :alt="project.title" class="w-full h-auto object-cover shadow-sm" />
        </div>
      </div>

      <div class="mb-24">
        <h2 class="text-3xl font-serif text-center text-luxury-matte-black mb-12">Featured Products</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <NuxtLink v-for="(product, index) in project.products" :key="index" :to="`/collections/wallpapers/the-heritage`" class="group block">
            <div class="aspect-square bg-white mb-4 relative overflow-hidden">
               <img :src="product.image" :alt="product.name" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div class="text-center">
              <h3 class="text-lg font-serif text-luxury-matte-black group-hover:text-luxury-brass transition-colors">{{ product.name }}</h3>
              <p class="text-luxury-charcoal text-sm font-light mt-1">{{ product.sku }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
      
      <div class="text-center">
        <NuxtLink to="/inspiration" class="btn-outline">
          Back to Inspiration
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

// Mock data based on slug
const project = {
  title: route.params.slug ? (route.params.slug as string).replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Project Name',
  description: 'An exploration of texture and light, this project showcases the transformative power of premium wallcoverings in a sophisticated residential setting. The interplay between the bold damask patterns and the minimalist furniture creates a striking balance.',
  location: 'Paris, France',
  designer: 'Atelier Verve',
  mainImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
  products: [
    { name: 'Imperial Damask', sku: 'V-1001', image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80' },
    { name: 'Velvet Noir Accent', sku: 'V-2005', image: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=800&q=80' }
  ]
}

useHead({
  title: `${project.title} | Verve Inspiration`
})
</script>
