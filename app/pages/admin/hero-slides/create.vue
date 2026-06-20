<template>
  <div>
    <AdminPageHeader
      title="Create Hero Slide"
      description="Add a curated slide to the homepage hero carousel."
    />

    <form class="max-w-2xl space-y-6 border border-neutral-200 bg-white p-8" @submit.prevent="handleSubmit">
      <div class="flex justify-end border-b border-neutral-100 pb-6">
        <AdminToggle v-model="form.is_active" label="Active" />
      </div>

      <AdminFormField label="Title" required>
        <template #default="{ inputId }">
          <input :id="inputId" v-model="form.title" type="text" required class="admin-input">
        </template>
      </AdminFormField>

      <AdminFormField label="Description">
        <template #default="{ inputId }">
          <textarea :id="inputId" v-model="form.description" rows="4" class="admin-input" />
        </template>
      </AdminFormField>

      <AdminImageUploader
        v-model="leftImages"
        folder="hero"
        preset="gallery"
        label="Left Image"
        hint="Texture or detail image shown on the left column (desktop)."
        required
        @remove-image="trackRemovedImage"
      />

      <AdminImageUploader
        v-model="rightImages"
        folder="hero"
        preset="primary"
        label="Right Image"
        hint="Main lifestyle image shown on the right."
        required
        @remove-image="trackRemovedImage"
      />

      <div class="flex gap-3">
        <button type="submit" class="btn-primary" :disabled="submitting || isUploading">
          {{ submitting ? 'Creating...' : 'Create Slide' }}
        </button>
        <NuxtLink to="/admin/hero-slides" class="btn-outline">Cancel</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { UploadedImage } from '~/composables/useImageUpload'

definePageMeta({ layout: 'admin' })

const { create } = useHeroSlides()
const { trackRemovedImage, flushPendingDeletions } = usePendingImageDeletions()
const toast = useToast()

const form = reactive({
  title: '',
  description: '',
  is_active: true,
})

const leftImages = ref<UploadedImage[]>([])
const rightImages = ref<UploadedImage[]>([])
const submitting = ref(false)

const isUploading = computed(() =>
  [...leftImages.value, ...rightImages.value].some(image =>
    image.status === 'compressing' || image.status === 'uploading',
  ),
)

async function handleSubmit() {
  const leftImageUrl = leftImages.value.find(image => image.status === 'complete')?.url
  const rightImageUrl = rightImages.value.find(image => image.status === 'complete')?.url

  if (!leftImageUrl || !rightImageUrl) {
    toast.error('Please upload both hero images.')
    return
  }

  submitting.value = true

  try {
    await flushPendingDeletions()

    const created = await create({
    title: form.title.trim(),
    description: form.description.trim() || null,
    left_image_url: leftImageUrl,
    right_image_url: rightImageUrl,
    link_url: '/collections',
    cta_label: 'Explore Collections',
    order_index: 0,
    is_active: form.is_active,
  })

    if (!created) {
      toast.error('Failed to create hero slide.')
      return
    }

    toast.success('Hero slide created.')
    await navigateTo('/admin/hero-slides')
  } catch {
    toast.error('Failed to create hero slide.')
  } finally {
    submitting.value = false
  }
}

useHead({ title: 'Create Hero Slide | Verve Admin' })
</script>

<style scoped>
.admin-input {
  @apply w-full border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-luxury-brass;
}
</style>
