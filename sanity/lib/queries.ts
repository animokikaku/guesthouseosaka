import { defineQuery } from 'next-sanity'

// =============================================================================
// GLOBAL SETTINGS
// =============================================================================

export const settingsQuery = defineQuery(`*[_type == "settings"][0]{
  _id,
  _type,
  "siteName": coalesce(siteName[_key == $locale][0].value, siteName[_key == "en"][0].value),
  "siteDescription": coalesce(siteDescription[_key == $locale][0].value, siteDescription[_key == "en"][0].value),
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
      "content": coalesce(content[_key == $locale][0].value, content[_key == "en"][0].value),
      "ctaLabel": coalesce(ctaLabel[_key == $locale][0].value, ctaLabel[_key == "en"][0].value)
    },
    "galleryWall": array::compact(galleryWall[0...6]{
      _key,
      asset->{
        _id,
        url,
        "dimensions": metadata.dimensions,
        "lqip": metadata.lqip
      },
      hotspot,
      crop,
      "alt": coalesce(alt[_key == $locale][0].value, alt[_key == "en"][0].value),
      "preview": asset->metadata.lqip
    }),
    "collection": collection{
      "content": coalesce(content[_key == $locale][0].value, content[_key == "en"][0].value)
    }
  },
  "houses": *[_type == "house"] | order(orderRank){
    _id,
    slug,
    "title": coalesce(title[_key == $locale][0].value, title[_key == "en"][0].value),
    "description": coalesce(description[_key == $locale][0].value, description[_key == "en"][0].value),
    image{
      asset->{
        _id,
        url,
        "dimensions": metadata.dimensions,
        "lqip": metadata.lqip
      },
      hotspot,
      crop,
      "alt": coalesce(alt[_key == $locale][0].value, alt[_key == "en"][0].value),
      "preview": asset->metadata.lqip
    }
  }
}`)

// =============================================================================
// HOUSE PAGE
// =============================================================================

export const houseQuery = defineQuery(`*[_type == "house" && slug == $slug][0]{
  _id,
  _type,
  slug,
  "title": coalesce(title[_key == $locale][0].value, title[_key == "en"][0].value),
  "description": coalesce(description[_key == $locale][0].value, description[_key == "en"][0].value),
  "caption": coalesce(caption[_key == $locale][0].value, caption[_key == "en"][0].value),
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
    "alt": coalesce(alt[_key == $locale][0].value, alt[_key == "en"][0].value)
  },

  // Featured Image (optional, prepended to gallery grids)
  "featuredImage": select(
    defined(featuredImage.asset) => featuredImage{
      asset,
      hotspot,
      crop,
      "alt": coalesce(alt[_key == $locale][0].value, alt[_key == "en"][0].value),
      "preview": asset->metadata.lqip
    }
  ),

  // About Section
  "about": coalesce(about[_key == $locale][0].value, about[_key == "en"][0].value),

  // Gallery grouped by category (enables per-category drag-and-drop reordering)
  "galleryCategories": array::compact(galleryCategories[]{
    _key,
    "category": category->{
      _id,
      "key": key.current,
      "label": coalesce(label[_key == $locale][0].value, label[_key == "en"][0].value),
      orderRank
    },
    "items": array::compact(items[]{
      _key,
      "image": image{
        asset,
        hotspot,
        crop,
        "alt": coalesce(alt[_key == $locale][0].value, alt[_key == "en"][0].value),
        "preview": asset->metadata.lqip
      }
    })
  }),

  // Amenities grouped by category (enables per-category drag-and-drop reordering)
  "amenityCategories": array::compact(amenityCategories[]{
    _key,
    "category": category->{
      _id,
      "key": key.current,
      "label": coalesce(label[_key == $locale][0].value, label[_key == "en"][0].value),
      icon,
      orderRank
    },
    "items": array::compact(items[]{
      _key,
      note,
      featured,
      "label": coalesce(
        customLabel[_key == $locale][0].value,
        amenity->label[_key == $locale][0].value,
        amenity->label[_key == "en"][0].value
      ),
      "icon": amenity->icon
    })
  }),

  // Featured amenities (pre-computed, max 10)
  "featuredAmenities": array::compact(amenityCategories[].items[featured == true])[0...10]{
    _key,
    note,
    "label": coalesce(
      customLabel[_key == $locale][0].value,
      amenity->label[_key == $locale][0].value,
      amenity->label[_key == "en"][0].value
    ),
    "icon": amenity->icon
  },

  // Location
  "location": location{
    "highlight": coalesce(highlight[_key == $locale][0].value, highlight[_key == "en"][0].value),
    "details": coalesce(details[_key == $locale][0].value, details[_key == "en"][0].value)
  },

  // Map
  "map": map{
    googleMapsUrl,
    placeId,
    "placeImage": placeImage{
      asset,
      hotspot,
      crop,
      "alt": coalesce(alt[_key == $locale][0].value, alt[_key == "en"][0].value),
      "preview": asset->metadata.lqip
    },
    coordinates,
    address
  },

  // Pricing
  "pricing": array::compact(pricing[]{
    _key,
    "label": coalesce(label[_key == $locale][0].value, label[_key == "en"][0].value),
    "content": coalesce(content[_key == $locale][0].value, content[_key == "en"][0].value)
  })
}`)

