import type { ContactType, HouseIdentifier } from '@/lib/types'
import type { SanityImageCrop, SanityImageHotspot } from '@/sanity.types'
import type { PortableTextBlock } from '@portabletext/react'

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
  googleMapsUrl?: string
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
    orderRank: string | null
  }
}

// ============================================
// Form Components
// ============================================

/**
 * Configuration for a single form field
 *
 * Type guarantees:
 * - `label` is `string` (not null) because schema has `validation: rule.required()`
 *   and queries use `coalesce(..., title[_key == "en"][0].value)` fallback
 * - `placeholder` and `description` are nullable (no validation in schema)
 *
 * @see sanity/schemaTypes/objects/form-field-config.ts
 */
export interface FormFieldConfig {
  label: string
  placeholder?: string
  description?: string
}

/**
 * Configuration for all form fields in a contact form
 * All field keys exist because the GROQ query projection explicitly includes them
 * (values like label/placeholder can be null if not configured in Studio)
 */
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
 * Complete contact form configuration including title and fields
 *
 * Type guarantees:
 * - `title` is `string` (not null) because schema has `validation: rule.required()`
 * - `description` is nullable (no validation in schema)
 *
 * @see sanity/schemaTypes/documents/contact-type.ts
 */
export interface ContactFormConfig {
  title: string
  description: string | null
  fields: FormFieldsConfig
}

// ============================================
// Visual Editing Components
// ============================================

/**
 * Base interface for components that support Sanity visual editing
 * Includes _id and _type needed by useOptimistic hook
 */
interface VisualEditingBase {
  _id: string
  _type: string
}

/**
 * House item in the collection grid
 * @see components/collection.tsx
 */
export interface CollectionHouseItem {
  _key: string
  slug: HouseIdentifier
  title: string | null
  description: string | null
  image: SanityImage
}

/**
 * Collection component data with visual editing support
 * @see components/collection.tsx
 */
export interface CollectionData extends VisualEditingBase {
  houses: CollectionHouseItem[]
}

/**
 * Contact type item in the navigation list
 * @see app/[locale]/contact/(components)/contact-types-list.tsx
 */
export interface ContactTypeItem {
  _key: string
  slug: ContactType
  title: string | null
  description: string | null
}

/**
 * Contact types list data with visual editing support
 * @see app/[locale]/contact/(components)/contact-types-list.tsx
 */
export interface ContactTypesListData extends VisualEditingBase {
  contactTypes: ContactTypeItem[]
}

// ============================================
// Gallery Components
// ============================================

/**
 * Pre-built image data for gallery display
 * All URLs are pre-computed, decoupling components from Sanity helpers
 * @see components/gallery-wall.tsx
 */
export interface GalleryImage {
  _key: string
  src: string
  alt: string | null
  blurDataURL: string | null
  width: number
  height: number
}

// ============================================
// Navigation Components
// ============================================

/**
 * Contact navigation item for the contact page tabs
 * Decoupled from Sanity types - only includes what the component needs
 * @see components/contact-nav.tsx
 */
export interface ContactNavItem {
  id: string
  slug: ContactType
  title: string
}
