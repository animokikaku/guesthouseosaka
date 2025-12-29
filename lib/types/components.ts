import type { PortableTextBlock } from '@portabletext/react'
import type { SanityImageCrop, SanityImageHotspot } from '@/sanity.types'

// ============================================
// Image Types
// ============================================

/**
 * Sanity image asset reference with optional metadata
 * Used for all Sanity-sourced images
 * Includes both _id and _ref for compatibility with Sanity image URL builder
 */
export interface SanityImageAsset {
  _id?: string
  _ref?: string
  _type?: 'reference'
  url?: string | null
}

/**
 * Complete Sanity image data structure
 * Compatible with urlFor() helper and Next.js Image
 */
export interface SanityImage {
  asset: SanityImageAsset | null
  hotspot?: SanityImageHotspot | null
  crop?: SanityImageCrop | null
  alt?: string | null
  preview?: string | null
}

// ============================================
// House Components
// ============================================

/**
 * Building information displayed on house cards
 * @see components/house/house-building.tsx
 */
export interface BuildingData {
  rooms?: number
  floors?: number
  startingPrice?: number
}

/**
 * Location highlight and map details
 * @see components/house/house-location.tsx
 * @see components/house/house-location-modal.tsx
 */
export interface LocationData {
  highlight: string | null
  details: PortableTextBlock[] | null
}

/**
 * Map data including coordinates and place info
 * @see components/house/house-map.tsx
 * @see components/map/place-details.tsx
 */
export interface MapData {
  coordinates: { lat: number; lng: number }
  placeId: string
  placeImage: SanityImage
  googleMapsUrl: string | null
}

/**
 * Pricing row for house pricing tables
 * Uses PortableText for rich content formatting
 * @see components/house/house-pricing.tsx
 */
export interface PricingRowData {
  _key: string
  label: string | null
  content: PortableTextBlock[] | null
}

/**
 * Amenity item with category grouping
 * @see components/house/house-amenities.tsx
 */
export interface AmenityItemData {
  _key: string
  label: string | null
  icon: string
  note: 'private' | 'shared' | 'coin' | null
  featured: boolean | null
  category: {
    _id: string
    key: string
    label: string | null
    order: number
  }
}

// ============================================
// Form Components
// ============================================

/**
 * Configuration for a single form field
 * @see components/forms/tour-form.tsx
 * @see components/forms/move-in-form.tsx
 * @see components/forms/contact-form.tsx
 */
export interface FormFieldConfig {
  label: string | null
  placeholder?: string | null
  description?: string | null
}

/**
 * Configuration for all form fields in a contact form
 * Fields are optional since different form types use different field subsets
 */
export interface FormFieldsConfig {
  places?: FormFieldConfig
  date?: FormFieldConfig
  hour?: FormFieldConfig
  stayDuration?: FormFieldConfig
  name?: FormFieldConfig
  age?: FormFieldConfig
  gender?: FormFieldConfig
  nationality?: FormFieldConfig
  email?: FormFieldConfig
  phone?: FormFieldConfig
  message?: FormFieldConfig
}

/**
 * Complete contact form configuration including title and fields
 */
export interface ContactFormConfig {
  title?: string | null
  description?: string | null
  fields: FormFieldsConfig
}
