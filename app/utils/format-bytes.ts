export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B'
  }

  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function savingsPercent(originalSize: number, compressedSize: number): number {
  if (originalSize <= 0) {
    return 0
  }

  return Math.max(0, Math.round((1 - compressedSize / originalSize) * 100))
}
