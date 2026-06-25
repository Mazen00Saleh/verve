<template>
  <div>
    <AdminPageHeader
      title="Edit Product"
      description="Update product details and manage image groups."
    />

    <div v-if="loading" class="text-sm text-luxury-charcoal">Loading product...</div>

    <form v-else-if="product" class="max-w-3xl space-y-6 border border-neutral-200 bg-white p-8" @submit.prevent="handleSubmit">
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
        @remove-image="onRemoveImage"
      />

      <AdminImageUploader
        v-model="secondaryImages"
        folder="products"
        preset="catalog"
        label="Secondary Images"
        multiple
        @remove-image="onRemoveImage"
        @remove-record="markImageRemoved"
      />

      <AdminImageUploader
        v-model="mockupImages"
        folder="products"
        preset="catalog"
        label="Room Mockups"
        multiple
        @remove-image="onRemoveImage"
        @remove-record="markImageRemoved"
      />

      <div class="flex gap-3">
        <button type="submit" class="btn-primary" :disabled="submitting || isUploading">
          {{ submitting ? 'Saving...' : 'Save Changes' }}
        </button>
        <NuxtLink to="/admin/products" class="btn-outline">Cancel</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { CollectionWithCategory } from '~/composables/useCollections'
import type { ProductWithRelations } from '~/composables/useProducts'
import type { UploadedImage } from '~/composables/useImageUpload'
import { uploadedImageFromUrl } from '~/composables/useImageUpload'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const productId = route.params.id as string

const { fetchAll: fetchCollections } = useCollections()
const { fetchOne, update } = useProducts()
const { trackRemovedImage, flushPendingDeletions } = usePendingImageDeletions()
const toast = useToast()

const collections = ref<CollectionWithCategory[]>([])
const product = ref<ProductWithRelations | null>(null)
const loading = ref(true)
const submitting = ref(false)

const primaryImages = ref<UploadedImage[]>([])
const secondaryImages = ref<UploadedImage[]>([])
const mockupImages = ref<UploadedImage[]>([])
const removedImageIds = ref<string[]>([])

const form = reactive({
  collection_id: '',
  name: '',
  description: '',
})

const isUploading = computed(() =>
  [...primaryImages.value, ...secondaryImages.value, ...mockupImages.value]
    .some(image => image.status === 'compressing' || image.status === 'uploading'),
)

function markImageRemoved(recordId: string) {
  if (!removedImageIds.value.includes(recordId)) {
    removedImageIds.value.push(recordId)
  }
}

function onRemoveImage(image: UploadedImage) {
  if (image.recordId || product.value?.primary_image === image.url) {
    return
  }

  trackRemovedImage(image)
}

function newUploadUrls(images: UploadedImage[]) {
  return images
    .filter(image => image.status === 'complete' && !image.recordId)
    .map(image => image.url)
}

onMounted(async () => {
  const [collectionList, currentProduct] = await Promise.all([
    fetchCollections(),
    fetchOne(productId),
  ])

  collections.value = collectionList
  product.value = currentProduct

  if (!product.value) {
    toast.error('Product not found.')
    await navigateTo('/admin/products')
    return
  }

  form.collection_id = product.value.collection_id ?? ''
  form.name = product.value.name
  form.description = product.value.description ?? ''

  if (product.value.primary_image) {
    primaryImages.value = [uploadedImageFromUrl(product.value.primary_image)]
  }

  secondaryImages.value = (product.value.product_images ?? [])
    .filter(image => image.type === 'secondary')
    .map(image => uploadedImageFromUrl(image.url, image.id))

  mockupImages.value = (product.value.product_images ?? [])
    .filter(image => image.type === 'mockup')
    .map(image => uploadedImageFromUrl(image.url, image.id))

  loading.value = false
})

async function handleSubmit() {
  if (!product.value) {
    return
  }

  submitting.value = true

  try {
    await flushPendingDeletions()

    const updated = await update(productId, {
    collection_id: form.collection_id,
    name: form.name,
    description: form.description,
    primaryImageUrl: primaryImages.value.find(image => image.status === 'complete')?.url ?? null,
    secondaryImageUrls: newUploadUrls(secondaryImages.value),
    mockupImageUrls: newUploadUrls(mockupImages.value),
    removedImageIds: removedImageIds.value,
  }, product.value)

    if (!updated) {
      toast.error('Failed to update product.')
      return
    }

    toast.success('Product updated successfully.')
    await navigateTo('/admin/products')
  } catch {
    toast.error('Failed to update product images.')
  } finally {
    submitting.value = false
  }
}

useHead({ title: 'Edit Product | Verve Admin' })
</script>

<style scoped>
.admin-input {
  @apply w-full border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-luxury-brass;
}
</style>
