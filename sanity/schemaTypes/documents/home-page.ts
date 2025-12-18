import { LocaleField } from '@/sanity/schemaTypes/fields/locale-field'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homePage',
  type: 'document',
  fields: [
    LocaleField,
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'heroTitle',
      type: 'string',
      fieldset: 'hero',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'heroDescription',
      type: 'text',
      rows: 3,
      fieldset: 'hero',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'heroCtaLabel',
      type: 'string',
      fieldset: 'hero',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'galleryWall',
      type: 'reference',
      to: [{ type: 'galleryWall' }],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'housesTitle',
      type: 'string',
      fieldset: 'houses',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'housesDescription',
      type: 'text',
      rows: 3,
      fieldset: 'houses',
      validation: (rule) => rule.required()
    })
  ],
  fieldsets: [
    { name: 'hero', title: 'Hero Section' },
    { name: 'houses', title: 'Houses Section' }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'locale'
    }
  }
})
