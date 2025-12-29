import {
  CheckmarkCircleIcon,
  CogIcon,
  ComponentIcon,
  DocumentsIcon,
  EnvelopeIcon,
  HelpCircleIcon,
  HomeIcon,
  ImagesIcon,
  TagIcon
} from '@sanity/icons'
import type { StructureResolver } from 'sanity/structure'

// Document types that are singletons (should not appear in generic lists)
const SINGLETONS = ['settings', 'homePage', 'faqPage', 'contactPage']

// Document types managed in folders (should not appear in generic lists)
const MANAGED_TYPES = [
  ...SINGLETONS,
  'house',
  'contactType',
  'galleryCategory',
  'amenityCategory',
  'amenity'
]

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // ============================================
      // SITE SETTINGS (Singleton)
      // ============================================
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(S.document().schemaType('settings').documentId('settings')),

      S.divider(),

      // ============================================
      // PAGES FOLDER
      // ============================================
      S.listItem()
        .title('Pages')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title('Pages')
            .items([
              S.listItem()
                .title('Home Page')
                .icon(HomeIcon)
                .child(
                  S.document().schemaType('homePage').documentId('homePage')
                ),
              S.listItem()
                .title('FAQ Page')
                .icon(HelpCircleIcon)
                .child(
                  S.document().schemaType('faqPage').documentId('faqPage')
                ),
              S.listItem()
                .title('Contact Page')
                .icon(EnvelopeIcon)
                .child(
                  S.document()
                    .schemaType('contactPage')
                    .documentId('contactPage')
                )
            ])
        ),

      // ============================================
      // HOUSES
      // ============================================
      S.listItem()
        .title('Houses')
        .icon(HomeIcon)
        .child(
          S.documentTypeList('house')
            .title('Houses')
            .defaultOrdering([{ field: 'slug', direction: 'asc' }])
        ),

      // ============================================
      // AMENITIES
      // ============================================
      S.listItem()
        .title('Amenities')
        .icon(CheckmarkCircleIcon)
        .child(S.documentTypeList('amenity').title('Amenities')),

      // ============================================
      // FORMS
      // ============================================
      S.listItem()
        .title('Forms')
        .icon(EnvelopeIcon)
        .child(
          S.documentTypeList('contactType')
            .title('Contact Form Types')
            .defaultOrdering([{ field: 'slug', direction: 'asc' }])
        ),

      // ============================================
      // CATEGORIES FOLDER
      // ============================================
      S.listItem()
        .title('Categories')
        .icon(TagIcon)
        .child(
          S.list()
            .title('Categories')
            .items([
              S.listItem()
                .title('Gallery Categories')
                .icon(ImagesIcon)
                .child(
                  S.documentTypeList('galleryCategory')
                    .title('Gallery Categories')
                    .defaultOrdering([{ field: 'order', direction: 'asc' }])
                ),
              S.listItem()
                .title('Amenity Categories')
                .icon(ComponentIcon)
                .child(
                  S.documentTypeList('amenityCategory')
                    .title('Amenity Categories')
                    .defaultOrdering([{ field: 'order', direction: 'asc' }])
                )
            ])
        ),

      S.divider(),

      // ============================================
      // OTHER DOCUMENT TYPES (if any remain)
      // ============================================
      ...S.documentTypeListItems().filter(
        (listItem) => !MANAGED_TYPES.includes(listItem.getId() as string)
      )
    ])
