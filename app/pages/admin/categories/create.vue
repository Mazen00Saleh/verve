<template>
  <div>
    <AdminPageHeader
      title="Create Category"
      description="Add a new category with name and cover image."
    />

    <form class="max-w-2xl space-y-6 border border-neutral-200 bg-white p-8" @submit.prevent="handleSubmit">
      <AdminFormField label="Name" required>
        <template #default="{ inputId }">
          <input :id="inputId" v-model="form.name" type="text" required class="admin-input">
        </template>
      </AdminFormField>

      <AdminImageUploader
        v-model="coverImages"
        folder="categories"
        preset="catalog"
        label="Cover Image"
        hint="Image is optimized in the browser before upload."
        required
        @remove-image="trackRemovedImage"
      />

      <div class="flex gap-3">
        <button type="submit" class="btn-primary" :disabled="submitting || isUploading">
          {{ submitting ? 'Creating...' : 'Create Category' }}
        </button>
        <NuxtLink to="/admin/categories" class="btn-outline">Cancel</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { UploadedImage } from '~/composables/useImageUpload'

definePageMeta({ layout: 'admin' })

const { create } = useCategories()
const { trackRemovedImage, flushPendingDeletions } = usePendingImageDeletions()
const toast = useToast()

const form = reactive({
  name: '',
})

const coverImages = ref<UploadedImage[]>([])
const submitting = ref(false)

const isUploading = computed(() =>
  coverImages.value.some(image => image.status === 'compressing' || image.status === 'uploading'),
)

async function handleSubmit() {
  const imageUrl = coverImages.value.find(image => image.status === 'complete')?.url

  if (!imageUrl) {
    toast.error('Please upload a cover image.')
    return
  }

  submitting.value = true

  try {
    await flushPendingDeletions()

    const created = await create({
    name: form.name.trim(),
    description: null,
    image_url: imageUrl,
  })

    if (!created) {
      toast.error('Failed to create category.')
      return
    }

    toast.success('Category created successfully.')
    await navigateTo('/admin/categories')
  } catch {
    toast.error('Failed to create category.')
  } finally {
    submitting.value = false
  }
}

useHead({ title: 'Create Category | Verve Admin' })
</script>
