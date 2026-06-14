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

<style scoped>
.admin-toggle {
  @apply relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border-2 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2;
  outline-color: theme('colors.luxury.brass.contrast');
}

.admin-toggle--on {
  @apply border-emerald-600 bg-emerald-500;
}

.admin-toggle--off {
  @apply border-neutral-300 bg-neutral-200;
}

.admin-toggle-thumb {
  @apply pointer-events-none block h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-200;
}
</style>
