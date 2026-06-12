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

    <div v-if="loading" class="text-sm text-luxury-charcoal">Loading hero slides...</div>

    <div v-else-if="!slides.length" class="border border-dashed border-neutral-300 bg-white p-10 text-center text-sm text-luxury-charcoal">
      No hero slides yet. The homepage will fall back to featured collections until slides are added.
    </div>

    <div v-else class="overflow-x-auto border border-neutral-200 bg-white">
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
          <tr v-for="slide in slides" :key="slide.id" class="border-b border-neutral-100">
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
            <td class="px-4 py-4 max-w-xs truncate">{{ slide.link_url }}</td>
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
  </div>
</template>

<script setup lang="ts">
import type { HeroSlide } from '~/composables/useHeroSlides'

definePageMeta({ layout: 'admin' })

const { fetchAll, remove, loading } = useHeroSlides()
const toast = useToast()

const slides = ref<HeroSlide[]>([])
const deletingId = ref<string | null>(null)

async function loadSlides() {
  slides.value = await fetchAll()
}

async function handleDelete(id: string, title: string) {
  if (!confirm(`Delete hero slide "${title}"?`)) {
    return
  }

  deletingId.value = id
  const success = await remove(id)
  deletingId.value = null

  if (success) {
    toast.success('Hero slide deleted.')
    await loadSlides()
    return
  }

  toast.error('Failed to delete hero slide.')
}

onMounted(loadSlides)

useHead({ title: 'Admin Hero Slides | Verve' })
</script>
