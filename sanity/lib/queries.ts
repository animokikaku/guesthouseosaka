import { defineQuery } from 'next-sanity'

export const homePageQuery =
  defineQuery(`*[_type == "homePage" && locale == $locale]{
  title,
  hero {
    title,
    description,
  }
}`)
