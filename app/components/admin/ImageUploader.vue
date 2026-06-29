<template>
  <AdminFormField :label="label" :hint="hint" :required="required">
    <template #default="{ inputId }">
      <div class="space-y-4">
        <div
          class="relative overflow-hidden rounded-lg border-2 border-dashed transition-colors"
          :class="dropZoneClass"
          @dragenter.prevent="onDragEnter"
          @dragover.prevent="onDragOver"
          @dragleave.prevent="onDragLeave"
          @drop.prevent="onDrop"
        >
          <input
            :id="inputId"
            ref="fileInputRef"
            type="file"
            class="sr-only"
            :accept="accept"
            :multiple="multiple"
            :disabled="disabled || isBusy"
            @change="onFileInputChange"
          >

          <template v-if="!multiple && images[0]">
            <div class="p-4">
              <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                <div class="overflow-hidden border border-neutral-200 bg-white">
                  <div class="relative aspect-square bg-neutral-50">
                    <img
                      :src="images[0].previewUrl ?? images[0].url"
                      :alt="images[0].fileName"
                      class="h-full w-full object-cover"
                    >

                    <div
                      v-if="images[0].status === 'compressing' || images[0].status === 'uploading'"
                      class="absolute inset-0 flex items-center justify-center bg-white/80 text-xs uppercase tracking-widest text-luxury-charcoal"
                    >
                      {{ images[0].status === 'compressing' ? 'Optimizing...' : 'Uploading...' }}
                    </div>

                    <button
                      type="button"
                      class="absolute right-2 top-2 bg-white/95 px-2 py-1 text-[10px] uppercase tracking-widest hover:bg-white"
                      :disabled="disabled || images[0].status === 'compressing' || images[0].status === 'uploading'"
                      @click="removeImage(images[0])"
                    >
                      Remove
                    </button>
                  </div>

                  <div class="space-y-1 px-3 py-3 text-xs text-luxury-charcoal">
                    <p class="truncate font-medium text-luxury-matte-black">{{ images[0].fileName }}</p>

                    <template v-if="images[0].status === 'complete' && images[0].originalSize && images[0].compressedSize">
                      <p>Original: {{ formatBytes(images[0].originalSize) }}</p>
                      <p>Optimized: {{ formatBytes(images[0].compressedSize) }}</p>
                      <p class="text-emerald-700">Saved: {{ images[0].savingsPercent }}%</p>
                    </template>

                    <p v-else-if="images[0].status === 'complete'" class="text-emerald-700">Uploaded</p>
                    <p v-else-if="images[0].status === 'error'" class="text-red-700">{{ images[0].error }}</p>
                  </div>
                </div>
              </div>

              <div class="border-t border-dashed border-neutral-200 px-6 py-5 text-center">
                <p class="text-sm font-medium text-luxury-matte-black">
                  {{ dropZoneTitle }}
                </p>
                <p class="mt-2 text-xs font-normal text-luxury-charcoal">
                  Drag and drop to replace, or
                  <button
                    type="button"
                    class="underline hover:text-luxury-brass"
                    :disabled="disabled || isBusy"
                    @click="openFilePicker"
                  >
                    browse files
                  </button>
                </p>
                <p v-if="isBusy" class="mt-3 text-xs text-luxury-brass">
                  {{ busyMessage }}
                </p>
              </div>
            </div>
          </template>

          <template v-else-if="multiple && images.length">
            <div class="grid grid-cols-2 gap-4 p-4 md:grid-cols-3 lg:grid-cols-4">
              <div
                v-for="image in images"
                :key="image.id"
                class="overflow-hidden border border-neutral-200 bg-white"
              >
                <div class="relative aspect-square bg-neutral-50">
                  <img
                    :src="image.previewUrl ?? image.url"
                    :alt="image.fileName"
                    class="h-full w-full object-cover"
                  >

                  <div
                    v-if="image.status === 'compressing' || image.status === 'uploading'"
                    class="absolute inset-0 flex items-center justify-center bg-white/80 text-xs uppercase tracking-widest text-luxury-charcoal"
                  >
                    {{ image.status === 'compressing' ? 'Optimizing...' : 'Uploading...' }}
                  </div>

                  <button
                    type="button"
                    class="absolute right-2 top-2 bg-white/95 px-2 py-1 text-[10px] uppercase tracking-widest hover:bg-white"
                    :disabled="disabled || image.status === 'compressing' || image.status === 'uploading'"
                    @click="removeImage(image)"
                  >
                    Remove
                  </button>
                </div>

                <div class="space-y-1 px-3 py-3 text-xs text-luxury-charcoal">
                  <p class="truncate font-medium text-luxury-matte-black">{{ image.fileName }}</p>

                  <template v-if="image.status === 'complete' && image.originalSize && image.compressedSize">
                    <p>Original: {{ formatBytes(image.originalSize) }}</p>
                    <p>Optimized: {{ formatBytes(image.compressedSize) }}</p>
                    <p class="text-emerald-700">Saved: {{ image.savingsPercent }}%</p>
                  </template>

                  <p v-else-if="image.status === 'complete'" class="text-emerald-700">Uploaded</p>
                  <p v-else-if="image.status === 'error'" class="text-red-700">{{ image.error }}</p>
                </div>
              </div>
            </div>

            <div class="border-t border-dashed border-neutral-200 px-6 py-5 text-center">
              <p class="text-sm font-medium text-luxury-matte-black">
                {{ dropZoneTitle }}
              </p>
              <p class="mt-2 text-xs font-normal text-luxury-charcoal">
                Drag and drop more images here, or
                <button
                  type="button"
                  class="underline hover:text-luxury-brass"
                  :disabled="disabled || isBusy"
                  @click="openFilePicker"
                >
                  browse files
                </button>
              </p>
              <p v-if="isBusy" class="mt-3 text-xs text-luxury-brass">
                {{ busyMessage }}
              </p>
            </div>
          </template>

          <div v-else class="flex flex-col items-center justify-center px-6 py-10 text-center">
            <p class="text-sm font-medium text-luxury-matte-black">
              {{ dropZoneTitle }}
            </p>
            <p class="mt-2 text-xs font-normal text-luxury-charcoal">
              Drag and drop {{ multiple ? 'images' : 'an image' }} here, or
              <button
                type="button"
                class="underline hover:text-luxury-brass"
                :disabled="disabled || isBusy"
                @click="openFilePicker"
              >
                browse files
              </button>
            </p>
            <p class="mt-2 text-[11px] uppercase tracking-widest text-luxury-charcoal/60">
              JPEG, PNG, WebP, GIF
            </p>

            <p v-if="isBusy" class="mt-4 text-xs text-luxury-brass">
              {{ busyMessage }}
            </p>
          </div>
        </div>

        <p v-if="errorMessage" class="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {{ errorMessage }}
        </p>
      </div>
    </template>
  </AdminFormField>
