// @vitest-environment node

import { jsonLdScript } from '../json-ld'

describe('jsonLdScript', () => {
  // Structured data carries CMS text, which must not be able to end the script.
  it('cannot be closed early by the content it carries', () => {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Osaka</script><script>alert(1)</script>'
    } as const

    const { type, children } = jsonLdScript(data)

    expect(type).toBe('application/ld+json')
    expect(children).not.toContain('</script>')
    expect(JSON.parse(children)).toEqual(data)
  })
})
