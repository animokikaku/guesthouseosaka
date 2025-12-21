import { EnvelopeIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const contactType = defineType({
  name: 'contactType',
  title: 'Contact Type',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'key',
      title: 'Key',
      type: 'string',
      description: 'Internal identifier (e.g., "tour", "move-in", "general")',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayText',
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'href',
      title: 'Link',
      type: 'string',
      description: 'URL path for this contact type (e.g., "/contact/tour")'
    })
  ],
  preview: {
    select: {
      title: 'title.0.value',
      key: 'key'
    },
    prepare({ title, key }) {
      return {
        title: title || 'No title',
        subtitle: key || 'No key'
      }
    }
  }
})
