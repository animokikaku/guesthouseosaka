import { DocumentTextIcon } from '@sanity/icons'
import { toPlainText } from '@portabletext/react'
import { defineField, defineType } from 'sanity'

export const pricingRow = defineType({
  name: 'pricingRow',
  title: 'Pricing Row',
  type: 'object',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'internationalizedArrayString',
      description: 'Row label (e.g., "Rent", "Short Stay", "Utilities")',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'internationalizedArrayPortableText',
      description: 'Rich text content for this row',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    })
  ],
  preview: {
    select: {
      label: 'label.0.value',
      content: 'content.0.value'
    },
    prepare({ label, content }) {
      return {
        title: label || 'No label',
        subtitle: content ? toPlainText(content) : 'No content'
      }
    }
  }
})
