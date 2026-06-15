<template>
  <footer class="bg-luxury-matte-black py-8 text-white sm:py-10">
    <div class="mx-auto flex max-w-4xl flex-col items-center gap-5 px-6 sm:gap-6">
      <NuxtLink to="/" class="block" aria-label="Verve home">
        <img
          src="/images/verve-footer-mark.webp"
          alt="Verve"
          class="h-24 w-auto object-contain sm:h-28 md:h-32"
          width="120"
          height="140"
          loading="lazy"
          decoding="async"
        >
      </NuxtLink>

      <div class="flex items-center gap-6 sm:gap-7">
        <a
          href="https://facebook.com/VerveHome"
          target="_blank"
          rel="noopener noreferrer"
          class="text-white transition-opacity hover:opacity-70"
          aria-label="Facebook"
        >
          <Icon name="lucide:facebook" size="16" />
        </a>
        <a
          href="mailto:info@verve-group.com"
          class="text-white transition-opacity hover:opacity-70"
          aria-label="Email"
        >
          <Icon name="lucide:mail" size="16" />
        </a>
        <a
          href="https://instagram.com/vervegroup"
          target="_blank"
          rel="noopener noreferrer"
          class="text-white transition-opacity hover:opacity-70"
          aria-label="Instagram"
        >
          <Icon name="lucide:instagram" size="16" />
        </a>
        <a
          href="https://wa.me/962790202838"
          target="_blank"
          rel="noopener noreferrer"
          class="text-white transition-opacity hover:opacity-70"
          aria-label="WhatsApp"
        >
          <Icon name="lucide:message-circle" size="16" />
        </a>
      </div>

      <p class="text-[10px] font-light tracking-wide text-white/90 sm:text-[11px]">
        &copy; {{ year }} All rights Reserved @VERVE
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>
