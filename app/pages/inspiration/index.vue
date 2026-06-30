<template>
  <div class="page-shell">
    <div class="page-container py-8 sm:py-12 md:py-16">
      <h1 class="sr-only">Inspiration | Verve Luxury Interiors</h1>
      <PageState
        :pending="pending"
        :error-message="errorMessage"
        :empty="!pending && total === 0"
        empty-title="No brochures yet"
        empty-message="Brochures will appear here once they are published."
        :retry="refresh"
      >
        <CatalogGridSkeleton v-if="pending" grid-class="md:grid-cols-3 lg:grid-cols-4" />

        <template v-else>
          <div class="catalog-grid md:grid-cols-3 lg:grid-cols-4">
            <BrochureCard
              v-for="brochure in items"
              :key="brochure.id"
              :brochure="brochure"
              @open="openBrochure"
            />
          </div>

          <Pagination
            :current-page="page"
            :total-pages="totalPages"
            :total-items="total"
            :page-size="pageSize"
            item-label="brochures"
            @page-change="setPage"
          />
        </template>
      </PageState>
    </div>

    <Transition name="overlay-fade">
      <div
        v-if="activeBrochureUrl"
        class="fixed inset-0 z-50 flex items-center justify-center bg-luxury-matte-black/90 p-4 backdrop-blur-md sm:p-6 md:p-10"
        @click.self="closeBrochure"
      >
        <div class="relative flex h-full max-h-[85vh] w-full max-w-6xl flex-col overflow-hidden rounded-sm bg-white shadow-2xl">
          <div class="flex items-center justify-between border-b border-luxury-brass/10 bg-luxury-matte-black px-4 py-4 text-luxury-ivory sm:px-6">
            <h3 class="truncate pr-4 text-sm tracking-wide">
              {{ activeBrochureTitle }}
            </h3>
            <button
              type="button"
              class="flex shrink-0 items-center space-x-1.5 text-xs font-medium uppercase tracking-widest text-luxury-brass-light transition-colors hover:text-white"
              @click="closeBrochure"
            >
              <span>Close</span>
              <Icon name="lucide:x" size="16" />
            </button>
          </div>

          <div class="relative h-full w-full flex-grow bg-neutral-900">
            <iframe
              v-if="activeBrochureUrl"
              :src="activeBrochureUrl"
              class="absolute inset-0 h-full w-full border-0"
              allowfullscreen
              allow="clipboard-write"
            />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { PublicBrochure } from '~/types/catalog'

const { data, pending, error, refresh } = await usePaginatedBrochures()
const { setPage, pageSize } = useRoutePagination('brochures')

const errorMessage = computed(() => error.value?.message ?? null)
const items = computed(() => data.value?.items ?? [])
const total = computed(() => data.value?.total ?? 0)
const page = computed(() => data.value?.page ?? 1)
const totalPages = computed(() => data.value?.totalPages ?? 1)

const activeBrochureUrl = ref<string | null>(null)
const activeBrochureTitle = ref('')

function openBrochure(brochure: PublicBrochure) {
  if (!brochure.fileUrl) {
    return
  }

  activeBrochureUrl.value = brochure.fileUrl
  activeBrochureTitle.value = brochure.title
}

function closeBrochure() {
  activeBrochureUrl.value = null
  activeBrochureTitle.value = ''
}

watch(activeBrochureUrl, (value) => {
  if (typeof document === 'undefined') {
    return
  }

  document.body.classList.toggle('overflow-hidden', Boolean(value))
})


usePageSeo({
  title: 'Inspiration | Verve Luxury Interiors',
  description: 'Explore the Verve brochures and collection catalog files for premium design inspirations.',
  path: computed(() => buildCanonicalPath('/inspiration', page.value)),
})
</script>
