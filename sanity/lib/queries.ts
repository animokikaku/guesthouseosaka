import { defineQuery } from 'next-sanity'

// Helper for localized field fallback pattern
// Usage: ${l('fieldName')} => coalesce(fieldName[_key == $locale][0].value, fieldName[_key == "en"][0].value)
const l = (field: string) =>
  `coalesce(${field}[_key == $locale][0].value, ${field}[_key == "en"][0].value)`

// =============================================================================
// GLOBAL SETTINGS
// =============================================================================

export const settingsQuery = defineQuery(`*[_type == "settings"][0]{
  _id,
  "siteName": ${l('siteName')},
  "companyName": ${l('companyName')},
  "socialLinks": socialLinks[]{
    _key,
    platform,
    url
  }
}`)

// =============================================================================
// HOME PAGE
// =============================================================================

export const homePageQuery = defineQuery(`*[_type == "homePage"][0]{
  _id,
  _type,
  "title": ${l('title')},
  "hero": hero{
    "title": ${l('title')},
    "description": ${l('description')},
    "ctaLabel": ${l('ctaLabel')}
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
    "alt": ${l('alt')},
    "preview": asset->metadata.lqip
  },
  "collection": collection{
    "title": ${l('title')},
    "description": ${l('description')}
  },
  "houses": houses[]{
    _key,
    ...@->{
      _id,
      slug,
      "title": ${l('title')},
      "description": ${l('description')},
      "caption": ${l('caption')},
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
        "alt": ${l('alt')},
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
  "title": ${l('title')},
  "description": ${l('description')},
  "caption": ${l('caption')},
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
    "alt": ${l('alt')}
  },

  // About Section
  "about": about{
    "description": ${l('description')},
    "highlights": highlights[]{
      _key,
      "text": ${l('text')}
    }
  },

  // Gallery with categories
  "gallery": gallery[]{
    _key,
    "image": image{
      asset->{
        _id,
        url,
        "dimensions": metadata.dimensions,
        "lqip": metadata.lqip
      },
      hotspot,
      crop,
      "alt": ${l('alt')}
    },
    "category": category->{
      "key": key.current,
      "label": ${l('label')},
      order
    }
  } | order(category.order asc),

  // Amenities with categories
  "amenities": amenities[]{
    _key,
    featured,
    note,
    "label": coalesce(
      customLabel[_key == $locale][0].value,
      amenity->label[_key == $locale][0].value,
      amenity->label[_key == "en"][0].value
    ),
    "icon": amenity->icon,
    "amenityKey": amenity->key.current,
    "category": amenity->category->{
      "key": key.current,
      "label": ${l('label')},
      order
    }
  } | order(category.order asc),

  // Location
  "location": location{
    "highlight": ${l('highlight')},
    coordinates,
    googleMapsUrl,
    placeId,
    address,
    "stations": stations[]{
      _key,
      "name": ${l('name')},
      "lines": ${l('lines')},
      "exit": ${l('exit')},
      walkMinutes
    },
    "nearby": nearby[]{
      _key,
      "description": ${l('description')}
    }
  },

  // Pricing
  "pricing": pricing{
    "rows": rows[]{
      _key,
      "label": ${l('label')},
      "values": ${l('values')}
    },
    "notes": notes[]{
      _key,
      "title": ${l('title')},
      "items": items[]{
        _key,
        "text": ${l('text')}
      }
    }
  }
}`)

// House slugs for static generation
export const houseSlugsQuery = defineQuery(`*[_type == "house" && defined(slug)]{
  "slug": slug
}`)

// =============================================================================
// FAQ PAGE
// =============================================================================

export const faqPageQuery = defineQuery(`*[_type == "faqPage"][0]{
  _id,
  _type,
  "title": ${l('title')},
  "description": ${l('description')},
  "items": items[]{
    _key,
    "question": ${l('question')},
    answer
  },
  "contactTitle": ${l('contactTitle')},
  "contactDescription": ${l('contactDescription')}
}`)

// =============================================================================
// CONTACT PAGE
// =============================================================================

export const contactPageQuery = defineQuery(`*[_type == "contactPage"][0]{
  _id,
  _type,
  "title": ${l('title')},
  "description": ${l('description')},
  "contactTypes": contactTypes[]{
    _key,
    key,
    "title": ${l('title')},
    "description": ${l('description')}
  }
}`)

// =============================================================================
// TAXONOMY QUERIES
// =============================================================================

export const galleryCategoriesQuery = defineQuery(`*[_type == "galleryCategory"] | order(order asc){
  _id,
  "key": key.current,
  "label": ${l('label')},
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
  "label": ${l('label')},
  order
}`)

export const amenitiesQuery = defineQuery(`*[_type == "amenity"]{
  _id,
  "key": key.current,
  "label": ${l('label')},
  icon,
  "category": category->{
    "key": key.current,
    "label": ${l('label')},
    order
  }
} | order(category.order asc, label asc)`)
