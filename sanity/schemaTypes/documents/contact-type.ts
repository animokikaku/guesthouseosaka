import { ContactTypeSchema, ContactTypeValues } from '@/lib/types'
import { EnvelopeIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

// Helper to create a field config
const fieldConfig = (
  name: string,
  title: string,
  options?: { hiddenFor?: string[]; noPlaceholder?: boolean }
) =>
  defineField({
    name,
    title,
    type: options?.noPlaceholder
      ? 'formFieldConfigNoPlaceholder'
      : 'formFieldConfig',
    hidden: options?.hiddenFor
      ? ({ document }) => options.hiddenFor!.includes(document?.slug as string)
      : undefined
  })

export const contactType = defineType({
  name: 'contactType',
  title: 'Contact Type',
  type: 'document',
  icon: EnvelopeIcon,
  groups: [
    { name: 'main', title: 'Main', default: true },
    { name: 'fields', title: 'Form Fields' }
  ],
  fields: [
    defineField({
      name: 'slug',
      title: 'Type',
      type: 'string',
      group: 'main',
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
      group: 'main',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayString',
      description: 'Brief description for navigation and form headers',
      group: 'main',
      options: { aiAssist: { translateAction: true } }
    }),
    // Form field configurations
    defineField({
      name: 'fields',
      title: 'Form Field Labels',
      type: 'object',
      group: 'fields',
      description: 'Customize labels, placeholders, and descriptions',
      options: { collapsible: true, collapsed: false },
      fields: [
        // Tour & Move-in only
        fieldConfig('places', 'Places Selection', {
          hiddenFor: ['other'],
          noPlaceholder: true
        }),
        fieldConfig('date', 'Date', { hiddenFor: ['other'], noPlaceholder: true }),
        // Tour only
        fieldConfig('hour', 'Hour', {
          hiddenFor: ['move-in', 'other'],
          noPlaceholder: true
        }),
        // Move-in only
        fieldConfig('stayDuration', 'Length of Stay', {
          hiddenFor: ['tour', 'other']
        }),
        // Tour & Move-in only (via FieldGroupUserAccount)
        fieldConfig('gender', 'Gender', { hiddenFor: ['other'] }),
        fieldConfig('age', 'Age', { hiddenFor: ['other'] }),
        fieldConfig('nationality', 'Nationality', { hiddenFor: ['other'] }),
        fieldConfig('phone', 'Phone', { hiddenFor: ['other'] }),
        // All forms
        fieldConfig('name', 'Name'),
        fieldConfig('email', 'Email'),
        fieldConfig('message', 'Message')
      ]
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
