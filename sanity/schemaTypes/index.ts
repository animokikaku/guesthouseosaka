import { type SchemaTypeDefinition } from 'sanity'

// Document types
import { amenity } from './documents/amenity'
import { amenityCategory } from './documents/amenity-category'
import { contactPage } from './documents/contact-page'
import { contactType } from './documents/contact-type'
import { faqPage } from './documents/faq-page'
import { faqQuestion } from './documents/faq-question'
import { galleryCategory } from './documents/gallery-category'
import homePage from './documents/home-page'
import { house } from './documents/house'
import { legalNotice } from './documents/legal-notice'
import { pricingCategory } from './documents/pricing-category'
import { settings } from './documents/settings'

// Object types
import {
  address,
  extraCostItem,
  formFieldConfig,
  formFieldConfigNoPlaceholder,
  houseAmenity,
  houseAmenityCategory,
  houseBuilding,
  houseGalleryCategory,
  houseGalleryItem,
  houseLocation,
  houseMap,
  housePhone,
  localizedImage,
  pageAction,
  pricingRow,
  socialLink
} from './objects'

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
  socialLink,
  pricingRow,
  address,
  pageAction,
  extraCostItem,
  formFieldConfig,
  formFieldConfigNoPlaceholder
] as const

export type DocumentTypeName = (typeof documentTypes)[number]['name']

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [...documentTypes, ...objectTypes]
}
