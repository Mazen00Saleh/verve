export function formatBrochureDate(isoDate: string | null | undefined): string {
  if (!isoDate) {
    return ''
  }

  const date = new Date(isoDate)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${month}/${year}`
}
