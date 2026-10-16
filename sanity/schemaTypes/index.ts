import { type SchemaTypeDefinition } from 'sanity'

// Document types
import { amenity } from './documents/amenity'
import { amenityCategory } from './documents/amenity-category'
import { contactPage } from './documents/contact-page'
import { contactType } from './documents/contact-type'
import { faqPage } from './documents/faq-page'
import { faqQuestion } from './documents/faq-question'
import { galleryCategory } from './documents/gallery-category'
import { homePage } from './documents/home-page'
import { house } from './documents/house'
import { legalNotice } from './documents/legal-notice'
import { pricingCategory } from './documents/pricing-category'
import { settings } from './documents/settings'
// Object types
import { address } from './objects/address'
import { extraCostItem } from './objects/extra-cost-item'
import { formFieldConfig, formFieldConfigNoPlaceholder } from './objects/form-field-config'
import { houseAmenity } from './objects/house-amenity'
import { houseAmenityCategory } from './objects/house-amenity-category'
import { houseBuilding } from './objects/house-building'
import { houseGalleryCategory } from './objects/house-gallery-category'
import { houseGalleryItem } from './objects/house-gallery-item'
import { houseLocation } from './objects/house-location'
import { houseMap } from './objects/house-map'
import { housePhone } from './objects/house-phone'
import { houseRoom } from './objects/house-room'
import { localizedImage } from './objects/localized-image'
import { pageAction } from './objects/page-action'
import { pricingRow } from './objects/pricing-row'
import { socialLink } from './objects/social-link'

export const documentTypes = [
  homePage,
  house,
  settings,
  faqPage,
  contactPage,
  contactType,
  legalNotice,
  galleryCategory,
  amenityCategory,
  amenity,
  pricingCategory,
  faqQuestion
] as const

const objectTypes = [
  localizedImage,
  houseAmenity,
  houseAmenityCategory,
  houseBuilding,
  houseGalleryCategory,
  houseGalleryItem,
  houseLocation,
  houseMap,
  housePhone,
  houseRoom,
  socialLink,
  pricingRow,
  address,
  pageAction,
  extraCostItem,
  formFieldConfig,
  formFieldConfigNoPlaceholder
] as const

export type DocumentTypeName = (typeof documentTypes)[number]['name']

/** One document each, opened directly from the desk structure. */
export const singletonTypes: DocumentTypeName[] = [
  'settings',
  'homePage',
  'faqPage',
  'contactPage',
  'legalNotice'
]

/** Documents the site routes on: no creating, duplicating or unpublishing. */
export const fixedSetTypes: DocumentTypeName[] = [...singletonTypes, 'house', 'contactType']

/** Fixed documents and the taxonomies houses reference: no deleting. */
export const protectedTypes: DocumentTypeName[] = [
  ...fixedSetTypes,
  'galleryCategory',
  'amenityCategory',
  'pricingCategory'
]

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [...documentTypes, ...objectTypes]
}
