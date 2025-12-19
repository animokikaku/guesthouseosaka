import homePage from './documents/home-page'

import { type SchemaTypeDefinition } from 'sanity'
import { house } from './blocks/house'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [homePage, house]
}
