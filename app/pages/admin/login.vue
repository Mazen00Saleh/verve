<template>
  <div class="flex min-h-screen items-center justify-center bg-luxury-ivory px-6">
    <div class="w-full max-w-md border border-neutral-200 bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      <div class="mb-8 text-center">
        <p class="text-xs uppercase tracking-[0.3em] text-luxury-brass">Verve Admin</p>
        <h1 class="mt-3 text-3xl text-luxury-matte-black">Sign in</h1>
        <p class="mt-2 text-sm font-light text-luxury-charcoal">
          Use your administrator credentials to access the dashboard.
        </p>
      </div>

      <form class="space-y-5" @submit.prevent="handleSubmit">
        <div>
          <label for="email" class="mb-2 block text-xs uppercase tracking-widest text-luxury-charcoal">
            Email
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="email"
            required
            class="w-full border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-luxury-brass"
            placeholder="admin@example.com"
          >
        </div>

        <div>
          <label for="password" class="mb-2 block text-xs uppercase tracking-widest text-luxury-charcoal">
            Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            required
            class="w-full border border-neutral-200 px-4 py-3 text-sm outline-none transition-colors focus:border-luxury-brass"
            placeholder="Enter your password"
          >
        </div>

        <p
          v-if="errorMessage"
          class="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          class="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const { login } = useAdminAuth()

async function handleSubmit() {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    const { error } = await login(email.value, password.value)

    if (error) {
      errorMessage.value = error
      return
    }

    await navigateTo('/admin')
  } finally {
    isSubmitting.value = false
  }
}

useHead({
  title: 'Admin Login | Verve',
})
</script>
