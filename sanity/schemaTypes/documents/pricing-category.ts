import { TagIcon } from '@sanity/icons'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { defineField, defineType } from 'sanity'

export const pricingCategory = defineType({
  name: 'pricingCategory',
  title: 'Pricing Category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      description: 'The display name of the category (e.g., "Deposit", "Common Fees")',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    orderRankField({ type: 'pricingCategory' })
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: {
      title: 'title'
    },
    prepare({ title }) {
      return {
        title: title?.[0]?.value ?? 'Untitled'
      }
    }
  }
})
