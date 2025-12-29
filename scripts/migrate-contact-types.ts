/**
 * Script to migrate contactTypes from embedded objects to separate documents
 * Run with: bun --env-file=.env.local run scripts/migrate-contact-types.ts
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '515wijoz',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'development',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false
})

// Helper to create internationalized string value
function i18nString(en: string, ja: string, fr: string) {
  return [
    { _type: 'internationalizedArrayStringValue', _key: 'en', value: en },
    { _type: 'internationalizedArrayStringValue', _key: 'ja', value: ja },
    { _type: 'internationalizedArrayStringValue', _key: 'fr', value: fr }
  ]
}

// Contact types data
const contactTypesData = [
  {
    _id: 'contactType-tour',
    slug: 'tour',
    title: i18nString('Tour request', '見学のご依頼', 'Demande de visite'),
    description: i18nString(
      'Schedule a visit to see our share houses and get a feel for what we offer.',
      'シェアハウスを見学して、私たちが提供する暮らしを体感してください。',
      'Réservez une visite pour découvrir nos share houses et ce que nous offrons.'
    )
  },
  {
    _id: 'contactType-move-in',
    slug: 'move-in',
    title: i18nString(
      'Move in request',
      '入居リクエスト',
      "Demande d'emménagement"
    ),
    description: i18nString(
      'Ready to move in? Share your preferences and timeline.',
      '入居の準備はできましたか？ご希望やスケジュールを教えてください。',
      'Prêt à emménager ? Partagez vos préférences et votre calendrier.'
    )
  },
  {
    _id: 'contactType-other',
    slug: 'other',
    title: i18nString(
      'General inquiry',
      '一般的なお問い合わせ',
      'Demande générale'
    ),
    description: i18nString(
      "Questions about rooms, pricing, or availability? We're happy to help.",
      'サービスや料金などについてご質問がありますか？私たちがお手伝いします。',
      'Des questions sur les chambres, les tarifs ou les disponibilités ? Nous sommes ravis de vous aider.'
    )
  }
]

async function migrateContactTypes() {
  console.log('Starting contact types migration...\n')

  // Step 1: Create contactType documents
  console.log('Step 1: Creating contactType documents...')

  for (const contactType of contactTypesData) {
    const doc = {
      _id: contactType._id,
      _type: 'contactType',
      slug: contactType.slug,
      title: contactType.title,
      description: contactType.description
    }

    try {
      await client.createOrReplace(doc)
      console.log(`  ✓ Created/updated: ${contactType.slug}`)
    } catch (error) {
      console.error(`  ✗ Failed to create ${contactType.slug}:`, error)
      throw error
    }
  }

  // Step 2: Update contactPage to reference the new documents
  console.log('\nStep 2: Updating contactPage references...')

  const contactTypeRefs = contactTypesData.map((ct) => ({
    _type: 'reference',
    _ref: ct._id,
    _key: ct.slug
  }))

  try {
    await client.patch('contactPage').set({ contactTypes: contactTypeRefs }).commit()
    console.log('  ✓ Updated contactPage with references')
  } catch (error) {
    console.error('  ✗ Failed to update contactPage:', error)
    throw error
  }

  console.log('\n✅ Migration complete!')
  console.log('Remember to publish the drafts in Sanity Studio.')
}

migrateContactTypes().catch((error) => {
  console.error('\n❌ Migration failed:', error)
  process.exit(1)
})
