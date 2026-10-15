// @vitest-environment node

import { renderToStaticMarkup } from 'react-dom/server'
import { JsonLd } from '../json-ld'

describe('JsonLd', () => {
  // Structured data carries CMS text, which must not be able to end the script.
  it('cannot be closed early by the content it carries', () => {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Osaka</script><script>alert(1)</script>'
    } as const

    const html = renderToStaticMarkup(<JsonLd data={data} />)
    const body = html.slice(html.indexOf('>') + 1, html.lastIndexOf('</script>'))

    expect(html.match(/<\/script>/g)).toHaveLength(1)
    expect(JSON.parse(body)).toEqual(data)
  })
})
