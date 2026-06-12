// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@nuxt/icon',
    '@nuxtjs/supabase',
    '@vercel/speed-insights/nuxt',
  ],
  supabase: {
    redirect: false,
    useSsrCookies: true,
  },
  css: ['~/assets/css/main.css'],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' }
  },
  googleFonts: {
    families: {
      'Playfair Display': {
        wght: [400, 500, 600, 700],
        ital: [400]
      },
      Montserrat: [300, 400, 500, 600],
    },
    display: 'swap',
  },
})