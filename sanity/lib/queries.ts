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
  "socialLinks": socialLinks[]{
    _key,
    platform,
    icon,
    url
  }
}`)

// =============================================================================
// HOME PAGE
// =============================================================================

export const homePageQuery = defineQuery(`*[_type == "homePage"][0]{
  _id,
  _type,
  "hero": hero{
    "content": coalesce(content[_key == $locale][0].value, content[_key == "en"][0].value),
    "ctaLabel": coalesce(ctaLabel[_key == $locale][0].value, ctaLabel[_key == "en"][0].value)
  },
  "galleryWall": galleryWall[]{
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
  },
  "collection": collection{
    "content": coalesce(content[_key == $locale][0].value, content[_key == "en"][0].value)
  },
  "houses": houses[]{
    _key,
    ...@->{
      _id,
      slug,
      "title": coalesce(title[_key == $locale][0].value, title[_key == "en"][0].value),
      "description": coalesce(description[_key == $locale][0].value, description[_key == "en"][0].value),
      "caption": coalesce(caption[_key == $locale][0].value, caption[_key == "en"][0].value),
      building,
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

  // Gallery as flat list (grouped by category on frontend for drag-and-drop reordering)
  "gallery": gallery[]{
    _key,
    "image": image{
      asset,
      hotspot,
      crop,
      "alt": coalesce(alt[_key == $locale][0].value, alt[_key == "en"][0].value),
      "preview": asset->metadata.lqip
    },
    "category": category->{
      _id,
      "key": key.current,
      "label": coalesce(label[_key == $locale][0].value, label[_key == "en"][0].value),
      order
    }
  },

  // Amenities as flat list (grouped by category on frontend for drag-and-drop reordering)
  "amenities": amenities[]{
    _key,
    note,
    featured,
    "label": coalesce(
      customLabel[_key == $locale][0].value,
      amenity->label[_key == $locale][0].value,
      amenity->label[_key == "en"][0].value
    ),
    "icon": amenity->icon,
    "category": amenity->category->{
      _id,
      "key": key.current,
      "label": coalesce(label[_key == $locale][0].value, label[_key == "en"][0].value),
      icon,
      order
    }
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
  "pricing": pricing[]{
    _key,
    "label": coalesce(label[_key == $locale][0].value, label[_key == "en"][0].value),
    "content": coalesce(content[_key == $locale][0].value, content[_key == "en"][0].value)
  }
}`)

// House slugs for static generation
export const houseSlugsQuery =
  defineQuery(`*[_type == "house" && defined(slug)]{
  "slug": slug
}`)

// House titles for forms (ordered by home page houses array)
export const housesTitlesQuery =
  defineQuery(`*[_type == "homePage"][0].houses[]->{
  "slug": slug,
  "title": coalesce(title[_key == $locale][0].value, title[_key == "en"][0].value)
}`)

// Houses for navigation (header) - ordered by home page houses array
export const housesNavQuery = defineQuery(`*[_type == "homePage"][0].houses[]->{
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

// All houses building and contact data (for FAQ page)
export const housesBuildingQuery =
  defineQuery(`*[_type == "homePage"][0].houses[]->{
  _id,
  _type,
  slug,
  "title": coalesce(title[_key == $locale][0].value, title[_key == "en"][0].value),
  "building": building{
    rooms,
    floors
  },
  phone,
  "extraCosts": extraCosts[]{
    _key,
    category,
    "value": coalesce(value[_key == $locale][0].value, value[_key == "en"][0].value)[]
  }
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
  categoryOrder,
  "actions": actions[]{
    _key,
    icon,
    "label": coalesce(label[_key == $locale][0].value, label[_key == "en"][0].value),
    href
  },
  "items": items[]{
    _key,
    "question": coalesce(question[_key == $locale][0].value, question[_key == "en"][0].value),
    "answer": coalesce(answer[_key == $locale][0].value, answer[_key == "en"][0].value)
  },
  "contactSection": coalesce(contactSection[_key == $locale][0].value, contactSection[_key == "en"][0].value),
  "contactNote": coalesce(contactNote[_key == $locale][0].value, contactNote[_key == "en"][0].value)
}`)

// =============================================================================
// CONTACT PAGE
// =============================================================================

export const contactPageQuery = defineQuery(`*[_type == "contactPage"][0]{
  _id,
  _type,
  "header": coalesce(header[_key == $locale][0].value, header[_key == "en"][0].value),
  "metaTitle": coalesce(metaTitle[_key == $locale][0].value, metaTitle[_key == "en"][0].value),
  "metaDescription": coalesce(metaDescription[_key == $locale][0].value, metaDescription[_key == "en"][0].value),
  "actions": actions[]{
    _key,
    icon,
    "label": coalesce(label[_key == $locale][0].value, label[_key == "en"][0].value),
    href
  },
  "contactTypes": contactTypes[]{
    _key,
    ...@->{
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
  }
}`)

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
  defineQuery(`*[_type == "galleryCategory"] | order(order asc){
  _id,
  "key": key.current,
  "label": coalesce(label[_key == $locale][0].value, label[_key == "en"][0].value),
  order,
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
  defineQuery(`*[_type == "amenityCategory"] | order(order asc){
  _id,
  "key": key.current,
  "label": coalesce(label[_key == $locale][0].value, label[_key == "en"][0].value),
  order
}`)

export const amenitiesQuery = defineQuery(`*[_type == "amenity"]{
  _id,
  "key": key.current,
  "label": coalesce(label[_key == $locale][0].value, label[_key == "en"][0].value),
  icon,
  "category": category->{
    "key": key.current,
    "label": coalesce(label[_key == $locale][0].value, label[_key == "en"][0].value),
    order
  }
} | order(category.order asc, label asc)`)
