// @vitest-environment node

import { resolvePageActionHref } from '../page-action-href'

describe('resolvePageActionHref', () => {
  it.each([
    [
      'an https URL',
      'https://line.me/R/ti/p/@guesthouse',
      { external: true, href: 'https://line.me/R/ti/p/@guesthouse' }
    ],
    ['an http URL', 'http://example.com', { external: true, href: 'http://example.com' }],
    ['a site path', '/contact', { external: false, pathname: '/contact' }],
    ['a path with a section', '/faq#phone', { external: false, pathname: '/faq', hash: '#phone' }],
    // An anchor alone targets the page the action is on.
    ['a bare anchor', '#phone', { external: false, pathname: '/faq', hash: '#phone' }]
  ])('resolves %s', (_name, href, expected) => {
    expect(resolvePageActionHref(href, '/faq')).toEqual(expected)
  })
})
