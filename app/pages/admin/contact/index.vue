<template>
  <div>
    <AdminPageHeader
      title="Contact Messages"
      description="Messages submitted through the public contact form."
    />

    <div v-if="pending" class="text-sm text-luxury-charcoal">Loading messages...</div>

    <div v-else-if="!items.length && total === 0" class="border border-dashed border-neutral-300 bg-white p-10 text-center text-sm text-luxury-charcoal">
      No contact messages yet.
    </div>

    <template v-else>
      <div class="space-y-4">
        <article
          v-for="submission in items"
          :key="submission.id"
          class="border border-neutral-200 bg-white p-6"
        >
          <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 class="font-medium text-luxury-matte-black">{{ submission.name }}</h3>
              <a :href="`mailto:${submission.email}`" class="mt-1 block text-sm text-luxury-brass hover:underline">
                {{ submission.email }}
              </a>
              <p class="mt-1 text-xs text-luxury-charcoal/70">
                {{ formatDate(submission.created_at) }}
              </p>
            </div>

            <div class="flex items-center gap-2">
              <label class="text-xs uppercase tracking-widest text-luxury-charcoal">Status</label>
              <select
                :value="submission.status"
                class="border border-neutral-200 px-3 py-2 text-sm"
                @change="handleStatusChange(submission.id, ($event.target as HTMLSelectElement).value)"
              >
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <p class="mt-4 whitespace-pre-wrap text-sm font-light leading-relaxed text-luxury-charcoal">
            {{ submission.message }}
          </p>
        </article>
      </div>

      <Pagination
        :current-page="page"
        :total-pages="totalPages"
        :total-items="total"
        :page-size="pageSize"
        item-label="messages"
        @page-change="setPage"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { ContactSubmission } from '~/composables/useContactSubmissions'

definePageMeta({ layout: 'admin' })

const { fetchPage, updateStatus } = useContactSubmissions()
const toast = useToast()
const { items, total, page, totalPages, pending, refresh, setPage, pageSize } = useAdminPaginatedList(
  'admin-contact',
  fetchPage,
)

function formatDate(value: string | null) {
  if (!value) {
    return ''
  }

  return new Date(value).toLocaleString()
}

async function handleStatusChange(id: string, status: string) {
  const success = await updateStatus(id, status as ContactSubmission['status'])

  if (success) {
    await refresh()
    return
  }

  toast.error('Failed to update message status.')
}

useHead({ title: 'Contact Messages | Verve Admin' })
</script>
