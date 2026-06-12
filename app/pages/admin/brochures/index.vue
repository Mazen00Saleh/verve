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

    <div v-if="loading" class="text-sm text-luxury-charcoal">Loading brochures...</div>

    <div v-else-if="!brochures.length" class="border border-dashed border-neutral-300 bg-white p-10 text-center text-sm text-luxury-charcoal">
      No brochures yet.
    </div>

    <div v-else class="overflow-x-auto border border-neutral-200 bg-white">
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
          <tr v-for="brochure in brochures" :key="brochure.id" class="border-b border-neutral-100">
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
            <td class="px-4 py-4 max-w-xs truncate">
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
  </div>
</template>

<script setup lang="ts">
import type { Brochure } from '~/composables/useBrochures'

definePageMeta({ layout: 'admin' })

const { fetchAll, remove, loading } = useBrochures()
const toast = useToast()

const brochures = ref<Brochure[]>([])
const deletingId = ref<string | null>(null)

async function loadBrochures() {
  brochures.value = await fetchAll()
}

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
    await loadBrochures()
    return
  }

  toast.error('Failed to delete brochure.')
}

onMounted(loadBrochures)

useHead({ title: 'Admin Brochures | Verve' })
</script>
