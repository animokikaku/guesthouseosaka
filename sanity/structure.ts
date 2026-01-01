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
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'
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
  'amenity',
  'pricingCategory'
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
      // HOUSES (orderable for global nav/FAQ/contact ordering)
      // ============================================
      orderableDocumentListDeskItem({
        type: 'house',
        title: 'Houses',
        icon: HomeIcon,
        S,
        context: S.context
      }),

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
      orderableDocumentListDeskItem({
        type: 'contactType',
        title: 'Contact',
        icon: EnvelopeIcon,
        S,
        context: S.context
      }),

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
              orderableDocumentListDeskItem({
                type: 'galleryCategory',
                title: 'Gallery Categories',
                icon: ImagesIcon,
                S,
                context: S.context
              }),
              orderableDocumentListDeskItem({
                type: 'amenityCategory',
                title: 'Amenity Categories',
                icon: ComponentIcon,
                S,
                context: S.context
              }),
              orderableDocumentListDeskItem({
                type: 'pricingCategory',
                title: 'Pricing Categories',
                icon: TagIcon,
                S,
                context: S.context
              })
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
