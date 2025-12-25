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
      description: 'Website name for manifest/UI (e.g., Share House Osaka)',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site Description',
      type: 'internationalizedArrayString',
      description: 'Default meta description for SEO',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'brandName',
      title: 'Brand Name (SEO)',
      type: 'internationalizedArrayString',
      description:
        'Brand name for SEO/JSON-LD purposes (e.g., Guest House Osaka)',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
      description: 'Legal company name for JSON-LD (e.g., 株式会社アニモ企画)',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
      description: 'Main contact email for Organization schema',
      validation: (rule) => rule.email()
    }),
    defineField({
      name: 'phone',
      title: 'Organization Phone',
      type: 'string',
      description: 'Main contact phone for Organization schema (international format)',
      placeholder: '+81-6-6643-4646'
    }),
    defineField({
      name: 'address',
      title: 'Organization Address',
      type: 'address',
      description: 'Main address for Organization schema'
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
