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
            <p v-if="brochure.date" class="mt-3 text-sm font-light text-luxury-muted">
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
            <p class="text-sm font-light text-luxury-charcoal">
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

const { data: brochures, pending, error } = await usePublicBrochures()

const errorMessage = computed(() => error.value?.message ?? null)
const brochure = computed(() => brochures.value?.find(item => item.slug === slug))

watch([pending, brochures], () => {
  if (!pending.value && brochures.value && !brochure.value) {
    throw createError({ statusCode: 404, statusMessage: 'Brochure not found' })
  }
})

useHead({
  title: computed(() =>
    brochure.value
      ? `${brochure.title} | Verve Inspiration`
      : 'Brochure | Verve Inspiration',
  ),
})
</script>
