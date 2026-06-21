// https://nuxt.com/docs/api/configuration/nuxt-config
function getImageDomains(): string[] {
  const domains = ['images.unsplash.com']

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL
  if (supabaseUrl) {
    try {
      domains.push(new URL(supabaseUrl).hostname)
    } catch {
      // ignore invalid URL
    }
  }

  return domains
}

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@nuxt/icon',
    '@nuxtjs/supabase',
    '@nuxt/image',
  ],
  supabase: {
    redirect: false,
    useSsrCookies: true,
  },
  image: {
    quality: 80,
    format: ['webp'],
    domains: getImageDomains(),
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
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
      Montserrat: [400, 500, 600],
    },
    display: 'swap',
    preload: true,
    preconnect: true,
    download: true,
  },
  routeRules: {
    '/': { prerender: true },
    '/admin/**': { ssr: false },
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/_ipx/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/images/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/favicon.ico': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/robots.txt': { headers: { 'cache-control': 'public, max-age=86400' } },
  },
})
