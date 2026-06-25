export type ImageSizePreset = 'thumbnail' | 'card' | 'mosaic' | 'product' | 'mockup' | 'feature' | 'accent'

const PRESETS: Record<ImageSizePreset, { width: number, height?: number, sizes: string }> = {
  thumbnail: {
    width: 400,
    height: 400,
    sizes: '150px',
  },
  card: {
    width: 800,
    height: 1000,
    sizes: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 400px',
  },
  mosaic: {
    width: 900,
    height: 1125,
    sizes: '(max-width: 768px) 100vw, 33vw',
  },
  product: {
    width: 1200,
    height: 1200,
    sizes: '(max-width: 1024px) 100vw, 50vw',
  },
  mockup: {
    width: 1600,
    sizes: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 480px',
  },
  feature: {
    width: 1200,
    height: 1500,
    sizes: '(max-width: 1024px) 100vw, 448px',
  },
  accent: {
    width: 1200,
    height: 1500,
    sizes: '(max-width: 1024px) 60vw, 336px',
  },
}

export function getImagePreset(preset: ImageSizePreset) {
  return PRESETS[preset]
}
