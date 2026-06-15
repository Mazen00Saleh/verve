import type { Category } from '~/types/catalog'

export type HomeCategoryMosaicSlot = 'left-top' | 'left-bottom' | 'middle' | 'right'

export type HomeCategoryMosaicConfig = {
  slot: HomeCategoryMosaicSlot
  label: string
  slugs: string[]
  titlePattern: RegExp
  className: string
}

export const HOME_CATEGORY_MOSAIC_SLOTS: HomeCategoryMosaicConfig[] = [
  {
    slot: 'left-top',
    label: 'Fabrics',
    slugs: ['fabrics', 'fabric'],
    titlePattern: /fabric/i,
    className: 'aspect-[5/3] sm:aspect-[4/3] md:col-start-1 md:row-start-1 md:aspect-auto md:h-full md:min-h-0',
  },
  {
    slot: 'left-bottom',
    label: 'Wallcoverings',
    slugs: ['wall-coverings', 'wallcoverings', 'wall-covering'],
    titlePattern: /wall\s*cover|accessor/i,
    className: 'aspect-[5/3] sm:aspect-[4/3] md:col-start-1 md:row-start-2 md:aspect-auto md:h-full md:min-h-0',
  },
  {
    slot: 'middle',
    label: 'Wallpapers',
    slugs: ['wallpapers', 'wallpaper'],
    titlePattern: /wallpaper/i,
    className: 'aspect-[4/5] sm:aspect-[3/4] md:col-start-2 md:row-span-2 md:row-start-1 md:aspect-auto md:h-full md:min-h-0',
  },
  {
    slot: 'right',
    label: 'Posters',
    slugs: ['posters', 'poster'],
    titlePattern: /poster/i,
    className: 'aspect-[4/5] sm:aspect-[3/4] md:col-start-3 md:row-span-2 md:row-start-1 md:aspect-auto md:h-full md:min-h-0',
  },
]

export function resolveCategoryForMosaicSlot(
  slot: HomeCategoryMosaicSlot,
  all: Category[],
  usedSlugs: Set<string>,
): Category | null {
  const config = HOME_CATEGORY_MOSAIC_SLOTS.find(item => item.slot === slot)
  if (!config) {
    return null
  }

  const bySlug = all.find(
    category => !usedSlugs.has(category.slug) && config.slugs.includes(category.slug),
  )
  if (bySlug) {
    return bySlug
  }

  const byTitle = all.find(
    category => !usedSlugs.has(category.slug) && config.titlePattern.test(category.title),
  )
  if (byTitle) {
    return byTitle
  }

  return all.find(category => !usedSlugs.has(category.slug)) ?? null
}

export function buildMosaicGalleryItems(categories: Category[]) {
  const usedSlugs = new Set<string>()
  const items: Array<{
    slot: HomeCategoryMosaicSlot
    label: string
    category: Category
    className: string
  }> = []

  for (const config of HOME_CATEGORY_MOSAIC_SLOTS) {
    const category = resolveCategoryForMosaicSlot(config.slot, categories, usedSlugs)
    if (!category) {
      continue
    }

    usedSlugs.add(category.slug)
    items.push({
      slot: config.slot,
      label: config.label,
      category,
      className: config.className,
    })
  }

  return items
}
