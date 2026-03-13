import { defineQuery } from 'next-sanity'

// =============================================================================
// GROQ FRAGMENTS (static only - no dynamic functions for typegen compatibility)
// =============================================================================

// Image fields with asset reference (for Next.js Image component optimization)
const imageRefFields = /* groq */ `
  asset,
  hotspot,
  crop,
  "alt": coalesce(alt[language == $locale][0].value, alt[language == "en"][0].value),
  "preview": asset->metadata.lqip
`

// Wrapped image fragment
const imageFields = /* groq */ `image{${imageRefFields}}`

// Actions array (used in faqPage, contactPage)
const actionsFields = /* groq */ `
  "actions": array::compact(actions[]{
    _key,
    icon,
    "label": coalesce(label[language == $locale][0].value, label[language == "en"][0].value),
    href
  })
`

// Contact form fields projection
const contactFormFields = /* groq */ `
  "fields": {
    "places": {
      "label": coalesce(fields.places.label[language == $locale][0].value, fields.places.label[language == "en"][0].value),
      "placeholder": coalesce(fields.places.placeholder[language == $locale][0].value, fields.places.placeholder[language == "en"][0].value),
      "description": coalesce(fields.places.description[language == $locale][0].value, fields.places.description[language == "en"][0].value)
    },
    "date": {
      "label": coalesce(fields.date.label[language == $locale][0].value, fields.date.label[language == "en"][0].value),
      "placeholder": coalesce(fields.date.placeholder[language == $locale][0].value, fields.date.placeholder[language == "en"][0].value),
      "description": coalesce(fields.date.description[language == $locale][0].value, fields.date.description[language == "en"][0].value)
    },
    "hour": {
      "label": coalesce(fields.hour.label[language == $locale][0].value, fields.hour.label[language == "en"][0].value),
      "placeholder": coalesce(fields.hour.placeholder[language == $locale][0].value, fields.hour.placeholder[language == "en"][0].value),
      "description": coalesce(fields.hour.description[language == $locale][0].value, fields.hour.description[language == "en"][0].value)
    },
    "stayDuration": {
      "label": coalesce(fields.stayDuration.label[language == $locale][0].value, fields.stayDuration.label[language == "en"][0].value),
      "placeholder": coalesce(fields.stayDuration.placeholder[language == $locale][0].value, fields.stayDuration.placeholder[language == "en"][0].value),
      "description": coalesce(fields.stayDuration.description[language == $locale][0].value, fields.stayDuration.description[language == "en"][0].value)
    },
    "gender": {
      "label": coalesce(fields.gender.label[language == $locale][0].value, fields.gender.label[language == "en"][0].value),
      "placeholder": coalesce(fields.gender.placeholder[language == $locale][0].value, fields.gender.placeholder[language == "en"][0].value),
      "description": coalesce(fields.gender.description[language == $locale][0].value, fields.gender.description[language == "en"][0].value)
    },
    "age": {
      "label": coalesce(fields.age.label[language == $locale][0].value, fields.age.label[language == "en"][0].value),
      "placeholder": coalesce(fields.age.placeholder[language == $locale][0].value, fields.age.placeholder[language == "en"][0].value),
      "description": coalesce(fields.age.description[language == $locale][0].value, fields.age.description[language == "en"][0].value)
    },
    "nationality": {
      "label": coalesce(fields.nationality.label[language == $locale][0].value, fields.nationality.label[language == "en"][0].value),
      "placeholder": coalesce(fields.nationality.placeholder[language == $locale][0].value, fields.nationality.placeholder[language == "en"][0].value),
      "description": coalesce(fields.nationality.description[language == $locale][0].value, fields.nationality.description[language == "en"][0].value)
    },
    "phone": {
      "label": coalesce(fields.phone.label[language == $locale][0].value, fields.phone.label[language == "en"][0].value),
      "placeholder": coalesce(fields.phone.placeholder[language == $locale][0].value, fields.phone.placeholder[language == "en"][0].value),
      "description": coalesce(fields.phone.description[language == $locale][0].value, fields.phone.description[language == "en"][0].value)
    },
    "name": {
      "label": coalesce(fields.name.label[language == $locale][0].value, fields.name.label[language == "en"][0].value),
      "placeholder": coalesce(fields.name.placeholder[language == $locale][0].value, fields.name.placeholder[language == "en"][0].value),
      "description": coalesce(fields.name.description[language == $locale][0].value, fields.name.description[language == "en"][0].value)
    },
    "email": {
      "label": coalesce(fields.email.label[language == $locale][0].value, fields.email.label[language == "en"][0].value),
      "placeholder": coalesce(fields.email.placeholder[language == $locale][0].value, fields.email.placeholder[language == "en"][0].value),
      "description": coalesce(fields.email.description[language == $locale][0].value, fields.email.description[language == "en"][0].value)
    },
    "message": {
      "label": coalesce(fields.message.label[language == $locale][0].value, fields.message.label[language == "en"][0].value),
      "placeholder": coalesce(fields.message.placeholder[language == $locale][0].value, fields.message.placeholder[language == "en"][0].value),
      "description": coalesce(fields.message.description[language == $locale][0].value, fields.message.description[language == "en"][0].value)
    }
  }
`

