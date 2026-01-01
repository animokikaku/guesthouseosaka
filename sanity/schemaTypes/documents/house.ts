import { HouseIdentifierSchema, HouseIdentifierValues } from '@/lib/types'
import { HomeIcon } from '@sanity/icons'
import {
  defineArrayMember,
  defineField,
  defineType,
  type StringFieldProps
} from 'sanity'

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
      hidden: true,
      components: {
        field: (props: StringFieldProps) => props.renderDefault(props)
      }
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
      type: 'object',
      group: 'building',
      fields: [
        defineField({
          name: 'rooms',
          title: 'Number of Rooms',
          type: 'number',
          validation: (rule) => rule.required().min(1)
        }),
        defineField({
          name: 'floors',
          title: 'Number of Floors',
          type: 'number',
          validation: (rule) => rule.required().min(1)
        }),
        defineField({
          name: 'startingPrice',
          title: 'Starting Price (JPY)',
          type: 'number',
          description: 'Monthly rent starting from',
          validation: (rule) => rule.required().min(0)
        })
      ]
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
      name: 'gallery',
      title: 'Gallery Images',
      type: 'array',
      group: 'gallery',
      description: 'House photos organized by category. Drag to reorder.',
      of: [defineArrayMember({ type: 'galleryImage' })],
      validation: (rule) =>
        rule.min(1).error('At least one gallery image is required')
    }),

    // ============================================
    // AMENITIES GROUP
    // ============================================
    defineField({
      name: 'amenities',
      title: 'Amenities',
      type: 'array',
      group: 'amenities',
      description:
        'Amenities available at this house. Mark items as "featured" to show in the preview section.',
      of: [defineArrayMember({ type: 'houseAmenity' })]
    }),

    // ============================================
    // LOCATION GROUP
    // ============================================
    defineField({
      name: 'location',
      title: 'Location',
      type: 'object',
      group: 'location',
      fields: [
        defineField({
          name: 'highlight',
          title: 'Location Highlight',
          type: 'internationalizedArrayText',
          description:
            'Key location selling point (e.g., "14 minutes walk to Namba")',
          options: { aiAssist: { translateAction: true } }
        }),
        defineField({
          name: 'details',
          title: 'Location Details',
          type: 'internationalizedArrayPortableText',
          description:
            'Use H3 for section headings (e.g., "Getting Around", "Nearby") and bullet lists for items',
          options: { aiAssist: { translateAction: true } }
        })
      ]
    }),

    // ============================================
    // MAP GROUP
    // ============================================
    defineField({
      name: 'map',
      title: 'Map',
      type: 'object',
      group: 'map',
      description: 'Google Maps configuration and address for JSON-LD',
      fields: [
        defineField({
          name: 'googleMapsUrl',
          title: 'Google Maps URL',
          type: 'url',
          description: 'Direct link to Google Maps',
          validation: (rule) => rule.required()
        }),
        defineField({
          name: 'placeId',
          title: 'Google Place ID',
          type: 'string',
          description: 'Google Maps Place ID for embedded maps',
          validation: (rule) => rule.required()
        }),
        defineField({
          name: 'placeImage',
          title: 'Place Image',
          type: 'localizedImage',
          description: 'Image for Google Maps Place card',
          validation: (rule) => rule.required().assetRequired()
        }),
        defineField({
          name: 'coordinates',
          title: 'Coordinates',
          type: 'geopoint',
          description: 'Pin location on the map',
          validation: (rule) => rule.required()
        }),
        defineField({
          name: 'address',
          title: 'Address',
          type: 'address',
          validation: (rule) => rule.required()
        })
      ]
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
      type: 'object',
      group: 'contact',
      fields: [
        defineField({
          name: 'domestic',
          title: 'Domestic',
          type: 'string',
          description: 'Phone number for calls from Japan'
        }),
        defineField({
          name: 'international',
          title: 'International',
          type: 'string',
          description: 'Phone number for calls from abroad'
        })
      ]
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
