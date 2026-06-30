<template>
  <div class="mb-6 flex flex-col gap-4 border border-neutral-200 bg-white p-4 sm:flex-row sm:flex-wrap sm:items-end">
    <div class="min-w-[220px] flex-1">
      <label :for="searchId" class="mb-2 block text-xs uppercase tracking-widest text-luxury-charcoal">
        Search
      </label>
      <input
        :id="searchId"
        :value="search"
        type="search"
        :placeholder="searchPlaceholder"
        class="admin-input"
        @input="emit('update:search', ($event.target as HTMLInputElement).value)"
      >
    </div>

    <div
      v-for="select in selects"
      :key="select.key"
      class="min-w-[180px]"
    >
      <label :for="`${searchId}-${select.key}`" class="mb-2 block text-xs uppercase tracking-widest text-luxury-charcoal">
        {{ select.label }}
      </label>
      <select
        :id="`${searchId}-${select.key}`"
        :value="selectValues[select.key] ?? ''"
        class="admin-input"
        @change="emit('update:select', select.key, ($event.target as HTMLSelectElement).value)"
      >
        <option value="">
          {{ select.allLabel ?? 'All' }}
        </option>
        <option
          v-for="option in select.options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </div>

    <button
      v-if="hasActiveFilters"
      type="button"
      class="border border-neutral-300 px-4 py-3 text-xs uppercase tracking-widest text-luxury-charcoal transition-colors hover:border-luxury-brass hover:text-luxury-matte-black"
      @click="emit('clear')"
    >
      Clear filters
    </button>
  </div>
</template>

<script setup lang="ts">
import type { AdminListSelectFilter } from '~/types/adminList'

defineProps<{
  search: string
  searchPlaceholder: string
  selects: AdminListSelectFilter[]
  selectValues: Record<string, string>
  hasActiveFilters: boolean
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:select': [key: string, value: string]
  clear: []
}>()

const searchId = `admin-search-${useId()}`
</script>
