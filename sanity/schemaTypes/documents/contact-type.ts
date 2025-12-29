import { ContactTypeSchema, ContactTypeValues } from '@/lib/types'
import { EnvelopeIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const contactType = defineType({
  name: 'contactType',
  title: 'Contact Type',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'slug',
      title: 'Type',
      type: 'string',
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!ContactTypeSchema.safeParse(value).success) {
            return `Must be one of: ${ContactTypeValues.join(', ')}`
          }
          return true
        }),
      options: {
        list: [...ContactTypeValues],
        layout: 'dropdown'
      }
    }),
    defineField({
      name: 'title',
      title: 'Navigation Title',
      type: 'internationalizedArrayString',
      description: 'Short title for navigation tabs (e.g., "Tour request")',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayString',
      description: 'Brief description for navigation and form headers',
      options: { aiAssist: { translateAction: true } }
    })
  ],
  preview: {
    select: {
      title: 'title.0.value',
      slug: 'slug'
    },
    prepare({ title, slug }) {
      const slugLabels: Record<string, string> = {
        tour: 'Tour Request',
        'move-in': 'Move-in Inquiry',
        other: 'General Inquiry'
      }
      return {
        title: title || slugLabels[slug] || 'No title',
        subtitle: slug || 'No slug'
      }
    }
  }
})
