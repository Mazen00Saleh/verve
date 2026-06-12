<template>
  <div>
    <AdminPageHeader
      title="Brochures"
      description="Manage brochure links for the inspiration section."
    >
      <template #actions>
        <NuxtLink to="/admin/brochures/create" class="btn-primary">
          Create Brochure
        </NuxtLink>
      </template>
    </AdminPageHeader>

    <div v-if="pending" class="text-sm text-luxury-charcoal">Loading brochures...</div>

    <div v-else-if="!items.length && total === 0" class="border border-dashed border-neutral-300 bg-white p-10 text-center text-sm text-luxury-charcoal">
      No brochures yet.
    </div>

    <template v-else>
      <div class="overflow-x-auto border border-neutral-200 bg-white">
        <table class="min-w-full text-left text-sm">
          <thead class="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-widest text-luxury-charcoal">
            <tr>
              <th class="px-4 py-3">Cover</th>
              <th class="px-4 py-3">Name</th>
              <th class="px-4 py-3">Description</th>
              <th class="px-4 py-3">URL</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="brochure in items" :key="brochure.id" class="border-b border-neutral-100">
              <td class="px-4 py-4">
                <img
                  v-if="brochure.image_url"
                  :src="brochure.image_url"
                  :alt="brochure.name"
                  class="h-14 w-10 object-cover"
                >
                <span v-else class="text-xs text-luxury-charcoal">—</span>
              </td>
              <td class="px-4 py-4 font-medium">{{ brochure.name }}</td>
              <td class="px-4 py-4 text-luxury-charcoal">{{ brochure.description || '—' }}</td>
              <td class="max-w-xs truncate px-4 py-4">
                <a
                  v-if="brochure.file_url"
                  :href="brochure.file_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="underline hover:text-luxury-brass"
                >
                  {{ brochure.file_url }}
                </a>
                <span v-else>—</span>
              </td>
              <td class="px-4 py-4">
                <div class="flex justify-end gap-2">
                  <NuxtLink
                    :to="`/admin/brochures/${brochure.id}`"
                    class="border border-neutral-300 px-3 py-2 text-xs uppercase tracking-widest hover:border-luxury-brass"
                  >
                    Edit
                  </NuxtLink>
                  <button
                    type="button"
                    class="border border-red-200 px-3 py-2 text-xs uppercase tracking-widest text-red-700 hover:bg-red-50 disabled:opacity-60"
                    :disabled="deletingId === brochure.id"
                    @click="handleDelete(brochure.id, brochure.name)"
                  >
                    {{ deletingId === brochure.id ? 'Deleting...' : 'Delete' }}
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
        item-label="brochures"
        @page-change="setPage"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { fetchPage, remove } = useBrochures()
const toast = useToast()
const { items, total, page, totalPages, pending, refresh, setPage, pageSize } = useAdminPaginatedList(
  'admin-brochures',
  fetchPage,
)

const deletingId = ref<string | null>(null)

async function handleDelete(id: string, name: string) {
  if (!confirm(`Delete brochure "${name}"?`)) {
    return
  }

  deletingId.value = id
  const success = await remove(id)
  deletingId.value = null

  if (success) {
    await clearNuxtData('public-brochures')
    toast.success('Brochure deleted successfully.')
    await refresh()
    return
  }

  toast.error('Failed to delete brochure.')
}

useHead({ title: 'Admin Brochures | Verve' })
</script>
