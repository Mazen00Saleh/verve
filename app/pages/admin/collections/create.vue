<template>
  <div>
    <AdminPageHeader
      title="Create Collection"
      description="Add a new collection and assign it to a category."
    />

    <form class="max-w-2xl space-y-6 border border-neutral-200 bg-white p-8" @submit.prevent="handleSubmit">
      <AdminFormField label="Category" required>
        <template #default="{ inputId }">
          <select :id="inputId" v-model="form.category_id" required class="admin-input">
            <option disabled value="">Select a category</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </template>
      </AdminFormField>

      <AdminFormField label="Name" required>
        <template #default="{ inputId }">
          <input :id="inputId" v-model="form.name" type="text" required class="admin-input">
        </template>
      </AdminFormField>

      <AdminImageUploader
        v-model="coverImages"
        folder="collections"
        preset="primary"
        label="Cover Image"
        hint="Image is optimized in the browser before upload."
        required
      />

      <div class="flex gap-3">
        <button type="submit" class="btn-primary" :disabled="submitting || isUploading">
          {{ submitting ? 'Creating...' : 'Create Collection' }}
        </button>
        <NuxtLink to="/admin/collections" class="btn-outline">Cancel</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~/composables/useCategories'
import type { UploadedImage } from '~/composables/useImageUpload'

definePageMeta({ layout: 'admin' })

const { fetchAll: fetchCategories } = useCategories()
const { create } = useCollections()
const toast = useToast()

const categories = ref<Category[]>([])
const coverImages = ref<UploadedImage[]>([])
const submitting = ref(false)

const form = reactive({
  category_id: '',
  name: '',
})

const isUploading = computed(() =>
  coverImages.value.some(image => image.status === 'compressing' || image.status === 'uploading'),
)

onMounted(async () => {
  categories.value = await fetchCategories()
})

async function handleSubmit() {
  const imageUrl = coverImages.value.find(image => image.status === 'complete')?.url

  if (!imageUrl) {
    toast.error('Please upload a cover image.')
    return
  }

  submitting.value = true

  const created = await create({
    category_id: form.category_id,
    name: form.name.trim(),
    description: null,
    image_url: imageUrl,
  })

  submitting.value = false

  if (!created) {
    toast.error('Failed to create collection.')
    return
  }

  toast.success('Collection created successfully.')
  await navigateTo('/admin/collections')
}

useHead({ title: 'Create Collection | Verve Admin' })
</script>

<style scoped>
.admin-input {
  @apply w-full border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-luxury-brass;
}
</style>
