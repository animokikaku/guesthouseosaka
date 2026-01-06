import type { SettingsQueryResult } from '@/sanity.types'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SiteFooter } from '../site-footer'

type OptimisticReducer = (
  currentLinks: NonNullable<SettingsQueryResult>['socialLinks'] | undefined,
  action: { id: string; document: Partial<NonNullable<SettingsQueryResult>> }
) => NonNullable<SettingsQueryResult>['socialLinks'] | undefined

let capturedReducer: OptimisticReducer | null = null

vi.mock('next-sanity/hooks', () => ({
  useOptimistic: <T, A>(
    initialValue: T,
    reducer: (current: T, action: A) => T
  ) => {
    capturedReducer = reducer as unknown as OptimisticReducer
    return initialValue
  }
}))

const createSettings = (
  overrides?: Partial<NonNullable<SettingsQueryResult>>
): NonNullable<SettingsQueryResult> => ({
  _id: 'settings-123',
  _type: 'settings',
  siteName: null,
  siteDescription: null,
  companyName: 'Guest House Osaka',
  email: 'info@example.com',
  phone: '+81-6-1234-5678',
  address: null,
  socialLinks: [
    {
      _key: 'social-1',
      icon: 'facebook',
      label: 'Facebook',
      url: 'https://facebook.com/example'
    },
    {
      _key: 'social-2',
      icon: 'instagram',
      label: 'Instagram',
      url: 'https://instagram.com/example'
    }
  ],
  ...overrides
})

describe('SiteFooter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('visibility', () => {
    it('renders footer element', () => {
      render(<SiteFooter settings={createSettings()} />)

      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    })

    it('displays company name', () => {
      render(<SiteFooter settings={createSettings()} />)

      // Company name appears in footer outside sr-only text
      expect(screen.getAllByText(/Guest House Osaka/).length).toBeGreaterThan(0)
    })

    it('displays current year in copyright', () => {
      render(<SiteFooter settings={createSettings()} />)

      const currentYear = new Date().getFullYear().toString()
      expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument()
    })

    it('renders social links with external target', () => {
      render(<SiteFooter settings={createSettings()} />)

      const socialLinks = screen.getAllByRole('link')
      expect(socialLinks.length).toBeGreaterThan(0)

      // Check all links have target="_blank"
      socialLinks.forEach((link) => {
        expect(link).toHaveAttribute('target', '_blank')
      })
    })

    it('renders social links with rel noopener noreferrer', () => {
      render(<SiteFooter settings={createSettings()} />)

      const socialLinks = screen.getAllByRole('link')
      socialLinks.forEach((link) => {
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      })
    })

    it('renders social links with correct href', () => {
      render(<SiteFooter settings={createSettings()} />)

      const facebookLink = screen.getByRole('link', { name: 'Facebook' })
      expect(facebookLink).toHaveAttribute(
        'href',
        'https://facebook.com/example'
      )

      const instagramLink = screen.getByRole('link', { name: 'Instagram' })
      expect(instagramLink).toHaveAttribute(
        'href',
        'https://instagram.com/example'
      )
    })

    it('renders social links with data-sanity attribute for visual editing', () => {
      render(<SiteFooter settings={createSettings()} />)

      const facebookLink = screen.getByRole('link', { name: 'Facebook' })
      expect(facebookLink).toHaveAttribute('data-sanity')
      expect(facebookLink.getAttribute('data-sanity')).toContain('social-1')

      const instagramLink = screen.getByRole('link', { name: 'Instagram' })
      expect(instagramLink).toHaveAttribute('data-sanity')
      expect(instagramLink.getAttribute('data-sanity')).toContain('social-2')
    })
  })

  describe('empty states', () => {
    it('handles missing social links gracefully', () => {
      render(<SiteFooter settings={createSettings({ socialLinks: null })} />)

      // Footer should still render
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
      // No social links should be present
      expect(screen.queryAllByRole('link')).toHaveLength(0)
    })

    it('handles empty social links array', () => {
      render(<SiteFooter settings={createSettings({ socialLinks: [] })} />)

      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
      expect(screen.queryAllByRole('link')).toHaveLength(0)
    })

    it('renders social link with custom label', () => {
      render(
        <SiteFooter
          settings={createSettings({
            socialLinks: [
              {
                _key: 'social-1',
                icon: 'facebook',
                label: 'Follow us on Facebook',
                url: 'https://facebook.com/example'
              }
            ]
          })}
        />
      )

      // Custom label is used instead of URL-derived label
      expect(screen.getByLabelText('Follow us on Facebook')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('renders screen reader text for company info', () => {
      render(<SiteFooter settings={createSettings()} />)

      expect(screen.getByText(/ゲストハウス大阪/)).toHaveClass('sr-only')
    })

    it('social links have aria-label for platform name', () => {
      render(<SiteFooter settings={createSettings()} />)

      expect(screen.getByRole('link', { name: 'Facebook' })).toBeInTheDocument()
      expect(
        screen.getByRole('link', { name: 'Instagram' })
      ).toBeInTheDocument()
    })
  })

  describe('optimistic updates', () => {
    const currentLinks = [
      {
        _key: 'social-1',
        icon: 'facebook',
        label: 'Facebook',
        url: 'https://facebook.com/example'
      },
      {
        _key: 'social-2',
        icon: 'instagram',
        label: 'Instagram',
        url: 'https://instagram.com/example'
      }
    ]

    beforeEach(() => {
      capturedReducer = null
    })

    it('returns updated links when action matches settings id', () => {
      const settings = createSettings()
      render(<SiteFooter settings={settings} />)

      expect(capturedReducer).not.toBeNull()

      const newLinks = [
        { _key: 'social-1', icon: 'facebook', label: 'FB', url: 'https://fb.com' },
        { _key: 'social-3', icon: 'twitter', label: 'Twitter', url: 'https://twitter.com' }
      ]

      const result = capturedReducer!(currentLinks, {
        id: settings._id,
        document: { socialLinks: newLinks }
      })

      // Should merge: existing link with _key 'social-1' is found, 'social-3' uses action link
      expect(result).toHaveLength(2)
      expect(result![0]).toEqual(currentLinks[0]) // Found in currentLinks
      expect(result![1]).toEqual(newLinks[1]) // Not found, uses action link
    })

    it('returns current links when action id does not match', () => {
      const settings = createSettings()
      render(<SiteFooter settings={settings} />)

      expect(capturedReducer).not.toBeNull()

      const result = capturedReducer!(currentLinks, {
        id: 'different-id',
        document: { socialLinks: [] }
      })

      expect(result).toBe(currentLinks)
    })

    it('returns current links when action has no socialLinks', () => {
      const settings = createSettings()
      render(<SiteFooter settings={settings} />)

      expect(capturedReducer).not.toBeNull()

      const result = capturedReducer!(currentLinks, {
        id: settings._id,
        document: {}
      })

      expect(result).toBe(currentLinks)
    })
  })
})
