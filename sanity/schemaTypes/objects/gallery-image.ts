import { ImageIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const galleryImage = defineType({
  name: 'galleryImage',
  title: 'Gallery Image',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'localizedImage',
      validation: (rule) => rule.required().assetRequired()
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'galleryCategory' }],
      validation: (rule) => rule.required()
    })
  ],
  preview: {
    select: {
      media: 'image.asset',
      alt: 'image.alt.0.value',
      categoryLabel: 'category.label.0.value'
    },
    prepare({ media, alt, categoryLabel }) {
      return {
        title: alt || 'No alt text',
        subtitle: categoryLabel || 'No category',
        media
      }
    }
  }
})