// House slugs for static generation
export const houseSlugsQuery =
  defineQuery(`*[_type == "house" && defined(slug)]{
  "slug": slug
}`)

// House titles for forms (ordered by global orderRank)
export const housesTitlesQuery =
  defineQuery(`*[_type == "house"] | order(orderRank){
  "slug": slug,
  "title": coalesce(title[_key == $locale][0].value, title[_key == "en"][0].value)
}`)

// Houses for navigation (header) - ordered by global orderRank
export const housesNavQuery =
  defineQuery(`*[_type == "house"] | order(orderRank){
  slug,
  "title": coalesce(title[_key == $locale][0].value, title[_key == "en"][0].value),
  "description": coalesce(description[_key == $locale][0].value, description[_key == "en"][0].value),
  "caption": coalesce(caption[_key == $locale][0].value, caption[_key == "en"][0].value),
  image{
    asset,
    hotspot,
    crop,
    "alt": coalesce(alt[_key == $locale][0].value, alt[_key == "en"][0].value),
    "lqip": asset->metadata.lqip
  }
}`)

// All houses building and contact data (for FAQ page) - ordered by global orderRank
export const housesBuildingQuery =
  defineQuery(`*[_type == "house"] | order(orderRank){
  _id,
  _type,
  slug,
  "title": coalesce(title[_key == $locale][0].value, title[_key == "en"][0].value),
  "building": building{
    rooms,
    floors
  },
  phone,
  image{
    asset,
    hotspot,
    crop,
    "alt": coalesce(alt[_key == $locale][0].value, alt[_key == "en"][0].value),
    "lqip": asset->metadata.lqip
  },
  "extraCosts": array::compact(extraCosts[]{
    "slug": category->slug.current,
    "value": coalesce(value[_key == $locale][0].value, value[_key == "en"][0].value)[]
  })
}`)

// =============================================================================
// FAQ PAGE
// =============================================================================

export const faqPageQuery = defineQuery(`*[_type == "faqPage"][0]{
  _id,
  _type,
  "header": coalesce(header[_key == $locale][0].value, header[_key == "en"][0].value),
  "metaTitle": coalesce(metaTitle[_key == $locale][0].value, metaTitle[_key == "en"][0].value),
  "metaDescription": coalesce(metaDescription[_key == $locale][0].value, metaDescription[_key == "en"][0].value),
  "actions": array::compact(actions[]{
    _key,
    icon,
    "label": coalesce(label[_key == $locale][0].value, label[_key == "en"][0].value),
    href
  }),
  "contactSection": coalesce(contactSection[_key == $locale][0].value, contactSection[_key == "en"][0].value),
  "contactNote": coalesce(contactNote[_key == $locale][0].value, contactNote[_key == "en"][0].value)
}`)

export const faqQuestionsQuery = defineQuery(`
  *[_type == "faqQuestion"] | order(orderRank) {
    _id,
    _type,
    "question": coalesce(question[_key == $locale][0].value, question[_key == "en"][0].value),
    "answer": coalesce(answer[_key == $locale][0].value, answer[_key == "en"][0].value),
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
    "metaTitle": coalesce(metaTitle[_key == $locale][0].value, metaTitle[_key == "en"][0].value),
    "metaDescription": coalesce(metaDescription[_key == $locale][0].value, metaDescription[_key == "en"][0].value)
  }
`)

