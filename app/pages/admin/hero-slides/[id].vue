<template>
  <div>
    <AdminPageHeader
      title="Edit Hero Slide"
      description="Update slide content, images, or visibility."
    />

    <div v-if="loading" class="text-sm text-luxury-charcoal">Loading slide...</div>

    <form v-else-if="slide" class="max-w-2xl space-y-6 border border-neutral-200 bg-white p-8" @submit.prevent="handleSubmit">
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
      />

      <AdminImageUploader
        v-model="rightImages"
        folder="hero"
        preset="primary"
        label="Right Image"
      />

      <AdminFormField label="Link URL" required>
        <template #default="{ inputId }">
          <input :id="inputId" v-model="form.link_url" type="text" required class="admin-input">
        </template>
      </AdminFormField>

      <AdminFormField label="CTA Label" required>
        <template #default="{ inputId }">
          <input :id="inputId" v-model="form.cta_label" type="text" required class="admin-input">
        </template>
      </AdminFormField>

      <AdminFormField label="Display Order">
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
          {{ submitting ? 'Saving...' : 'Save Changes' }}
        </button>
        <NuxtLink to="/admin/hero-slides" class="btn-outline">Cancel</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { HeroSlide } from '~/composables/useHeroSlides'
import type { UploadedImage } from '~/composables/useImageUpload'
import { uploadedImageFromUrl } from '~/composables/useImageUpload'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const slideId = route.params.id as string

const { fetchOne, update } = useHeroSlides()
const { deleteByUrl } = useFileUpload()
const toast = useToast()

const slide = ref<HeroSlide | null>(null)
const loading = ref(true)
const submitting = ref(false)
const leftImages = ref<UploadedImage[]>([])
const rightImages = ref<UploadedImage[]>([])
const previousLeftUrl = ref<string | null>(null)
const previousRightUrl = ref<string | null>(null)

const form = reactive({
  title: '',
  description: '',
  link_url: '',
  cta_label: 'Explore Collection',
  order_index: 0,
  is_active: true,
})

const isUploading = computed(() =>
  [...leftImages.value, ...rightImages.value].some(image =>
    image.status === 'compressing' || image.status === 'uploading',
  ),
)

onMounted(async () => {
  slide.value = await fetchOne(slideId)

  if (!slide.value) {
    toast.error('Hero slide not found.')
    await navigateTo('/admin/hero-slides')
    return
  }

  form.title = slide.value.title
  form.description = slide.value.description ?? ''
  form.link_url = slide.value.link_url
  form.cta_label = slide.value.cta_label
  form.order_index = slide.value.order_index
  form.is_active = slide.value.is_active

  previousLeftUrl.value = slide.value.left_image_url
  previousRightUrl.value = slide.value.right_image_url

  leftImages.value = [uploadedImageFromUrl(slide.value.left_image_url)]
  rightImages.value = [uploadedImageFromUrl(slide.value.right_image_url)]

  loading.value = false
})

async function handleSubmit() {
  if (!slide.value) {
    return
  }

  const nextLeftUrl = leftImages.value.find(image => image.status === 'complete')?.url
  const nextRightUrl = rightImages.value.find(image => image.status === 'complete')?.url

  if (!nextLeftUrl || !nextRightUrl) {
    toast.error('Both hero images are required.')
    return
  }

  submitting.value = true

  try {
    if (previousLeftUrl.value && previousLeftUrl.value !== nextLeftUrl) {
      await deleteByUrl(previousLeftUrl.value)
    }

    if (previousRightUrl.value && previousRightUrl.value !== nextRightUrl) {
      await deleteByUrl(previousRightUrl.value)
    }

    const updated = await update(slideId, {
      title: form.title.trim(),
      description: form.description.trim() || null,
      left_image_url: nextLeftUrl,
      right_image_url: nextRightUrl,
      link_url: form.link_url.trim(),
      cta_label: form.cta_label.trim() || 'Explore Collection',
      order_index: form.order_index,
      is_active: form.is_active,
    })

    if (!updated) {
      toast.error('Failed to update hero slide.')
      return
    }

    toast.success('Hero slide updated.')
    await navigateTo('/admin/hero-slides')
  } catch {
    toast.error('Failed to update hero slide images.')
  } finally {
    submitting.value = false
  }
}

useHead({ title: 'Edit Hero Slide | Verve Admin' })
</script>

<style scoped>
.admin-input {
  @apply w-full border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-luxury-brass;
}
</style>
