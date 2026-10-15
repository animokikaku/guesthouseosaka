import type { SettingsQueryResult } from '@/sanity.types'
import { render, screen } from '@testing-library/react'
import { SiteFooter } from '../site-footer'

type Settings = NonNullable<SettingsQueryResult>

const settings: Settings = {
  _id: 'settings',
  _type: 'settings',
  siteName: null,
  siteDescription: null,
  companyName: 'Guest House Osaka Ltd.',
  email: 'info@example.com',
  phone: '+81-6-1234-5678',
  address: null,
  socialLinks: [
    { _key: 'fb', icon: 'facebook', label: 'Facebook', url: 'https://facebook.com/example' },
    {
      _key: 'ig',
      icon: 'instagram',
      label: 'Follow us on Instagram',
      url: 'https://instagram.com/example'
    }
  ]
}

describe('SiteFooter', () => {
  it('credits the company for the given year', () => {
    render(<SiteFooter year={2026} settings={settings} />)

    expect(screen.getByRole('contentinfo')).toHaveTextContent('© 2026 Guest House Osaka Ltd.')
  })

  it('links each social profile in a new tab, named by its label', () => {
    render(<SiteFooter year={2026} settings={settings} />)

    const instagram = screen.getByRole('link', { name: 'Follow us on Instagram' })
    expect(instagram).toHaveAttribute('href', 'https://instagram.com/example')
    expect(instagram).toHaveAttribute('target', '_blank')
    expect(instagram).toHaveAttribute('rel', 'noopener noreferrer')
    expect(instagram.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('tags each link for visual editing', () => {
    render(<SiteFooter year={2026} settings={settings} />)

    expect(screen.getByRole('link', { name: 'Facebook' }).getAttribute('data-sanity')).toContain(
      'path=socialLinks:fb'
    )
  })

  it.each([null, []])('renders without social links (%j)', (socialLinks) => {
    render(<SiteFooter year={2026} settings={{ ...settings, socialLinks }} />)

    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
