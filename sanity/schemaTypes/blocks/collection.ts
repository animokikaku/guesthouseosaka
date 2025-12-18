import { GalleryHorizontal } from 'lucide-react'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'collection',
  type: 'document',
  icon: GalleryHorizontal,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required()
    }),
    defineField({
      name: 'houses',
      title: 'Houses',
      type: 'array',
      description: 'Drag to reorder the 3 cards on the homepage.',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'house' }] })],
      validation: (r) => r.required().length(3).unique()
    })
  ],
  preview: {
    select: {
      title: 'title',
      houses: 'houses'
    },
    prepare({ title, houses }) {
      const count = Array.isArray(houses) ? houses.length : 0
      return { title, subtitle: `${count}/3 images` }
    }
  }
})
