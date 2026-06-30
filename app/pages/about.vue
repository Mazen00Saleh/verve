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
              srcset="/images/about-hero1.webp"
              sizes="(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw"
              type="image/webp"
            >
            <img
              src="/images/about-hero1.webp"
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

usePageSeo({
  title: 'About | Verve Luxury Interiors',
  description: 'Established in 2006, Verve designs and wholesales luxury furnishing fabrics and wallpapers across the MENA region with uncompromising quality.',
  path: '/about',
  image: '/images/about-hero1.webp',
})

useHead({
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: '/images/about-hero1.webp',
      type: 'image/webp',
      imagesizes: '(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw',
    },
  ],
})
</script>
