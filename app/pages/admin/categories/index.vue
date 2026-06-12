<template>
  <div>
    <AdminPageHeader
      title="Categories"
      description="Manage the top-level product categories displayed on the public site."
    >
      <template #actions>
        <NuxtLink to="/admin/categories/create" class="btn-primary">
          Create Category
        </NuxtLink>
      </template>
    </AdminPageHeader>

    <div v-if="loading" class="text-sm text-luxury-charcoal">Loading categories...</div>

    <div v-else-if="!categories.length" class="border border-dashed border-neutral-300 bg-white p-10 text-center text-sm text-luxury-charcoal">
      No categories yet. Create your first category to get started.
    </div>

    <div v-else class="overflow-x-auto border border-neutral-200 bg-white">
      <table class="min-w-full text-left text-sm">
        <thead class="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-widest text-luxury-charcoal">
          <tr>
            <th class="px-4 py-3">Image</th>
            <th class="px-4 py-3">Name</th>
            <th class="px-4 py-3">Description</th>
            <th class="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category.id" class="border-b border-neutral-100">
            <td class="px-4 py-4">
              <img
                v-if="category.image_url"
                :src="category.image_url"
                :alt="category.name"
                class="h-14 w-20 object-cover"
              >
            </td>
            <td class="px-4 py-4 font-medium">{{ category.name }}</td>
            <td class="px-4 py-4 text-luxury-charcoal">{{ category.description || '—' }}</td>
            <td class="px-4 py-4">
              <div class="flex justify-end gap-2">
                <NuxtLink
                  :to="`/admin/categories/${category.id}`"
                  class="border border-neutral-300 px-3 py-2 text-xs uppercase tracking-widest hover:border-luxury-brass"
                >
                  Edit
                </NuxtLink>
                <button
                  type="button"
                  class="border border-red-200 px-3 py-2 text-xs uppercase tracking-widest text-red-700 hover:bg-red-50 disabled:opacity-60"
                  :disabled="deletingId === category.id"
                  @click="handleDelete(category.id, category.name)"
                >
                  {{ deletingId === category.id ? 'Deleting...' : 'Delete' }}
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
import type { Category } from '~/composables/useCategories'

definePageMeta({ layout: 'admin' })

const { fetchAll, remove, loading } = useCategories()
const toast = useToast()

const categories = ref<Category[]>([])
const deletingId = ref<string | null>(null)

async function loadCategories() {
  categories.value = await fetchAll()
}

async function handleDelete(id: string, name: string) {
  if (!confirm(`Delete category "${name}" and all nested collections/products?`)) {
    return
  }

  deletingId.value = id
  const success = await remove(id)
  deletingId.value = null

  if (success) {
    toast.success('Category deleted successfully.')
    await loadCategories()
    return
  }

  toast.error('Failed to delete category.')
}

onMounted(loadCategories)

useHead({ title: 'Admin Categories | Verve' })
</script>
