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
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      googleMapsApiKey: process.env.NUXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    },
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@nuxt/icon',
    '@nuxtjs/supabase',
    '@nuxt/image',
  ],
  experimental: {
    // Extracts async data payloads into separate JSON files to shrink HTML on navigation.
    payloadExtraction: true,
    // Serialises payloads as JSON instead of devalue for faster parsing in the browser.
    renderJsonPayloads: true,
  },
  supabase: {
    redirect: false,
    useSsrCookies: true,
  },
  nitro: {
    // Targets Cloudflare Pages Functions for SSR at the edge.
    preset: process.env.NITRO_PRESET || 'cloudflare-pages',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },
  image: {
    quality: 100,
    format: ['webp'],
    domains: getImageDomains(),
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1920,
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
    // Homepage: edge SWR so CMS updates appear without a full rebuild.
    // '/': { swr: 300 },
    // Marketing pages: no Supabase — safe to prerender.
    // '/about': { prerender: true },
    // '/contact': { swr: 3600 },
    // Public catalog: edge SWR (public, non-personalised CMS content).
    // '/collections': { swr: 300 },
    // '/collections/**': { swr: 300 },
    // '/inspiration': { swr: 600 },
    // '/inspiration/**': { swr: 600 },
    '/brochures': { redirect: { to: '/inspiration', statusCode: 301 } },
    // Admin SPA — never cache.
    '/admin/**': { ssr: false },
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/_ipx/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/images/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/favicon.ico': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/robots.txt': { headers: { 'cache-control': 'public, max-age=86400' } },
    '/sitemap.xml': { swr: 3600 },
  },
})
