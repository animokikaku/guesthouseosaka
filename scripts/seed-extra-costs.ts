/**
 * Script to seed extraCosts data for all houses
 * Run with: bunx tsx scripts/seed-extra-costs.ts
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '515wijoz',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'development',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false
})

// Helper to create a portable text block
function block(text: string) {
  return [
    {
      _type: 'block',
      _key: crypto.randomUUID().slice(0, 12),
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: crypto.randomUUID().slice(0, 12), text, marks: [] }]
    }
  ]
}

// Helper to create internationalized portable text value
function i18nPortableText(en: string, ja: string, fr: string) {
  return [
    { _type: 'internationalizedArrayPortableTextValue', _key: 'en', value: block(en) },
    { _type: 'internationalizedArrayPortableTextValue', _key: 'ja', value: block(ja) },
    { _type: 'internationalizedArrayPortableTextValue', _key: 'fr', value: block(fr) }
  ]
}

// Extra costs data per house
const extraCostsData: Record<string, Array<{ category: string; en: string; ja: string; fr: string }>> = {
  orange: [
    { category: 'deposit', en: '¥30,000', ja: '¥30,000', fr: '¥30,000' },
    { category: 'common-fees', en: '¥12,000/month', ja: '¥12,000/月', fr: '¥12,000/mois' },
    { category: 'utility-fees', en: 'Summer/Winter: ¥3,000-¥6,000\nSpring/Autumn: ¥2,000-¥3,000', ja: '夏/冬: ¥3,000-¥6,000\n春/秋: ¥2,000-¥3,000', fr: 'Été/Hiver: ¥3,000-¥6,000\nPrintemps/Automne: ¥2,000-¥3,000' },
    { category: 'water-bill', en: 'Free', ja: '無料', fr: 'Gratuit' },
    { category: 'laundromat', en: 'Free', ja: '無料', fr: 'Gratuit' },
    { category: 'drying-machine', en: '¥100/30min', ja: '¥100/30分', fr: '¥100/30min' },
    { category: 'internet', en: 'Free Wi-Fi/LAN', ja: '無料Wi-Fi/LAN', fr: 'Wi-Fi/LAN gratuit' }
  ],
  lemon: [
    { category: 'deposit', en: '¥30,000', ja: '¥30,000', fr: '¥30,000' },
    { category: 'common-fees', en: '¥10,000/month', ja: '¥10,000/月', fr: '¥10,000/mois' },
    { category: 'utility-fees', en: 'Summer/Winter: ¥3,000-¥7,000\nSpring/Autumn: ¥2,000-¥4,000', ja: '夏/冬: ¥3,000-¥7,000\n春/秋: ¥2,000-¥4,000', fr: 'Été/Hiver: ¥3,000-¥7,000\nPrintemps/Automne: ¥2,000-¥4,000' },
    { category: 'water-bill', en: 'Free', ja: '無料', fr: 'Gratuit' },
    { category: 'laundromat', en: 'Free', ja: '無料', fr: 'Gratuit' },
    { category: 'drying-machine', en: '¥100/20min', ja: '¥100/20分', fr: '¥100/20min' },
    { category: 'internet', en: 'Free Wi-Fi', ja: '無料Wi-Fi', fr: 'Wi-Fi gratuit' }
  ],
  apple: [
    { category: 'deposit', en: '¥30,000', ja: '¥30,000', fr: '¥30,000' },
    { category: 'common-fees', en: '¥10,000/month', ja: '¥10,000/月', fr: '¥10,000/mois' },
    { category: 'utility-fees', en: 'Summer/Winter: ¥3,000-¥7,000\nSpring/Autumn: ¥2,000-¥4,000', ja: '夏/冬: ¥3,000-¥7,000\n春/秋: ¥2,000-¥4,000', fr: 'Été/Hiver: ¥3,000-¥7,000\nPrintemps/Automne: ¥2,000-¥4,000' },
    { category: 'water-bill', en: 'Free', ja: '無料', fr: 'Gratuit' },
    { category: 'laundromat', en: 'Each room has a private washing machine', ja: '各部屋に専用洗濯機付き', fr: 'Chaque chambre dispose d\'un lave-linge privé' },
    { category: 'drying-machine', en: '–', ja: '–', fr: '–' },
    { category: 'internet', en: 'Free Wi-Fi', ja: '無料Wi-Fi', fr: 'Wi-Fi gratuit' }
  ]
}

async function seedExtraCosts() {
  console.log('Fetching houses...')

  const houses = await client.fetch<Array<{ _id: string; slug: string }>>(
    `*[_type == "house"]{ _id, slug }`
  )

  console.log(`Found ${houses.length} houses`)

  for (const house of houses) {
    const data = extraCostsData[house.slug]
    if (!data) {
      console.log(`No data for house: ${house.slug}`)
      continue
    }

    const extraCosts = data.map((item) => ({
      _type: 'extraCostItem',
      _key: `ec-${item.category}`,
      category: item.category,
      value: i18nPortableText(item.en, item.ja, item.fr)
    }))

    console.log(`Patching ${house.slug}...`)

    await client
      .patch(house._id)
      .set({ extraCosts })
      .commit()

    console.log(`✓ Updated ${house.slug}`)
  }

  console.log('\nDone! Remember to publish the drafts in Sanity Studio.')
}

seedExtraCosts().catch(console.error)
