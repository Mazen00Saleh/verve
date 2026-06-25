import { buildSitemapXml, getSitemapPaths } from '../utils/sitemap'

export default defineEventHandler(async (event) => {
  const { public: { siteUrl } } = useRuntimeConfig(event)
  const paths = await getSitemapPaths(event)

  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')
  setResponseHeader(event, 'cache-control', 'public, max-age=3600, s-maxage=3600')

  return buildSitemapXml(siteUrl, paths)
})
