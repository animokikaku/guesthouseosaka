import { defineQuery } from 'next-sanity'

export const homePageQuery = defineQuery(`*[_type == "homePage"][0]{
  _id,
  _type,
  "title": coalesce(title[_key == $locale][0].value, title[_key == "en"][0].value),
  "hero": hero{
    "title": coalesce(title[_key == $locale][0].value, title[_key == "en"][0].value),
    "description": coalesce(description[_key == $locale][0].value, description[_key == "en"][0].value),
    "ctaLabel": coalesce(ctaLabel[_key == $locale][0].value, ctaLabel[_key == "en"][0].value)
  },
  "galleryWall": galleryWall[]{
    ...,
    "alt": coalesce(alt[_key == $locale][0].value, alt[_key == "en"][0].value),
    "preview": asset->metadata.lqip
  },
  "collection": collection{
    "title": coalesce(title[_key == $locale][0].value, title[_key == "en"][0].value),
    "description": coalesce(description[_key == $locale][0].value, description[_key == "en"][0].value)
  },
  "houses": houses[]{
    _key,
    ...@->{
      _id,
      slug,
      "title": coalesce(title[_key == $locale][0].value, title[_key == "en"][0].value),
      "description": coalesce(description[_key == $locale][0].value, description[_key == "en"][0].value),
      image{
        ...,
        "alt": coalesce(alt[_key == $locale][0].value, alt[_key == "en"][0].value),
        "preview": asset->metadata.lqip
      }
    }
  }
}`)
