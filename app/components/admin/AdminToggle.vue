<template>
  <label class="inline-flex cursor-pointer items-center gap-3 select-none">
    <span class="text-sm font-medium text-luxury-matte-black">{{ label }}</span>

    <button
      type="button"
      role="switch"
      class="admin-toggle"
      :class="modelValue ? 'admin-toggle--on' : 'admin-toggle--off'"
      :aria-checked="modelValue"
      :aria-label="label"
      @click="emit('update:modelValue', !modelValue)"
    >
      <span class="admin-toggle-thumb" :class="modelValue ? 'translate-x-6' : 'translate-x-0.5'" />
    </button>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  label: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>
