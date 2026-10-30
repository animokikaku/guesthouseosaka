import { SANITY_STUDIO_HOSTS } from '@/lib/config'

/**
 * What the zone's HSTS leaves out: no MIME sniffing, and only the site itself
 * and the Studios' Presentation tool (hosted, in the Sanity dashboard, or
 * `sanity dev`) may frame its pages. Browsers already default to the
 * `strict-origin-when-cross-origin` referrer policy. Static assets get
 * `nosniff` from a zone Transform Rule (see docs/architecture.md).
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

/** `response` with the security headers, as a copy: one passed through from `fetch` has immutable headers. */
export function withSecurityHeaders(response: Response) {
  const secured = new Response(response.body, response)
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) secured.headers.set(name, value)
  return secured
}
