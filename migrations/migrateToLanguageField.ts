import { migrateToLanguageField } from 'sanity-plugin-internationalized-array/migrations'

// Add the document types that contain internationalized arrays.
// Example: ['internationalizedPost', 'translation.metadata']
const DOCUMENT_TYPES: string[] = [
  'homePage',
  'house',
  'settings',
  'faqPage',
  'contactPage',
  'contactType',
  'legalNotice',
  'galleryCategory',
  'amenityCategory',
  'amenity',
  'pricingCategory',
  'faqQuestion'
]

export default migrateToLanguageField(DOCUMENT_TYPES)
