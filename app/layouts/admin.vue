<template>
  <div class="min-h-screen bg-neutral-100 text-luxury-matte-black">
    <div class="flex min-h-screen">
      <aside class="sticky top-0 flex h-screen w-64 shrink-0 flex-col self-start border-r border-neutral-200 bg-luxury-matte-black text-luxury-ivory">
        <div class="border-b border-white/10 px-6 py-8">
          <p class="text-xs uppercase tracking-[0.3em] text-luxury-brass">Verve</p>
          <h1 class="mt-2 text-2xl">Admin</h1>
        </div>

        <nav class="flex-1 px-4 py-6">
          <ul class="space-y-1">
            <li v-for="item in navItems" :key="item.to">
              <NuxtLink
                :to="item.to"
                class="block rounded-md px-4 py-3 text-sm transition-colors"
                :class="isActive(item.to)
                  ? 'bg-white/10 text-luxury-brass'
                  : 'text-white/80 hover:bg-white/5 hover:text-white'"
              >
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <div class="mt-auto border-t border-white/10 p-4">
          <button
            type="button"
            class="w-full rounded-md border border-white/20 px-4 py-3 text-sm uppercase tracking-widest transition-colors hover:border-luxury-brass hover:text-luxury-brass disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="loggingOut"
            @click="handleLogout"
          >
            {{ loggingOut ? 'Signing out...' : 'Logout' }}
          </button>
        </div>
      </aside>

      <div class="flex min-h-screen flex-1 flex-col">
        <header class="border-b border-neutral-200 bg-white px-8 py-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.25em] text-luxury-charcoal/60">Signed in as</p>
              <p class="mt-1 text-sm font-medium">{{ userEmail }}</p>
            </div>
            <NuxtLink
              to="/"
              class="text-xs uppercase tracking-widest text-luxury-charcoal transition-colors hover:text-luxury-brass"
            >
              View site
            </NuxtLink>
          </div>
        </header>

        <main class="flex-1 px-8 py-8">
          <slot />
        </main>
      </div>
    </div>

    <AdminToast />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { user, logout } = useAdminAuth()

const loggingOut = ref(false)

const navItems = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Categories', to: '/admin/categories' },
  { label: 'Collections', to: '/admin/collections' },
  { label: 'Products', to: '/admin/products' },
  { label: 'Brochures', to: '/admin/brochures' },
  { label: 'Brand Logos', to: '/admin/brand-logos' },
  { label: 'Hero Slides', to: '/admin/hero-slides' },
  { label: 'Contact Messages', to: '/admin/contact' },
]

const userEmail = computed(() => user.value?.email ?? 'Admin user')

function isActive(path: string) {
  if (path === '/admin') {
    return route.path === '/admin'
  }

  return route.path.startsWith(path)
}

async function handleLogout() {
  loggingOut.value = true

  try {
    await logout()
  } finally {
    loggingOut.value = false
  }
}
</script>
