import { CogIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const settings = defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'brandName',
      title: 'Brand Name (SEO)',
      type: 'internationalizedArrayString',
      description:
        'Legacy brand name for SEO purposes, shown in footer as sr-only (e.g., Guest House Osaka)',
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
      brandName: 'brandName.0.value'
    },
    prepare({ brandName }) {
      return {
        title: 'Site Settings',
        subtitle: brandName || 'Not configured'
      }
    }
  }
})
