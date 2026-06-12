<template>
  <div>
    <AdminPageHeader
      title="Create Hero Slide"
      description="Add a curated slide to the homepage hero carousel."
    />

    <form class="max-w-2xl space-y-6 border border-neutral-200 bg-white p-8" @submit.prevent="handleSubmit">
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
      />

      <AdminImageUploader
        v-model="rightImages"
        folder="hero"
        preset="primary"
        label="Right Image"
        hint="Main lifestyle image shown on the right."
        required
      />

      <AdminFormField label="Link URL" hint="Internal path or full URL for the CTA button." required>
        <template #default="{ inputId }">
          <input :id="inputId" v-model="form.link_url" type="text" required placeholder="/collections/wallpapers" class="admin-input">
        </template>
      </AdminFormField>

      <AdminFormField label="CTA Label" required>
        <template #default="{ inputId }">
          <input :id="inputId" v-model="form.cta_label" type="text" required class="admin-input">
        </template>
      </AdminFormField>

      <AdminFormField label="Display Order" hint="Lower numbers appear first.">
        <template #default="{ inputId }">
          <input :id="inputId" v-model.number="form.order_index" type="number" min="0" class="admin-input">
        </template>
      </AdminFormField>

      <label class="flex items-center gap-3 text-sm text-luxury-charcoal">
        <input v-model="form.is_active" type="checkbox" class="h-4 w-4 border-neutral-300">
        Active on homepage
      </label>

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
const toast = useToast()

const form = reactive({
  title: '',
  description: '',
  link_url: '',
  cta_label: 'Explore Collection',
  order_index: 0,
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

  const created = await create({
    title: form.title.trim(),
    description: form.description.trim() || null,
    left_image_url: leftImageUrl,
    right_image_url: rightImageUrl,
    link_url: form.link_url.trim(),
    cta_label: form.cta_label.trim() || 'Explore Collection',
    order_index: form.order_index,
    is_active: form.is_active,
  })

  submitting.value = false

  if (!created) {
    toast.error('Failed to create hero slide.')
    return
  }

  toast.success('Hero slide created.')
  await navigateTo('/admin/hero-slides')
}

useHead({ title: 'Create Hero Slide | Verve Admin' })
</script>

<style scoped>
.admin-input {
  @apply w-full border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-luxury-brass;
}
</style>
