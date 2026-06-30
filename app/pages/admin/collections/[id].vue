<template>
  <div>
    <AdminPageHeader
      title="Edit Collection"
      description="Update collection details or replace the cover image."
    />

    <div v-if="loading" class="text-sm text-luxury-charcoal">Loading collection...</div>

    <form v-else-if="collection" class="max-w-2xl space-y-6 border border-neutral-200 bg-white p-8" @submit.prevent="handleSubmit">
      <AdminFormField label="Category" required>
        <template #default="{ inputId }">
          <select :id="inputId" v-model="form.category_id" required class="admin-input">
            <option disabled value="">Select a category</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </template>
      </AdminFormField>

      <AdminFormField label="Name" required>
        <template #default="{ inputId }">
          <input :id="inputId" v-model="form.name" type="text" required class="admin-input">
        </template>
      </AdminFormField>

      <AdminImageUploader
        v-model="coverImages"
        folder="collections"
        preset="catalog"
        label="Cover Image"
        hint="Upload a new image to replace the current cover."
        @remove-image="trackRemovedImage"
      />

      <div class="flex gap-3">
        <button type="submit" class="btn-primary" :disabled="submitting || isUploading">
          {{ submitting ? 'Saving...' : 'Save Changes' }}
        </button>
        <NuxtLink to="/admin/collections" class="btn-outline">Cancel</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~/composables/useCategories'
import type { Collection } from '~/composables/useCollections'
import type { UploadedImage } from '~/composables/useImageUpload'
import { uploadedImageFromUrl } from '~/composables/useImageUpload'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const collectionId = route.params.id as string

const { fetchAll: fetchCategories } = useCategories()
const { fetchOne, update } = useCollections()
const { trackRemovedImage, flushPendingDeletions } = usePendingImageDeletions()
const toast = useToast()

const categories = ref<Category[]>([])
const collection = ref<Collection | null>(null)
const loading = ref(true)
const submitting = ref(false)
const coverImages = ref<UploadedImage[]>([])

const form = reactive({
  category_id: '',
  name: '',
})

const isUploading = computed(() =>
  coverImages.value.some(image => image.status === 'compressing' || image.status === 'uploading'),
)

onMounted(async () => {
  const [categoryList, currentCollection] = await Promise.all([
    fetchCategories(),
    fetchOne(collectionId),
  ])

  categories.value = categoryList
  collection.value = currentCollection

  if (!collection.value) {
    toast.error('Collection not found.')
    await navigateTo('/admin/collections')
    return
  }

  form.category_id = collection.value.category_id ?? ''
  form.name = collection.value.name

  if (collection.value.image_url) {
    coverImages.value = [uploadedImageFromUrl(collection.value.image_url)]
  }

  loading.value = false
})

async function handleSubmit() {
  if (!collection.value) {
    return
  }

  submitting.value = true

  try {
    await flushPendingDeletions()

    const nextImageUrl = coverImages.value.find(image => image.status === 'complete')?.url ?? null

    const updated = await update(collectionId, {
      category_id: form.category_id,
      name: form.name.trim(),
      description: null,
      image_url: nextImageUrl,
    })

    if (!updated) {
      toast.error('Failed to update collection.')
      return
    }

    toast.success('Collection updated successfully.')
    await navigateTo('/admin/collections')
  } catch {
    toast.error('Failed to update collection image.')
  } finally {
    submitting.value = false
  }
}

useHead({ title: 'Edit Collection | Verve Admin' })
</script>
