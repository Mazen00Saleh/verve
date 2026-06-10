<template>
  <section class="py-24 bg-luxury-warm-beige/20 relative">
    <div class="container mx-auto px-6 lg:px-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div class="order-2 lg:order-1 relative">
          <div class="aspect-[4/5] relative overflow-hidden">
            <img src="https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1000&q=80" alt="Craftsmanship" class="w-full h-full object-cover" />
          </div>
          <div class="absolute -bottom-8 -right-8 w-2/3 aspect-square hidden md:block border-8 border-luxury-ivory overflow-hidden">
             <img src="https://images.unsplash.com/photo-1617104424032-b9bd6972d0e4?auto=format&fit=crop&w=600&q=80" alt="Texture Details" class="w-full h-full object-cover" />
          </div>
        </div>
        
        <div class="order-1 lg:order-2">
          <span class="text-luxury-brass uppercase tracking-[0.2em] text-xs font-semibold mb-4 block">Uncompromising Quality</span>
          <h2 class="text-4xl md:text-5xl font-serif text-luxury-matte-black mb-8">Premium Materials & Masterful Craftsmanship</h2>
          <p class="text-luxury-charcoal font-light text-lg mb-6 leading-relaxed">
            Every roll of wallpaper and yard of fabric we produce is a testament to our dedication to excellence. We source only the finest raw materials, from pure silks and natural linens to sustainable, heavy-weight paper stocks.
          </p>
          <p class="text-luxury-charcoal font-light text-lg mb-10 leading-relaxed">
            Our artisans employ time-honored techniques alongside cutting-edge technology to create textures that demand to be touched and colors that captivate the eye.
          </p>
          <NuxtLink to="/about" class="btn-outline">
            Discover Our Story
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
