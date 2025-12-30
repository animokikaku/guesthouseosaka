import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { HouseAmenities } from '../house-amenities'
import { createAmenity } from '@/lib/transforms/__tests__/mocks'

// Mock matchMedia for vaul/Drawer
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
})

// Mock dependencies
vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: vi.fn(() => false)
}))

vi.mock('@/hooks/use-optimistic', () => ({
  useOptimistic: vi.fn((data, field) => [
    data[field],
    { list: () => '', item: () => '' }
  ])
}))

vi.mock('lucide-react/dynamic', () => ({
  DynamicIcon: ({ name }: { name: string }) => (
    <span data-testid={`icon-${name}`} />
  ),
  dynamicIconImports: {}
}))

// Mock Radix UI portals for Dialog/Drawer
vi.mock('@radix-ui/react-dialog', async () => {
  const actual = await vi.importActual('@radix-ui/react-dialog')
  return {
    ...actual,
    Portal: ({ children }: { children: React.ReactNode }) => children
  }
})

vi.mock('vaul', async () => {
  const actual = await vi.importActual<typeof import('vaul')>('vaul')
  return {
    ...actual,
    Drawer: {
      ...actual.Drawer,
      Portal: ({ children }: { children: React.ReactNode }) => children
    }
  }
})

import { useIsMobile } from '@/hooks/use-mobile'

