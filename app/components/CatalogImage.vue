<template>
  <div
    class="relative overflow-hidden bg-neutral-100"
    :class="[aspectClass, containerClass]"
  >
    <NuxtImg
      v-if="src"
      :src="src"
      :alt="alt"
      :width="resolvedWidth"
      :height="resolvedHeight"
      :sizes="resolvedSizes"
      :fit="resolvedFit"
      :loading="priority ? 'eager' : 'lazy'"
      :fetchpriority="priority ? 'high' : 'auto'"
      format="webp"
      quality="80"
      decoding="async"
      class="transition-transform duration-700"
      :class="[imageObjectClass, imageClass, hoverScale && !usesNaturalAspect ? 'group-hover:scale-105' : '']"
    />
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
import { getImagePreset, type ImageSizePreset } from '~/utils/imageSizes'

const props = withDefaults(defineProps<{
  src: string
  alt: string
  aspect?: 'square' | '1/1' | '4/3' | '4/5' | '3/4' | 'auto'
  objectFit?: 'cover' | 'contain'
  overlay?: boolean
  hoverScale?: boolean
  priority?: boolean
  size?: ImageSizePreset
  width?: number
  height?: number
  sizes?: string
  containerClass?: string
  imageClass?: string
}>(), {
  aspect: 'square',
  objectFit: 'cover',
  overlay: false,
  hoverScale: true,
  priority: false,
  size: 'card',
  containerClass: '',
  imageClass: '',
})

const preset = computed(() => getImagePreset(props.size))

const usesNaturalAspect = computed(() => props.objectFit === 'contain')

const resolvedWidth = computed(() => props.width ?? preset.value.width)
const resolvedHeight = computed(() => {
  if (props.height !== undefined) {
    return props.height
  }

  return usesNaturalAspect.value ? undefined : preset.value.height
})
const resolvedSizes = computed(() => props.sizes ?? preset.value.sizes)
const resolvedFit = computed(() => (usesNaturalAspect.value ? 'inside' : undefined))

const imageObjectClass = computed(() =>
  usesNaturalAspect.value
    ? 'h-auto w-full object-contain'
    : 'h-full w-full object-cover',
)

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
