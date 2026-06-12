<template>
  <header
    class="fixed top-0 z-50 w-full bg-luxury-ivory py-5 shadow-sm transition-all duration-300 sm:py-6 md:py-8"
    :class="{ 'shadow-md': scrolled || mobileOpen }"
  >
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-12">
      <nav class="hidden flex-1 items-center justify-end space-x-8 pr-8 md:flex lg:space-x-12 lg:pr-12">
        <NuxtLink
          v-for="link in leftLinks"
          :key="link.to"
          :to="link.to"
          class="text-sm uppercase tracking-widest text-luxury-matte-black transition-colors duration-300 hover:text-luxury-brass-contrast lg:text-base"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <div class="flex flex-none items-center justify-center">
        <NuxtLink
          to="/"
          class="select-none text-center font-serif text-3xl uppercase tracking-[0.15em] text-luxury-matte-black transition-colors duration-300 sm:text-4xl md:text-5xl md:tracking-[0.2em]"
          @click="closeMobile"
        >
          Verve
        </NuxtLink>
      </div>

      <div class="flex flex-1 items-center justify-end md:justify-start md:pl-8 lg:pl-12">
        <nav class="hidden items-center space-x-8 md:flex lg:space-x-12">
          <NuxtLink
            v-for="link in rightLinks"
            :key="link.to"
            :to="link.to"
            class="text-sm uppercase tracking-widest text-luxury-matte-black transition-colors duration-300 hover:text-luxury-brass-contrast lg:text-base"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>

        <button
          type="button"
          class="ml-2 inline-flex items-center justify-center p-2 text-luxury-matte-black transition-colors hover:text-luxury-brass-contrast md:hidden"
          :aria-expanded="mobileOpen"
          aria-label="Toggle navigation menu"
          @click="toggleMobile"
        >
          <Icon :name="mobileOpen ? 'lucide:x' : 'lucide:menu'" size="24" />
        </button>
      </div>
    </div>

    <Transition name="mobile-nav">
      <div
        v-if="mobileOpen"
        class="border-t border-luxury-warm-beige/40 bg-luxury-ivory md:hidden"
      >
        <nav class="page-container flex flex-col gap-1 py-4">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="px-2 py-3 text-sm uppercase tracking-widest text-luxury-matte-black transition-colors hover:text-luxury-brass-contrast"
            @click="closeMobile"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const scrolled = ref(false)
const mobileOpen = ref(false)

const navLinks = [
  { label: 'Collections', to: '/collections' },
  { label: 'Inspiration', to: '/inspiration' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
]

const leftLinks = navLinks.slice(0, 2)
const rightLinks = navLinks.slice(2)

function handleScroll() {
  scrolled.value = window.scrollY > 50
}

function toggleMobile() {
  mobileOpen.value = !mobileOpen.value
}

function closeMobile() {
  mobileOpen.value = false
}

watch(() => route.path, () => {
  closeMobile()
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.mobile-nav-enter-active,
.mobile-nav-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.mobile-nav-enter-from,
.mobile-nav-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
