export const MEDIA_BUCKET = 'media'

export function getStoragePathFromUrl(url: string | null | undefined): string | null {
  if (!url) {
    return null
  }

  const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`
  const index = url.indexOf(marker)

  if (index === -1) {
    return null
  }

  return decodeURIComponent(url.slice(index + marker.length))
}

export function collectUrls(urls: Array<string | null | undefined>): string[] {
  return [...new Set(urls.filter((url): url is string => Boolean(url)))]
}
