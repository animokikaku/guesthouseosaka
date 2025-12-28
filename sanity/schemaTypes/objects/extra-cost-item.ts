import { defineField, defineType } from 'sanity'
import { toPlainText } from '@portabletext/react'

const EXTRA_COST_CATEGORIES = [
  { title: 'Deposit', value: 'deposit' },
  { title: 'Common Fees', value: 'common-fees' },
  { title: 'Utility Fees', value: 'utility-fees' },
  { title: 'Water Bill', value: 'water-bill' },
  { title: 'Laundromat', value: 'laundromat' },
  { title: 'Drying Machine', value: 'drying-machine' },
  { title: 'Internet', value: 'internet' }
]

export const extraCostItem = defineType({
  name: 'extraCostItem',
  title: 'Extra Cost Item',
  type: 'object',
  fields: [
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: EXTRA_COST_CATEGORIES
      },
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
      category: 'category',
      value: 'value.0.value'
    },
    prepare({ category, value }) {
      const categoryLabel =
        EXTRA_COST_CATEGORIES.find((c) => c.value === category)?.title ??
        category
      return {
        title: categoryLabel,
        subtitle: value ? toPlainText(value) : 'No value'
      }
    }
  }
})
