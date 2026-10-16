import { FAQExtraCostsCards } from '@/app/[locale]/faq/(components)/faq-extra-costs-cards'
import messages from '@/messages/en.json'
import type { FaqHouses, PricingCategories } from '@/app/[locale]/faq/(components)/types'
import { NextIntlClientProvider } from 'next-intl'

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

function bulletList(items: string[]) {
  return items.map((text) => ({
    ...portableText(text)[0],
    listItem: 'bullet' as const,
    level: 1
  }))
}

const pricingCategories = [
  { _id: 'deposit', title: 'Deposit' },
  { _id: 'internet', title: 'Internet' }
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
    {
      categoryId: 'internet',
      value:
        slug === 'orange'
          ? bulletList(['Wi-Fi included', 'Wired in every room'])
          : portableText('Included')
    }
  ]
})) satisfies FaqHouses

export function ThreeHouses() {
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <main className="mx-auto max-w-lg p-6">
        <FAQExtraCostsCards houses={houses} pricingCategories={pricingCategories} />
      </main>
    </NextIntlClientProvider>
  )
}
