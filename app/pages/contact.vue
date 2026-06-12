<template>
  <div class="page-shell">
    <div class="page-container py-8 sm:py-12 md:py-16">
      <div class="mx-auto mb-16 max-w-4xl text-center">
        <span class="section-eyebrow">Inquiries</span>
        <h1 class="section-title mb-6 sm:mb-8">Contact Us</h1>
        <p class="section-intro mx-auto max-w-2xl text-sm sm:text-base">
          Whether you are an interior designer sourcing for a project, or a private client looking for something unique, our dedicated team is here to assist you.
        </p>
      </div>

      <div class="mx-auto grid max-w-5xl grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        <div class="border border-luxury-warm-beige/30 bg-white p-6 shadow-sm sm:p-10">
          <h2 class="mb-6 font-serif text-2xl text-luxury-matte-black sm:mb-8">Send a Message</h2>

          <div
            v-if="success"
            class="mb-6 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
            role="status"
          >
            Thank you for your message. Our team will get back to you shortly.
          </div>

          <div
            v-else-if="error"
            class="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {{ error }}
          </div>

          <form class="space-y-6" @submit.prevent="handleSubmit">
            <div>
              <label for="contact-name" class="mb-2 block text-xs uppercase tracking-widest text-luxury-charcoal">Name</label>
              <input
                id="contact-name"
                v-model="form.name"
                type="text"
                required
                maxlength="120"
                class="contact-input"
                :disabled="submitting"
              >
            </div>

            <div>
              <label for="contact-email" class="mb-2 block text-xs uppercase tracking-widest text-luxury-charcoal">Email</label>
              <input
                id="contact-email"
                v-model="form.email"
                type="email"
                required
                maxlength="254"
                class="contact-input"
                :disabled="submitting"
              >
            </div>

            <div>
              <label for="contact-message" class="mb-2 block text-xs uppercase tracking-widest text-luxury-charcoal">Message</label>
              <textarea
                id="contact-message"
                v-model="form.message"
                rows="4"
                required
                minlength="10"
                maxlength="5000"
                class="contact-input resize-none"
                :disabled="submitting"
              />
            </div>

            <div class="hidden" aria-hidden="true">
              <label for="contact-website">Website</label>
              <input id="contact-website" v-model="form.website" type="text" tabindex="-1" autocomplete="off">
            </div>

            <button type="submit" class="btn-primary mt-2 w-full" :disabled="submitting">
              {{ submitting ? 'Sending...' : 'Submit' }}
            </button>
          </form>
        </div>

        <div class="flex flex-col justify-center space-y-10">
          <div>
            <h3 class="mb-4 font-serif text-xl text-luxury-matte-black">Address</h3>
            <p class="mb-1 font-light text-luxury-charcoal">Verve Building No.(67)</p>
            <p class="mb-1 font-light text-luxury-charcoal">Prs. Alia St, Al-Swaifyeh</p>
            <p class="font-light text-luxury-charcoal">Amman, Jordan</p>
          </div>
          <div>
            <h3 class="mb-4 font-serif text-xl text-luxury-matte-black">Contact Information</h3>
            <p class="mb-1 font-light text-luxury-charcoal">Telephone : 06-5925041</p>
            <p class="mb-1 font-light text-luxury-charcoal">Mobile: 079 0202 838</p>
            <a href="mailto:info@verve-group.com" class="block w-max border-b border-luxury-brass-contrast pb-1 text-luxury-brass-contrast transition-colors hover:text-luxury-matte-black">info@verve-group.com</a>
          </div>
          <div>
            <h3 class="mb-4 font-serif text-xl text-luxury-matte-black">Working Hours</h3>
            <p class="mb-1 font-light text-luxury-charcoal">Saturday - Wednesday: 10am - 8pm</p>
            <p class="mb-1 font-light text-luxury-charcoal">Thursday: 10am - 7pm</p>
            <p class="font-light text-luxury-charcoal">Friday: Closed</p>
          </div>
        </div>
      </div>

      <section class="mx-auto mt-16 max-w-5xl" aria-labelledby="find-us-heading">
        <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="find-us-heading" class="font-serif text-2xl text-luxury-matte-black">Find Us</h2>
            <p class="mt-2 text-sm font-light text-luxury-charcoal sm:text-base">
              Visit our showroom in Al-Swaifyeh, Amman.
            </p>
          </div>
          <a
            :href="mapsDirectionsUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex w-max items-center gap-2 border-b border-luxury-brass-contrast pb-1 text-sm text-luxury-brass-contrast transition-colors hover:text-luxury-matte-black"
          >
            <span>Get directions</span>
            <Icon name="lucide:external-link" size="14" />
          </a>
        </div>

        <div class="overflow-hidden border border-luxury-warm-beige/30 bg-luxury-warm-beige/10 shadow-sm">
          <div class="relative aspect-[4/3] w-full sm:aspect-[16/9]">
            <iframe
              :src="mapsEmbedUrl"
              title="Verve showroom location on Google Maps"
              class="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              allowfullscreen
              referrerpolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// Official Google Maps listing for VERVE showroom (fabric store, Al-Swaifyeh)
const mapsEmbedUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3386.85417570248!2d35.8681432!3d31.955486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ca1026694633b%3A0xcddacdf59402220!2sVERVE!5e0!3m2!1sen!2sjo!4v1749686400000!5m2!1sen!2sjo'
const mapsDirectionsUrl = 'https://www.google.com/maps/place/VERVE/@31.955486,35.870518,17z/data=!4m6!3m5!1s0x151ca1026694633b:0xcddacdf59402220!8m2!3d31.955486!4d35.870518!16s%2Fg%2F11b7l81lj5'

const { submit, submitting, error, success, reset } = useContactForm()

const form = reactive({
  name: '',
  email: '',
  message: '',
  website: '',
})

async function handleSubmit() {
  const sent = await submit({
    name: form.name.trim(),
    email: form.email.trim(),
    message: form.message.trim(),
    website: form.website.trim(),
  })

  if (sent) {
    form.name = ''
    form.email = ''
    form.message = ''
    form.website = ''
  }
}

onBeforeUnmount(() => {
  reset()
})

useHead({
  title: 'Contact | Verve Luxury Interiors',
})
</script>

<style scoped>
.contact-input {
  @apply w-full border-b border-luxury-charcoal bg-transparent py-2 text-base text-luxury-matte-black outline-none transition-colors focus:border-luxury-brass-contrast disabled:opacity-60;
}
</style>
