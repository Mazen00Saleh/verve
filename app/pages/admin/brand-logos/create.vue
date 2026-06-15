<template>
  <div>
    <AdminPageHeader
      title="Create Brand Logo"
      description="Add a partner logo for the homepage carousel."
    />

    <form class="max-w-2xl space-y-6 border border-neutral-200 bg-white p-8" @submit.prevent="handleSubmit">
      <AdminImageUploader
        v-model="logoImages"
        folder="brands"
        preset="gallery"
        label="Brand Logo"
        hint="Image is optimized in the browser before upload."
        required
      />

      <div class="flex gap-3">
        <button type="submit" class="btn-primary" :disabled="submitting || isUploading || !hasLogoImage">
          {{ submitting ? 'Creating...' : 'Create Brand Logo' }}
        </button>
        <NuxtLink to="/admin/brand-logos" class="btn-outline">Cancel</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { UploadedImage } from '~/composables/useImageUpload'

definePageMeta({ layout: 'admin' })

const { create } = useBrandLogos()
const toast = useToast()

const logoImages = ref<UploadedImage[]>([])
const submitting = ref(false)

const isUploading = computed(() =>
  logoImages.value.some(image => image.status === 'compressing' || image.status === 'uploading'),
)

const hasLogoImage = computed(() =>
  logoImages.value.some(image => image.status === 'complete' && image.url),
)

async function handleSubmit() {
  const logoUrl = logoImages.value.find(image => image.status === 'complete')?.url

  if (!logoUrl) {
    toast.error('Please upload a brand logo.')
    return
  }

  submitting.value = true

  const created = await create({
    name: 'Brand Logo',
    logo_url: logoUrl,
    order_index: 0,
  })

  submitting.value = false

  if (!created) {
    toast.error('Failed to create brand logo.')
    return
  }

  await clearNuxtData('public-brand-logos')
  toast.success('Brand logo created successfully.')
  await navigateTo('/admin/brand-logos')
}

useHead({ title: 'Create Brand Logo | Verve Admin' })
</script>
