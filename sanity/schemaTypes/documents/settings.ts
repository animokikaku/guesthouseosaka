import { CogIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const settings = defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'site', title: 'Site', default: true },
    { name: 'organization', title: 'Organization' }
  ],
  fields: [
    // Site group
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'internationalizedArrayString',
      description: 'Website name for manifest/UI (e.g., Share House Osaka)',
      group: 'site',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site Description',
      type: 'internationalizedArrayString',
      description: 'Default meta description for SEO',
      group: 'site',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      description: 'Social media links shown in the footer. Drag to reorder.',
      group: 'site',
      of: [defineArrayMember({ type: 'socialLink' })]
    }),

    // Organization group (JSON-LD schema)
    defineField({
      name: 'companyName',
      title: 'Legal Name',
      type: 'string',
      description: 'Legal company name (legalName in JSON-LD)',
      group: 'organization',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      description: 'Contact email',
      group: 'organization',
      validation: (rule) => rule.required().email()
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
      description: 'Contact phone (international format)',
      group: 'organization',
      placeholder: '+81-6-6643-4646',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'address',
      description: 'Organization address',
      group: 'organization'
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
