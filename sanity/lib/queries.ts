import { defineQuery } from 'next-sanity'

export const homePageQuery =
  defineQuery(`*[_type == "homePage" && locale == $locale][0]{
  title,
  heroTitle,
  heroDescription,
  heroCtaLabel,
  "galleryWall": galleryWall->images[] {
    _key,
    image,
    "alt": coalesce(alt[_key == $locale][0].value, alt[_key == "en"][0].value),
    "lqip": image.asset->metadata.lqip
  },
  "collection": collection->images[] {
    _key,
    house-> {
      slug,
      "title": coalesce(title[_key == $locale][0].value, title[_key == "en"][0].value),
      "description": coalesce(description[_key == $locale][0].value, description[_key == "en"][0].value)
    },
    image,
    "lqip": image.asset->metadata.lqip
  },
  housesTitle,
  housesDescription,
}`)
