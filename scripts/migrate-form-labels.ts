/**
 * Script to populate form field labels from translation files to Sanity
 * Run with: bun --env-file=.env.local run scripts/migrate-form-labels.ts
 */

import { createClient } from '@sanity/client'
import en from '../messages/en.json'
import fr from '../messages/fr.json'
import ja from '../messages/ja.json'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '515wijoz',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'development',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false
})

// Helper to create internationalized string value
function i18nString(enVal?: string, jaVal?: string, frVal?: string) {
  const values = []
  if (enVal)
    values.push({
      _type: 'internationalizedArrayStringValue',
      _key: 'en',
      value: enVal
    })
  if (jaVal)
    values.push({
      _type: 'internationalizedArrayStringValue',
      _key: 'ja',
      value: jaVal
    })
  if (frVal)
    values.push({
      _type: 'internationalizedArrayStringValue',
      _key: 'fr',
      value: frVal
    })
  return values.length > 0 ? values : undefined
}

// Helper to create a field config object
function fieldConfig(
  enLabel?: string,
  jaLabel?: string,
  frLabel?: string,
  enPlaceholder?: string,
  jaPlaceholder?: string,
  frPlaceholder?: string,
  enDescription?: string,
  jaDescription?: string,
  frDescription?: string
) {
  return {
    label: i18nString(enLabel, jaLabel, frLabel),
    placeholder: i18nString(enPlaceholder, jaPlaceholder, frPlaceholder),
    description: i18nString(enDescription, jaDescription, frDescription)
  }
}

// Field configs for Tour form
const tourFields = {
  places: fieldConfig(
    en.forms.fields.places.label,
    ja.forms.fields.places.label,
    fr.forms.fields.places.label,
    undefined,
    undefined,
    undefined,
    en.forms.fields.places.tour_description,
    ja.forms.fields.places.tour_description,
    fr.forms.fields.places.tour_description
  ),
  date: fieldConfig(
    en.forms.fields.date.tour_label,
    ja.forms.fields.date.tour_label,
    fr.forms.fields.date.tour_label,
    undefined,
    undefined,
    undefined,
    en.forms.fields.date.tour_description,
    ja.forms.fields.date.tour_description,
    fr.forms.fields.date.tour_description
  ),
  hour: fieldConfig(
    en.forms.fields.hour.tour_label,
    ja.forms.fields.hour.tour_label,
    fr.forms.fields.hour.tour_label,
    undefined,
    undefined,
    undefined,
    en.forms.fields.hour.tour_description,
    ja.forms.fields.hour.tour_description,
    fr.forms.fields.hour.tour_description
  ),
  gender: fieldConfig(
    en.forms.fields.gender.label,
    ja.forms.fields.gender.label,
    fr.forms.fields.gender.label,
    en.forms.fields.gender.placeholder,
    ja.forms.fields.gender.placeholder,
    fr.forms.fields.gender.placeholder,
    en.forms.fields.gender.description,
    ja.forms.fields.gender.description,
    fr.forms.fields.gender.description
  ),
  name: fieldConfig(
    en.forms.fields.name.label,
    ja.forms.fields.name.label,
    fr.forms.fields.name.label,
    en.forms.fields.name.placeholder,
    ja.forms.fields.name.placeholder,
    fr.forms.fields.name.placeholder,
    en.forms.fields.name.description,
    ja.forms.fields.name.description,
    fr.forms.fields.name.description
  ),
  age: fieldConfig(
    en.forms.fields.age.label,
    ja.forms.fields.age.label,
    fr.forms.fields.age.label,
    en.forms.fields.age.placeholder,
    ja.forms.fields.age.placeholder,
    fr.forms.fields.age.placeholder,
    en.forms.fields.age.description,
    ja.forms.fields.age.description,
    fr.forms.fields.age.description
  ),
  nationality: fieldConfig(
    en.forms.fields.nationality.label,
    ja.forms.fields.nationality.label,
    fr.forms.fields.nationality.label,
    en.forms.fields.nationality.placeholder,
    ja.forms.fields.nationality.placeholder,
    fr.forms.fields.nationality.placeholder,
    en.forms.fields.nationality.description,
    ja.forms.fields.nationality.description,
    fr.forms.fields.nationality.description
  ),
  email: fieldConfig(
    en.forms.fields.email.label,
    ja.forms.fields.email.label,
    fr.forms.fields.email.label,
    en.forms.fields.email.placeholder,
    ja.forms.fields.email.placeholder,
    fr.forms.fields.email.placeholder,
    en.forms.fields.email.description,
    ja.forms.fields.email.description,
    fr.forms.fields.email.description
  ),
  phone: fieldConfig(
    en.forms.fields.phone.label,
    ja.forms.fields.phone.label,
    fr.forms.fields.phone.label,
    en.forms.fields.phone.placeholder,
    ja.forms.fields.phone.placeholder,
    fr.forms.fields.phone.placeholder,
    en.forms.fields.phone.description,
    ja.forms.fields.phone.description,
    fr.forms.fields.phone.description
  ),
  message: fieldConfig(
    en.forms.fields.message.label,
    ja.forms.fields.message.label,
    fr.forms.fields.message.label,
    en.forms.fields.message.contact_placeholder,
    ja.forms.fields.message.contact_placeholder,
    fr.forms.fields.message.contact_placeholder,
    en.forms.fields.message.description,
    ja.forms.fields.message.description,
    fr.forms.fields.message.description
  )
}

