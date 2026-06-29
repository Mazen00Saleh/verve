const SHOWROOM_LAT = 31.955486
const SHOWROOM_LNG = 35.870518

/** Share-link embed (no API key). Kept as fallback when no key is configured. */
const LEGACY_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3386.85417570248!2d35.8681432!3d31.955486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ca1026694633b%3A0xcddacdf59402220!2sVERVE!5e0!3m2!1sen!2sjo!4v1749686400000!5m2!1sen!2sjo'

export const mapsDirectionsUrl =
  'https://www.google.com/maps/place/VERVE/@31.955486,35.870518,17z/data=!4m6!3m5!1s0x151ca1026694633b:0xcddacdf59402220!8m2!3d31.955486!4d35.870518!16s%2Fg%2F11b7l81lj5'

/** Share-link embed (no API key). Reliable default for iframe embeds. */
export const mapsEmbedUrl = LEGACY_EMBED_URL

export function getGoogleMapsEmbedUrl(apiKey?: string) {
  const trimmedKey = apiKey?.trim()
  if (!trimmedKey || trimmedKey === 'your-google-maps-api-key') {
    return LEGACY_EMBED_URL
  }

  const params = new URLSearchParams({
    key: trimmedKey,
    q: `${SHOWROOM_LAT},${SHOWROOM_LNG}`,
    zoom: '17',
  })

  return `https://www.google.com/maps/embed/v1/place?${params.toString()}`
}
