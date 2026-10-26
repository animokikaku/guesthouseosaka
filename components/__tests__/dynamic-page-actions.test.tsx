import { routerState } from '@/lib/__tests__/utils/router'
import { render, screen } from '@testing-library/react'
import { DynamicPageActions } from '../dynamic-page-actions'

// The action sits on the FAQ page.
beforeEach(() => {
  routerState.pathname = '/en/faq'
})

const action = (key: string, label: string, href: string) => ({
  _key: key,
  label,
  href,
  icon: 'phone'
})

function renderActions(actions: ReturnType<typeof action>[] | null) {
  return render(
    <DynamicPageActions documentId="faqPage" documentType="faqPage" actions={actions} />
  )
}

describe('DynamicPageActions', () => {
  it('turns each CMS action into a link, in order', () => {
    renderActions([action('a', 'Call us', '#phone'), action('b', 'Contact', '/contact')])

    expect(screen.getAllByRole('link').map((link) => link.textContent)).toEqual([
      'Call us',
      'Contact'
    ])
  })

  it.each([
    ['a site path', '/contact', '/en/contact'],
    ['a path with a section', '/faq#phone', '/en/faq#phone'],
    // An anchor alone targets the page the action is on.
    ['a bare anchor', '#phone', '/en/faq#phone']
  ])('localizes %s', (_name, href, expected) => {
    renderActions([action('a', 'Go', href)])

    expect(screen.getByRole('link', { name: 'Go' })).toHaveAttribute('href', expected)
  })

  it.each(['https://line.me/R/ti/p/@guesthouse', 'http://example.com'])(
    'opens %s in a new tab without handing over the page',
    (href) => {
      renderActions([action('a', 'Away', href)])

      const link = screen.getByRole('link', { name: 'Away' })
      expect(link).toHaveAttribute('href', href)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    }
  )

  it('tags each action for visual editing', () => {
    renderActions([action('call', 'Call us', '#phone')])

    expect(screen.getByRole('link').getAttribute('data-sanity')).toContain('path=actions:call')
  })

  it.each([null, []])('renders nothing without actions (%j)', (actions) => {
    const { container } = renderActions(actions)

    expect(container).toBeEmptyDOMElement()
  })
})
