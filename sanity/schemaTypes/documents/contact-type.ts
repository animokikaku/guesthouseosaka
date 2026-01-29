import { ContactTypeSchema, ContactTypeValues } from '@/lib/types'
import { EnvelopeIcon } from '@sanity/icons'
import { defineField, defineType, type StringFieldProps } from 'sanity'

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
  description: 'Contact form types displayed on contact page. Drag to reorder.',
  orderings: [
    {
      title: 'Global Order',
      name: 'orderRankAsc',
      by: [{ field: 'orderRank', direction: 'asc' }]
    }
  ],
  groups: [
    { name: 'main', title: 'Main', default: true },
    { name: 'fields', title: 'Form Fields' }
  ],
  fields: [
    // Hidden field for @sanity/orderable-document-list
    defineField({
      name: 'orderRank',
      type: 'string',
      hidden: true,
      components: {
        field: (props: StringFieldProps) => props.renderDefault(props)
      }
    }),
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
      validation: (rule) => rule.required(),
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
        // All forms
        fieldConfig('places', 'Places Selection', { noPlaceholder: true }),
        // Tour & Move-in only
        fieldConfig('date', 'Date', {
          hiddenFor: ['other'],
          noPlaceholder: true
        }),
        // Tour only
        fieldConfig('hour', 'Hour', {
          hiddenFor: ['move-in', 'other'],
          noPlaceholder: true
        }),
        // Move-in only
        fieldConfig('stayDuration', 'Length of Stay', {
          hiddenFor: ['tour', 'other']
        }),
        // All forms (via FieldGroupUserAccount)
        fieldConfig('gender', 'Gender'),
        fieldConfig('age', 'Age'),
        fieldConfig('nationality', 'Nationality'),
        fieldConfig('phone', 'Phone'),
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
        title: title || slugLabels[slug]
      }
    }
  }
})