export const contactPageQuery = defineQuery(`{
  "page": *[_type == "contactPage"][0]{
    _id,
    _type,
    "header": coalesce(header[_key == $locale][0].value, header[_key == "en"][0].value),
    "actions": array::compact(actions[]{
      _key,
      icon,
      "label": coalesce(label[_key == $locale][0].value, label[_key == "en"][0].value),
      href
    })
  },
  "contactTypes": *[_type == "contactType"] | order(orderRank){
    _id,
    _type,
    slug,
    "title": coalesce(title[_key == $locale][0].value, title[_key == "en"][0].value),
    "description": coalesce(description[_key == $locale][0].value, description[_key == "en"][0].value),
    "fields": {
      "places": {
        "label": coalesce(fields.places.label[_key == $locale][0].value, fields.places.label[_key == "en"][0].value),
        "placeholder": coalesce(fields.places.placeholder[_key == $locale][0].value, fields.places.placeholder[_key == "en"][0].value),
        "description": coalesce(fields.places.description[_key == $locale][0].value, fields.places.description[_key == "en"][0].value)
      },
      "date": {
        "label": coalesce(fields.date.label[_key == $locale][0].value, fields.date.label[_key == "en"][0].value),
        "placeholder": coalesce(fields.date.placeholder[_key == $locale][0].value, fields.date.placeholder[_key == "en"][0].value),
        "description": coalesce(fields.date.description[_key == $locale][0].value, fields.date.description[_key == "en"][0].value)
      },
      "hour": {
        "label": coalesce(fields.hour.label[_key == $locale][0].value, fields.hour.label[_key == "en"][0].value),
        "placeholder": coalesce(fields.hour.placeholder[_key == $locale][0].value, fields.hour.placeholder[_key == "en"][0].value),
        "description": coalesce(fields.hour.description[_key == $locale][0].value, fields.hour.description[_key == "en"][0].value)
      },
      "stayDuration": {
        "label": coalesce(fields.stayDuration.label[_key == $locale][0].value, fields.stayDuration.label[_key == "en"][0].value),
        "placeholder": coalesce(fields.stayDuration.placeholder[_key == $locale][0].value, fields.stayDuration.placeholder[_key == "en"][0].value),
        "description": coalesce(fields.stayDuration.description[_key == $locale][0].value, fields.stayDuration.description[_key == "en"][0].value)
      },
      "gender": {
        "label": coalesce(fields.gender.label[_key == $locale][0].value, fields.gender.label[_key == "en"][0].value),
        "placeholder": coalesce(fields.gender.placeholder[_key == $locale][0].value, fields.gender.placeholder[_key == "en"][0].value),
        "description": coalesce(fields.gender.description[_key == $locale][0].value, fields.gender.description[_key == "en"][0].value)
      },
      "age": {
        "label": coalesce(fields.age.label[_key == $locale][0].value, fields.age.label[_key == "en"][0].value),
        "placeholder": coalesce(fields.age.placeholder[_key == $locale][0].value, fields.age.placeholder[_key == "en"][0].value),
        "description": coalesce(fields.age.description[_key == $locale][0].value, fields.age.description[_key == "en"][0].value)
      },
      "nationality": {
        "label": coalesce(fields.nationality.label[_key == $locale][0].value, fields.nationality.label[_key == "en"][0].value),
        "placeholder": coalesce(fields.nationality.placeholder[_key == $locale][0].value, fields.nationality.placeholder[_key == "en"][0].value),
        "description": coalesce(fields.nationality.description[_key == $locale][0].value, fields.nationality.description[_key == "en"][0].value)
      },
      "phone": {
        "label": coalesce(fields.phone.label[_key == $locale][0].value, fields.phone.label[_key == "en"][0].value),
        "placeholder": coalesce(fields.phone.placeholder[_key == $locale][0].value, fields.phone.placeholder[_key == "en"][0].value),
        "description": coalesce(fields.phone.description[_key == $locale][0].value, fields.phone.description[_key == "en"][0].value)
      },
      "name": {
        "label": coalesce(fields.name.label[_key == $locale][0].value, fields.name.label[_key == "en"][0].value),
        "placeholder": coalesce(fields.name.placeholder[_key == $locale][0].value, fields.name.placeholder[_key == "en"][0].value),
        "description": coalesce(fields.name.description[_key == $locale][0].value, fields.name.description[_key == "en"][0].value)
      },
      "email": {
        "label": coalesce(fields.email.label[_key == $locale][0].value, fields.email.label[_key == "en"][0].value),
        "placeholder": coalesce(fields.email.placeholder[_key == $locale][0].value, fields.email.placeholder[_key == "en"][0].value),
        "description": coalesce(fields.email.description[_key == $locale][0].value, fields.email.description[_key == "en"][0].value)
      },
      "message": {
        "label": coalesce(fields.message.label[_key == $locale][0].value, fields.message.label[_key == "en"][0].value),
        "placeholder": coalesce(fields.message.placeholder[_key == $locale][0].value, fields.message.placeholder[_key == "en"][0].value),
        "description": coalesce(fields.message.description[_key == $locale][0].value, fields.message.description[_key == "en"][0].value)
      }
    }
  }
}`)

