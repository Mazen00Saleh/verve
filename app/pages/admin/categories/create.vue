<template>
  <div>
    <AdminPageHeader
      title="Create Category"
      description="Add a new category with name, description, and cover image."
    />

    <form class="max-w-2xl space-y-6 border border-neutral-200 bg-white p-8" @submit.prevent="handleSubmit">
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
        v-model="coverImages"
        folder="categories"
        preset="primary"
        label="Cover Image"
        hint="Image is optimized in the browser before upload."
        required
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
const toast = useToast()

const form = reactive({
  name: '',
  description: '',
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

  const created = await create({
    name: form.name.trim(),
    description: form.description.trim() || null,
    image_url: imageUrl,
  })

  submitting.value = false

  if (!created) {
    toast.error('Failed to create category.')
    return
  }

  toast.success('Category created successfully.')
  await navigateTo('/admin/categories')
}

useHead({ title: 'Create Category | Verve Admin' })
</script>

<style scoped>
.admin-input {
  @apply w-full border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-luxury-brass;
}
</style>
