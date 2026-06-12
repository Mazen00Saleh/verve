<template>
  <div>
    <AdminPageHeader
      title="Create Brochure"
      description="Add a brochure with cover image, description, and a link to the PDF."
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
        folder="brochures"
        preset="primary"
        label="Cover Image"
        hint="Shown on the inspiration page. Image is optimized in the browser before upload."
        required
      />

      <AdminFormField label="Brochure URL" hint="Link to the hosted PDF or flipbook (e.g. Supabase Storage or external URL)." required>
        <template #default="{ inputId }">
          <input
            :id="inputId"
            v-model="form.file_url"
            type="url"
            required
            placeholder="https://example.com/brochure.pdf"
            class="admin-input"
          >
        </template>
      </AdminFormField>

      <div class="flex gap-3">
        <button type="submit" class="btn-primary" :disabled="submitting || isUploading || !hasCoverImage">
          {{ submitting ? 'Creating...' : 'Create Brochure' }}
        </button>
        <NuxtLink to="/admin/brochures" class="btn-outline">Cancel</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { UploadedImage } from '~/composables/useImageUpload'

definePageMeta({ layout: 'admin' })

const { create } = useBrochures()
const toast = useToast()

const form = reactive({
  name: '',
  description: '',
  file_url: '',
})

const coverImages = ref<UploadedImage[]>([])
const submitting = ref(false)

const isUploading = computed(() =>
  coverImages.value.some(image => image.status === 'compressing' || image.status === 'uploading'),
)

const hasCoverImage = computed(() =>
  coverImages.value.some(image => image.status === 'complete' && image.url),
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
    file_url: form.file_url.trim(),
  })

  submitting.value = false

  if (!created) {
    toast.error('Failed to create brochure.')
    return
  }

  await clearNuxtData('public-brochures')
  toast.success('Brochure created successfully.')
  await navigateTo('/admin/brochures')
}

useHead({ title: 'Create Brochure | Verve Admin' })
</script>

<style scoped>
.admin-input {
  @apply w-full border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-luxury-brass;
}
</style>
