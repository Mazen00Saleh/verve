<template>
  <div>
    <AdminPageHeader
      title="Edit Brochure"
      description="Update brochure details, cover image, or PDF link."
    />

    <div v-if="loading" class="text-sm text-luxury-charcoal">Loading brochure...</div>

    <form v-else-if="brochure" class="max-w-2xl space-y-6 border border-neutral-200 bg-white p-8" @submit.prevent="handleSubmit">
      <AdminFormField label="Name" required>
        <template #default="{ inputId }">
          <input :id="inputId" v-model="form.name" type="text" required class="admin-input">
        </template>
      </AdminFormField>

      <AdminImageUploader
        v-model="coverImages"
        folder="brochures"
        preset="primary"
        label="Cover Image"
        hint="Required. Upload a new image to replace the current cover."
        required
        @remove-image="trackRemovedImage"
      />

      <AdminFormField label="Brochure URL" hint="Link to the hosted PDF or flipbook." required>
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
          {{ submitting ? 'Saving...' : 'Save Changes' }}
        </button>
        <NuxtLink to="/admin/brochures" class="btn-outline">Cancel</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Brochure } from '~/composables/useBrochures'
import type { UploadedImage } from '~/composables/useImageUpload'
import { uploadedImageFromUrl } from '~/composables/useImageUpload'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const brochureId = route.params.id as string

const { fetchOne, update } = useBrochures()
const { trackRemovedImage, flushPendingDeletions } = usePendingImageDeletions()
const toast = useToast()

const brochure = ref<Brochure | null>(null)
const loading = ref(true)
const submitting = ref(false)
const coverImages = ref<UploadedImage[]>([])

const form = reactive({
  name: '',
  file_url: '',
})

const isUploading = computed(() =>
  coverImages.value.some(image => image.status === 'compressing' || image.status === 'uploading'),
)

const hasCoverImage = computed(() =>
  coverImages.value.some(image => image.status === 'complete' && image.url),
)

onMounted(async () => {
  brochure.value = await fetchOne(brochureId)

  if (!brochure.value) {
    toast.error('Brochure not found.')
    await navigateTo('/admin/brochures')
    return
  }

  form.name = brochure.value.name
  form.file_url = brochure.value.file_url ?? ''

  if (brochure.value.image_url) {
    coverImages.value = [uploadedImageFromUrl(brochure.value.image_url)]
  }

  loading.value = false
})

async function handleSubmit() {
  if (!brochure.value) {
    return
  }

  const nextImageUrl = coverImages.value.find(image => image.status === 'complete')?.url

  if (!nextImageUrl) {
    toast.error('Please upload a cover image.')
    return
  }

  submitting.value = true

  try {
    await flushPendingDeletions()

    const updated = await update(brochureId, {
      name: form.name.trim(),
      description: null,
      image_url: nextImageUrl,
      file_url: form.file_url.trim(),
    })

    if (!updated) {
      toast.error('Failed to update brochure.')
      return
    }

    await clearNuxtData('public-brochures')
    toast.success('Brochure updated successfully.')
    await navigateTo('/admin/brochures')
  } catch {
    toast.error('Failed to update brochure image.')
  } finally {
    submitting.value = false
  }
}

useHead({ title: 'Edit Brochure | Verve Admin' })
</script>

<style scoped>
.admin-input {
  @apply w-full border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-luxury-brass;
}
</style>
