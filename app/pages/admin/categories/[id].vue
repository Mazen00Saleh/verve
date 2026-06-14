<template>
  <div>
    <AdminPageHeader
      title="Edit Category"
      description="Update category details or replace the cover image."
    />

    <div v-if="loading" class="text-sm text-luxury-charcoal">Loading category...</div>

    <form v-else-if="category" class="max-w-2xl space-y-6 border border-neutral-200 bg-white p-8" @submit.prevent="handleSubmit">
      <AdminFormField label="Name" required>
        <template #default="{ inputId }">
          <input :id="inputId" v-model="form.name" type="text" required class="admin-input">
        </template>
      </AdminFormField>

      <AdminImageUploader
        v-model="coverImages"
        folder="categories"
        preset="primary"
        label="Cover Image"
        hint="Upload a new image to replace the current cover."
      />

      <div class="flex gap-3">
        <button type="submit" class="btn-primary" :disabled="submitting || isUploading">
          {{ submitting ? 'Saving...' : 'Save Changes' }}
        </button>
        <NuxtLink to="/admin/categories" class="btn-outline">Cancel</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~/composables/useCategories'
import type { UploadedImage } from '~/composables/useImageUpload'
import { uploadedImageFromUrl } from '~/composables/useImageUpload'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const categoryId = route.params.id as string

const { fetchOne, update } = useCategories()
const { deleteByUrl } = useFileUpload()
const toast = useToast()

const category = ref<Category | null>(null)
const loading = ref(true)
const submitting = ref(false)
const coverImages = ref<UploadedImage[]>([])
const previousImageUrl = ref<string | null>(null)

const form = reactive({
  name: '',
})

const isUploading = computed(() =>
  coverImages.value.some(image => image.status === 'compressing' || image.status === 'uploading'),
)

onMounted(async () => {
  category.value = await fetchOne(categoryId)

  if (!category.value) {
    toast.error('Category not found.')
    await navigateTo('/admin/categories')
    return
  }

  form.name = category.value.name
  previousImageUrl.value = category.value.image_url

  if (category.value.image_url) {
    coverImages.value = [uploadedImageFromUrl(category.value.image_url)]
  }

  loading.value = false
})

async function handleSubmit() {
  if (!category.value) {
    return
  }

  submitting.value = true

  try {
    const nextImageUrl = coverImages.value.find(image => image.status === 'complete')?.url ?? null

    if (
      previousImageUrl.value
      && previousImageUrl.value !== nextImageUrl
    ) {
      await deleteByUrl(previousImageUrl.value)
    }

    const updated = await update(categoryId, {
      name: form.name.trim(),
      description: null,
      image_url: nextImageUrl,
    })

    if (!updated) {
      toast.error('Failed to update category.')
      return
    }

    toast.success('Category updated successfully.')
    await navigateTo('/admin/categories')
  } catch {
    toast.error('Failed to update category image.')
  } finally {
    submitting.value = false
  }
}

useHead({ title: 'Edit Category | Verve Admin' })
</script>

<style scoped>
.admin-input {
  @apply w-full border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-luxury-brass;
}
</style>
