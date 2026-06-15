<template>
  <div>
    <AdminPageHeader
      title="Edit Brand Logo"
      description="Replace the logo image shown in the homepage carousel."
    />

    <div v-if="loading" class="text-sm text-luxury-charcoal">Loading brand logo...</div>

    <form v-else-if="brandLogo" class="max-w-2xl space-y-6 border border-neutral-200 bg-white p-8" @submit.prevent="handleSubmit">
      <AdminImageUploader
        v-model="logoImages"
        folder="brands"
        preset="gallery"
        label="Brand Logo"
        hint="Required. Upload a new image to replace the current logo."
        required
      />

      <div class="flex gap-3">
        <button type="submit" class="btn-primary" :disabled="submitting || isUploading || !hasLogoImage">
          {{ submitting ? 'Saving...' : 'Save Changes' }}
        </button>
        <NuxtLink to="/admin/brand-logos" class="btn-outline">Cancel</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { BrandLogo } from '~/composables/useBrandLogos'
import type { UploadedImage } from '~/composables/useImageUpload'
import { uploadedImageFromUrl } from '~/composables/useImageUpload'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const brandLogoId = route.params.id as string

const { fetchOne, update } = useBrandLogos()
const { deleteByUrl } = useFileUpload()
const toast = useToast()

const brandLogo = ref<BrandLogo | null>(null)
const loading = ref(true)
const submitting = ref(false)
const logoImages = ref<UploadedImage[]>([])
const previousLogoUrl = ref<string | null>(null)

const isUploading = computed(() =>
  logoImages.value.some(image => image.status === 'compressing' || image.status === 'uploading'),
)

const hasLogoImage = computed(() =>
  logoImages.value.some(image => image.status === 'complete' && image.url),
)

onMounted(async () => {
  brandLogo.value = await fetchOne(brandLogoId)

  if (!brandLogo.value) {
    toast.error('Brand logo not found.')
    await navigateTo('/admin/brand-logos')
    return
  }

  previousLogoUrl.value = brandLogo.value.logo_url

  if (brandLogo.value.logo_url) {
    logoImages.value = [uploadedImageFromUrl(brandLogo.value.logo_url)]
  }

  loading.value = false
})

async function handleSubmit() {
  if (!brandLogo.value) {
    return
  }

  const nextLogoUrl = logoImages.value.find(image => image.status === 'complete')?.url

  if (!nextLogoUrl) {
    toast.error('Please upload a brand logo.')
    return
  }

  submitting.value = true

  try {
    if (previousLogoUrl.value && previousLogoUrl.value !== nextLogoUrl) {
      await deleteByUrl(previousLogoUrl.value)
    }

    const updated = await update(brandLogoId, {
      logo_url: nextLogoUrl,
    })

    if (!updated) {
      toast.error('Failed to update brand logo.')
      return
    }

    await clearNuxtData('public-brand-logos')
    toast.success('Brand logo updated successfully.')
    await navigateTo('/admin/brand-logos')
  } catch {
    toast.error('Failed to update brand logo image.')
  } finally {
    submitting.value = false
  }
}

useHead({ title: 'Edit Brand Logo | Verve Admin' })
</script>
