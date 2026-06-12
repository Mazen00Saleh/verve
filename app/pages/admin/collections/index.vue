<template>
  <div>
    <AdminPageHeader
      title="Collections"
      description="Manage collections within each category."
    >
      <template #actions>
        <NuxtLink to="/admin/collections/create" class="btn-primary">
          Create Collection
        </NuxtLink>
      </template>
    </AdminPageHeader>

    <div v-if="loading" class="text-sm text-luxury-charcoal">Loading collections...</div>

    <div v-else-if="!collections.length" class="border border-dashed border-neutral-300 bg-white p-10 text-center text-sm text-luxury-charcoal">
      No collections yet.
    </div>

    <div v-else class="overflow-x-auto border border-neutral-200 bg-white">
      <table class="min-w-full text-left text-sm">
        <thead class="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-widest text-luxury-charcoal">
          <tr>
            <th class="px-4 py-3">Image</th>
            <th class="px-4 py-3">Name</th>
            <th class="px-4 py-3">Category</th>
            <th class="px-4 py-3">Description</th>
            <th class="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="collection in collections" :key="collection.id" class="border-b border-neutral-100">
            <td class="px-4 py-4">
              <img
                v-if="collection.image_url"
                :src="collection.image_url"
                :alt="collection.name"
                class="h-14 w-20 object-cover"
              >
            </td>
            <td class="px-4 py-4 font-medium">{{ collection.name }}</td>
            <td class="px-4 py-4">{{ collection.categories?.name || '—' }}</td>
            <td class="px-4 py-4 text-luxury-charcoal">{{ collection.description || '—' }}</td>
            <td class="px-4 py-4">
              <div class="flex justify-end gap-2">
                <NuxtLink
                  :to="`/admin/collections/${collection.id}`"
                  class="border border-neutral-300 px-3 py-2 text-xs uppercase tracking-widest hover:border-luxury-brass"
                >
                  Edit
                </NuxtLink>
                <button
                  type="button"
                  class="border border-red-200 px-3 py-2 text-xs uppercase tracking-widest text-red-700 hover:bg-red-50 disabled:opacity-60"
                  :disabled="deletingId === collection.id"
                  @click="handleDelete(collection.id, collection.name)"
                >
                  {{ deletingId === collection.id ? 'Deleting...' : 'Delete' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CollectionWithCategory } from '~/composables/useCollections'

definePageMeta({ layout: 'admin' })

const { fetchAll, remove, loading } = useCollections()
const toast = useToast()

const collections = ref<CollectionWithCategory[]>([])
const deletingId = ref<string | null>(null)

async function loadCollections() {
  collections.value = await fetchAll()
}

async function handleDelete(id: string, name: string) {
  if (!confirm(`Delete collection "${name}" and all nested products?`)) {
    return
  }

  deletingId.value = id
  const success = await remove(id)
  deletingId.value = null

  if (success) {
    toast.success('Collection deleted successfully.')
    await loadCollections()
    return
  }

  toast.error('Failed to delete collection.')
}

onMounted(loadCollections)

useHead({ title: 'Admin Collections | Verve' })
</script>
