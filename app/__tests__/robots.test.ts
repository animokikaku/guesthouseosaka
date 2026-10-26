// @vitest-environment node

import robots from '../robots'

describe('robots.txt', () => {
  it('lets crawlers in, except into the Studio, and points them at the sitemap', () => {
    expect(robots()).toEqual({
      rules: { userAgent: '*', allow: '/', disallow: '/studio' },
      sitemap: 'https://guesthouseosaka.test/sitemap.xml'
    })
  })
})
