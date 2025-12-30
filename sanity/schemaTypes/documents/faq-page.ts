import { CogIcon, HelpCircleIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const faqPage = defineType({
  name: 'faqPage',
  title: 'FAQ Page',
  type: 'document',
  icon: HelpCircleIcon,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'settings', title: 'Settings', icon: CogIcon }
  ],
  fields: [
    defineField({
      name: 'header',
      title: 'Page Header',
      type: 'internationalizedArrayPortableText',
      description: 'Use H1 for the title and normal text for the description',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } },
      group: 'content'
    }),
    defineField({
      name: 'actions',
      title: 'Page Actions',
      type: 'array',
      description:
        'Action buttons shown in the page header. Drag to reorder, first item is primary.',
      of: [defineArrayMember({ type: 'pageAction' })],
      group: 'content'
    }),
    defineField({
      name: 'items',
      title: 'FAQ Items',
      type: 'array',
      description: 'Questions and answers. Drag to reorder.',
      of: [defineArrayMember({ type: 'faqItem' })],
      group: 'content'
    }),
    defineField({
      name: 'contactSection',
      title: 'Contact Section',
      type: 'internationalizedArrayPortableText',
      description:
        'Content for the contact card shown below FAQs. Use H2 for the title.',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } },
      group: 'content'
    }),
    defineField({
      name: 'contactNote',
      title: 'Contact Note',
      type: 'internationalizedArrayString',
      description:
        'Small note shown below the contact section (e.g., "We may not be able to answer calls at certain times.")',
      options: { aiAssist: { translateAction: true } },
      group: 'content'
    }),
    defineField({
      name: 'categoryOrder',
      title: 'Pricing Categories Order',
      type: 'array',
      description:
        'Order of extra cost categories in the pricing table. Drag to reorder.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'pricingCategory' }]
        })
      ],
      validation: (rule) =>
        rule.custom((refs: Array<{ _ref: string }> | undefined) => {
          if (!refs || refs.length === 0) return true
          const refIds = refs.map((ref) => ref._ref)
          const uniqueIds = new Set(refIds)
          if (uniqueIds.size !== refIds.length) {
            return 'Each category can only be added once'
          }
          return true
        }),
      group: 'content'
    }),
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'internationalizedArrayString',
      description: 'SEO title for browser tabs and search results',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } },
      group: 'settings'
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'internationalizedArrayString',
      description: 'SEO description for search results',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } },
      group: 'settings'
    })
  ],
  preview: {
    select: {
      items: 'items'
    },
    prepare({ items }) {
      return {
        title: 'FAQ Page',
        subtitle: `${items?.length || 0} questions`
      }
    }
  }
})
