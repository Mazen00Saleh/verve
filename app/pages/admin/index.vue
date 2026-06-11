<template>
  <div>
    <h2 class="font-serif text-3xl text-luxury-matte-black">Dashboard</h2>
    <p class="mt-3 max-w-2xl text-sm font-light text-luxury-charcoal">
      Welcome to the Verve admin area. Use the navigation to manage categories, collections, products, and brochures.
    </p>

    <div class="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <NuxtLink
        v-for="item in quickLinks"
        :key="item.to"
        :to="item.to"
        class="border border-neutral-200 bg-white p-6 transition-colors hover:border-luxury-brass"
      >
        <h3 class="font-serif text-xl">{{ item.label }}</h3>
        <p class="mt-2 text-sm font-light text-luxury-charcoal">{{ item.description }}</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const quickLinks = [
  {
    label: 'Categories',
    to: '/admin/categories',
    description: 'Manage product categories shown on the public site.',
  },
  {
    label: 'Collections',
    to: '/admin/collections',
    description: 'Organize collections within each category.',
  },
  {
    label: 'Products',
    to: '/admin/products',
    description: 'Create and update individual product entries.',
  },
  {
    label: 'Brochures',
    to: '/admin/brochures',
    description: 'Upload and maintain downloadable brochure files.',
  },
]

useHead({
  title: 'Admin Dashboard | Verve',
})
</script>
