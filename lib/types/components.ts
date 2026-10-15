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
// Navigation Components
// ============================================

export interface ContactNavItem {
  id: string
  slug: ContactType
  title: string
}
