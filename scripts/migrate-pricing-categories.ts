import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
})

const PRICING_CATEGORIES = [
  {
    slug: 'deposit',
    titles: { en: 'Deposit', ja: '敷金', fr: 'Dépôt de garantie' }
  },
  {
    slug: 'common-fees',
    titles: { en: 'Common fees', ja: '共益費', fr: 'Charges communes' }
  },
  {
    slug: 'utility-fees',
    titles: { en: 'Utility fees', ja: '光熱費', fr: 'Charges' }
  },
  {
    slug: 'water-bill',
    titles: { en: 'Water bill', ja: '水道代', fr: "Facture d'eau" }
  },
  {
    slug: 'laundromat',
    titles: { en: 'Laundromat', ja: '洗濯機', fr: 'Laverie' }
  },
  {
    slug: 'drying-machine',
    titles: { en: 'Drying machine', ja: '乾燥機', fr: 'Sèche-linge' }
  },
  {
    slug: 'internet',
    titles: { en: 'Internet', ja: 'インターネット', fr: 'Internet' }
  }
]

async function main() {
  console.log('Creating pricing categories...\n')

  for (const category of PRICING_CATEGORIES) {
    const doc = {
      _type: 'pricingCategory',
      _id: `pricingCategory-${category.slug}`,
      title: [
        { _key: 'en', value: category.titles.en },
        { _key: 'ja', value: category.titles.ja },
        { _key: 'fr', value: category.titles.fr }
      ],
      slug: { _type: 'slug', current: category.slug }
    }

    const result = await client.createOrReplace(doc)
    console.log(`✓ Created: ${category.titles.en} (${category.slug})`)
  }

  console.log('\nDone! Created', PRICING_CATEGORIES.length, 'pricing categories.')
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
