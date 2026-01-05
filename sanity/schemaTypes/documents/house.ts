import { HouseIdentifierSchema, HouseIdentifierValues } from '@/lib/types'
import { HomeIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

export const house = defineType({
  name: 'house',
  title: 'House',
  icon: HomeIcon,
  type: 'document',
  orderings: [
    {
      title: 'Global Order',
      name: 'orderRankAsc',
      by: [{ field: 'orderRank', direction: 'asc' }]
    }
  ],
  groups: [
    { name: 'identity', title: 'Identity', default: true },
    { name: 'building', title: 'Building' },
    { name: 'about', title: 'About' },
    { name: 'gallery', title: 'Gallery' },
    { name: 'amenities', title: 'Amenities' },
    { name: 'location', title: 'Location' },
    { name: 'map', title: 'Map' },
    { name: 'pricing', title: 'Pricing' },
    { name: 'contact', title: 'Contact' }
  ],
  fields: [
    // Hidden field for @sanity/orderable-document-list
    defineField({
      name: 'orderRank',
      type: 'string',
      hidden: true
    }),

    // ============================================
    // IDENTITY GROUP
    // ============================================
    defineField({
      name: 'slug',
      title: 'House ID',
      type: 'string',
      group: 'identity',
      description: 'Unique identifier for this house',
      options: {
        list: [...HouseIdentifierValues],
        layout: 'dropdown'
      },
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!HouseIdentifierSchema.safeParse(value).success) {
            return `Must be one of: ${HouseIdentifierValues.join(', ')}`
          }
          return true
        })
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      group: 'identity',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'internationalizedArrayText',
      group: 'identity',
      description: 'Main description shown on the house page',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'caption',
      title: 'Navigation Caption',
      type: 'internationalizedArrayText',
      group: 'identity',
      description: 'Short description shown in navigation dropdown',
      options: { aiAssist: { translateAction: true } }
    }),
    defineField({
      name: 'image',
      title: 'Hero Image',
      type: 'localizedImage',
      group: 'identity',
      validation: (rule) => rule.required().assetRequired()
    }),

    // ============================================
    // BUILDING GROUP
    // ============================================
    defineField({
      name: 'building',
      title: 'Building Facts',
      type: 'houseBuilding',
      group: 'building'
    }),

    // ============================================
    // ABOUT GROUP
    // ============================================
    defineField({
      name: 'about',
      title: 'About Section',
      type: 'internationalizedArrayPortableText',
      group: 'about',
      description:
        'Detailed description and highlights of the house. Use bullet points for key features.',
      validation: (rule) => rule.required(),
      options: { aiAssist: { translateAction: true } }
    }),

    // ============================================
    // GALLERY GROUP
    // ============================================
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'localizedImage',
      group: 'gallery',
      description:
        'Optional image displayed first in gallery grids (mobile carousel and desktop block gallery)'
    }),
    defineField({
      name: 'galleryCategories',
      title: 'Photos by Category',
      type: 'array',
      group: 'gallery',
      description:
        'Photos grouped by category. Drag to reorder within each category.',
      of: [defineArrayMember({ type: 'houseGalleryCategory' })],
      options: { sortable: false }
    }),

    // ============================================
    // AMENITIES GROUP
    // ============================================
    defineField({
      name: 'amenityCategories',
      title: 'Amenities by Category',
      type: 'array',
      group: 'amenities',
      description:
        'Amenities grouped by category. Drag to reorder within each category.',
      of: [defineArrayMember({ type: 'houseAmenityCategory' })],
      options: { sortable: false }
    }),

    // ============================================
    // LOCATION GROUP
    // ============================================
    defineField({
      name: 'location',
      title: 'Location',
      type: 'houseLocation',
      group: 'location'
    }),

    // ============================================
    // MAP GROUP
    // ============================================
    defineField({
      name: 'map',
      title: 'Map',
      type: 'houseMap',
      group: 'map'
    }),

    // ============================================
    // PRICING GROUP
    // ============================================
    defineField({
      name: 'pricing',
      title: 'Pricing',
      type: 'array',
      group: 'pricing',
      description: 'Pricing information rows with rich text content',
      of: [defineArrayMember({ type: 'pricingRow' })],
      validation: (rule) =>
        rule.min(1).error('At least one pricing row is required')
    }),
    defineField({
      name: 'extraCosts',
      title: 'Extra Costs',
      type: 'array',
      group: 'pricing',
      description:
        'Additional costs shown in the FAQ section. Order is controlled on the FAQ page.',
      of: [defineArrayMember({ type: 'extraCostItem' })],
      options: { sortable: false },
      validation: (rule) =>
        rule.custom(
          (items: Array<{ category?: { _ref: string } }> | undefined) => {
            if (!items || items.length === 0) return true
            const categoryRefs = items
              .map((item) => item.category?._ref)
              .filter(Boolean)
            const uniqueRefs = new Set(categoryRefs)
            if (uniqueRefs.size !== categoryRefs.length) {
              return 'Each category can only be used once'
            }
            return true
          }
        )
    }),

    // ============================================
    // CONTACT GROUP
    // ============================================
    defineField({
      name: 'phone',
      title: 'Phone Numbers',
      type: 'housePhone',
      group: 'contact',
      validation: (rule) => rule.required()
    })
  ],
  preview: {
    select: {
      title: 'title.0.value',
      slug: 'slug',
      media: 'image.asset'
    },
    prepare({ title, slug, media }) {
      return {
        title: title || 'Untitled House',
        subtitle: slug || 'No ID',
        media
      }
    }
  }
})
