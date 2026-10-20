import { defineQuery } from 'next-sanity'

// =============================================================================
// GROQ FRAGMENTS (static only - no dynamic functions for typegen compatibility)
// =============================================================================

// Image fields with asset reference, minus the preview (shared by the two variants below)
const imageBaseFields = /* groq */ `
  asset,
  hotspot,
  crop,
  "alt": coalesce(alt[language == $locale][0].value, alt[language == "en"][0].value)`

// Image fields with asset reference (for Next.js Image component optimization)
const imageRefFields = /* groq */ `${imageBaseFields},
  "preview": asset->metadata.lqip
`

// Wrapped image fragment
const imageFields = /* groq */ `image{${imageRefFields}}`

// Same shape as imageRefFields, minus the LQIP. The base64 preview is ~600 B
// per image — 75% of a gallery item — so lists long enough to matter carry it
// only where a blur placeholder is actually painted.
const leanImageRefFields = /* groq */ `${imageBaseFields},
  "preview": null
`

// Actions array (used in faqPage, contactPage)
const actionsFields = /* groq */ `
  "actions": array::compact(actions[]{
    _key,
    icon,
    "label": coalesce(label[language == $locale][0].value, label[language == "en"][0].value),
    href
  })
`

// One form field's localized label, placeholder and description
const formFieldConfigFields = /* groq */ `{
  "label": coalesce(label[language == $locale][0].value, label[language == "en"][0].value),
  "placeholder": coalesce(placeholder[language == $locale][0].value, placeholder[language == "en"][0].value),
  "description": coalesce(description[language == $locale][0].value, description[language == "en"][0].value)
}`

