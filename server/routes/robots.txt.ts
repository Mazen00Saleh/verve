export default defineEventHandler((event) => {
  const { public: { siteUrl } } = useRuntimeConfig(event)
  const origin = siteUrl.replace(/\/$/, '')

  setResponseHeader(event, 'content-type', 'text/plain; charset=utf-8')
  setResponseHeader(event, 'cache-control', 'public, max-age=86400')

  return [
    'User-Agent: *',
    'Disallow: /admin/',
    'Disallow: /admin',
    '',
    `Sitemap: ${origin}/sitemap.xml`,
  ].join('\n')
})
