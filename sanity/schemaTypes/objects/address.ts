import { HomeIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const address = defineType({
  name: 'address',
  title: 'Address',
  type: 'object',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'streetAddress',
      title: 'Street Address',
      type: 'string',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'locality',
      title: 'City/Ward',
      type: 'string',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'postalCode',
      title: 'Postal Code',
      type: 'string',
      validation: (rule) => rule.required()
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      initialValue: 'JP',
      validation: (rule) => rule.required()
    })
  ],
  preview: {
    select: {
      streetAddress: 'streetAddress',
      locality: 'locality',
      postalCode: 'postalCode'
    },
    prepare({ streetAddress, locality, postalCode }) {
      return {
        title: streetAddress || 'No address',
        subtitle: [postalCode, locality].filter(Boolean).join(', ')
      }
    }
  }
})
