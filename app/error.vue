<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

useSeoMeta({
  robots: 'noindex, nofollow',
})

useHead({
  title: props.error.statusCode === 404 ? 'Page Not Found | Verve' : 'Error | Verve',
})

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="page-shell">
    <div class="page-container py-20 text-center">
      <h1 class="section-title">
        {{ error.statusCode === 404 ? 'Page not found' : 'Something went wrong' }}
      </h1>
      <p class="section-intro mx-auto mt-4 max-w-lg">
        {{ error.statusMessage || 'The page you requested could not be found.' }}
      </p>
      <button type="button" class="btn-primary mt-8" @click="handleError">
        Back to home
      </button>
    </div>
  </div>
</template>
