<template>
  <div>
    <AdminPageHeader
      title="Create Product"
      description="Add a product with a primary image, secondary images, and room mockups."
    />

    <form class="max-w-3xl space-y-6 border border-neutral-200 bg-white p-8" @submit.prevent="handleSubmit">
      <AdminFormField label="Collection" required>
        <template #default="{ inputId }">
          <select :id="inputId" v-model="form.collection_id" required class="admin-input">
            <option disabled value="">Select a collection</option>
            <option v-for="collection in collections" :key="collection.id" :value="collection.id">
              {{ collection.categories?.name }} / {{ collection.name }}
            </option>
          </select>
        </template>
      </AdminFormField>

      <AdminFormField label="Name" required>
        <template #default="{ inputId }">
          <input :id="inputId" v-model="form.name" type="text" required class="admin-input">
        </template>
      </AdminFormField>

      <AdminFormField label="Description">
        <template #default="{ inputId }">
          <textarea :id="inputId" v-model="form.description" rows="4" class="admin-input" />
        </template>
      </AdminFormField>

      <AdminImageUploader
        v-model="primaryImages"
        folder="products"
        preset="catalog"
        label="Primary Image"
        hint="Main product image shown on listings and detail pages."
        required
        @remove-image="trackRemovedImage"
      />

      <AdminImageUploader
        v-model="secondaryImages"
        folder="products"
        preset="catalog"
        label="Secondary Images"
        hint="Additional product views and detail shots."
        multiple
        @remove-image="trackRemovedImage"
      />

      <AdminImageUploader
        v-model="mockupImages"
        folder="products"
        preset="catalog"
        label="Room Mockups"
        hint="In-room inspiration images for this product."
        multiple
        @remove-image="trackRemovedImage"
      />

      <div class="flex gap-3">
        <button type="submit" class="btn-primary" :disabled="submitting || isUploading">
          {{ submitting ? 'Creating...' : 'Create Product' }}
        </button>
        <NuxtLink to="/admin/products" class="btn-outline">Cancel</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { CollectionWithCategory } from '~/composables/useCollections'
import type { UploadedImage } from '~/composables/useImageUpload'

definePageMeta({ layout: 'admin' })

const { fetchAll: fetchCollections } = useCollections()
const { create } = useProducts()
const { trackRemovedImage, flushPendingDeletions } = usePendingImageDeletions()
const toast = useToast()

const collections = ref<CollectionWithCategory[]>([])
const primaryImages = ref<UploadedImage[]>([])
const secondaryImages = ref<UploadedImage[]>([])
const mockupImages = ref<UploadedImage[]>([])
const submitting = ref(false)

const form = reactive({
  collection_id: '',
  name: '',
  description: '',
})

const isUploading = computed(() =>
  [...primaryImages.value, ...secondaryImages.value, ...mockupImages.value]
    .some(image => image.status === 'compressing' || image.status === 'uploading'),
)

function completedUrls(images: UploadedImage[]) {
  return images.filter(image => image.status === 'complete').map(image => image.url)
}

onMounted(async () => {
  collections.value = await fetchCollections()
})

async function handleSubmit() {
  const primaryImageUrl = primaryImages.value.find(image => image.status === 'complete')?.url

  if (!primaryImageUrl) {
    toast.error('Please upload a primary image.')
    return
  }

  submitting.value = true

  try {
    await flushPendingDeletions()

    const created = await create({
    collection_id: form.collection_id,
    name: form.name,
    description: form.description,
    primaryImageUrl,
    secondaryImageUrls: completedUrls(secondaryImages.value),
    mockupImageUrls: completedUrls(mockupImages.value),
  })

    if (!created) {
      toast.error('Failed to create product.')
      return
    }

    toast.success('Product created successfully.')
    await navigateTo('/admin/products')
  } catch {
    toast.error('Failed to create product.')
  } finally {
    submitting.value = false
  }
}

useHead({ title: 'Create Product | Verve Admin' })
</script>

<style scoped>
.admin-input {
  @apply w-full border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-luxury-brass;
}
</style>
