import { ImageIcon } from '@sanity/icons/Image'
import { defineField, defineType } from 'sanity'

export const localizedImage = defineType({
  name: 'localizedImage',
  title: 'Image',
  type: 'image',
  icon: ImageIcon,
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'internationalizedArrayString',
      description: 'Describe this image for screen readers and SEO',
      validation: (rule) => rule.required()
    })
  ],
  preview: {
    select: {
      media: 'asset',
      alt: 'alt.0.value'
    },
    prepare({ media, alt }) {
      return {
        title: alt || 'No alt text',
        media
      }
    }
  }
})
