<template>
  <section class="relative h-[80vh] w-full overflow-hidden bg-luxury-matte-black">
    <!-- Slides wrapper -->
    <div class="relative w-full h-full">
      <div 
        v-for="(slide, index) in slides" 
        :key="index"
        :class="[
          'absolute inset-0 w-full h-full flex flex-row items-stretch transition-opacity duration-1000 ease-in-out',
          currentSlide === index ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
        ]"
      >
        <!-- Left Texture Column (22%) -->
        <div class="w-[22%] h-full relative overflow-hidden hidden lg:block">
          <div 
            class="w-full h-full bg-cover bg-center transition-transform duration-[8000ms] ease-out"
            :style="{ 
              backgroundImage: `url(${slide.leftImage})`,
              transform: currentSlide === index ? 'scale(1.05)' : 'scale(1.15)'
            }"
          ></div>
          <div class="absolute inset-0 bg-black/10"></div>
        </div>

        <!-- Middle Content Card (26% on lg, 38% on md, 100% on mobile) -->
        <div 
          class="w-full md:w-[40%] lg:w-[26%] bg-luxury-ivory flex flex-col justify-center px-8 sm:px-12 lg:px-16 text-left py-16 relative z-20 transition-all duration-1000 delay-300"
          :style="{
            transform: currentSlide === index ? 'translateY(0)' : 'translateY(20px)',
            opacity: currentSlide === index ? '1' : '0'
          }"
        >
          <!-- Content Elements with Staggered Delays -->
          <div class="space-y-6">
            <h2 
              class="text-3xl sm:text-4xl lg:text-5xl font-serif text-luxury-matte-black tracking-wide uppercase leading-tight transition-all duration-700 delay-500"
              :style="{
                transform: currentSlide === index ? 'translateY(0)' : 'translateY(15px)',
                opacity: currentSlide === index ? '1' : '0'
              }"
            >
              {{ slide.title }}
            </h2>
            <p 
              class="text-luxury-charcoal text-xs sm:text-sm font-light leading-relaxed transition-all duration-700 delay-700"
              :style="{
                transform: currentSlide === index ? 'translateY(0)' : 'translateY(15px)',
                opacity: currentSlide === index ? '1' : '0'
              }"
            >
              {{ slide.description }}
            </p>
          </div>
        </div>

        <!-- Right Lifestyle Column (Remaining width) -->
        <div class="flex-grow h-full relative overflow-hidden">
          <div 
            class="w-full h-full bg-cover bg-center transition-transform duration-[8000ms] ease-out"
            :style="{ 
              backgroundImage: `url(${slide.rightImage})`,
              transform: currentSlide === index ? 'scale(1)' : 'scale(1.1)'
            }"
          ></div>
          <div class="absolute inset-0 bg-black/[0.03]"></div>
        </div>
      </div>
    </div>

    <!-- Minimal Chevron Controls -->
    <!-- Left Chevron -->
    <button 
      @click="prevSlide" 
      class="absolute left-6 top-1/2 -translate-y-1/2 z-30 text-white/50 hover:text-white hover:scale-110 p-2 transition-all duration-300"
      aria-label="Previous slide"
    >
      <Icon name="lucide:chevron-left" size="36" />
    </button>

    <!-- Right Chevron -->
    <button 
      @click="nextSlide" 
      class="absolute right-6 top-1/2 -translate-y-1/2 z-30 text-white/50 hover:text-white hover:scale-110 p-2 transition-all duration-300"
      aria-label="Next slide"
    >
      <Icon name="lucide:chevron-right" size="36" />
    </button>

    <!-- Slide Indicators -->
    <div class="absolute bottom-8 right-12 z-30 flex items-center space-x-3 hidden md:flex">
      <button 
        v-for="(slide, index) in slides" 
        :key="index" 
        @click="selectSlide(index)" 
        :class="[
          'w-1.5 h-1.5 rounded-full transition-all duration-300', 
          currentSlide === index ? 'bg-luxury-brass w-6' : 'bg-white/40 hover:bg-white/70'
        ]"
        :aria-label="`Go to slide ${index + 1}`"
      ></button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const slides = [
  {
    title: 'Tramis',
    description: "In this collection of timeless plain colors and textures, the natural material seems to retain something of the earth, wind and elements that shaped it. The palette opens with Verve's signature colors and extends to other harmonies of neutral, warm and muted tones.",
    leftImage: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=800&q=80',
    rightImage: 'https://images.unsplash.com/photo-1618219944342-824e40a13285?auto=format&fit=crop&w=1600&q=80',
    link: '/collections/wallpapers'
  },
  {
    title: 'The Heritage',
    description: 'Drawing inspiration from historic archives and classical luxury, The Heritage collection reinterprets damask patterns, gold accents, and deep jewel tones for modern stately residences.',
    leftImage: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=800&q=80',
    rightImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
    link: '/collections/wallpapers/the-heritage'
  },
  {
    title: 'Monolith',
    description: 'Celebrating brutalist form and architectural simplicity, Monolith presents stone-like textures, matte plaster finishes, and structured geometric block prints.',
    leftImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
    rightImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
    link: '/collections/wallpapers/monolith'
  }
]

const currentSlide = ref(0)
let autoplayTimer: any = null

const startAutoplay = () => {
  stopAutoplay()
  autoplayTimer = setInterval(() => {
    nextSlide()
  }, 8000)
}

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
  }
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
}

const selectSlide = (index: number) => {
  currentSlide.value = index
  startAutoplay() // Reset timer on manual selection
}

onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})
</script>
