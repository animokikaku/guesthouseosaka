import { defineQuery } from 'next-sanity'

export const homePageQuery =
  defineQuery(`*[_type == "homePage" && locale == $locale][0]{
  title,
  heroTitle,
  heroDescription,
  heroCtaLabel,
  housesTitle,
  housesDescription,
}`)
