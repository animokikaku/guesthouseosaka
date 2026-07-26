import { FAQExtraCostsCards } from '@/app/[locale]/faq/(components)/faq-extra-costs-cards'
import type { HousesBuildingQueryResult, PricingCategoriesQueryResult } from '@/sanity.types'

type Houses = NonNullable<HousesBuildingQueryResult>
type PricingCategories = NonNullable<PricingCategoriesQueryResult>

function portableText(text: string) {
  return [
    {
      _type: 'block' as const,
      _key: `block-${text}`,
      children: [{ _type: 'span' as const, _key: `span-${text}`, text, marks: [] }],
      markDefs: [],
      style: 'normal' as const
    }
  ]
}

const pricingCategories = [
  { _id: 'deposit', title: 'Deposit', orderRank: 'a' },
  { _id: 'internet', title: 'Internet', orderRank: 'b' }
] satisfies PricingCategories

const houses = (
  [
    ['orange', 'Orange House', '¥30,000'],
    ['apple', 'Apple House', '¥40,000'],
    ['lemon', 'Lemon House', '¥50,000']
  ] as const
).map(([slug, title, deposit]) => ({
  _id: `house-${slug}`,
  _type: 'house' as const,
  slug,
  title,
  building: null,
  phone: {
    _type: 'housePhone' as const,
    domestic: '06-1234-5678',
    international: '+81-6-1234-5678'
  },
  image: {
    asset: null,
    hotspot: null,
    crop: null,
    alt: null,
    preview: null
  },
  extraCosts: [
    { categoryId: 'deposit', value: portableText(deposit) },
    { categoryId: 'internet', value: portableText('Included') }
  ]
})) satisfies Houses

export function ThreeHouses() {
  return (
    <main className="mx-auto max-w-lg p-6">
      <FAQExtraCostsCards houses={houses} pricingCategories={pricingCategories} />
    </main>
  )
}
