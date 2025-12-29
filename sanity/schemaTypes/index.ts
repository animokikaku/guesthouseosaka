import { type SchemaTypeDefinition } from 'sanity'

// Document types
import { house } from './blocks/house'
import { amenity } from './documents/amenity'
import { amenityCategory } from './documents/amenity-category'
import { contactPage } from './documents/contact-page'
import { contactType } from './documents/contact-type'
import { faqPage } from './documents/faq-page'
import { galleryCategory } from './documents/gallery-category'
import homePage from './documents/home-page'
import { legalNotice } from './documents/legal-notice'
import { settings } from './documents/settings'

// Object types
import {
  address,
  extraCostItem,
  faqItem,
  formFieldConfig,
  formFieldConfigNoPlaceholder,
  galleryImage,
  houseAmenity,
  localizedImage,
  pageAction,
  pricingRow,
  socialLink
} from './objects'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    homePage,
    house,
    settings,
    faqPage,
    contactPage,
    contactType,
    legalNotice,

    // Taxonomy
    galleryCategory,
    amenityCategory,
    amenity,

    // Objects
    localizedImage,
    galleryImage,
    houseAmenity,
    socialLink,
    pricingRow,
    faqItem,
    address,
    pageAction,
    extraCostItem,
    formFieldConfig,
    formFieldConfigNoPlaceholder
  ]
}
