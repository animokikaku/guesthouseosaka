import type { SettingsQueryResult } from '@/sanity.types'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SiteFooter } from '../site-footer'

const createSettings = (
  overrides?: Partial<NonNullable<SettingsQueryResult>>
): SettingsQueryResult => ({
  _id: 'settings-123',
  _type: 'settings',
  siteName: null,
  siteDescription: null,
  companyName: 'Guest House Osaka',
  email: null,
  phone: null,
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
})
