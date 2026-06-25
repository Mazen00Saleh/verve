import { MEDIA_BUCKET, getStoragePathFromUrl } from '~/utils/storage'
import { formatBytes, savingsPercent } from '~/utils/format-bytes'
import { getErrorMessage } from '~/utils/errors'

export type ImageUploadPreset = 'catalog' | 'hero'

export type UploadStatus = 'idle' | 'compressing' | 'uploading' | 'complete' | 'error'

export interface UploadedImage {
  id: string
  url: string
  path: string
  fileName: string
  previewUrl?: string
  originalSize?: number
  compressedSize?: number
  savingsPercent?: number
  status: UploadStatus
  error?: string
  /** Existing database record id (e.g. product_images.id) */
  recordId?: string
}

export interface CompressionResult {
  file: File
  originalSize: number
  compressedSize: number
  savingsPercent: number
}

const CATALOG_MAX_SIZE_BYTES = 300 * 1024

// Unified catalog upload preset (primary, gallery, mockup, categories, etc.).
// Sized to the largest public delivery width (mockup 1600w) while staying under 300 KB.
const PRESETS: Record<ImageUploadPreset, {
  maxWidthOrHeight: number
  quality: number
  maxSizeBytes: number
}> = {
  catalog: {
    maxWidthOrHeight: 1600,
    quality: 0.74,
    maxSizeBytes: CATALOG_MAX_SIZE_BYTES,
  },
  hero: {
    maxWidthOrHeight: 2560,
    quality: 0.88,
    maxSizeBytes: 500 * 1024,
  },
}

const OUTPUT_TYPE = 'image/webp'

const ACCEPTED_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
])

export function uploadedImageFromUrl(url: string, recordId?: string): UploadedImage {
  const path = getStoragePathFromUrl(url) ?? ''
  const fileName = path.split('/').pop() ?? url.split('/').pop() ?? 'image'

  return {
    id: recordId ?? crypto.randomUUID(),
    url,
    path,
    fileName,
    status: 'complete',
    recordId,
  }
}

export function useImageUpload() {
  const supabase = useSupabaseClient()

  function isAcceptedImage(file: File): boolean {
    return ACCEPTED_TYPES.has(file.type) || file.type.startsWith('image/')
  }

  function generateFileName(originalName: string): string {
    const baseName = originalName.replace(/\.[^.]+$/, '')
    return `${crypto.randomUUID()}-${baseName}.webp`
  }

  async function compressImage(file: File, preset: ImageUploadPreset = 'catalog'): Promise<CompressionResult> {
    if (!isAcceptedImage(file)) {
      throw new Error('Unsupported file type. Please upload a JPEG, PNG, WebP, or GIF image.')
    }

    const options = PRESETS[preset]
    const originalSize = file.size
    const maxSizeBytes = options.maxSizeBytes
    const maxSizeMB = maxSizeBytes / (1024 * 1024)

    try {
      const imageCompression = (await import('browser-image-compression')).default
      let quality = options.quality
      let maxDimension = options.maxWidthOrHeight
      let compressedFile = file

      for (let attempt = 0; attempt < 6; attempt++) {
        compressedFile = await imageCompression(file, {
          maxSizeMB,
          maxWidthOrHeight: maxDimension,
          useWebWorker: true,
          initialQuality: quality,
          fileType: OUTPUT_TYPE,
        })

        if (compressedFile.size < maxSizeBytes) {
          return {
            file: compressedFile,
            originalSize,
            compressedSize: compressedFile.size,
            savingsPercent: savingsPercent(originalSize, compressedFile.size),
          }
        }

        quality = Math.max(0.35, quality - 0.1)
        maxDimension = Math.round(maxDimension * 0.85)
      }

      throw new Error(
        `Could not compress image below ${formatBytes(maxSizeBytes)} (final size: ${formatBytes(compressedFile.size)}). Try a smaller source image.`,
      )
    } catch (compressionError) {
      if (compressionError instanceof Error && compressionError.message.startsWith('Could not compress')) {
        throw compressionError
      }

      throw new Error(`Image compression failed: ${getErrorMessage(compressionError)}`)
    }
  }

  async function uploadCompressedFile(
    file: File,
    folder: string,
    originalFileName: string,
    meta: Pick<CompressionResult, 'originalSize' | 'compressedSize' | 'savingsPercent'>,
  ): Promise<UploadedImage> {
    const fileName = generateFileName(originalFileName)
    const path = `${folder}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(path, file, {
        cacheControl: '31536000',
        upsert: false,
        contentType: OUTPUT_TYPE,
      })

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path)

    return {
      id: crypto.randomUUID(),
      url: data.publicUrl,
      path,
      fileName,
      originalSize: meta.originalSize,
      compressedSize: meta.compressedSize,
      savingsPercent: meta.savingsPercent,
      status: 'complete',
    }
  }

  async function uploadImage(
    file: File,
    folder: string,
    preset: ImageUploadPreset = 'catalog',
  ): Promise<UploadedImage> {
    const compressed = await compressImage(file, preset)
    return uploadCompressedFile(compressed.file, folder, file.name, compressed)
  }

  async function uploadImages(
    files: File[],
    folder: string,
    preset: ImageUploadPreset = 'catalog',
  ): Promise<UploadedImage[]> {
    const results: UploadedImage[] = []

    for (const file of files) {
      results.push(await uploadImage(file, folder, preset))
    }

    return results
  }

  async function deleteImage(image: Pick<UploadedImage, 'path' | 'url'>): Promise<void> {
    const path = image.path || getStoragePathFromUrl(image.url)

    if (!path) {
      return
    }

    const { error: deleteError } = await supabase.storage
      .from(MEDIA_BUCKET)
      .remove([path])

    if (deleteError) {
      throw deleteError
    }
  }

  return {
    isAcceptedImage,
    compressImage,
    uploadCompressedFile,
    uploadImage,
    uploadImages,
    deleteImage,
    formatBytes,
    uploadedImageFromUrl,
  }
}
