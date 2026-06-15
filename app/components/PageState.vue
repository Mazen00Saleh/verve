<template>
  <div v-if="pending" :class="wrapperClass">
    <div class="mx-auto max-w-md text-center">
      <div class="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-luxury-brass border-t-transparent" />
      <p class="text-sm uppercase tracking-widest text-luxury-charcoal">{{ loadingText }}</p>
    </div>
  </div>

  <div v-else-if="errorMessage" :class="wrapperClass">
    <div class="mx-auto max-w-lg border border-red-200 bg-red-50 px-6 py-8 text-center">
      <p class="text-xl text-luxury-matte-black">{{ errorTitle }}</p>
      <p class="mt-3 text-sm font-light text-luxury-charcoal">{{ errorMessage }}</p>
      <button
        v-if="retry"
        type="button"
        class="btn-outline mt-6"
        @click="retry"
      >
        Try Again
      </button>
    </div>
  </div>

  <div v-else-if="empty" :class="wrapperClass">
    <div class="mx-auto max-w-lg text-center">
      <p class="text-2xl text-luxury-matte-black">{{ emptyTitle }}</p>
      <p class="mt-3 text-sm font-light text-luxury-charcoal">{{ emptyMessage }}</p>
      <slot name="empty-action" />
    </div>
  </div>

  <slot v-else />
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  pending?: boolean
  errorMessage?: string | null
  empty?: boolean
  loadingText?: string
  errorTitle?: string
  emptyTitle?: string
  emptyMessage?: string
  wrapperClass?: string
  retry?: () => void
}>(), {
  pending: false,
  errorMessage: null,
  empty: false,
  loadingText: 'Loading...',
  errorTitle: 'Something went wrong',
  emptyTitle: 'Nothing here yet',
  emptyMessage: 'Check back soon for new content.',
  wrapperClass: 'flex min-h-[40vh] items-center justify-center py-24',
})
</script>
