import { LOCALE_COOKIE, localeToPrefix, prefixToLocale } from '@/i18n/routing'
import { negotiateLocale, resolveLegacyRedirect } from '@/lib/redirects'
import { createCsrfMiddleware, createMiddleware, createStart } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'

/** A redirect with a relative `Location`, as Next sent them. */
function redirectTo(url: URL, pathname: string, status: 307 | 308) {
  return new Response(null, { status, headers: { Location: pathname + url.search } })
}

/** Paths the locale prefix never applies to: endpoints, the Studio and files. */
function isUnlocalized(pathname: string) {
  return /^\/(?:api|studio|_|@)/.test(pathname) || pathname.split('/').at(-1)?.includes('.')
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

  if (isUnlocalized(pathname)) return next()

  const [, prefix = '', ...rest] = pathname.split('/')
  if (prefixToLocale(prefix)) return next()

  // A known locale in the wrong case (`/zh-CN/faq`) keeps its path.
  const casedLocale = prefixToLocale(prefix.toLowerCase())
  if (casedLocale) {
    return redirectTo(url, ['', localeToPrefix(casedLocale), ...rest].join('/'), 308)
  }

  const locale = negotiateLocale(request.headers.get('accept-language'), getCookie(LOCALE_COOKIE))
  return redirectTo(url, `/${localeToPrefix(locale)}${pathname === '/' ? '' : pathname}`, 307)
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
