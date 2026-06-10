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
        <h4 class="text-xs tracking-[0.2em] uppercase text-luxury-brass mb-6">Explore</h4>
        <nav class="flex flex-col space-y-3">
          <NuxtLink to="/collections" class="text-sm hover:text-luxury-brass transition-colors w-max">Collections</NuxtLink>
          <NuxtLink to="/inspiration" class="text-sm hover:text-luxury-brass transition-colors w-max">Inspiration</NuxtLink>
          <NuxtLink to="/about" class="text-sm hover:text-luxury-brass transition-colors w-max">About Us</NuxtLink>
          <NuxtLink to="/contact" class="text-sm hover:text-luxury-brass transition-colors w-max">Contact Us</NuxtLink>
        </nav>
      </div>
      
      <div class="space-y-4">
        <h4 class="text-xs tracking-[0.2em] uppercase text-luxury-brass mb-6">Connect</h4>
        <div class="text-sm space-y-2 text-luxury-warm-beige font-light">
          <p>Verve Building No.(67)</p>
          <p>Prs. Alia St, Al-Swaifyeh</p>
          <p>Amman, Jordan</p>
          <div class="flex space-x-5 pt-6">
            <a href="https://instagram.com/vervegroup" target="_blank" rel="noopener noreferrer" class="text-luxury-warm-beige hover:text-luxury-brass transition-colors" aria-label="Instagram">
              <Icon name="lucide:instagram" size="20" />
            </a>
            <a href="https://facebook.com/VerveHome" target="_blank" rel="noopener noreferrer" class="text-luxury-warm-beige hover:text-luxury-brass transition-colors" aria-label="Facebook">
              <Icon name="lucide:facebook" size="20" />
            </a>
            <a href="https://wa.me/962790202838" target="_blank" rel="noopener noreferrer" class="text-luxury-warm-beige hover:text-luxury-brass transition-colors" aria-label="WhatsApp">
              <Icon name="lucide:message-circle" size="20" />
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="container mx-auto px-6 lg:px-12 mt-16 pt-8 border-t border-luxury-charcoal flex justify-between items-center text-xs text-luxury-warm-beige">
      <p>&copy; {{ new Date().getFullYear() }} VERVE GROUP. All rights reserved.</p>
      <div class="space-x-4">
        <!-- <a href="#" class="hover:text-luxury-ivory">Privacy Policy</a>
        <a href="#" class="hover:text-luxury-ivory">Terms of Service</a> -->
      </div>
    </div>
  </footer>
</template>
