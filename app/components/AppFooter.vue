<template>
  <footer class="bg-luxury-matte-black text-luxury-ivory py-16">
    <div class="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-12">
      <div class="space-y-4">
        <h3 class="font-serif text-2xl tracking-[0.1em] uppercase">Verve</h3>
        <p class="text-luxury-warm-beige text-sm font-light leading-relaxed max-w-sm">
          Home Deco. Dedicated to Fabric & Wallpaper
        </p>
      </div>
      
      <div class="space-y-4">
        <h4 class="mb-6 text-xs uppercase tracking-[0.2em] text-luxury-brass-light">Explore</h4>
        <nav class="flex flex-col space-y-3">
          <NuxtLink to="/collections" class="w-max text-sm text-luxury-champagne transition-colors hover:text-luxury-brass-light">Collections</NuxtLink>
          <NuxtLink to="/inspiration" class="w-max text-sm text-luxury-champagne transition-colors hover:text-luxury-brass-light">Inspiration</NuxtLink>
          <NuxtLink to="/about" class="w-max text-sm text-luxury-champagne transition-colors hover:text-luxury-brass-light">About Us</NuxtLink>
          <NuxtLink to="/contact" class="w-max text-sm text-luxury-champagne transition-colors hover:text-luxury-brass-light">Contact Us</NuxtLink>
        </nav>
      </div>
      
      <div class="space-y-4">
        <h4 class="mb-6 text-xs uppercase tracking-[0.2em] text-luxury-brass-light">Connect</h4>
        <div class="space-y-2 text-sm font-light text-luxury-champagne">
          <p>Verve Building No.(67)</p>
          <p>Prs. Alia St, Al-Swaifyeh</p>
          <p>Amman, Jordan</p>
          <div class="flex space-x-5 pt-6">
            <a href="https://instagram.com/vervegroup" target="_blank" rel="noopener noreferrer" class="text-luxury-champagne transition-colors hover:text-luxury-brass-light" aria-label="Instagram">
              <Icon name="lucide:instagram" size="20" />
            </a>
            <a href="https://facebook.com/VerveHome" target="_blank" rel="noopener noreferrer" class="text-luxury-champagne transition-colors hover:text-luxury-brass-light" aria-label="Facebook">
              <Icon name="lucide:facebook" size="20" />
            </a>
            <a href="https://wa.me/962790202838" target="_blank" rel="noopener noreferrer" class="text-luxury-champagne transition-colors hover:text-luxury-brass-light" aria-label="WhatsApp">
              <Icon name="lucide:message-circle" size="20" />
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="container mx-auto mt-16 flex items-center justify-between border-t border-luxury-charcoal px-6 pt-8 text-xs text-luxury-champagne lg:px-12">
      <p>&copy; {{ new Date().getFullYear() }} VERVE GROUP. All rights reserved.</p>
      <div class="space-x-4">
        <!-- <a href="#" class="hover:text-luxury-ivory">Privacy Policy</a>
        <a href="#" class="hover:text-luxury-ivory">Terms of Service</a> -->
      </div>
    </div>
  </footer>
</template>
