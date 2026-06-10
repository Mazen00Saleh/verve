<template>
  <header 
    class="fixed top-0 w-full z-50 bg-luxury-ivory py-8 shadow-sm transition-all duration-300"
  >
    <div class="max-w-5xl mx-auto px-6 lg:px-12 flex items-center justify-between">
      <!-- Left side links (First two links) -->
      <nav class="hidden md:flex flex-1 justify-end items-center space-x-12 pr-12">
        <NuxtLink 
          to="/collections" 
          class="text-base tracking-widest uppercase hover:text-luxury-brass transition-colors duration-300 text-luxury-matte-black"
        >
          Collections
        </NuxtLink>
        <NuxtLink 
          to="/inspiration" 
          class="text-base tracking-widest uppercase hover:text-luxury-brass transition-colors duration-300 text-luxury-matte-black"
        >
          Inspiration
        </NuxtLink>
      </nav>
      
      <!-- Center logo -->
      <div class="flex-none flex justify-center items-center">
        <NuxtLink 
          to="/" 
          class="text-4xl md:text-5xl font-serif tracking-[0.2em] uppercase text-center transition-colors duration-300 text-luxury-matte-black select-none"
        >
          Verve
        </NuxtLink>
      </div>
      
      <!-- Right side links (Remaining links) -->
      <nav class="hidden md:flex flex-1 justify-start items-center space-x-12 pl-12">
        <NuxtLink 
          to="/about" 
          class="text-base tracking-widest uppercase hover:text-luxury-brass transition-colors duration-300 text-luxury-matte-black"
        >
          About Us
        </NuxtLink>
        <NuxtLink 
          to="/contact" 
          class="text-base tracking-widest uppercase hover:text-luxury-brass transition-colors duration-300 text-luxury-matte-black"
        >
          Contact Us
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const scrolled = ref(false)
const hovered = ref(false)

const isDark = computed(() => scrolled.value || hovered.value || route.path !== '/')

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
