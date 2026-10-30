// @vitest-environment node

import { robotsTxt } from '../robots'

describe('robots.txt', () => {
  const lines = robotsTxt().split('\n')

  it('lets crawlers in, except into the Studio', () => {
    expect(lines).toEqual(expect.arrayContaining(['User-Agent: *', 'Disallow: /studio']))
  })

  it('points crawlers at the sitemap on the canonical origin', () => {
    expect(lines).toContain('Sitemap: https://guesthouseosaka.test/sitemap.xml')
  })
})
