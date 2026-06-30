<template>
  <header
    ref="headerRef"
    class="site-header fixed top-0 z-50 w-full bg-black pt-3 pb-2 shadow-sm transition-all duration-300 sm:pt-4 sm:pb-2.5 md:pt-5 md:pb-3"
    :class="{ 'shadow-md shadow-black/20': scrolled }"
  >
    <div class="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-12">
      <div class="relative w-full md:min-h-24">
        <div class="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2 md:contents">
          <div class="header-social flex items-center gap-3 justify-self-start sm:gap-4 md:absolute md:left-0 md:top-1/2 md:-translate-y-1/2">
            <a
              v-for="link in socialLinks"
              :key="link.label"
              :href="link.href"
              class="header-social-link"
              :aria-label="link.label"
              :target="link.external ? '_blank' : undefined"
              :rel="link.external ? 'noopener noreferrer' : undefined"
            >
              <Icon :name="link.icon" size="16" />
            </a>
          </div>

          <NuxtLink
            to="/"
            class="flex justify-center justify-self-center md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
            @click="closeMenu"
          >
            <img
              src="/images/verve-logo.webp"
              alt="Verve — Exclusive Home Collection"
              class="h-12 w-auto max-w-[min(100%,220px)] object-contain sm:h-14 md:h-24"
              width="400"
              height="168"
              loading="eager"
              fetchpriority="high"
              decoding="async"
            >
          </NuxtLink>

          <button
            type="button"
            class="flex h-10 w-10 shrink-0 items-center justify-center justify-self-end text-luxury-ivory transition-colors hover:text-luxury-brass md:hidden"
            :aria-expanded="menuOpen"
            aria-controls="mobile-nav"
            :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
            @click="toggleMenu"
          >
            <Icon :name="menuOpen ? 'lucide:x' : 'lucide:menu'" size="24" />
          </button>
        </div>
      </div>

      <nav class="mt-3 hidden w-full items-center justify-center gap-x-8 md:flex lg:gap-x-10">
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

    <Transition name="mobile-nav">
      <div
        v-if="menuOpen"
        class="fixed inset-x-0 bottom-0 top-[var(--site-header-height)] z-40 md:hidden"
      >
        <button
          type="button"
          class="absolute inset-0 bg-black/60"
          aria-label="Close menu"
          @click="closeMenu"
        />

        <nav
          id="mobile-nav"
          class="relative border-t border-white/10 bg-black px-4 py-5 shadow-lg"
        >
          <ul class="flex flex-col gap-1">
            <li v-for="link in navLinks" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="mobile-nav-link"
                :class="{ 'mobile-nav-link-active': isActiveLink(link.to) }"
                @click="closeMenu"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const scrolled = ref(false)
const menuOpen = ref(false)
const headerRef = ref<HTMLElement | null>(null)

const navLinks = [
  { label: 'Collections', to: '/collections' },
  { label: 'Inspiration', to: '/inspiration' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
]

const socialLinks = [
  { href: 'https://facebook.com/VerveHome', label: 'Facebook', icon: 'lucide:facebook', external: true },
  { href: 'mailto:info@verve-group.com', label: 'Email', icon: 'lucide:mail', external: false },
  { href: 'https://instagram.com/vervegroup', label: 'Instagram', icon: 'lucide:instagram', external: true },
  { href: 'https://wa.me/962790202838', label: 'WhatsApp', icon: 'lucide:message-circle', external: true },
]

function isActiveLink(to: string) {
  return route.path === to || route.path.startsWith(`${to}/`)
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

function updateHeaderHeight() {
  const height = headerRef.value?.offsetHeight ?? 0
  document.documentElement.style.setProperty('--site-header-height', `${height}px`)
}

function handleScroll() {
  scrolled.value = window.scrollY > 50
}

let resizeObserver: ResizeObserver | null = null

watch(() => route.path, () => {
  closeMenu()
})

watch(menuOpen, (open) => {
  if (typeof document === 'undefined') {
    return
  }

  document.body.classList.toggle('overflow-hidden', open)
  nextTick(updateHeaderHeight)
})

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
  document.body.classList.remove('overflow-hidden')
})
</script>
