<template>
  <header
    ref="headerRef"
    class="site-header fixed top-0 z-50 w-full bg-luxury-matte-black pt-4 pb-2 shadow-sm transition-all duration-300 sm:pt-5 sm:pb-2.5 md:pt-5 md:pb-3"
    :class="{ 'shadow-md shadow-black/20': scrolled }"
  >
    <div class="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-4 sm:gap-3.5 sm:px-6 lg:px-12">
      <NuxtLink to="/" class="flex w-full justify-center">
        <img
          src="/images/verve-logo.png"
          alt="Verve — Exclusive Home Collection"
          class="h-16 w-auto max-w-full object-contain sm:h-20 md:h-24"
          width="400"
          height="168"
          loading="eager"
          fetchpriority="high"
          decoding="async"
        >
      </NuxtLink>

      <nav class="flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:gap-x-8 lg:gap-x-10">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="nav-link"
          :class="{ 'nav-link-active': isActiveLink(link.to) }"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const scrolled = ref(false)
const headerRef = ref<HTMLElement | null>(null)

const navLinks = [
  { label: 'Collections', to: '/collections' },
  { label: 'Inspiration', to: '/inspiration' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
]

function isActiveLink(to: string) {
  return route.path === to || route.path.startsWith(`${to}/`)
}

function updateHeaderHeight() {
  const height = headerRef.value?.offsetHeight ?? 0
  document.documentElement.style.setProperty('--site-header-height', `${height}px`)
}

function handleScroll() {
  scrolled.value = window.scrollY > 50
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  updateHeaderHeight()
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', updateHeaderHeight, { passive: true })

  if (headerRef.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(updateHeaderHeight)
    resizeObserver.observe(headerRef.value)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', updateHeaderHeight)
  resizeObserver?.disconnect()
})
</script>

<style scoped>
.nav-link {
  @apply border-b border-transparent pb-1 text-center text-[10px] uppercase tracking-widest text-luxury-ivory transition-colors duration-300 hover:text-luxury-brass-light sm:text-[11px];
}

.nav-link-active {
  @apply border-luxury-brass-light text-luxury-brass-light;
}
</style>
