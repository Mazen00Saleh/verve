<template>
  <div class="pointer-events-none fixed right-6 top-6 z-50 flex w-full max-w-sm flex-col gap-3">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="pointer-events-auto border px-4 py-3 text-sm shadow-lg"
      :class="toast.type === 'success'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
        : 'border-red-200 bg-red-50 text-red-800'"
    >
      <div class="flex items-start justify-between gap-3">
        <p>{{ toast.message }}</p>
        <button
          type="button"
          class="text-xs uppercase tracking-widest opacity-70 hover:opacity-100"
          @click="dismiss(toast.id)"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { toasts, dismiss } = useToast()
</script>
