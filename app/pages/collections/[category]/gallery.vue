<template>
  <div class="page-shell">
    <div class="page-container">
      <div class="page-back">
        <NuxtLink to="/" class="back-link group">
          <svg class="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </NuxtLink>
      </div>

      <PageState
        :pending="pending"
        :error-message="errorMessage"
        :empty="!pending && !category"
        empty-title="Category not found"
        empty-message="This category may have been removed or is not yet available."
        :retry="refresh"
      >
        <template v-if="category">
          <PageState
            :empty="!mockups.length"
            empty-title="No room inspirations yet"
            empty-message="Mockup images for this category will appear here once published."
            wrapper-class="py-16"
          >
            <CategoryMockupMasonry
              :mockups="mockups"
              :alt="`${category.title} room inspiration`"
            />
          </PageState>
        </template>
      </PageState>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const categorySlug = route.params.category as string

const { data, pending, error, refresh } = await useCategoryMockups(categorySlug)

if (data.value && !data.value.category) {
  throw createError({ statusCode: 404, statusMessage: 'Category not found' })
}

const errorMessage = computed(() => error.value?.message ?? null)
const category = computed(() => data.value?.category ?? null)
const mockups = computed(() => data.value?.mockups ?? [])

useHead({
  title: computed(() =>
    category.value
      ? `${category.value.title} Gallery | Verve Luxury Interiors`
      : 'Gallery | Verve Luxury Interiors',
  ),
})
</script>
