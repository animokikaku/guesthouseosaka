import { LocaleField } from '@/sanity/schemaTypes/fields/locale-field'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'housePage',
  title: 'House Page',
  type: 'document',
  fields: [
    LocaleField,
    defineField({
      name: 'house',
      title: 'House',
      type: 'reference',
      to: [{ type: 'house' }],
      validation: (r) => r.required()
    }),
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required()
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'locale'
    }
  }
})