// =============================================================================
// GLOBAL SETTINGS
// =============================================================================

export const settingsQuery = defineQuery(`*[_type == "settings"][0]{
  _id,
  _type,
  "siteName": coalesce(siteName[language == $locale][0].value, siteName[language == "en"][0].value),
  "siteDescription": coalesce(siteDescription[language == $locale][0].value, siteDescription[language == "en"][0].value),
  companyName,
  email,
  phone,
  address,
  "socialLinks": array::compact(socialLinks[]{
    _key,
    icon,
    label,
    url
  })
}`)

// =============================================================================
// HOME PAGE
// =============================================================================

export const homePageQuery = defineQuery(`{
  "page": *[_type == "homePage"][0]{
    _id,
    _type,
    "hero": hero{
      "content": coalesce(content[language == $locale][0].value, content[language == "en"][0].value),
      "ctaLabel": coalesce(ctaLabel[language == $locale][0].value, ctaLabel[language == "en"][0].value)
    },
    "galleryWall": array::compact(galleryWall[0...6]{
      _key,${imageRefFields}
    }),
    "collection": collection{
      "content": coalesce(content[language == $locale][0].value, content[language == "en"][0].value)
    }
  },
  "houses": *[_type == "house"] | order(orderRank){
    _id,
    slug,
    "title": coalesce(title[language == $locale][0].value, title[language == "en"][0].value),
    "description": coalesce(description[language == $locale][0].value, description[language == "en"][0].value),
    ${imageFields}
  }
}`)

// =============================================================================
// HOUSE PAGE
// =============================================================================

export const houseQuery = defineQuery(`*[_type == "house" && slug == $slug][0]{
  _id,
  _type,
  slug,
  "title": coalesce(title[language == $locale][0].value, title[language == "en"][0].value),
  "description": coalesce(description[language == $locale][0].value, description[language == "en"][0].value),
  "caption": coalesce(caption[language == $locale][0].value, caption[language == "en"][0].value),
  building,
  phone,

  // Hero Image
  image{
    asset->{
      _id,
      url,
      "dimensions": metadata.dimensions,
      "lqip": metadata.lqip
    },
    hotspot,
    crop,
    "alt": coalesce(alt[language == $locale][0].value, alt[language == "en"][0].value)
  },

  // Featured Image (optional, prepended to gallery grids)
  "featuredImage": select(
    defined(featuredImage.asset) => featuredImage{${imageRefFields}}
  ),

  // About Section
  "about": coalesce(about[language == $locale][0].value, about[language == "en"][0].value),

  // Gallery grouped by category (for gallery page - enables per-category display)
  // Sorted by category orderRank for consistent display order
  // Filter out empty categories at query level
  "galleryCategories": array::compact(galleryCategories[]{
    _key,
    "category": category->{
      _id,
      "label": coalesce(label[language == $locale][0].value, label[language == "en"][0].value),
      orderRank
    },
    "items": array::compact(items[]{
      _key,
      "image": image{${imageRefFields}}
    })
  })[count(items) > 0] | order(category.orderRank),

  // Flattened gallery images (for carousel/preview - pre-computed from sorted categories)
  "galleryImages": array::compact((galleryCategories | order(category->orderRank))[].items[]{
    _key,
    "image": image{${imageRefFields}}
  }),

  // Amenities grouped by category (enables per-category drag-and-drop reordering)
  // Filter out empty categories at query level
  "amenityCategories": array::compact(amenityCategories[]{
    _key,
    "category": category->{
      _id,
      "label": coalesce(label[language == $locale][0].value, label[language == "en"][0].value),
      icon,
      orderRank
    },
    "items": array::compact(items[]{
      _key,
      note,
      featured,
      "label": coalesce(
        customLabel[language == $locale][0].value,
        amenity->label[language == $locale][0].value,
        amenity->label[language == "en"][0].value
      ),
      "icon": amenity->icon
    })
  })[count(items) > 0],

  // Featured amenities (pre-computed, max 10)
  "featuredAmenities": array::compact(amenityCategories[].items[featured == true])[0...10]{
    _key,
    note,
    "label": coalesce(
      customLabel[language == $locale][0].value,
      amenity->label[language == $locale][0].value,
      amenity->label[language == "en"][0].value
    ),
    "icon": amenity->icon
  },

  // Location
  "location": location{
    "highlight": coalesce(highlight[language == $locale][0].value, highlight[language == "en"][0].value),
    "details": coalesce(details[language == $locale][0].value, details[language == "en"][0].value)
  },

  // Map
  "map": map{
    googleMapsUrl,
    placeId,
    "placeImage": placeImage{${imageRefFields}},
    coordinates,
    address
  },

  // Pricing
  "pricing": array::compact(pricing[]{
    _key,
    "label": coalesce(label[language == $locale][0].value, label[language == "en"][0].value),
    "content": coalesce(content[language == $locale][0].value, content[language == "en"][0].value)
  })
}`)

