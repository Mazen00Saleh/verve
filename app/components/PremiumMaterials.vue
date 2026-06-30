<template>
  <section class="premium-materials bg-luxury-ivory py-10 sm:py-12 md:py-14">
    <div class="page-container">
      <div class="premium-materials-grid">
        <div class="premium-materials-content">
          <div class="premium-materials-block">
            <h2 class="premium-materials-heading">
              WHAT WE OFFER?
            </h2>
            <p class="premium-materials-body">
              {{ whatWeOffer }}
            </p>
          </div>

          <div class="premium-materials-columns">
            <div class="premium-materials-block">
              <h3 class="premium-materials-heading">
                WHO WE ARE?
              </h3>
              <p class="premium-materials-body">
                {{ whoWeAre }}
              </p>
            </div>

            <div class="premium-materials-block">
              <h3 class="premium-materials-heading">
                WHAT WE DO?
              </h3>
              <p class="premium-materials-body">
                {{ whatWeDo }}
                <NuxtLink to="/about" class="premium-materials-body underline">
                  Read More..
                </NuxtLink>
              </p>
            </div>
          </div>
        </div>

        <div class="premium-materials-image">
          <picture class="block w-full">
            <source
              srcset="/images/about-home.webp"
              sizes="(min-width: 1024px) 50vw, 100vw"
              type="image/webp"
            >
            <img
              src="/images/about-home.webp"
              sizes="(min-width: 1024px) 50vw, 100vw"
              alt="Verve Exclusive Home Collection showroom interior"
              class="h-auto w-full"
              width="1200"
              height="568"
              loading="lazy"
              decoding="async"
            >
          </picture>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const whoWeAre =
  "Established in 2006, Verve designs and wholesales furnishing fabrics, and wallpapers in all the MENA region. Verve's business philosophy is to combine creativity and innovation with the highest levels of quality: quality of design, product, service and people."

const whatWeDo =
  "Take a step through the gateway to inspired interiors. By offering a style-packed diversity of fabrics for curtains, blinds, upholstery and accessories – not to mention a range of truly stunning wallpapers – Verve Group can always support and assist with enticing new ideas for home interiors."

const whatWeOffer =
  "A top notch and super elite fabric provider offer an Exquisite taste, elevated quality and a refined sense of luxury – these are the principals on which verve was founded. Using modern and classic references as a starting point but always infusing them with an elegant, contemporary touch, 'verve Group' describes the ebullience of our past endeavors. It sketches the outline of our future. A collective through more than ten quintessentially luxury interior brands, We aim and succeed in providing a variety of Lavish, Opulent and exquisite luxury brands that are specialized in Fabric, Wall-coverings and Wallpaper to match different styles and tastes giving you a feel of your perfect home!"
</script>
