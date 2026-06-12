<template>
  <div>
    <AdminPageHeader
      title="Products"
      description="Manage products, primary images, secondary images, and room mockups."
    >
      <template #actions>
        <NuxtLink to="/admin/products/create" class="btn-primary">
          Create Product
        </NuxtLink>
      </template>
    </AdminPageHeader>

    <div v-if="loading" class="text-sm text-luxury-charcoal">Loading products...</div>

    <div v-else-if="!products.length" class="border border-dashed border-neutral-300 bg-white p-10 text-center text-sm text-luxury-charcoal">
      No products yet.
    </div>

    <div v-else class="overflow-x-auto border border-neutral-200 bg-white">
      <table class="min-w-full text-left text-sm">
        <thead class="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-widest text-luxury-charcoal">
          <tr>
            <th class="px-4 py-3">Image</th>
            <th class="px-4 py-3">Name</th>
            <th class="px-4 py-3">Collection</th>
            <th class="px-4 py-3">Gallery</th>
            <th class="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id" class="border-b border-neutral-100">
            <td class="px-4 py-4">
              <img
                v-if="product.primary_image"
                :src="product.primary_image"
                :alt="product.name"
                class="h-14 w-14 object-cover"
              >
            </td>
            <td class="px-4 py-4 font-medium">{{ product.name }}</td>
            <td class="px-4 py-4">
              <span v-if="product.collections">
                {{ product.collections.categories?.name }} / {{ product.collections.name }}
              </span>
              <span v-else>—</span>
            </td>
            <td class="px-4 py-4 text-luxury-charcoal">
              {{ product.product_images?.length || 0 }} images
            </td>
            <td class="px-4 py-4">
              <div class="flex justify-end gap-2">
                <NuxtLink
                  :to="`/admin/products/${product.id}`"
                  class="border border-neutral-300 px-3 py-2 text-xs uppercase tracking-widest hover:border-luxury-brass"
                >
                  Edit
                </NuxtLink>
                <button
                  type="button"
                  class="border border-red-200 px-3 py-2 text-xs uppercase tracking-widest text-red-700 hover:bg-red-50 disabled:opacity-60"
                  :disabled="deletingId === product.id"
                  @click="handleDelete(product.id, product.name)"
                >
                  {{ deletingId === product.id ? 'Deleting...' : 'Delete' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductWithRelations } from '~/composables/useProducts'

definePageMeta({ layout: 'admin' })

const { fetchAll, remove, loading } = useProducts()
const toast = useToast()

const products = ref<ProductWithRelations[]>([])
const deletingId = ref<string | null>(null)

async function loadProducts() {
  products.value = await fetchAll()
}

async function handleDelete(id: string, name: string) {
  if (!confirm(`Delete product "${name}" and all associated images?`)) {
    return
  }

  deletingId.value = id
  const success = await remove(id)
  deletingId.value = null

  if (success) {
    toast.success('Product deleted successfully.')
    await loadProducts()
    return
  }

  toast.error('Failed to delete product.')
}

onMounted(loadProducts)

useHead({ title: 'Admin Products | Verve' })
</script>
