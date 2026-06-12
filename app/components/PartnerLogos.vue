<template>
  <section class="py-12 bg-luxury-ivory border-t border-b border-luxury-warm-beige overflow-hidden relative">
    <!-- Fade overlays -->
    <div class="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-luxury-ivory to-transparent z-10 pointer-events-none"></div>
    <div class="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-luxury-ivory to-transparent z-10 pointer-events-none"></div>
    
    <div class="flex w-max animate-scroll">
      <div class="flex items-center gap-16 px-8" v-for="n in 2" :key="n">
        <span v-for="(brand, i) in brands" :key="`${n}-${i}`" class="cursor-default select-none font-serif text-xl uppercase tracking-[0.1em] text-luxury-charcoal md:text-2xl">
          {{ brand }}
        </span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const brands = [
  "D&G", "ARMANI/CASA", "AGENA", "ANTHOLOGY", "Baker Lifestyle", 
  "BLACK edition", "CAMENGO", "CASADECO", "CASAMANCE", "JV ITALIAN DESIGN", 
  "MISSONI HOME", "NOBILIS", "omexco", "PHILLIP JEFFRIES", "PIERRE FREY", 
  "pt", "RUBELLI", "SAHCO", "SAMUEL & SONS", "SIRPI", 
  "zinc textile", "ZOFFANY", "HOULES", "kravet"
]
</script>
