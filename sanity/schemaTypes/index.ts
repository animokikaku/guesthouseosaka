import { pages } from '@/sanity/schemaTypes/documents'
import { type SchemaTypeDefinition } from 'sanity'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [...pages]
}
