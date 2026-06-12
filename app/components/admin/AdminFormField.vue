<template>
  <div>
    <label :for="inputId" class="mb-2 block text-xs uppercase tracking-widest text-luxury-charcoal">
      {{ label }}
      <span v-if="required" class="text-luxury-brass">*</span>
    </label>

    <slot :input-id="inputId" />

    <p v-if="hint" class="mt-2 text-xs font-light text-luxury-charcoal/70">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string
  hint?: string
  required?: boolean
  id?: string
}>()

const inputId = computed(() => props.id ?? `field-${props.label.toLowerCase().replace(/\s+/g, '-')}`)
</script>
