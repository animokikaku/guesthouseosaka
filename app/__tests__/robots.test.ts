// @vitest-environment node

import robots from '../robots'

describe('robots.txt', () => {
  it('lets crawlers in and points them at the sitemap', () => {
    expect(robots()).toEqual({
      rules: { userAgent: '*', allow: '/' },
      sitemap: 'https://guesthouseosaka.test/sitemap.xml'
    })
  })
})
