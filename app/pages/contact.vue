<template>
  <div class="pt-24 bg-luxury-ivory min-h-screen">
    <div class="container mx-auto px-6 lg:px-12 py-16">
      <div class="max-w-4xl mx-auto text-center mb-16">
        <span class="text-luxury-brass uppercase tracking-[0.3em] text-xs font-semibold mb-6 block">Inquiries</span>
        <h1 class="text-5xl md:text-6xl font-serif text-luxury-matte-black mb-8">Contact Us</h1>
        <p class="text-luxury-charcoal font-light leading-relaxed max-w-2xl mx-auto">
          Whether you are an interior designer sourcing for a project, or a private client looking for something unique, our dedicated team is here to assist you.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
        <div class="bg-white p-10 shadow-sm border border-luxury-warm-beige/30">
          <h2 class="text-2xl font-serif text-luxury-matte-black mb-8">Send a Message</h2>
          <form class="space-y-6">
            <div>
              <label class="block text-xs uppercase tracking-widest text-luxury-charcoal mb-2">Name</label>
              <input type="text" class="w-full border-b border-luxury-charcoal bg-transparent py-2 focus:outline-none focus:border-luxury-brass transition-colors" />
            </div>
            <div>
              <label class="block text-xs uppercase tracking-widest text-luxury-charcoal mb-2">Email</label>
              <input type="email" class="w-full border-b border-luxury-charcoal bg-transparent py-2 focus:outline-none focus:border-luxury-brass transition-colors" />
            </div>
            <div>
              <label class="block text-xs uppercase tracking-widest text-luxury-charcoal mb-2">Message</label>
              <textarea rows="4" class="w-full border-b border-luxury-charcoal bg-transparent py-2 focus:outline-none focus:border-luxury-brass transition-colors resize-none"></textarea>
            </div>
            <button type="button" class="btn-primary w-full mt-4">Submit</button>
          </form>
        </div>

        <div class="space-y-10 flex flex-col justify-center">
          <div>
            <h3 class="text-xl font-serif text-luxury-matte-black mb-4">Address</h3>
            <p class="text-luxury-charcoal font-light mb-1">Verve Building No.(67)</p>
            <p class="text-luxury-charcoal font-light mb-1">Prs. Alia St, Al-Swaifyeh</p>
            <p class="text-luxury-charcoal font-light mb-1">Amman, Jordan</p>
          </div>
          <div>
            <h3 class="text-xl font-serif text-luxury-matte-black mb-4">Contact Information</h3>
            <p class="text-luxury-charcoal font-light mb-1">Telephone : 06-5925041</p>
            <p class="text-luxury-charcoal font-light mb-1">Mobile: 079 0202 838</p>
            <a href="mailto:info@verve-group.com" class="text-luxury-brass hover:text-luxury-matte-black transition-colors border-b border-luxury-brass pb-1 block w-max">info@verve-group.com</a>
          </div>
          <div>
            <h3 class="text-xl font-serif text-luxury-matte-black mb-4">Working Hours</h3>
            <p class="text-luxury-charcoal font-light mb-1">Saturday - Wednesday: 10am - 8pm</p>
            <p class="text-luxury-charcoal font-light mb-1">Thursday: 10am - 7pm</p>
            <p class="text-luxury-charcoal font-light">Friday: Closed</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Contact | Verve Luxury Interiors'
})
</script>
