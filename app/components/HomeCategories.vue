<template>
  <section class="bg-luxury-ivory py-10 sm:py-12 md:py-16">
    <PageState
      :pending="pending"
      :error-message="errorMessage"
      :empty="!categories?.length"
      empty-title="Categories coming soon"
      empty-message="Our catalog is being prepared. Please check back shortly."
      wrapper-class="page-container"
    >
      <div class="page-container grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 md:grid-rows-2 md:gap-3 md:min-h-[560px] lg:min-h-[680px] xl:min-h-[720px]">
        <HomeCategoryMosaicCard
          v-for="item in mosaicItems"
          :key="item.slot"
          :category="item.category"
          :label="item.label"
          :class="item.className"
        />
      </div>
    </PageState>
  </section>
</template>

<script setup lang="ts">
import type { Category } from '~/data/catalog'

type MosaicSlot = 'left-top' | 'left-bottom' | 'middle' | 'right'

type MosaicItem = {
  slot: MosaicSlot
  category: Category
  label: string
  className: string
}

const SLOT_CONFIG: Array<{
  slot: MosaicSlot
  label: string
  slugs: string[]
  titlePattern: RegExp
  className: string
}> = [
  {
    slot: 'left-top',
    label: 'Fabrics',
    slugs: ['fabrics', 'fabric'],
    titlePattern: /fabric/i,
    className: 'aspect-[5/3] sm:aspect-[4/3] md:col-start-1 md:row-start-1 md:aspect-auto md:h-full md:min-h-0',
  },
  {
    slot: 'left-bottom',
    label: 'Wall Coverings',
    slugs: ['wall-coverings', 'wallcoverings', 'wall-covering'],
    titlePattern: /wall\s*cover|accessor/i,
    className: 'aspect-[5/3] sm:aspect-[4/3] md:col-start-1 md:row-start-2 md:aspect-auto md:h-full md:min-h-0',
  },
  {
    slot: 'middle',
    label: 'Wallpaper',
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

const { data: categories, pending, error } = await useCatalog()

const errorMessage = computed(() => error.value?.message ?? null)

function resolveCategoryForSlot(
  slot: MosaicSlot,
  all: Category[],
  usedSlugs: Set<string>,
): Category | null {
  const config = SLOT_CONFIG.find(item => item.slot === slot)
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

const mosaicItems = computed<MosaicItem[]>(() => {
  const all = categories.value ?? []
  const usedSlugs = new Set<string>()
  const items: MosaicItem[] = []

  for (const config of SLOT_CONFIG) {
    const category = resolveCategoryForSlot(config.slot, all, usedSlugs)
    if (!category) {
      continue
    }

    usedSlugs.add(category.slug)
    items.push({
      slot: config.slot,
      category,
      label: config.label,
      className: config.className,
    })
  }

  return items
})
</script>
