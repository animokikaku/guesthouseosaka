import type { HousesBuildingQueryResult, PricingCategoriesQueryResult } from '@/sanity.types'

export type PricingCategories = NonNullable<PricingCategoriesQueryResult>
export type Houses = NonNullable<HousesBuildingQueryResult>
export type ExtraCost = NonNullable<Houses[number]['extraCosts']>[number]

export const createCategory = (id: string, title: string): PricingCategories[number] => ({
  _id: id,
  title,
  orderRank: `0|${id}:`
})

export const createHouse = (
  id: string,
  slug: 'orange' | 'apple' | 'lemon',
  extraCosts: ExtraCost[] | null = []
): Houses[number] => ({
  _id: id,
  _type: 'house',
  title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} House`,
  slug,
  building: null,
  phone: { _type: 'housePhone', domestic: '06-1234-5678', international: '+81-6-1234-5678' },
  image: {
    asset: null,
    hotspot: null,
    crop: null,
    alt: null,
    preview: null
  },
  extraCosts
})

export const createExtraCost = (categoryId: string, text: string): ExtraCost => ({
  categoryId,
  value: [
    {
      _type: 'block',
      _key: 'block1',
      children: [{ _type: 'span', _key: 'span1', text, marks: [] }],
      markDefs: [],
      style: 'normal'
    }
  ]
})

export const createExtraCostWithList = (
  categoryId: string,
  items: string[],
  listItem: 'bullet' | 'number'
): ExtraCost => ({
  categoryId,
  value: items.map((text, i) => ({
    _type: 'block' as const,
    _key: `list-block-${i}`,
    children: [{ _type: 'span' as const, _key: `span${i}`, text, marks: [] as string[] }],
    markDefs: [] as never[],
    style: 'normal' as const,
    listItem,
    level: 1
  }))
})