// Separate query for listing contact types (avoids stega deduplication with layout)
export const contactTypesListQuery = defineQuery(`
  *[_type == "contactType"] | order(orderRank){
    _id,
    _type,
    slug,
    "title": coalesce(title[_key == $locale][0].value, title[_key == "en"][0].value),
    "description": coalesce(description[_key == $locale][0].value, description[_key == "en"][0].value)
  }
`)

export const contactTypeQuery =
  defineQuery(`*[_type == "contactType" && slug == $slug][0]{
  _id,
  _type,
  slug,
  "title": coalesce(title[_key == $locale][0].value, title[_key == "en"][0].value),
  "description": coalesce(description[_key == $locale][0].value, description[_key == "en"][0].value),
  "fields": {
    "places": {
      "label": coalesce(fields.places.label[_key == $locale][0].value, fields.places.label[_key == "en"][0].value),
      "placeholder": coalesce(fields.places.placeholder[_key == $locale][0].value, fields.places.placeholder[_key == "en"][0].value),
      "description": coalesce(fields.places.description[_key == $locale][0].value, fields.places.description[_key == "en"][0].value)
    },
    "date": {
      "label": coalesce(fields.date.label[_key == $locale][0].value, fields.date.label[_key == "en"][0].value),
      "placeholder": coalesce(fields.date.placeholder[_key == $locale][0].value, fields.date.placeholder[_key == "en"][0].value),
      "description": coalesce(fields.date.description[_key == $locale][0].value, fields.date.description[_key == "en"][0].value)
    },
    "hour": {
      "label": coalesce(fields.hour.label[_key == $locale][0].value, fields.hour.label[_key == "en"][0].value),
      "placeholder": coalesce(fields.hour.placeholder[_key == $locale][0].value, fields.hour.placeholder[_key == "en"][0].value),
      "description": coalesce(fields.hour.description[_key == $locale][0].value, fields.hour.description[_key == "en"][0].value)
    },
    "stayDuration": {
      "label": coalesce(fields.stayDuration.label[_key == $locale][0].value, fields.stayDuration.label[_key == "en"][0].value),
      "placeholder": coalesce(fields.stayDuration.placeholder[_key == $locale][0].value, fields.stayDuration.placeholder[_key == "en"][0].value),
      "description": coalesce(fields.stayDuration.description[_key == $locale][0].value, fields.stayDuration.description[_key == "en"][0].value)
    },
    "gender": {
      "label": coalesce(fields.gender.label[_key == $locale][0].value, fields.gender.label[_key == "en"][0].value),
      "placeholder": coalesce(fields.gender.placeholder[_key == $locale][0].value, fields.gender.placeholder[_key == "en"][0].value),
      "description": coalesce(fields.gender.description[_key == $locale][0].value, fields.gender.description[_key == "en"][0].value)
    },
    "age": {
      "label": coalesce(fields.age.label[_key == $locale][0].value, fields.age.label[_key == "en"][0].value),
      "placeholder": coalesce(fields.age.placeholder[_key == $locale][0].value, fields.age.placeholder[_key == "en"][0].value),
      "description": coalesce(fields.age.description[_key == $locale][0].value, fields.age.description[_key == "en"][0].value)
    },
    "nationality": {
      "label": coalesce(fields.nationality.label[_key == $locale][0].value, fields.nationality.label[_key == "en"][0].value),
      "placeholder": coalesce(fields.nationality.placeholder[_key == $locale][0].value, fields.nationality.placeholder[_key == "en"][0].value),
      "description": coalesce(fields.nationality.description[_key == $locale][0].value, fields.nationality.description[_key == "en"][0].value)
    },
    "phone": {
      "label": coalesce(fields.phone.label[_key == $locale][0].value, fields.phone.label[_key == "en"][0].value),
      "placeholder": coalesce(fields.phone.placeholder[_key == $locale][0].value, fields.phone.placeholder[_key == "en"][0].value),
      "description": coalesce(fields.phone.description[_key == $locale][0].value, fields.phone.description[_key == "en"][0].value)
    },
    "name": {
      "label": coalesce(fields.name.label[_key == $locale][0].value, fields.name.label[_key == "en"][0].value),
      "placeholder": coalesce(fields.name.placeholder[_key == $locale][0].value, fields.name.placeholder[_key == "en"][0].value),
      "description": coalesce(fields.name.description[_key == $locale][0].value, fields.name.description[_key == "en"][0].value)
    },
    "email": {
      "label": coalesce(fields.email.label[_key == $locale][0].value, fields.email.label[_key == "en"][0].value),
      "placeholder": coalesce(fields.email.placeholder[_key == $locale][0].value, fields.email.placeholder[_key == "en"][0].value),
      "description": coalesce(fields.email.description[_key == $locale][0].value, fields.email.description[_key == "en"][0].value)
    },
    "message": {
      "label": coalesce(fields.message.label[_key == $locale][0].value, fields.message.label[_key == "en"][0].value),
      "placeholder": coalesce(fields.message.placeholder[_key == $locale][0].value, fields.message.placeholder[_key == "en"][0].value),
      "description": coalesce(fields.message.description[_key == $locale][0].value, fields.message.description[_key == "en"][0].value)
    }
  }
}`)

