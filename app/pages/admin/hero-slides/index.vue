<template>
  <div>
    <AdminPageHeader
      title="Hero Slides"
      description="Curate homepage hero carousel slides. Active slides appear in order on the public site."
    >
      <template #actions>
        <NuxtLink to="/admin/hero-slides/create" class="btn-primary">
          Create Slide
        </NuxtLink>
      </template>
    </AdminPageHeader>

    <div v-if="pending" class="text-sm text-luxury-charcoal">Loading hero slides...</div>

    <div v-else-if="!items.length && total === 0" class="border border-dashed border-neutral-300 bg-white p-10 text-center text-sm text-luxury-charcoal">
      No hero slides yet. The homepage will fall back to featured collections until slides are added.
    </div>

    <template v-else>
      <div class="overflow-x-auto border border-neutral-200 bg-white">
        <table class="min-w-full text-left text-sm">
          <thead class="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-widest text-luxury-charcoal">
            <tr>
              <th class="px-4 py-3">Preview</th>
              <th class="px-4 py-3">Title</th>
              <th class="px-4 py-3">Order</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Link</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="slide in items" :key="slide.id" class="border-b border-neutral-100">
              <td class="px-4 py-4">
                <img :src="slide.right_image_url" :alt="slide.title" class="h-14 w-20 object-cover">
              </td>
              <td class="px-4 py-4 font-medium">{{ slide.title }}</td>
              <td class="px-4 py-4">{{ slide.order_index }}</td>
              <td class="px-4 py-4">
                <span :class="slide.is_active ? 'text-emerald-700' : 'text-luxury-charcoal'">
                  {{ slide.is_active ? 'Active' : 'Hidden' }}
                </span>
              </td>
              <td class="max-w-xs truncate px-4 py-4">{{ slide.link_url }}</td>
              <td class="px-4 py-4">
                <div class="flex justify-end gap-2">
                  <NuxtLink
                    :to="`/admin/hero-slides/${slide.id}`"
                    class="border border-neutral-300 px-3 py-2 text-xs uppercase tracking-widest hover:border-luxury-brass"
                  >
                    Edit
                  </NuxtLink>
                  <button
                    type="button"
                    class="border border-red-200 px-3 py-2 text-xs uppercase tracking-widest text-red-700 hover:bg-red-50 disabled:opacity-60"
                    :disabled="deletingId === slide.id"
                    @click="handleDelete(slide.id, slide.title)"
                  >
                    {{ deletingId === slide.id ? 'Deleting...' : 'Delete' }}
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
        item-label="slides"
        @page-change="setPage"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { fetchPage, remove } = useHeroSlides()
const toast = useToast()
const { items, total, page, totalPages, pending, refresh, setPage, pageSize } = useAdminPaginatedList(
  'admin-hero-slides',
  fetchPage,
)

const deletingId = ref<string | null>(null)

async function handleDelete(id: string, title: string) {
  if (!confirm(`Delete hero slide "${title}"?`)) {
    return
  }

  deletingId.value = id
  const success = await remove(id)
  deletingId.value = null

  if (success) {
    toast.success('Hero slide deleted.')
    await refresh()
    return
  }

  toast.error('Failed to delete hero slide.')
}

useHead({ title: 'Admin Hero Slides | Verve' })
</script>