// Contact form fields projection
const contactFormFields = /* groq */ `
  "fields": {
    "places": fields.places${formFieldConfigFields},
    "date": fields.date${formFieldConfigFields},
    "hour": fields.hour${formFieldConfigFields},
    "stayDuration": fields.stayDuration${formFieldConfigFields},
    "gender": fields.gender${formFieldConfigFields},
    "age": fields.age${formFieldConfigFields},
    "nationality": fields.nationality${formFieldConfigFields},
    "phone": fields.phone${formFieldConfigFields},
    "name": fields.name${formFieldConfigFields},
    "email": fields.email${formFieldConfigFields},
    "message": fields.message${formFieldConfigFields}
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

// Keep metadata separate from the render query so draft-mode stega data
// is resolved independently for pages and galleries.
export const houseMetaQuery = defineQuery(`*[_type == "house" && slug == $slug][0]{
  "title": coalesce(title[language == $locale][0].value, title[language == "en"][0].value),
  "description": coalesce(description[language == $locale][0].value, description[language == "en"][0].value)
}`)

export const houseQuery = defineQuery(`*[_type == "house" && slug == $slug][0]{
  _id,
  _type,
  slug,
  "title": coalesce(title[language == $locale][0].value, title[language == "en"][0].value),
  "description": coalesce(description[language == $locale][0].value, description[language == "en"][0].value),
  building,
  phone,

  // Only read by urlFor for the page's JSON-LD image, so no alt or LQIP
  image{
    asset,
    hotspot,
    crop
  },

  // Featured Image (optional, prepended to gallery grids)
  "featuredImage": select(
    defined(featuredImage.asset) => featuredImage{${imageRefFields}}
  ),

  // About Section
  "about": coalesce(about[language == $locale][0].value, about[language == "en"][0].value),

  // Every gallery image, flattened from the sorted categories, so the mobile
  // hero carousel can swipe the whole set. Lean: these slides lazy-load one at
  // a time behind a swipe, and carrying an LQIP for each would cost more than
  // the rest of the house document put together.
  //
  // The asset filter runs inside the projection, not after it: the consumers
  // drop items that don't resolve to an image, and filtering downstream of a
  // slice would let an unfinished item eat a slot and push a renderable one out.
  "galleryImages": array::compact((galleryCategories | order(category->orderRank))[].items[defined(image.asset)]{
    _key,
    "image": image{${leanImageRefFields}}
  }),

  // The five tiles ImageBlockGallery paints above the fold, with their LQIP.
  // Five covers the grid whether or not a featured image is prepended to it.
  "galleryPreview": array::compact((galleryCategories | order(category->orderRank))[].items[defined(image.asset)]{
    _key,
    "image": image{${imageRefFields}}
  })[0...5],

  // Total behind the five-tile grid, for its "+N" overflow badge. Counts only
  // items that resolve to a renderable image, matching what the grid drops.
  "galleryImageCount": count(galleryCategories[].items[defined(image.asset)]),

  // Amenities grouped by category (enables per-category drag-and-drop reordering)
  // Filter out empty categories at query level
  "amenityCategories": array::compact(amenityCategories[]{
    _key,
    "category": category->{
      _id,
      "label": coalesce(label[language == $locale][0].value, label[language == "en"][0].value),
      icon
    },
    "items": array::compact(items[]{
      _key,
      note,
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

  // Room availability; _updatedAt dates the list on the page
  _updatedAt,
  "rooms": rooms[]{
    _key,
    number,
    availableFrom,
    style,
    size,
    rent
  },

  // Pricing
  "pricing": array::compact(pricing[]{
    _key,
    "label": coalesce(label[language == $locale][0].value, label[language == "en"][0].value),
    "content": coalesce(content[language == $locale][0].value, content[language == "en"][0].value)
  })
}`)

// Gallery grouped by category, for the gallery page and its intercepting modal.
// Kept out of houseQuery: the two sets are the same images, and no route needs
// both. Sorted by category orderRank, with empty categories filtered out.
export const houseGalleryQuery = defineQuery(`*[_type == "house" && slug == $slug][0]{
  _id,
  _type,
  "title": coalesce(title[language == $locale][0].value, title[language == "en"][0].value),
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
  })[count(items) > 0] | order(category.orderRank)
}`)

// House titles for the contact forms and the house page's HousesNav (ordered by global orderRank)
export const housesTitlesQuery = defineQuery(`*[_type == "house"] | order(orderRank){
  slug,
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

// Houses and their rooms for the LINE bot. Fetched with the `raw` perspective so
// drafts come along: a room update is copied to the draft too, or publishing it
// would undo the update. Release versions are left alone.
export const roomUpdateHousesQuery =
  defineQuery(`*[_type == "house" && !(_id in path("versions.**"))] | order(orderRank){
  _id,
  slug,
  "titles": title[]{ language, value },
  "rooms": rooms[]{ _key, number, availableFrom }
}`)

// The LINE bot's sender, by the ID the bot gave their document. Fetched with the
// `raw` perspective, so the draft of someone not approved yet doesn't match.
export const lineManagerQuery = defineQuery(
  `*[_type == "lineManager" && _id == $id][0]{ "houses": houses[]._ref }`
)

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

// Keep metadata separate from the render query so draft-mode stega data
// is resolved independently for the layout and page.
export const faqPageMetaQuery = defineQuery(`*[_type == "faqPage"][0]{
  "metaTitle": coalesce(metaTitle[language == $locale][0].value, metaTitle[language == "en"][0].value),
  "metaDescription": coalesce(metaDescription[language == $locale][0].value, metaDescription[language == "en"][0].value)
}`)

export const faqPageQuery = defineQuery(`*[_type == "faqPage"][0]{
  _id,
  _type,
  "header": coalesce(header[language == $locale][0].value, header[language == "en"][0].value),
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
  // No form field config here: the only consumer is toContactNavItems, which
  // reads _id/slug/title. contactTypeQuery carries the fields for the one
  // contact type actually being rendered as a form.
  "contactTypes": *[_type == "contactType"] | order(orderRank){
    _id,
    slug,
    "title": coalesce(title[language == $locale][0].value, title[language == "en"][0].value)
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
  "title": coalesce(title[language == $locale][0].value, title[language == "en"][0].value)
}`)
