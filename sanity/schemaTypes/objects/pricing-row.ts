import { DocumentTextIcon } from '@sanity/icons'
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
      description: 'Row label (e.g., "Rent", "Short Stay")',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'values',
      title: 'Values',
      type: 'internationalizedArrayText',
      description: 'Price details (multi-line supported)',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    })
  ],
  preview: {
    select: {
      label: 'label.0.value',
      values: 'values.0.value'
    },
    prepare({ label, values }) {
      return {
        title: label || 'No label',
        subtitle: values ? values.substring(0, 50) + '...' : 'No values'
      }
    }
  }
})
