import { render, screen } from '@testing-library/react'
import { ContactNav } from '../contact-nav'
import type { ContactNavItem } from '@/lib/types/components'

// Mock the useIsMobile hook
vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false
}))

// Mock next/navigation for useSelectedLayoutSegment
vi.mock('next/navigation', async () => {
  const actual = await vi.importActual('next/navigation')
  return {
    ...actual,
    useSelectedLayoutSegment: () => null
  }
})

// Mock the Link component from next-intl/navigation
vi.mock('@/i18n/navigation', () => ({
  Link: ({
    children,
    href,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    scroll,
    ...props
  }: {
    children: React.ReactNode
    href: { pathname: string; params: { slug: string }; hash: string }
    scroll?: boolean
    [key: string]: unknown
  }) => (
    <a href={`/contact/${href.params.slug}${href.hash}`} {...props}>
      {children}
    </a>
  )
}))

const createMockItems = (count: number): ContactNavItem[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `contact-${index + 1}`,
    slug: ['tour', 'move-in', 'other'][index % 3] as ContactNavItem['slug'],
    title: `Contact Type ${index + 1}`
  }))

describe('ContactNav', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders all navigation items', () => {
      const items = createMockItems(3)
      render(<ContactNav items={items} />)

      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(3)
    })

    it('renders items with correct href links', () => {
      const items: ContactNavItem[] = [
        { id: 'tour-1', slug: 'tour', title: 'Book a Tour' },
        { id: 'move-in-1', slug: 'move-in', title: 'Move In' },
        { id: 'other-1', slug: 'other', title: 'Other Inquiries' }
      ]
      render(<ContactNav items={items} />)

      expect(screen.getByRole('link', { name: 'Book a Tour' })).toHaveAttribute(
        'href',
        '/contact/tour#tabs'
      )
      expect(screen.getByRole('link', { name: 'Move In' })).toHaveAttribute(
        'href',
        '/contact/move-in#tabs'
      )
      expect(screen.getByRole('link', { name: 'Other Inquiries' })).toHaveAttribute(
        'href',
        '/contact/other#tabs'
      )
    })
  })

  describe('empty state', () => {
    it('returns null when items array is empty', () => {
      const { container } = render(<ContactNav items={[]} />)

      expect(container.firstChild).toBeNull()
    })
  })

  describe('active state', () => {
    it('sets data-active attribute based on current segment', async () => {
      // Reset modules to allow re-mocking
      vi.resetModules()

      // Mock useSelectedLayoutSegment to return 'tour' before importing component
      vi.doMock('next/navigation', () => ({
        useSelectedLayoutSegment: () => 'tour'
      }))

      // Re-import the component after mocking
      const { ContactNav: ContactNavWithTourActive } = await import('../contact-nav')

      const items: ContactNavItem[] = [
        { id: 'tour-1', slug: 'tour', title: 'Book a Tour' },
        { id: 'move-in-1', slug: 'move-in', title: 'Move In' }
      ]
      render(<ContactNavWithTourActive items={items} />)

      const tourLink = screen.getByRole('link', { name: 'Book a Tour' })
      const moveInLink = screen.getByRole('link', { name: 'Move In' })

      // Only tour link should have data-active="true"
      expect(tourLink).toHaveAttribute('data-active', 'true')
      expect(moveInLink).toHaveAttribute('data-active', 'false')
    })
  })
})
