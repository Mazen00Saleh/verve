<template>
  <div class="page-shell about-page">
    <div class="page-container about-page-container">
      <section class="about-hero" aria-labelledby="about-hero-heading">
        <div class="about-hero-text">
          <h1 id="about-hero-heading" class="about-hero-heading">
            WHO WE ARE?
          </h1>
          <p class="about-hero-body">
            Established in 2006, Verve designs and wholesales furnishing fabrics, and wallpapers in all the MENA region. Verve's business philosophy is to combine creativity and innovation with the highest levels of quality: quality of design, product, service and people.
          </p>
        </div>

        <div class="about-hero-image">
          <picture class="block w-full">
            <source
              srcset="/images/about-hero.webp"
              sizes="(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw"
              type="image/webp"
            >
            <img
              src="/images/about-hero.webp"
              sizes="(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw"
              alt="Verve Exclusive Home Collection showroom interior"
              class="about-hero-img"
              width="1200"
              height="568"
              loading="eager"
              fetchpriority="high"
              decoding="async"
            >
          </picture>
        </div>
      </section>

      <section class="about-bottom" aria-label="Services and information">
        <div class="about-services">
          <h2 class="about-services-heading">
            What can we do for you?
          </h2>

          <div class="about-accordion">
            <div
              v-for="panel in accordionPanels"
              :key="panel.id"
              class="about-accordion-item"
            >
              <button
                :id="`about-trigger-${panel.id}`"
                type="button"
                class="about-accordion-trigger"
                :class="{ 'about-accordion-trigger-active': openPanel === panel.id }"
                :aria-expanded="openPanel === panel.id"
                :aria-controls="`about-panel-${panel.id}`"
                @click="togglePanel(panel.id)"
              >
                <span class="about-accordion-icon" aria-hidden="true">
                  {{ openPanel === panel.id ? '−' : '+' }}
                </span>
                <span>{{ panel.title }}</span>
              </button>

              <div
                v-show="openPanel === panel.id"
                :id="`about-panel-${panel.id}`"
                class="about-accordion-panel"
                role="region"
                :aria-labelledby="`about-trigger-${panel.id}`"
              >
                <p class="about-accordion-body">
                  {{ panel.content }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <aside class="about-sidebar">
          <div>
            <h3 class="about-sidebar-heading">
              Hours of Operation
            </h3>
            <dl class="about-hours">
              <div
                v-for="entry in hoursOfOperation"
                :key="entry.day"
                class="about-hours-row"
              >
                <dt>{{ entry.day }}</dt>
                <dd>{{ entry.hours }}</dd>
              </div>
            </dl>
          </div>

          <div class="about-careers">
            <h3 class="about-sidebar-heading">
              Careers
            </h3>
            <p class="about-careers-text">
              If you're interested in employment opportunities at Verve Group, please email us:
              <a href="mailto:info@verve-group.com" class="about-careers-link">info@verve-group.com</a>
            </p>
          </div>
        </aside>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
type AccordionPanelId = 'what-we-do' | 'what-we-offer'

const openPanel = ref<AccordionPanelId | null>('what-we-do')

const accordionPanels = [
  {
    id: 'what-we-do' as const,
    title: 'What we do?',
    content:
      "Take a step through the gateway to inspired interiors. By offering a style-packed diversity of fabrics for curtains, blinds, upholstery and accessories – not to mention a range of truly stunning wallpapers – Verve Group can always support and assist with enticing new ideas for home interiors. So if you're stuck for inspiration, visit our showroom and get the look, touch and feel of our endless fabric wallpaper, wall-covering collections!",
  },
  {
    id: 'what-we-offer' as const,
    title: 'What we offer?',
    content:
      "A top notch and super elite fabric provider offer an Exquisite taste, elevated quality and a refined sense of luxury – these are the principals on which verve was founded. Using modern and classic references as a starting point but always infusing them with an elegant, contemporary touch, 'verve Group' describes the ebullience of our past endeavors. It sketches the outline of our future. A collective through more than ten quintessentially luxury interior brands, We aim and succeed in providing a variety of Lavish, Opulent and exquisite luxury brands that are specialized in Fabric, Wall-coverings and Wallpaper to match different styles and tastes giving you a feel of your perfect home!",
  },
]

const hoursOfOperation = [
  { day: 'Saturday to Wednesday', hours: '10 AM - 8 PM' },
  { day: 'Thursday', hours: '10 AM - 7 PM' },
  { day: 'Friday', hours: 'Closed' },
]

function togglePanel(id: AccordionPanelId) {
  openPanel.value = openPanel.value === id ? null : id
}

useHead({
  title: 'About | Verve Luxury Interiors',
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: '/images/about-hero.webp',
      type: 'image/webp',
      imagesizes: '(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw',
    },
  ],
})
</script>

<style scoped>
.about-page {
  @apply min-h-0 pb-12 pt-8 sm:pb-16 sm:pt-10 md:pt-12;
}

.about-page-container {
  @apply max-w-7xl py-4 sm:py-6;
}

.about-hero {
  @apply mb-12 grid grid-cols-1 items-start gap-8 md:mb-16 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] md:gap-8 lg:gap-10;
}

.about-hero-heading {
  @apply mb-3 text-lg uppercase tracking-wide text-luxury-matte-black sm:mb-4 sm:text-xl;
}

.about-hero-body {
  @apply text-xs font-normal leading-relaxed text-luxury-charcoal sm:text-sm;
}

.about-hero-image {
  @apply w-full;
}

.about-hero-img {
  @apply h-auto w-full;
}

.about-bottom {
  @apply grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-12 xl:gap-16;
}

.about-services-heading {
  @apply mb-5 text-lg text-luxury-matte-black sm:mb-6 sm:text-xl;
}

.about-accordion {
  @apply border border-neutral-200;
}

.about-accordion-item + .about-accordion-item {
  @apply border-t border-neutral-200;
}

.about-accordion-trigger {
  @apply flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm text-luxury-charcoal transition-colors sm:px-5 sm:py-4 sm:text-base;
}

.about-accordion-trigger-active {
  @apply text-luxury-brass;
}

.about-accordion-icon {
  @apply inline-flex w-4 shrink-0 justify-center text-base leading-none;
}

.about-accordion-panel {
  @apply border-t border-neutral-200 px-4 py-4 sm:px-5 sm:py-5;
}

.about-accordion-body {
  @apply text-xs font-normal leading-relaxed text-luxury-charcoal sm:text-sm;
}

.about-sidebar-heading {
  @apply mb-3 text-base text-luxury-muted sm:text-lg;
}

.about-hours {
  @apply space-y-1.5;
}

.about-hours-row {
  @apply grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 text-xs font-normal text-luxury-charcoal sm:text-sm;
}

.about-hours-row dt {
  @apply text-luxury-muted;
}

.about-hours-row dd {
  @apply text-right;
}

.about-careers {
  @apply mt-8 sm:mt-10;
}

.about-careers-text {
  @apply text-xs font-normal leading-relaxed text-luxury-charcoal sm:text-sm;
}

.about-careers-link {
  @apply underline decoration-luxury-charcoal/40 underline-offset-2 transition-colors hover:text-luxury-brass hover:decoration-luxury-brass;
}
</style>
