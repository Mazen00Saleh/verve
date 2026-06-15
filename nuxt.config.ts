// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@nuxt/icon',
    '@nuxtjs/supabase',
    '@vercel/analytics/nuxt',
    '@vercel/speed-insights/nuxt',
  ],
  supabase: {
    redirect: false,
    useSsrCookies: true,
  },
  css: ['~/assets/css/main.css'],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'en' },
    },
  },
  googleFonts: {
    families: {
      'Playfair Display': [400, 600],
      Montserrat: [400, 500, 600],
    },
    display: 'swap',
    preload: true,
    preconnect: true,
    download: true,
  },
  routeRules: {
    '/admin/**': { ssr: true },
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/images/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/favicon.ico': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/favicon1.ico': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/robots.txt': { headers: { 'cache-control': 'public, max-age=86400' } },
  },
})
