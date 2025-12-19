import collection from './blocks/collection'
import contactPage from './documents/contact-page'
import faqPage from './documents/faq-page'
import homePage from './documents/home-page'
import housePage from './documents/house-page'

import { type SchemaTypeDefinition } from 'sanity'
import { galleryWall } from './blocks/gallery-wall'
import { house } from './blocks/house'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    contactPage,
    faqPage,
    homePage,
    housePage,
    galleryWall,
    collection,
    house
  ]
}
