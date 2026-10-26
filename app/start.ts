import { LOCALE_COOKIE, localeToPrefix, prefixToLocale } from '@/i18n/routing'
import { SANITY_STUDIO_HOSTS } from '@/lib/config'
import { env } from '@/lib/env'
import { negotiateLocale, resolveLegacyRedirect } from '@/lib/redirects'
import { createCsrfMiddleware, createMiddleware, createStart } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'

/** A redirect with a relative `Location`, as Next sent them. */
function redirectTo(url: URL, pathname: string, status: 307 | 308) {
  return new Response(null, { status, headers: { Location: pathname + url.search } })
}

/**
 * Sends `/studio` to the hosted Studio editing this build's dataset. The
 * Studio keeps the `/studio` base path the embedded one had, so deep links
 * carry over. Robots are kept out (see `app/robots.ts`).
 */
function redirectToStudio(url: URL) {
  const dataset = env.VITE_SANITY_DATASET
  const studio = new URL(
    url.pathname + url.search,
    `https://${SANITY_STUDIO_HOSTS[dataset]}.sanity.studio`
  )
  // The development Studio opens on the build that sent the editor there, a
  // Worker Preview or the dev server, rather than its default preview.
  if (dataset === 'development' && url.pathname === '/studio') {
    studio.pathname = '/studio/presentation'
    studio.searchParams.set('preview', `${url.origin}/`)
  }
  return new Response(null, {
    status: 307,
    headers: { Location: studio.toString(), 'X-Robots-Tag': 'noindex, nofollow' }
  })
}

/** Paths the locale prefix never applies to: endpoints and files. */
function isUnlocalized(pathname: string) {
  return /^\/(?:api|_|@)/.test(pathname) || pathname.split('/').at(-1)?.includes('.')
}

/**
 * Answers legacy URLs and unprefixed paths with a redirect before routing,
 * as `next.config.ts` redirects and next-intl's middleware did.
 */
const routingMiddleware = createMiddleware().server(({ request, next }) => {
  const url = new URL(request.url)
  const { pathname } = url

  if (pathname.length > 1 && pathname.endsWith('/')) {
    return redirectTo(url, pathname.slice(0, -1), 308)
  }

  const legacy = resolveLegacyRedirect(pathname)
  if (legacy) return redirectTo(url, legacy, 308)

  if (pathname === '/studio' || pathname.startsWith('/studio/')) return redirectToStudio(url)

  if (isUnlocalized(pathname)) return next()

  const [, prefix = '', ...rest] = pathname.split('/')
  if (prefixToLocale(prefix)) return next()

  // A known locale in the wrong case (`/zh-CN/faq`) keeps its path.
  const casedLocale = prefixToLocale(prefix.toLowerCase())
  if (casedLocale) {
    return redirectTo(url, ['', localeToPrefix(casedLocale), ...rest].join('/'), 308)
  }

  const locale = negotiateLocale(request.headers.get('accept-language'), getCookie(LOCALE_COOKIE))
  const negotiated = redirectTo(
    url,
    `/${localeToPrefix(locale)}${pathname === '/' ? '' : pathname}`,
    307
  )
  // Depends on headers the cache key leaves out, so it must never be shared.
  negotiated.headers.set('Cache-Control', 'no-store')
  return negotiated
})

const testProxyMiddleware = createMiddleware().server(async ({ request, next }) => {
  if (!__E2E_TEST_PROXY__) return next()

  const { withTestProxy } = await import('@/lib/test-proxy.server')
  return withTestProxy(request, next)
})

export const startInstance = createStart(() => ({
  requestMiddleware: [
    createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === 'serverFn' }),
    routingMiddleware,
    testProxyMiddleware
  ]
}))
