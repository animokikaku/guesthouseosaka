import { CogIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const settings = defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'internationalizedArrayString',
      description: 'The name of your website',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'companyName',
      title: 'Company Name',
      type: 'internationalizedArrayString',
      description: 'Legal company name shown in the footer',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      description: 'Social media links shown in the footer. Drag to reorder.',
      of: [defineArrayMember({ type: 'socialLink' })]
    })
  ],
  preview: {
    select: {
      siteName: 'siteName.0.value'
    },
    prepare({ siteName }) {
      return {
        title: 'Site Settings',
        subtitle: siteName || 'Not configured'
      }
    }
  }
})
