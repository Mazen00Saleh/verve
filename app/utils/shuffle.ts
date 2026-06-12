/** Fisher–Yates shuffle with injectable RNG (for deterministic SSR-safe shuffles). */
export function shuffleArray<T>(array: T[], random: () => number = Math.random): T[] {
  const result = [...array]

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }

  return result
}

export function pickRandom<T>(array: T[], count: number, random?: () => number): T[] {
  if (!array.length || count <= 0) {
    return []
  }

  return shuffleArray(array, random).slice(0, Math.min(count, array.length))
}

/** Simple string hash for stable daily seeds. */
export function hashString(value: string): number {
  let hash = 0

  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i)
    hash |= 0
  }

  return Math.abs(hash)
}

/** Mulberry32 PRNG — same seed yields same sequence on server and client. */
export function createSeededRandom(seed: number): () => number {
  let state = seed % 2147483647
  if (state <= 0) {
    state += 2147483646
  }

  return () => {
    state = (state * 16807) % 2147483647
    return (state - 1) / 2147483646
  }
}

/** Picks a subset that changes daily but stays stable within a day (SSR-safe). */
export function pickDailyRandom<T>(array: T[], count: number, salt = ''): T[] {
  const dayKey = new Date().toISOString().slice(0, 10)
  const seed = hashString(`${dayKey}:${salt}:${array.length}`)
  return pickRandom(array, count, createSeededRandom(seed))
}
