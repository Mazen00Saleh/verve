<template>
  <div class="catalog-grid" :class="gridClass">
    <div
      v-for="index in count"
      :key="index"
      class="animate-pulse"
    >
      <div class="aspect-[4/5] bg-neutral-200/80 sm:aspect-square" />
      <div class="mt-3 space-y-2">
        <div class="mx-auto h-3 w-3/4 rounded bg-neutral-200/80" />
        <div class="mx-auto h-2 w-1/2 rounded bg-neutral-200/60" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  count?: number
  gridClass?: string
}>(), {
  count: 12,
  gridClass: '',
})
</script>