export const contactTypeSlugsQuery = defineQuery(
  `*[_type == "contactType"]{ slug }`
)

// =============================================================================
// LEGAL NOTICE
// =============================================================================

export const legalNoticeQuery = defineQuery(`*[_type == "legalNotice"][0]{
  _id,
  _type,
  "title": coalesce(title[_key == $locale][0].value, title[_key == "en"][0].value),
  lastUpdated,
  "content": coalesce(content[_key == $locale][0].value, content[_key == "en"][0].value)
}`)

// =============================================================================
// TAXONOMY QUERIES
// =============================================================================

export const galleryCategoriesQuery =
  defineQuery(`*[_type == "galleryCategory"] | order(orderRank){
  _id,
  "key": key.current,
  "label": coalesce(label[_key == $locale][0].value, label[_key == "en"][0].value),
  orderRank,
  image{
    asset->{
      _id,
      url,
      "dimensions": metadata.dimensions,
      "lqip": metadata.lqip
    },
    hotspot,
    crop
  }
}`)

export const amenityCategoriesQuery =
  defineQuery(`*[_type == "amenityCategory"] | order(orderRank){
  _id,
  "key": key.current,
  "label": coalesce(label[_key == $locale][0].value, label[_key == "en"][0].value),
  orderRank
}`)

export const amenitiesQuery = defineQuery(`*[_type == "amenity"]{
  _id,
  "key": key.current,
  "label": coalesce(label[_key == $locale][0].value, label[_key == "en"][0].value),
  icon,
  "category": category->{
    "key": key.current,
    "label": coalesce(label[_key == $locale][0].value, label[_key == "en"][0].value),
    orderRank
  }
} | order(category.orderRank, label asc)`)

export const pricingCategoriesQuery =
  defineQuery(`*[_type == "pricingCategory"] | order(orderRank){
  _id,
  "slug": slug.current,
  "title": coalesce(title[_key == $locale][0].value, title[_key == "en"][0].value),
  orderRank
}`)
