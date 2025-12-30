import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SiteFooter } from '../site-footer'
import type { SettingsQueryResult } from '@/sanity.types'

// Mock useOptimistic hook
vi.mock('@/hooks/use-optimistic', () => ({
  useOptimistic: (data: SettingsQueryResult, field: string) => [
    data?.socialLinks ?? [],
    { list: () => '', item: () => '' }
  ]
}))

const createSettings = (overrides?: Partial<NonNullable<SettingsQueryResult>>): SettingsQueryResult => ({
  _id: 'settings-123',
  _type: 'settings',
  _createdAt: '2024-01-01',
  _updatedAt: '2024-01-01',
  _rev: 'rev-123',
  companyName: 'Guest House Osaka',
  socialLinks: [
    {
      _key: 'social-1',
      platform: 'twitter',
      url: 'https://twitter.com/example',
      icon: '<svg></svg>'
    },
    {
      _key: 'social-2',
      platform: 'instagram',
      url: 'https://instagram.com/example',
      icon: '<svg></svg>'
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

      const twitterLink = screen.getByRole('link', { name: 'twitter' })
      expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/example')

      const instagramLink = screen.getByRole('link', { name: 'instagram' })
      expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/example')
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

    it('skips social links with missing url', () => {
      render(
        <SiteFooter
          settings={createSettings({
            socialLinks: [
              { _key: 'social-1', platform: 'twitter', url: null, icon: '<svg></svg>' }
            ]
          })}
        />
      )

      expect(screen.queryAllByRole('link')).toHaveLength(0)
    })

    it('skips social links with missing icon', () => {
      render(
        <SiteFooter
          settings={createSettings({
            socialLinks: [
              { _key: 'social-1', platform: 'twitter', url: 'https://twitter.com', icon: null }
            ]
          })}
        />
      )

      expect(screen.queryAllByRole('link')).toHaveLength(0)
    })
  })

  describe('accessibility', () => {
    it('renders screen reader text for company info', () => {
      render(<SiteFooter settings={createSettings()} />)

      expect(screen.getByText(/ゲストハウス大阪/)).toHaveClass('sr-only')
    })

    it('social links have aria-label for platform name', () => {
      render(<SiteFooter settings={createSettings()} />)

      expect(screen.getByRole('link', { name: 'twitter' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'instagram' })).toBeInTheDocument()
    })
  })
})