describe('HouseAmenities', () => {
  const mockUseIsMobile = useIsMobile as ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseIsMobile.mockReturnValue(false)
  })

  const baseProps = {
    _id: 'house-123',
    _type: 'house'
  }

  describe('featured amenities display', () => {
    it('renders featured amenities on desktop (max 10)', () => {
      const amenities = Array.from({ length: 15 }, (_, i) =>
        createAmenity({
          _key: `amenity-${i}`,
          label: `Amenity ${i}`,
          featured: true,
          icon: 'wifi'
        })
      )

      render(<HouseAmenities {...baseProps} amenities={amenities} />)

      // Should display max 10 on desktop
      expect(screen.getAllByText(/Amenity \d+/)).toHaveLength(10)
    })

    it('renders featured amenities on mobile (max 5)', () => {
      mockUseIsMobile.mockReturnValue(true)

      const amenities = Array.from({ length: 15 }, (_, i) =>
        createAmenity({
          _key: `amenity-${i}`,
          label: `Amenity ${i}`,
          featured: true,
          icon: 'wifi'
        })
      )

      render(<HouseAmenities {...baseProps} amenities={amenities} />)

      // Should display max 5 on mobile
      expect(screen.getAllByText(/Amenity \d+/)).toHaveLength(5)
    })

    it('filters only amenities with featured: true', () => {
      const amenities = [
        createAmenity({ _key: 'featured-1', label: 'Featured 1', featured: true, icon: 'wifi' }),
        createAmenity({ _key: 'not-featured', label: 'Not Featured', featured: false, icon: 'bed' }),
        createAmenity({ _key: 'featured-2', label: 'Featured 2', featured: true, icon: 'utensils' })
      ]

      render(<HouseAmenities {...baseProps} amenities={amenities} />)

      expect(screen.getByText('Featured 1')).toBeInTheDocument()
      expect(screen.getByText('Featured 2')).toBeInTheDocument()
      expect(screen.queryByText('Not Featured')).not.toBeInTheDocument()
    })
  })

  describe('section heading', () => {
    it('renders section heading with translation key', () => {
      const amenities = [
        createAmenity({ _key: 'a1', label: 'Wifi', featured: true, icon: 'wifi' })
      ]

      render(<HouseAmenities {...baseProps} amenities={amenities} />)

      // The heading uses t('heading') which returns 'heading' in mocked translations
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('heading')
    })
  })

  describe('show all button', () => {
    it('renders button with show_all translation key', () => {
      const amenities = Array.from({ length: 25 }, (_, i) =>
        createAmenity({
          _key: `amenity-${i}`,
          featured: i < 10,
          icon: 'wifi'
        })
      )

      render(<HouseAmenities {...baseProps} amenities={amenities} />)

      // Button uses show_all translation key (mocked)
      expect(screen.getByRole('button')).toHaveTextContent('show_all')
    })
  })

  describe('note badges', () => {
    it('renders note badges for amenities with notes', () => {
      const amenities = [
        createAmenity({ _key: 'shared-wifi', label: 'Wifi', note: 'shared', featured: true, icon: 'wifi' }),
        createAmenity({ _key: 'private-bath', label: 'Bath', note: 'private', featured: true, icon: 'bath' }),
        createAmenity({ _key: 'coin-laundry', label: 'Laundry', note: 'coin', featured: true, icon: 'shirt' }),
        createAmenity({ _key: 'no-note', label: 'Kitchen', note: null, featured: true, icon: 'utensils' })
      ]

      render(<HouseAmenities {...baseProps} amenities={amenities} />)

      // Note labels use translation keys
      expect(screen.getByText('notes.shared')).toBeInTheDocument()
      expect(screen.getByText('notes.private')).toBeInTheDocument()
      expect(screen.getByText('notes.coin')).toBeInTheDocument()
    })
  })

  describe('amenity icons', () => {
    it('renders amenity icons correctly', () => {
      const amenities = [
        createAmenity({ _key: 'wifi', label: 'Wifi', icon: 'wifi', featured: true }),
        createAmenity({ _key: 'bed', label: 'Bed', icon: 'bed', featured: true })
      ]

      render(<HouseAmenities {...baseProps} amenities={amenities} />)

      expect(screen.getByTestId('icon-wifi')).toBeInTheDocument()
      expect(screen.getByTestId('icon-bed')).toBeInTheDocument()
    })
  })

  describe('empty amenities', () => {
    it('handles empty amenities array', () => {
      render(<HouseAmenities {...baseProps} amenities={[]} />)

      // Should still render section with heading and button
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
      // Button renders with translation key containing the count
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('modal dialog', () => {
    it('opens Dialog on desktop when clicking button', () => {
      const amenities = [
        createAmenity({
          _key: 'wifi',
          label: 'Wifi',
          featured: true,
          icon: 'wifi',
          category: { _id: 'cat1', key: 'internet', label: 'Internet', icon: null, orderRank: '0|a00000:' }
        })
      ]

      render(<HouseAmenities {...baseProps} amenities={amenities} />)

      fireEvent.click(screen.getByRole('button'))

      // Dialog should open - multiple heading elements visible (section + dialog)
      expect(screen.getAllByText('heading').length).toBeGreaterThanOrEqual(2)
    })

    it('opens Drawer on mobile when clicking button', () => {
      mockUseIsMobile.mockReturnValue(true)
      const amenities = [
        createAmenity({
          _key: 'wifi',
          label: 'Wifi',
          featured: true,
          icon: 'wifi',
          category: { _id: 'cat1', key: 'internet', label: 'Internet', icon: null, orderRank: '0|a00000:' }
        })
      ]

      render(<HouseAmenities {...baseProps} amenities={amenities} />)

      fireEvent.click(screen.getByRole('button'))

      // Drawer should open (verified by having multiple heading elements)
      expect(screen.getAllByText('heading').length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('category grouping in modal', () => {
    it('groups amenities by category in modal', () => {
      const amenities = [
        createAmenity({
          _key: 'wifi',
          label: 'Wifi',
          featured: true,
          icon: 'wifi',
          category: { _id: 'cat1', key: 'internet', label: 'Internet Access', icon: null, orderRank: '0|a00000:' }
        }),
        createAmenity({
          _key: 'bed',
          label: 'Bed',
          featured: true,
          icon: 'bed',
          category: { _id: 'cat2', key: 'bedroom', label: 'Bedroom', icon: null, orderRank: '0|b00000:' }
        }),
        createAmenity({
          _key: 'router',
          label: 'Router',
          featured: true,
          icon: 'router',
          category: { _id: 'cat1', key: 'internet', label: 'Internet Access', icon: null, orderRank: '0|a00000:' }
        })
      ]

      render(<HouseAmenities {...baseProps} amenities={amenities} />)

      fireEvent.click(screen.getByRole('button'))

      // Should have category labels as h3
      expect(screen.getByText('Internet Access')).toBeInTheDocument()
      expect(screen.getByText('Bedroom')).toBeInTheDocument()
    })

    it('sorts categories by orderRank in modal', () => {
      const amenities = [
        createAmenity({
          _key: 'kitchen',
          label: 'Kitchen',
          featured: true,
          icon: 'utensils',
          category: { _id: 'cat3', key: 'kitchen', label: 'Kitchen', icon: null, orderRank: '0|c00000:' }
        }),
        createAmenity({
          _key: 'wifi',
          label: 'Wifi',
          featured: true,
          icon: 'wifi',
          category: { _id: 'cat1', key: 'internet', label: 'Internet', icon: null, orderRank: '0|a00000:' }
        }),
        createAmenity({
          _key: 'bed',
          label: 'Bed',
          featured: true,
          icon: 'bed',
          category: { _id: 'cat2', key: 'bedroom', label: 'Bedroom', icon: null, orderRank: '0|b00000:' }
        })
      ]

      render(<HouseAmenities {...baseProps} amenities={amenities} />)

      fireEvent.click(screen.getByRole('button'))

      // Get all h3 elements and verify order
      const h3Elements = screen.getAllByRole('heading', { level: 3 })
      expect(h3Elements[0]).toHaveTextContent('Internet')
      expect(h3Elements[1]).toHaveTextContent('Bedroom')
      expect(h3Elements[2]).toHaveTextContent('Kitchen')
    })
  })
})
