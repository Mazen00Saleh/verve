<template>
  <div class="page-shell">
    <div class="page-container py-8">
      <PageState
        :pending="pending"
        :error-message="errorMessage"
        :empty="!brochure"
        empty-title="Brochure not found"
        empty-message="This brochure may have been removed or is not yet available."
      >
        <template v-if="brochure">
          <div class="page-back">
            <NuxtLink to="/inspiration" class="back-link group">
              <svg class="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Brochures
            </NuxtLink>
          </div>

          <div class="mb-6 text-center sm:mb-8">
            <span class="section-eyebrow">Brochure</span>
            <h1 class="section-title">{{ brochure.title }}</h1>
            <div class="section-title-divider" />
            <p v-if="brochure.date" class="mt-3 text-sm font-normal text-luxury-muted">
              {{ brochure.date }}
            </p>
            <p v-if="brochure.description" class="section-intro mx-auto mt-4 max-w-2xl text-sm sm:text-base">
              {{ brochure.description }}
            </p>
          </div>

          <div v-if="brochure.fileUrl" class="mx-auto max-w-6xl overflow-hidden border border-neutral-200 bg-white shadow-2xl">
            <iframe
              :src="brochure.fileUrl"
              class="h-[70vh] w-full border-0 sm:h-[80vh]"
              allowfullscreen
              allow="clipboard-write"
            />
          </div>

          <div v-else class="mx-auto max-w-lg border border-neutral-200 bg-white px-6 py-10 text-center">
            <p class="text-sm font-normal text-luxury-charcoal">
              This brochure does not have a viewable file yet.
            </p>
          </div>
        </template>
      </PageState>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data: brochure, pending, error } = await useBrochureBySlug(slug)

if (brochure.value === null && !pending.value) {
  throw createError({ statusCode: 404, statusMessage: 'Brochure not found' })
}

const errorMessage = computed(() => error.value?.message ?? null)

const seoTitle = computed(() =>
  brochure.value
    ? `${brochure.value.title} | Verve Inspiration`
    : 'Brochure | Verve Inspiration',
)

const seoDescription = computed(() => {
  if (brochure.value?.description) {
    return brochure.value.description
  }

  return brochure.value
    ? `Browse the ${brochure.value.title} brochure from Verve for luxury wallpaper and fabric design inspiration.`
    : 'Explore Verve inspiration brochures for premium interior design ideas.'
})

usePageSeo({
  title: seoTitle,
  description: seoDescription,
  path: computed(() => `/inspiration/${slug}`),
  type: 'article',
  image: computed(() => brochure.value?.coverImage || undefined),
})
</script>
