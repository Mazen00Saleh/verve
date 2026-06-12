export type PaginatedResult<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export function parsePageQuery(value: unknown): number {
  const raw = Array.isArray(value) ? value[0] : value
  const parsed = Number(raw)

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1
  }

  return Math.floor(parsed)
}

export function getPaginationRange(page: number, pageSize: number) {
  const safePage = Math.max(1, page)
  const from = (safePage - 1) * pageSize
  const to = from + pageSize - 1

  return { from, to, page: safePage }
}

export function getTotalPages(total: number, pageSize: number): number {
  if (total <= 0) {
    return 1
  }

  return Math.ceil(total / pageSize)
}

export function normalizePage(page: number, total: number, pageSize: number): number {
  const totalPages = getTotalPages(total, pageSize)

  if (page > totalPages) {
    return totalPages
  }

  return Math.max(1, page)
}

export function buildPaginatedResult<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number,
): PaginatedResult<T> {
  const normalizedPage = normalizePage(page, total, pageSize)

  return {
    items,
    total,
    page: normalizedPage,
    pageSize,
    totalPages: getTotalPages(total, pageSize),
  }
}

export function getVisiblePageRange(currentPage: number, totalPages: number, maxVisible = 5): number[] {
  if (totalPages <= 1) {
    return [1]
  }

  const half = Math.floor(maxVisible / 2)
  let start = Math.max(1, currentPage - half)
  let end = Math.min(totalPages, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

export function getPaginationSummary(
  page: number,
  pageSize: number,
  total: number,
  itemLabel: string,
): { rangeLabel: string, pageLabel: string } {
  if (total === 0) {
    return {
      rangeLabel: `Showing 0 ${itemLabel}`,
      pageLabel: 'Page 1 of 1',
    }
  }

  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)
  const totalPages = getTotalPages(total, pageSize)

  return {
    rangeLabel: `Showing ${start}–${end} of ${total} ${itemLabel}`,
    pageLabel: `Page ${page} of ${totalPages}`,
  }
}
