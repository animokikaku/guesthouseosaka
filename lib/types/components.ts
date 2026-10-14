import type { ContactType } from '@/lib/types'
import type { HouseQueryResult } from '@/sanity.types'

type HouseData = NonNullable<HouseQueryResult>
export type HousePortableTextContent = HouseData['about']

// ============================================
// House Components
// ============================================

export interface BuildingData {
  rooms?: number
  floors?: number
  startingPrice?: number
}

export interface LocationData {
  highlight: string | null
  details: NonNullable<HouseData['location']>['details']
}

export interface MapData {
  coordinates: { lat: number; lng: number }
  placeId: string
  placeImage: NonNullable<HouseData['map']>['placeImage']
  googleMapsUrl?: string
}

export interface PricingRowData {
  _key: string
  label: string | null
  content: NonNullable<HouseData['pricing']>[number]['content']
}

/** `featured` is filtered in the GROQ query, so the frontend never reads it. */
export interface AmenityItemData {
  _key: string
  label: string | null
  icon: string
  note: 'private' | 'shared' | 'coin' | null
}

export interface AmenityCategoryData {
  _key: string
  _id: string
  label: string | null
  icon: string | null
  items: AmenityItemData[]
}

// ============================================
// Form Components
// ============================================

/**
 * `label` is a string because the schema requires it and the query falls back
 * to English; `placeholder` and `description` are optional in the schema.
 *
 * @see sanity/schemaTypes/objects/form-field-config.ts
 */
export interface FormFieldConfig {
  label: string
  placeholder?: string
  description?: string
}

/** Every key exists because the GROQ projection lists each one explicitly. */
export interface FormFieldsConfig {
  places: FormFieldConfig
  date: FormFieldConfig
  hour: FormFieldConfig
  stayDuration: FormFieldConfig
  name: FormFieldConfig
  age: FormFieldConfig
  gender: FormFieldConfig
  nationality: FormFieldConfig
  email: FormFieldConfig
  phone: FormFieldConfig
  message: FormFieldConfig
}

/**
 * `title` is a string because the schema requires it; `description` is optional.
 *
 * @see sanity/schemaTypes/documents/contact-type.ts
 */
export interface ContactFormConfig {
  title: string
  description: string | null
  fields: FormFieldsConfig
}

// ============================================
// Gallery Components
// ============================================

/** Pre-built image data with every URL computed, so components don't need Sanity helpers. */
export interface GalleryImage {
  _key: string
  src: string
  alt: string | null
  blurDataURL: string | null
  width: number
  height: number
  /** Preloaded as the likely LCP element rather than lazy-loaded. */
  priority?: boolean
}

// ============================================
// Navigation Components
// ============================================

export interface ContactNavItem {
  id: string
  slug: ContactType
  title: string
}
