import { type SchemaTypeDefinition } from 'sanity'

// Document types
import { house } from './blocks/house'
import { amenity } from './documents/amenity'
import { amenityCategory } from './documents/amenity-category'
import { contactPage } from './documents/contact-page'
import { faqPage } from './documents/faq-page'
import { galleryCategory } from './documents/gallery-category'
import homePage from './documents/home-page'
import { settings } from './documents/settings'

// Object types
import {
  address,
  contactType,
  faqItem,
  galleryImage,
  houseAmenity,
  localizedImage,
  nearbyPlace,
  pricingNote,
  pricingRow,
  socialLink,
  stationInfo
} from './objects'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    homePage,
    house,
    settings,
    faqPage,
    contactPage,

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
    pricingNote,
    faqItem,
    stationInfo,
    nearbyPlace,
    address,
    contactType
  ]
}
