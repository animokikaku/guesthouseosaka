import { render, screen } from '@testing-library/react'
import { DynamicPageActions } from '../dynamic-page-actions'

vi.mock('@/i18n/navigation', () => ({
  usePathname: () => '/faq',
  Link: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode
    href: string | { pathname: string; hash?: string }
  }) => (
    <a href={typeof href === 'string' ? href : `${href.pathname}${href.hash ?? ''}`} {...props}>
      {children}
    </a>
  )
}))

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

  it('keeps a bare anchor on the current page', () => {
    renderActions([action('a', 'Call us', '#phone')])

    expect(screen.getByRole('link', { name: 'Call us' })).toHaveAttribute('href', '/faq#phone')
  })

  it('opens an external link in a new tab without handing over the page', () => {
    renderActions([action('a', 'LINE', 'https://line.me/R/ti/p/@guesthouse')])

    const link = screen.getByRole('link', { name: 'LINE' })
    expect(link).toHaveAttribute('href', 'https://line.me/R/ti/p/@guesthouse')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('tags each action for visual editing', () => {
    renderActions([action('call', 'Call us', '#phone')])

    expect(screen.getByRole('link').getAttribute('data-sanity')).toContain('path=actions:call')
  })

  it.each([null, []])('renders nothing without actions (%j)', (actions) => {
    const { container } = renderActions(actions)

    expect(container).toBeEmptyDOMElement()
  })
})
