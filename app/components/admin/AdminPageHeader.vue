<template>
  <div class="mb-8 flex flex-wrap items-start justify-between gap-4">
    <div>
      <h2 class="text-3xl text-luxury-matte-black">{{ title }}</h2>
      <p v-if="description" class="mt-2 max-w-2xl text-sm font-normal text-luxury-charcoal">
        {{ description }}
      </p>
    </div>

    <div v-if="$slots.actions" class="flex flex-wrap gap-3">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>