</template>

<script setup lang="ts">
import type { ImageUploadPreset, UploadedImage } from '~/composables/useImageUpload'

const props = withDefaults(defineProps<{
  folder: string
  label: string
  hint?: string
  required?: boolean
  multiple?: boolean
  maxFiles?: number
  preset?: ImageUploadPreset
  modelValue?: UploadedImage[]
  disabled?: boolean
}>(), {
  hint: undefined,
  required: false,
  multiple: false,
  maxFiles: undefined,
  preset: 'catalog',
  modelValue: () => [],
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: UploadedImage[]]
  'remove-record': [recordId: string]
  'remove-image': [image: UploadedImage]
}>()

const {
  isAcceptedImage,
  compressImage,
  uploadCompressedFile,
  formatBytes,
} = useImageUpload()

const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const isProcessing = ref(false)
const errorMessage = ref('')

const images = computed(() => props.modelValue)
const maxAllowed = computed(() => {
  if (props.maxFiles) {
    return props.maxFiles
  }

  return props.multiple ? Infinity : 1
})

const isBusy = computed(() =>
  isProcessing.value || images.value.some(image =>
    image.status === 'compressing' || image.status === 'uploading',
  ),
)

const dropZoneTitle = computed(() => {
  if (isDragging.value) {
    return 'Drop to upload'
  }

  if (isBusy.value) {
    return 'Processing images...'
  }

  return props.multiple ? 'Upload images' : 'Upload image'
})

const busyMessage = computed(() => {
  const compressing = images.value.some(image => image.status === 'compressing')
  const uploading = images.value.some(image => image.status === 'uploading')

  if (compressing) {
    return 'Optimizing images before upload...'
  }

  if (uploading) {
    return 'Uploading optimized images...'
  }

  return 'Processing...'
})

