import { defineQuery } from 'next-sanity'

export const homePageQuery =
  defineQuery(`*[_type == "homePage" && locale == $locale][0]{
  title,
  hero {
    title,
    description,
  }
}`)