// Field configs for Move-in form
const moveInFields = {
  places: fieldConfig(
    en.forms.fields.places.label,
    ja.forms.fields.places.label,
    fr.forms.fields.places.label,
    undefined,
    undefined,
    undefined,
    en.forms.fields.places.move_in_description,
    ja.forms.fields.places.move_in_description,
    fr.forms.fields.places.move_in_description
  ),
  date: fieldConfig(
    en.forms.fields.date.move_in_label,
    ja.forms.fields.date.move_in_label,
    fr.forms.fields.date.move_in_label,
    undefined,
    undefined,
    undefined,
    en.forms.fields.date.move_in_description,
    ja.forms.fields.date.move_in_description,
    fr.forms.fields.date.move_in_description
  ),
  stayDuration: fieldConfig(
    en.forms.fields.stay_duration.label,
    ja.forms.fields.stay_duration.label,
    fr.forms.fields.stay_duration.label,
    en.forms.fields.stay_duration.placeholder,
    ja.forms.fields.stay_duration.placeholder,
    fr.forms.fields.stay_duration.placeholder,
    en.forms.fields.stay_duration.description,
    ja.forms.fields.stay_duration.description,
    fr.forms.fields.stay_duration.description
  ),
  gender: tourFields.gender,
  name: tourFields.name,
  age: tourFields.age,
  nationality: tourFields.nationality,
  email: tourFields.email,
  phone: tourFields.phone,
  message: fieldConfig(
    en.forms.fields.message.label,
    ja.forms.fields.message.label,
    fr.forms.fields.message.label,
    en.forms.fields.message.move_in_placeholder,
    ja.forms.fields.message.move_in_placeholder,
    fr.forms.fields.message.move_in_placeholder,
    en.forms.fields.message.description,
    ja.forms.fields.message.description,
    fr.forms.fields.message.description
  )
}

// Field configs for General inquiry form (other)
const otherFields = {
  name: tourFields.name,
  email: tourFields.email,
  message: fieldConfig(
    en.forms.fields.message.label,
    ja.forms.fields.message.label,
    fr.forms.fields.message.label,
    en.forms.fields.message.contact_placeholder,
    ja.forms.fields.message.contact_placeholder,
    fr.forms.fields.message.contact_placeholder,
    en.forms.fields.message.description,
    ja.forms.fields.message.description,
    fr.forms.fields.message.description
  )
}

async function migrateFormLabels() {
  console.log('Starting form labels migration...\n')

  const patches = [
    { id: 'contactType-tour', fields: tourFields },
    { id: 'contactType-move-in', fields: moveInFields },
    { id: 'contactType-general', fields: otherFields }
  ]

  for (const { id, fields } of patches) {
    try {
      await client.patch(id).set({ fields }).commit()
      console.log(`  ✓ Updated: ${id}`)
    } catch (error) {
      console.error(`  ✗ Failed to update ${id}:`, error)
      throw error
    }
  }

  console.log('\n✅ Migration complete!')
  console.log('Remember to publish the drafts in Sanity Studio.')
}

migrateFormLabels().catch((error) => {
  console.error('\n❌ Migration failed:', error)
  process.exit(1)
})
