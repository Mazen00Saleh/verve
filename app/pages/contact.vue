<template>
  <div class="page-shell contact-page">
    <div class="page-container contact-page-container">
      <h1 class="sr-only">Contact Verve Luxury Interiors</h1>
      <div class="contact-layout">
        <div class="contact-map" aria-label="Verve showroom location on Google Maps">
          <iframe
            :src="mapsEmbedUrl"
            title="Verve showroom location on Google Maps"
            class="contact-map-iframe"
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          />
        </div>

        <div class="contact-content">
        <div class="contact-info-grid">
          <div>
            <h3 class="contact-info-heading">Address</h3>
            <p class="contact-info-text">
              Verve Building No.(67), <br>
              Prs. Alia St, Al-Swaifyeh, <br>
              Amman, Jordan
            </p>
          </div>

          <div>
            <h3 class="contact-info-heading">Contact Number</h3>
            <p class="contact-info-text">
              Tell:
              <a href="tel:+96265925041" class="transition-colors hover:text-luxury-brass underline">06-5925041</a>
            </p>
            <p class="contact-info-text">
              Mobile:
              <a href="tel:+962790202838" class="transition-colors hover:text-luxury-brass underline">079 0202 838</a>
            </p>
          </div>

          <div>
            <h3 class="contact-info-heading">Email</h3>
            <a
              href="mailto:info@verve-group.com"
              class="contact-info-text transition-colors hover:text-luxury-brass underline"
            >
              info@verve-group.com
            </a>
          </div>

          <div>
            <h3 class="contact-info-heading">Social</h3>
            <div class="flex items-center gap-4">
              <a
                href="https://facebook.com/VerveHome"
                target="_blank"
                rel="noopener noreferrer"
                class="text-luxury-charcoal transition-colors hover:text-luxury-brass"
                aria-label="Facebook"
              >
                <Icon name="lucide:facebook" size="16" />
              </a>
              <a
                href="mailto:info@verve-group.com"
                class="text-luxury-charcoal transition-colors hover:text-luxury-brass"
                aria-label="Email"
              >
                <Icon name="lucide:mail" size="16" />
              </a>
              
              <a
                href="https://instagram.com/vervegroup"
                target="_blank"
                rel="noopener noreferrer"
                class="text-luxury-charcoal transition-colors hover:text-luxury-brass"
                aria-label="Instagram"
              >
                <Icon name="lucide:instagram" size="16" />
              </a>
              <a
                href="https://wa.me/962790202838"
                target="_blank"
                rel="noopener noreferrer"
                class="text-luxury-charcoal transition-colors hover:text-luxury-brass"
                aria-label="WhatsApp"
              >
                <Icon name="lucide:message-circle" size="16" />
              </a>
            </div>
          </div>
        </div>

        <section class="contact-form-section" aria-labelledby="contact-form-heading">
          <h2 id="contact-form-heading" class="contact-form-title">Drop Us A Line</h2>
          <p class="contact-form-intro">
            If you have any questions, please feel free to get in touch with us. We will reply to you as soon as possible. Thank you!
          </p>

          <div
            v-if="success"
            class="mb-3 border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800"
            role="status"
          >
            Thank you for your message. Our team will get back to you shortly.
          </div>

          <div
            v-else-if="error"
            class="mb-3 border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
            role="alert"
          >
            {{ error }}
          </div>

          <form class="contact-form" @submit.prevent="handleSubmit">
            <div class="contact-form-row">
              <div>
                <label for="contact-name" class="contact-label">Your Name (required)</label>
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
                <label for="contact-email" class="contact-label">Your Email (required)</label>
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
            </div>

            <div>
              <label for="contact-message" class="contact-label">Your Message</label>
              <textarea
                id="contact-message"
                v-model="form.message"
                rows="3"
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

            <button type="submit" class="btn-primary contact-submit" :disabled="submitting">
              {{ submitting ? 'Sending...' : 'Submit' }}
            </button>
          </form>
        </section>

        <p class="contact-footer-text">
          VERVE &trade; {{ year }}, Home Deco. Dedicated to Fabric &amp; Wallpaper. &copy; Copyright. All rights reserved.
        </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mapsEmbedUrl } from '~/utils/googleMaps'

const { submit, submitting, error, success, reset } = useContactForm()

const year = new Date().getFullYear()

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

const { public: { siteUrl } } = useRuntimeConfig()

usePageSeo({
  title: 'Contact | Verve Luxury Interiors',
  description: 'Visit Verve in Amman or get in touch by phone, email, or our contact form for luxury fabrics, wallpapers, and interior design support.',
  path: '/contact',
  jsonLd: computed(() => buildLocalBusinessJsonLd(siteUrl)),
})
</script>
