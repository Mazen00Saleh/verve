<template>
  <div>
    <AdminPageHeader
      title="Brand Logos"
      description="Manage partner logos shown in the homepage carousel."
    >
      <template #actions>
        <NuxtLink to="/admin/brand-logos/create" class="btn-primary">
          Create Brand Logo
        </NuxtLink>
      </template>
    </AdminPageHeader>

    <AdminListToolbar
      :search="searchInput"
      :search-placeholder="searchPlaceholder"
      :selects="[]"
      :select-values="selectValues"
      :has-active-filters="hasActiveFilters"
      @update:search="searchInput = $event"
      @update:select="setSelectValue"
      @clear="clearFilters"
    />

    <div v-if="pending" class="text-sm text-luxury-charcoal">Loading brand logos...</div>

    <div v-else-if="!items.length && total === 0 && !hasActiveFilters" class="border border-dashed border-neutral-300 bg-white p-10 text-center text-sm text-luxury-charcoal">
      No brand logos yet.
    </div>

    <div v-else-if="!items.length && total === 0 && hasActiveFilters" class="border border-dashed border-neutral-300 bg-white p-10 text-center text-sm text-luxury-charcoal">
      No brand logos match your search.
    </div>

    <template v-else>
      <div class="overflow-x-auto border border-neutral-200 bg-white">
        <table class="min-w-full text-left text-sm">
          <thead class="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-widest text-luxury-charcoal">
            <tr>
              <th class="px-4 py-3">Logo</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="brandLogo in items" :key="brandLogo.id" class="border-b border-neutral-100">
              <td class="px-4 py-4">
                <img
                  v-if="brandLogo.logo_url"
                  :src="brandLogo.logo_url"
                  alt=""
                  class="h-10 w-auto max-w-[8rem] object-contain"
                >
                <span v-else class="text-xs text-luxury-charcoal">—</span>
              </td>
              <td class="px-4 py-4">
                <div class="flex justify-end gap-2">
                  <NuxtLink
                    :to="`/admin/brand-logos/${brandLogo.id}`"
                    class="border border-neutral-300 px-3 py-2 text-xs uppercase tracking-widest hover:border-luxury-brass"
                  >
                    Edit
                  </NuxtLink>
                  <button
                    type="button"
                    class="border border-red-200 px-3 py-2 text-xs uppercase tracking-widest text-red-700 hover:bg-red-50 disabled:opacity-60"
                    :disabled="deletingId === brandLogo.id"
                    @click="handleDelete(brandLogo.id)"
                  >
                    {{ deletingId === brandLogo.id ? 'Deleting...' : 'Delete' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Pagination
        :current-page="page"
        :total-pages="totalPages"
        :total-items="total"
        :page-size="pageSize"
        item-label="brand logos"
        @page-change="setPage"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { fetchPage, remove } = useBrandLogos()
const toast = useToast()
const {
  searchInput,
  selectValues,
  filters,
  hasActiveFilters,
  searchPlaceholder,
  setSelectValue,
  clearFilters,
} = useAdminListFilters({ searchPlaceholder: 'Search brand logos...' })
const { items, total, page, totalPages, pending, refresh, setPage, pageSize } = useAdminPaginatedList(
  'admin-brand-logos',
  fetchPage,
  filters,
)

const deletingId = ref<string | null>(null)

async function handleDelete(id: string) {
  if (!confirm('Delete this brand logo?')) {
    return
  }

  deletingId.value = id
  const success = await remove(id)
  deletingId.value = null

  if (success) {
    await clearNuxtData('public-brand-logos')
    toast.success('Brand logo deleted successfully.')
    await refresh()
    return
  }

  toast.error('Failed to delete brand logo.')
}

useHead({ title: 'Admin Brand Logos | Verve' })
</script>
