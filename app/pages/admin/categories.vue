<template>
  <div>
    <h2 class="font-serif text-3xl text-luxury-matte-black">Categories</h2>
    <p class="mt-3 max-w-2xl text-sm font-light text-luxury-charcoal">
      Category management will live here. This route is protected and only accessible to admin users.
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

useHead({
  title: 'Admin Categories | Verve',
})
</script>
