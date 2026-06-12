<template>
  <div
    class="relative overflow-hidden bg-neutral-100"
    :class="[aspectClass, containerClass]"
  >
    <img
      v-if="src"
      :src="src"
      :alt="alt"
      class="h-full w-full object-cover transition-transform duration-700"
      :class="[imageClass, hoverScale ? 'group-hover:scale-105' : '']"
      :loading="priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : 'auto'"
      decoding="async"
      :width="width"
      :height="height"
    >
    <div
      v-else
      class="flex h-full w-full items-center justify-center bg-luxury-warm-beige/30 text-xs uppercase tracking-widest text-luxury-muted"
    >
      No image
    </div>
    <div
      v-if="overlay"
      class="pointer-events-none absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-transparent"
    />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  src: string
  alt: string
  aspect?: 'square' | '1/1' | '4/3' | '4/5' | '3/4' | 'auto'
  overlay?: boolean
  hoverScale?: boolean
  priority?: boolean
  width?: number
  height?: number
  containerClass?: string
  imageClass?: string
}>(), {
  aspect: 'square',
  overlay: false,
  hoverScale: true,
  priority: false,
  containerClass: '',
  imageClass: '',
})

const aspectClass = computed(() => {
  switch (props.aspect) {
    case '1/1':
    case 'square':
      return 'aspect-square'
    case '4/3':
      return 'aspect-[4/3]'
    case '4/5':
      return 'aspect-[4/5]'
    case '3/4':
      return 'aspect-[3/4]'
    case 'auto':
      return ''
    default:
      return 'aspect-square'
  }
})
</script>
