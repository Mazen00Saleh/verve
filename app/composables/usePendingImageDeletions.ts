import type { UploadedImage } from '~/composables/useImageUpload'

export function usePendingImageDeletions() {
  const { deleteByUrls } = useFileUpload()
  const pendingUrls = ref<string[]>([])

  function trackRemovedImage(image: UploadedImage) {
    if (image.status === 'complete' && image.url) {
      pendingUrls.value.push(image.url)
    }
  }

  async function flushPendingDeletions() {
    const urls = [...new Set(pendingUrls.value)]
    pendingUrls.value = []

    if (urls.length) {
      await deleteByUrls(urls)
    }
  }

  return {
    trackRemovedImage,
    flushPendingDeletions,
  }
}
