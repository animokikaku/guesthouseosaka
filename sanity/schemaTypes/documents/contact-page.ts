import { CogIcon, EnvelopeIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  icon: EnvelopeIcon,
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
    prepare() {
      return {
        title: 'Contact Page'
      }
    }
  }
})
