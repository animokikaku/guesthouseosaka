vi.mock('@/lib/env', () => ({
  env: {
    NEXT_PUBLIC_APP_URL: 'https://guesthouseosaka.example'
  }
}))

vi.mock('@/i18n/navigation', () => ({
  getPathname: ({ href, locale }: { href: string | { pathname: string }; locale: string }) => {
    const pathname = typeof href === 'string' ? href : href.pathname
    return `/${locale}${pathname === '/' ? '' : pathname}`
  }
}))

import sitemap, { routes } from '../sitemap'

describe('sitemap', () => {
  it('omits lastModified when no content modification date is available', () => {
    const entries = sitemap()

    expect(entries).toHaveLength(routes.length)
    expect(entries.every((entry) => entry.lastModified === undefined)).toBe(true)
  })

  it('includes every locale as an alternate for each route', () => {
    const entries = sitemap()

    for (const entry of entries) {
      expect(entry.alternates?.languages).toEqual({
        en: expect.stringContaining('/en'),
        fr: expect.stringContaining('/fr'),
        ja: expect.stringContaining('/ja')
      })
    }
  })
})
