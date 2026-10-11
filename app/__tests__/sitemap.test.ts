// @vitest-environment node

vi.mock('@/lib/env', () => ({
  env: {
    NEXT_PUBLIC_APP_URL: 'https://guesthouseosaka.example'
  }
}))

vi.mock('@/i18n/navigation', async () => {
  const { routing } = await import('@/i18n/routing')
  const { localePrefix } = routing
  const prefixes: Partial<Record<string, string>> =
    typeof localePrefix === 'object' && 'prefixes' in localePrefix
      ? (localePrefix.prefixes ?? {})
      : {}

  return {
    getPathname: ({
      href,
      locale
    }: {
      href: string | { pathname: string; params?: Record<string, string> }
      locale: string
    }) => {
      let pathname = typeof href === 'string' ? href : href.pathname

      if (typeof href !== 'string' && href.params) {
        for (const [key, value] of Object.entries(href.params)) {
          pathname = pathname.replace(`[${key}]`, value)
        }
      }

      return `${prefixes[locale] ?? `/${locale}`}${pathname === '/' ? '' : pathname}`
    }
  }
})

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
        ja: expect.stringContaining('/ja'),
        'zh-CN': expect.stringContaining('/zh-cn'),
        'zh-TW': expect.stringContaining('/zh-tw')
      })
    }
  })

  it('interpolates parameters in dynamic route URLs', () => {
    const entries = sitemap()
    const urls = entries.flatMap((entry) => [
      entry.url,
      ...Object.values(entry.alternates?.languages ?? {})
    ])

    expect(entries).toContainEqual(
      expect.objectContaining({ url: 'https://guesthouseosaka.example/en/orange' })
    )
    expect(urls.join('\n')).not.toContain('[')
  })
})
