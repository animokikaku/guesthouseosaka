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
    coordinates,
    googleMapsUrl,
    placeId,
    address,
    "details": coalesce(details[_key == $locale][0].value, details[_key == "en"][0].value)
  },

  // Pricing
  "pricing": pricing[]{
    _key,
    "label": coalesce(label[_key == $locale][0].value, label[_key == "en"][0].value),
    "content": coalesce(content[_key == $locale][0].value, content[_key == "en"][0].value)
  }
}`)

// House slugs for static generation
export const houseSlugsQuery = defineQuery(`*[_type == "house" && defined(slug)]{
  "slug": slug
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
export const housesBuildingQuery = defineQuery(`*[_type == "house"] | order(slug asc){
  _id,
  _type,
  slug,
  "title": coalesce(title[_key == $locale][0].value, title[_key == "en"][0].value),
  "building": building{
    rooms,
    floors
  },
  phone
}`)

// =============================================================================
// FAQ PAGE
// =============================================================================

export const faqPageQuery = defineQuery(`*[_type == "faqPage"][0]{
  _id,
  _type,
  "header": coalesce(header[_key == $locale][0].value, header[_key == "en"][0].value),
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
  "actions": actions[]{
    _key,
    icon,
    "label": coalesce(label[_key == $locale][0].value, label[_key == "en"][0].value),
    href
  },
  "contactTypes": contactTypes[]{
    _key,
    key,
    "content": coalesce(content[_key == $locale][0].value, content[_key == "en"][0].value)
  }
}`)

export const contactTypeQuery = defineQuery(`*[_type == "contactPage"][0].contactTypes[key == $type][0]{
  "content": coalesce(content[_key == $locale][0].value, content[_key == "en"][0].value)
}`)

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

export const galleryCategoriesQuery = defineQuery(`*[_type == "galleryCategory"] | order(order asc){
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

export const amenityCategoriesQuery = defineQuery(`*[_type == "amenityCategory"] | order(order asc){
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
