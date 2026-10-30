import { LOCALE_COOKIE, localeToPrefix, prefixToLocale } from '@/i18n/routing'
import { SANITY_STUDIO_HOSTS } from '@/lib/config'
import { env } from '@/lib/env'
import { negotiateLocale, resolveLegacyRedirect } from '@/lib/redirects'
import { createCsrfMiddleware, createMiddleware, createStart } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'

/** A redirect with a relative `Location`, which keeps whichever host served the request. */
function redirectTo(url: URL, pathname: string, status: 307 | 308) {
  return new Response(null, { status, headers: { Location: pathname + url.search } })
}

/**
 * Sends `/studio` to the hosted Studio editing this build's dataset. The
 * Studio is served from its host's root, so the embedded Studio's deep links
 * (`/studio/structure/faq`) carry over without the prefix. Robots are kept out
 * (see `lib/robots.ts`).
 */
function redirectToStudio(url: URL) {
  const dataset = env.VITE_SANITY_DATASET
  const studio = new URL(
    url.pathname.replace(/^\/studio/, '') + url.search,
    `https://${SANITY_STUDIO_HOSTS[dataset]}.sanity.studio`
  )
  // The development Studio opens on the build that sent the editor there, a
  // Worker Preview or the dev server, rather than its default preview.
  if (dataset === 'development' && url.pathname === '/studio') {
    studio.pathname = '/presentation'
    studio.searchParams.set('preview', `${url.origin}/`)
  }
  return new Response(null, {
    status: 307,
    headers: { Location: studio.toString(), 'X-Robots-Tag': 'noindex, nofollow' }
  })
}

/**
 * Paths the locale prefix never applies to: endpoints (`/api/…`, server
 * functions under `/_serverFn/…`, Vite's `/@…` in dev) and files.
 */
function isUnlocalized(pathname: string) {
  return /^\/(?:api(?:\/|$)|_|@)/.test(pathname) || pathname.split('/').at(-1)?.includes('.')
}

/**
 * Answers legacy URLs, trailing slashes, `/studio` and unprefixed paths with a
 * redirect before routing; an unprefixed path goes to the visitor's language.
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

/**
 * What the zone's HSTS leaves out: no MIME sniffing, and only the site itself
 * and the Studios' Presentation tool (hosted, in the Sanity dashboard, or
 * `sanity dev`) may frame its pages. Browsers already default to the
 * `strict-origin-when-cross-origin` referrer policy.
 */
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Content-Security-Policy': `frame-ancestors ${[
    "'self'",
    ...Object.values(SANITY_STUDIO_HOSTS).map((host) => `https://${host}.sanity.studio`),
    'https://www.sanity.io',
    'http://localhost:3333'
  ].join(' ')}`
}

const securityHeadersMiddleware = createMiddleware().server(async ({ next }) => {
  const { response } = await next()
  // A copy, since a response passed through from `fetch` has immutable headers.
  const secured = new Response(response.body, response)
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) secured.headers.set(name, value)
  return secured
})

export const startInstance = createStart(() => ({
  requestMiddleware: [
    securityHeadersMiddleware,
    createCsrfMiddleware({ filter: (ctx) => ctx.handlerType === 'serverFn' }),
    routingMiddleware
  ]
}))
