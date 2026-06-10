<template>
  <div class="pt-32 bg-luxury-ivory min-h-screen pb-24">
    <div class="container mx-auto px-6 lg:px-12">
      <!-- Page Header -->
      <div class="mb-16 text-center">
        <span class="text-luxury-brass uppercase tracking-[0.25em] text-[10px] font-semibold mb-3 block">Inspiration</span>
        <h1 class="text-4xl md:text-5xl font-serif text-luxury-matte-black tracking-wide">Brochures</h1>
        <div class="w-12 h-[1px] bg-luxury-brass/40 mx-auto mt-6"></div>
      </div>

      <!-- Grid of Brochures -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
        <div 
          v-for="(brochure, index) in brochures" 
          :key="index" 
          class="group cursor-pointer block"
          @click="openBrochure(brochure)"
        >
          <!-- Card Container -->
          <div class="relative overflow-hidden aspect-[3/4] bg-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-500 hover:shadow-[0_12px_36px_rgba(0,0,0,0.12)] hover:-translate-y-1">
            <img 
              :src="brochure.image" 
              :alt="brochure.title" 
              class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
            />
            
            <!-- Standard Overlay Brand (Centered at bottom) -->
            <div v-if="brochure.overlayType === 'standard'" class="absolute bottom-6 left-0 right-0 text-center">
              <span class="text-white text-xl tracking-[0.25em] font-serif uppercase select-none opacity-90 drop-shadow-md">Verve</span>
            </div>
            
            <!-- Script Overlay Brand (Center cursive) -->
            <div v-else-if="brochure.overlayType === 'script'" class="absolute inset-0 flex flex-col items-center justify-center bg-black/5 group-hover:bg-transparent transition-colors duration-500">
              <div class="text-center text-white drop-shadow-md select-none">
                <span class="block font-serif italic text-4xl lowercase leading-none tracking-normal">Maison</span>
                <span class="block text-[10px] uppercase tracking-[0.3em] font-sans mt-2">Verve</span>
              </div>
            </div>
          </div>
          
          <!-- Brochure Information Below -->
          <div class="text-center mt-5">
            <h3 class="text-sm font-sans tracking-wide font-medium text-luxury-matte-black group-hover:text-luxury-brass transition-colors duration-300">
              {{ brochure.title }}
            </h3>
            <p class="text-xs text-luxury-charcoal/60 font-light mt-1">
              {{ brochure.date }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Iframe Modal Viewer -->
    <Transition name="fade">
      <div 
        v-if="activeBrochureUrl" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-luxury-matte-black/90 backdrop-blur-md"
        @click.self="closeBrochure"
      >
        <!-- Modal Content Container -->
        <div class="relative w-full h-full max-w-6xl max-h-[85vh] bg-white shadow-2xl rounded-sm flex flex-col overflow-hidden">
          <!-- Top bar -->
          <div class="bg-luxury-matte-black text-luxury-ivory px-6 py-4 flex items-center justify-between border-b border-luxury-brass/10">
            <h3 class="font-serif tracking-wide text-sm">{{ activeBrochureTitle }}</h3>
            <button 
              @click="closeBrochure" 
              class="text-luxury-brass hover:text-white transition-colors flex items-center space-x-1.5 text-xs uppercase tracking-widest font-semibold"
            >
              <span>Close</span>
              <Icon name="lucide:x" size="16" />
            </button>
          </div>
          
          <!-- Iframe embed -->
          <div class="flex-grow w-full h-full relative bg-neutral-900">
            <iframe 
              :src="activeBrochureUrl" 
              class="w-full h-full border-0 absolute inset-0"
              allowfullscreen
              allow="clipboard-write"
            ></iframe>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

useHead({
  title: 'Inspiration | Verve Luxury Interiors',
  meta: [
    { name: 'description', content: 'Explore the Verve brochures and collection catalog files for premium design inspirations.' }
  ]
})

interface Brochure {
  title: string
  date: string
  overlayType: 'standard' | 'script'
  image: string
  link: string
}

const brochures: Brochure[] = [
  {
    title: 'General brochure',
    date: '01/2026',
    overlayType: 'standard',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
    link: 'https://online.fliphtml5.com/pyly/zdhs'
  },
  {
    title: 'Wallcoverings brochure',
    date: '01/2026',
    overlayType: 'script',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    link: 'https://online.fliphtml5.com/pyly/zdhs'
  },
  {
    title: 'Wallpaper brochure',
    date: '01/2026',
    overlayType: 'standard',
    image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80',
    link: 'https://online.fliphtml5.com/pyly/zdhs'
  },
  {
    title: 'Wallcovering brochure',
    date: '01/2026',
    overlayType: 'standard',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    link: 'https://online.fliphtml5.com/pyly/zdhs'
  },
  {
    title: 'Textile brochure',
    date: '01/2026',
    overlayType: 'standard',
    image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80',
    link: 'https://online.fliphtml5.com/pyly/zdhs'
  },
  {
    title: 'Contract brochure',
    date: '01/2026',
    overlayType: 'standard',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
    link: 'https://online.fliphtml5.com/pyly/zdhs'
  },
  {
    title: 'Panoramique brochure',
    date: '01/2026',
    overlayType: 'script',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    link: 'https://online.fliphtml5.com/pyly/zdhs'
  },
  {
    title: 'Outdoor brochure',
    date: '01/2026',
    overlayType: 'standard',
    image: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=800&q=80',
    link: 'https://online.fliphtml5.com/pyly/zdhs'
  }
]

const activeBrochureUrl = ref<string | null>(null)
const activeBrochureTitle = ref<string>('')

const openBrochure = (brochure: Brochure) => {
  activeBrochureUrl.value = brochure.link
  activeBrochureTitle.value = brochure.title
}

const closeBrochure = () => {
  activeBrochureUrl.value = null
  activeBrochureTitle.value = ''
}

watch(activeBrochureUrl, (newVal) => {
  if (newVal && typeof window !== 'undefined') {
    document.body.classList.add('overflow-hidden')
  } else if (typeof window !== 'undefined') {
    document.body.classList.remove('overflow-hidden')
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
