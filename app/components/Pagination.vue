<template>
  <div v-if="totalPages > 1" class="mt-10 flex justify-center border-t border-neutral-200 pt-8 sm:mt-12">
    <nav
      class="inline-flex items-center justify-center gap-1 sm:gap-2"
      aria-label="Pagination"
    >
      <button
        type="button"
        class="pagination-btn"
        :disabled="currentPage <= 1"
        aria-label="Previous page"
        @click="emitPageChange(currentPage - 1)"
      >
        <Icon name="lucide:chevron-left" size="18" />
        <span class="hidden sm:inline">Prev</span>
      </button>

      <div class="hidden items-center gap-1 sm:flex">
          <button
            v-if="visiblePages[0] > 1"
            type="button"
            class="pagination-page"
            @click="emitPageChange(1)"
          >
            1
          </button>
          <span v-if="visiblePages[0] > 2" class="px-1 text-luxury-muted">…</span>

          <button
            v-for="page in visiblePages"
            :key="page"
            type="button"
            class="pagination-page"
            :class="{ 'pagination-page-active': page === currentPage }"
            :aria-current="page === currentPage ? 'page' : undefined"
            @click="emitPageChange(page)"
          >
            {{ page }}
          </button>

          <span v-if="visiblePages[visiblePages.length - 1] < totalPages - 1" class="px-1 text-luxury-muted">…</span>
          <button
            v-if="visiblePages[visiblePages.length - 1] < totalPages"
            type="button"
            class="pagination-page"
            @click="emitPageChange(totalPages)"
          >
            {{ totalPages }}
          </button>
      </div>

      <span class="px-2 text-xs text-luxury-charcoal sm:hidden">
        {{ currentPage }} / {{ totalPages }}
      </span>

      <button
        type="button"
        class="pagination-btn"
        :disabled="currentPage >= totalPages"
        aria-label="Next page"
        @click="emitPageChange(currentPage + 1)"
      >
        <span class="hidden sm:inline">Next</span>
        <Icon name="lucide:chevron-right" size="18" />
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { getVisiblePageRange } from '~/utils/pagination'

const props = defineProps<{
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  itemLabel: string
}>()

const emit = defineEmits<{
  'page-change': [page: number]
}>()

const visiblePages = computed(() =>
  getVisiblePageRange(props.currentPage, props.totalPages),
)

function emitPageChange(page: number) {
  if (page < 1 || page > props.totalPages || page === props.currentPage) {
    return
  }

  emit('page-change', page)
}
</script>