// House slugs for static generation
export const houseSlugsQuery = defineQuery(`*[_type == "house" && defined(slug)]{
  "slug": slug
}`)

// House titles for forms (ordered by global orderRank)
export const housesTitlesQuery = defineQuery(`*[_type == "house"] | order(orderRank){
  "slug": slug,
  "title": coalesce(title[language == $locale][0].value, title[language == "en"][0].value)
}`)

// Houses for navigation (header) - ordered by global orderRank
export const housesNavQuery = defineQuery(`*[_type == "house"] | order(orderRank){
  slug,
  "title": coalesce(title[language == $locale][0].value, title[language == "en"][0].value),
  "description": coalesce(description[language == $locale][0].value, description[language == "en"][0].value),
  "caption": coalesce(caption[language == $locale][0].value, caption[language == "en"][0].value),
  ${imageFields}
}`)

// All houses building and contact data (for FAQ page) - ordered by global orderRank
export const housesBuildingQuery = defineQuery(`*[_type == "house"] | order(orderRank){
  _id,
  _type,
  slug,
  "title": coalesce(title[language == $locale][0].value, title[language == "en"][0].value),
  "building": building{
    rooms,
    floors
  },
  phone,
  ${imageFields},
  "extraCosts": array::compact(extraCosts[]{
    "categoryId": category->_id,
    "value": coalesce(value[language == $locale][0].value, value[language == "en"][0].value)[]
  })
}`)

// =============================================================================
// FAQ PAGE
// =============================================================================

export const faqPageQuery = defineQuery(`*[_type == "faqPage"][0]{
  _id,
  _type,
  "header": coalesce(header[language == $locale][0].value, header[language == "en"][0].value),
  "metaTitle": coalesce(metaTitle[language == $locale][0].value, metaTitle[language == "en"][0].value),
  "metaDescription": coalesce(metaDescription[language == $locale][0].value, metaDescription[language == "en"][0].value),
  ${actionsFields},
  "contactSection": coalesce(contactSection[language == $locale][0].value, contactSection[language == "en"][0].value),
  "contactNote": coalesce(contactNote[language == $locale][0].value, contactNote[language == "en"][0].value)
}`)

export const faqQuestionsQuery = defineQuery(`
  *[_type == "faqQuestion"] | order(orderRank) {
    _id,
    _type,
    "question": coalesce(question[language == $locale][0].value, question[language == "en"][0].value),
    "answer": coalesce(answer[language == $locale][0].value, answer[language == "en"][0].value),
    componentKey
  }
`)

// =============================================================================
// CONTACT PAGE
// =============================================================================

// Separate query for metadata to avoid stega deduplication issues
// (generateMetadata runs before draft mode context is established)
export const contactPageMetaQuery = defineQuery(`
  *[_type == "contactPage"][0]{
    "metaTitle": coalesce(metaTitle[language == $locale][0].value, metaTitle[language == "en"][0].value),
    "metaDescription": coalesce(metaDescription[language == $locale][0].value, metaDescription[language == "en"][0].value)
  }
`)

export const contactPageQuery = defineQuery(`{
  "page": *[_type == "contactPage"][0]{
    _id,
    _type,
    "header": coalesce(header[language == $locale][0].value, header[language == "en"][0].value),
    ${actionsFields}
  },
  "contactTypes": *[_type == "contactType"] | order(orderRank){
    _id,
    _type,
    slug,
    "title": coalesce(title[language == $locale][0].value, title[language == "en"][0].value),
    "description": coalesce(description[language == $locale][0].value, description[language == "en"][0].value),
    ${contactFormFields}
  }
}`)

// Separate query for listing contact types (avoids stega deduplication with layout)
export const contactTypesListQuery = defineQuery(`
  *[_type == "contactType"] | order(orderRank){
    _id,
    _type,
    slug,
    "title": coalesce(title[language == $locale][0].value, title[language == "en"][0].value),
    "description": coalesce(description[language == $locale][0].value, description[language == "en"][0].value)
  }
`)

export const contactTypeQuery = defineQuery(`*[_type == "contactType" && slug == $slug][0]{
  _id,
  _type,
  slug,
  "title": coalesce(title[language == $locale][0].value, title[language == "en"][0].value),
  "description": coalesce(description[language == $locale][0].value, description[language == "en"][0].value),
  ${contactFormFields}
}`)

export const contactTypeSlugsQuery = defineQuery(`*[_type == "contactType"]{ slug }`)

// =============================================================================
// LEGAL NOTICE
// =============================================================================

export const legalNoticeQuery = defineQuery(`*[_type == "legalNotice"][0]{
  _id,
  _type,
  "title": coalesce(title[language == $locale][0].value, title[language == "en"][0].value),
  lastUpdated,
  "content": coalesce(content[language == $locale][0].value, content[language == "en"][0].value)
}`)

// =============================================================================
// TAXONOMY QUERIES
// =============================================================================

export const pricingCategoriesQuery = defineQuery(`*[_type == "pricingCategory"] | order(orderRank){
  _id,
  "title": coalesce(title[language == $locale][0].value, title[language == "en"][0].value),
  orderRank
}`)
