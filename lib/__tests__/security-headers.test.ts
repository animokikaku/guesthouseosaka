// @vitest-environment node

import { withSecurityHeaders } from '../security-headers'

describe('withSecurityHeaders', () => {
  it('forbids MIME sniffing', () => {
    const response = withSecurityHeaders(new Response('ok'))
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff')
  })

  // Presentation previews the site in an iframe of the Studio.
  it('lets only the site and the Studios frame its pages', () => {
    const policy = withSecurityHeaders(new Response('ok')).headers.get('Content-Security-Policy')
    expect(policy).toMatch(/^frame-ancestors 'self' /)
    expect(policy).toContain('https://guesthouseosaka.sanity.studio')
    expect(policy).toContain('https://guesthouseosaka-dev.sanity.studio')
    expect(policy).not.toContain('*')
  })

  // A redirect's headers are immutable, like those of a response from `fetch`.
  it('keeps a response whose headers are immutable as it was', async () => {
    const response = withSecurityHeaders(Response.redirect('https://guesthouseosaka.test/en', 308))
    expect(response.status).toBe(308)
    expect(response.headers.get('Location')).toBe('https://guesthouseosaka.test/en')
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff')
  })
})
