import { MEDIA_BUCKET, getStoragePathFromUrl } from '~/utils/storage'
import { getErrorMessage } from '~/utils/errors'

export function useFileUpload() {
  const supabase = useSupabaseClient()
  const uploading = ref(false)
  const error = ref<string | null>(null)

  async function uploadFile(folder: string, file: File): Promise<string> {
    const path = `${folder}/${crypto.randomUUID()}-${file.name}`

    const { error: uploadError } = await supabase.storage
      .from(MEDIA_BUCKET)
      .upload(path, file, {
        cacheControl: '31536000',
        upsert: false,
        contentType: file.type,
      })

    if (uploadError) {
      throw uploadError
    }

    const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path)
    return data.publicUrl
  }

  async function uploadFiles(folder: string, files: File[]): Promise<string[]> {
    if (!files.length) {
      return []
    }

    uploading.value = true
    error.value = null

    try {
      return await Promise.all(files.map(file => uploadFile(folder, file)))
    } catch (uploadError) {
      error.value = getErrorMessage(uploadError)
      throw uploadError
    } finally {
      uploading.value = false
    }
  }

  async function deleteByUrl(url: string | null | undefined): Promise<void> {
    const path = getStoragePathFromUrl(url)

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

  async function deleteByUrls(urls: Array<string | null | undefined>): Promise<void> {
    const paths = [...new Set(
      urls
        .map(url => getStoragePathFromUrl(url))
        .filter((path): path is string => Boolean(path)),
    )]

    if (!paths.length) {
      return
    }

    const { error: deleteError } = await supabase.storage
      .from(MEDIA_BUCKET)
      .remove(paths)

    if (deleteError) {
      throw deleteError
    }
  }

  return {
    uploading: readonly(uploading),
    error: readonly(error),
    uploadFile,
    uploadFiles,
    deleteByUrl,
    deleteByUrls,
  }
}
