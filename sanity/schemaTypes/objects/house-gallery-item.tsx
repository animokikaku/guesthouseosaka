import { ImageIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const houseGalleryItem = defineType({
  name: 'houseGalleryItem',
  title: 'Gallery Item',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'localizedImage',
      validation: (rule) => rule.required().assetRequired()
    })
  ],
  preview: {
    select: {
      media: 'image.asset',
      alt: 'image.alt.0.value'
    },
    prepare({ media, alt }) {
      return {
        title: alt || 'No alt text',
        media
      }
    }
  }
})
