import { defineField, defineType } from 'sanity'
import { toPlainText } from '@portabletext/react'

export const extraCostItem = defineType({
  name: 'extraCostItem',
  title: 'Extra Cost Item',
  type: 'object',
  fields: [
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'pricingCategory' }],
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'value',
      title: 'Value',
      type: 'internationalizedArrayPortableText',
      description: 'Cost details with rich text support',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    })
  ],
  preview: {
    select: {
      categoryTitle: 'category.title',
      value: 'value.0.value'
    },
    prepare({ categoryTitle, value }) {
      const title = categoryTitle?.[0]?.value ?? 'No category'
      return {
        title,
        subtitle: value ? toPlainText(value) : 'No value'
      }
    }
  }
})