const dropZoneClass = computed(() => {
  if (props.disabled || isBusy.value) {
    return 'border-neutral-200 bg-neutral-50 opacity-80'
  }

  if (isDragging.value) {
    return 'border-luxury-brass bg-luxury-brass/5'
  }

  if (errorMessage.value) {
    return 'border-red-300 bg-red-50/40'
  }

  return 'border-neutral-300 bg-white hover:border-luxury-brass/60'
})

const accept = 'image/jpeg,image/png,image/webp,image/gif'

function openFilePicker() {
  fileInputRef.value?.click()
}

function onDragEnter() {
  if (!props.disabled && !isBusy.value) {
    isDragging.value = true
  }
}

function onDragOver() {
  if (!props.disabled && !isBusy.value) {
    isDragging.value = true
  }
}

function onDragLeave() {
  isDragging.value = false
}

async function onDrop(event: DragEvent) {
  isDragging.value = false

  if (props.disabled || isBusy.value) {
    return
  }

  const files = [...(event.dataTransfer?.files ?? [])]
  await processFiles(files)
}

async function onFileInputChange(event: Event) {
  const input = event.target as HTMLInputElement
  const files = [...(input.files ?? [])]
  input.value = ''
  await processFiles(files)
}

async function processFiles(files: File[]) {
  errorMessage.value = ''

  if (!files.length) {
    return
  }

  const imageFiles = files.filter(file => isAcceptedImage(file))

  if (!imageFiles.length) {
    errorMessage.value = 'Please upload a supported image file (JPEG, PNG, WebP, or GIF).'
    return
  }

  const remainingSlots = maxAllowed.value - images.value.length

  const filesToProcess = props.multiple
    ? imageFiles.slice(0, Math.max(remainingSlots, 0))
    : imageFiles.slice(0, 1)

  if (props.multiple && filesToProcess.length < imageFiles.length) {
    errorMessage.value = `Only ${maxAllowed.value} image(s) allowed. Extra files were ignored.`
  }

  if (!filesToProcess.length) {
    errorMessage.value = `Maximum of ${maxAllowed.value} image(s) reached.`
    return
  }

  isProcessing.value = true

  let workingImages = props.multiple ? [...images.value] : []

  if (!props.multiple && workingImages.length >= 1) {
    removeImage(workingImages[0])
    workingImages = []
  }

  for (const file of filesToProcess) {
    const placeholder: UploadedImage = {
      id: crypto.randomUUID(),
      url: '',
      path: '',
      fileName: file.name,
      previewUrl: URL.createObjectURL(file),
      status: 'compressing',
    }

    workingImages = [...workingImages, placeholder]
    emit('update:modelValue', workingImages)

    try {
      const compressed = await compressImage(file, props.preset)

      workingImages = workingImages.map(image =>
        image.id === placeholder.id
          ? {
              ...image,
              originalSize: compressed.originalSize,
              compressedSize: compressed.compressedSize,
              savingsPercent: compressed.savingsPercent,
              status: 'uploading',
            }
          : image,
      )
      emit('update:modelValue', workingImages)

      const uploaded = await uploadCompressedFile(
        compressed.file,
        props.folder,
        file.name,
        compressed,
      )

      if (placeholder.previewUrl) {
        URL.revokeObjectURL(placeholder.previewUrl)
      }

      workingImages = workingImages.map(image =>
        image.id === placeholder.id
          ? {
              ...uploaded,
              id: placeholder.id,
              status: 'complete',
            }
          : image,
      )
      emit('update:modelValue', workingImages)
    } catch (processError) {
      if (placeholder.previewUrl) {
        URL.revokeObjectURL(placeholder.previewUrl)
      }

      workingImages = workingImages.filter(image => image.id !== placeholder.id)

      errorMessage.value = processError instanceof Error
        ? processError.message
        : 'Failed to process image.'
    }
  }

  emit('update:modelValue', workingImages)
  isProcessing.value = false
}

function removeImage(image: UploadedImage) {
  if (image.previewUrl) {
    URL.revokeObjectURL(image.previewUrl)
  }

  if (image.path && image.status === 'complete') {
    emit('remove-image', image)
  }

  if (image.recordId) {
    emit('remove-record', image.recordId)
  }

  emit('update:modelValue', images.value.filter(item => item.id !== image.id))
}

onBeforeUnmount(() => {
  for (const image of images.value) {
    if (image.previewUrl) {
      URL.revokeObjectURL(image.previewUrl)
    }
  }
})
</script>
