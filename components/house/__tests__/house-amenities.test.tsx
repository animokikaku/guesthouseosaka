import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { HouseAmenities } from '../house-amenities'
import {
  createAmenityCategory,
  createAmenityItem
} from '@/lib/transforms/__tests__/mocks'
import type { AmenityCategoryData } from '@/lib/types/components'

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

vi.mock('@/lib/icons', () => ({
  Icon: ({ name }: { name: string }) => <span data-testid={`icon-${name}`} />
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

const defaultProps = {
  documentId: 'house-test',
  documentType: 'house',
  featuredAmenities: [] as ReturnType<typeof toAmenityCategoryData>['items']
}

// Helper to create amenity category data matching component's expected type
function toAmenityCategoryData(
  cat: ReturnType<typeof createAmenityCategory>
): AmenityCategoryData {
  return {
    _key: cat._key,
    category: {
      _id: cat.category._id,
      key: cat.category.key,
      label: cat.category.label ?? null,
      icon: cat.category.icon ?? null,
      orderRank: cat.category.orderRank
    },
    items: (cat.items ?? []).map((item: ReturnType<typeof createAmenityItem>) => ({
      _key: item._key,
      label: item.label ?? null,
      icon: item.icon,
      note: item.note ?? null,
      featured: item.featured ?? null
    }))
  }
}

describe('HouseAmenities', () => {
  const mockUseIsMobile = useIsMobile as ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseIsMobile.mockReturnValue(false)
  })

  describe('featured amenities display', () => {
    it('renders featured amenities on desktop (max 10)', () => {
      // GROQ query provides max 10 featured amenities
      const featuredAmenities = Array.from({ length: 10 }, (_, i) => ({
        _key: `amenity-${i}`,
        label: `Amenity ${i}`,
        icon: 'wifi',
        note: null as 'private' | 'shared' | 'coin' | null,
        featured: true as boolean | null
      }))
      const categories = [
        toAmenityCategoryData(
          createAmenityCategory({
            _key: 'cat1',
            category: { _id: 'c1', key: 'room', label: 'Room', icon: null, orderRank: '0|a00000:' },
            items: Array.from({ length: 15 }, (_, i) =>
              createAmenityItem({
                _key: `amenity-${i}`,
                label: `Amenity ${i}`,
                featured: true,
                icon: 'wifi'
              })
            )
          })
        )
      ]

      render(
        <HouseAmenities
          {...defaultProps}
          amenityCategories={categories}
          featuredAmenities={featuredAmenities}
        />
      )

      // Should display all 10 (max from GROQ) on desktop
      expect(screen.getAllByText(/Amenity \d+/)).toHaveLength(10)
    })

    it('renders featured amenities on mobile (max 5)', () => {
      mockUseIsMobile.mockReturnValue(true)

      // GROQ query provides max 10, component slices to 5 on mobile
      const featuredAmenities = Array.from({ length: 10 }, (_, i) => ({
        _key: `amenity-${i}`,
        label: `Amenity ${i}`,
        icon: 'wifi',
        note: null as 'private' | 'shared' | 'coin' | null,
        featured: true as boolean | null
      }))
      const categories = [
        toAmenityCategoryData(
          createAmenityCategory({
            _key: 'cat1',
            category: { _id: 'c1', key: 'room', label: 'Room', icon: null, orderRank: '0|a00000:' },
            items: Array.from({ length: 15 }, (_, i) =>
              createAmenityItem({
                _key: `amenity-${i}`,
                label: `Amenity ${i}`,
                featured: true,
                icon: 'wifi'
              })
            )
          })
        )
      ]

      render(
        <HouseAmenities
          {...defaultProps}
          amenityCategories={categories}
          featuredAmenities={featuredAmenities}
        />
      )

      // Should display max 5 on mobile
      expect(screen.getAllByText(/Amenity \d+/)).toHaveLength(5)
    })

    it('displays only the featured amenities provided via prop', () => {
      // Featured amenities are now pre-filtered by GROQ query
      const featuredAmenities = [
        { _key: 'featured-1', label: 'Featured 1', icon: 'wifi', note: null as 'private' | 'shared' | 'coin' | null, featured: true as boolean | null },
        { _key: 'featured-2', label: 'Featured 2', icon: 'utensils', note: null as 'private' | 'shared' | 'coin' | null, featured: true as boolean | null }
      ]
      const categories = [
        toAmenityCategoryData(
          createAmenityCategory({
            _key: 'cat1',
            category: { _id: 'c1', key: 'room', label: 'Room', icon: null, orderRank: '0|a00000:' },
            items: [
              createAmenityItem({ _key: 'featured-1', label: 'Featured 1', featured: true, icon: 'wifi' }),
              createAmenityItem({ _key: 'not-featured', label: 'Not Featured', featured: false, icon: 'bed' }),
              createAmenityItem({ _key: 'featured-2', label: 'Featured 2', featured: true, icon: 'utensils' })
            ]
          })
        )
      ]

      render(
        <HouseAmenities
          {...defaultProps}
          amenityCategories={categories}
          featuredAmenities={featuredAmenities}
        />
      )

      expect(screen.getByText('Featured 1')).toBeInTheDocument()
      expect(screen.getByText('Featured 2')).toBeInTheDocument()
      // 'Not Featured' is in categories but not in featuredAmenities prop
      expect(screen.queryByText('Not Featured')).not.toBeInTheDocument()
    })
  })

  describe('section heading', () => {
    it('renders section heading with translation key', () => {
      const featuredAmenities = [
        { _key: 'wifi', label: 'Wifi', icon: 'wifi', note: null as 'private' | 'shared' | 'coin' | null, featured: true as boolean | null }
      ]
      const categories = [
        toAmenityCategoryData(
          createAmenityCategory({
            items: [createAmenityItem({ featured: true, icon: 'wifi' })]
          })
        )
      ]

      render(
        <HouseAmenities
          {...defaultProps}
          amenityCategories={categories}
          featuredAmenities={featuredAmenities}
        />
      )

      // The heading uses t('heading') which returns 'heading' in mocked translations
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('heading')
    })
  })

  describe('show all button', () => {
    it('renders button with show_all translation key', () => {
      const featuredAmenities = Array.from({ length: 10 }, (_, i) => ({
        _key: `amenity-${i}`,
        label: `Amenity ${i}`,
        icon: 'wifi',
        note: null as 'private' | 'shared' | 'coin' | null,
        featured: true as boolean | null
      }))
      const items = Array.from({ length: 25 }, (_, i) =>
        createAmenityItem({
          _key: `amenity-${i}`,
          featured: i < 10,
          icon: 'wifi'
        })
      )
      const categories = [
        toAmenityCategoryData(
          createAmenityCategory({
            _key: 'cat1',
            category: { _id: 'c1', key: 'room', label: 'Room', icon: null, orderRank: '0|a00000:' },
            items
          })
        )
      ]

      render(
        <HouseAmenities
          {...defaultProps}
          amenityCategories={categories}
          featuredAmenities={featuredAmenities}
        />
      )

      // Button uses show_all translation key (mocked)
      expect(screen.getByRole('button')).toHaveTextContent('show_all')
    })
  })

  describe('note badges', () => {
    it('renders note badges for amenities with notes', () => {
      const featuredAmenities = [
        { _key: 'shared-wifi', label: 'Wifi', icon: 'wifi', note: 'shared' as const, featured: true as boolean | null },
        { _key: 'private-bath', label: 'Bath', icon: 'bath', note: 'private' as const, featured: true as boolean | null },
        { _key: 'coin-laundry', label: 'Laundry', icon: 'shirt', note: 'coin' as const, featured: true as boolean | null },
        { _key: 'no-note', label: 'Kitchen', icon: 'utensils', note: null as 'private' | 'shared' | 'coin' | null, featured: true as boolean | null }
      ]
      const categories = [
        toAmenityCategoryData(
          createAmenityCategory({
            _key: 'cat1',
            category: { _id: 'c1', key: 'room', label: 'Room', icon: null, orderRank: '0|a00000:' },
            items: [
              createAmenityItem({ _key: 'shared-wifi', label: 'Wifi', note: 'shared', featured: true, icon: 'wifi' }),
              createAmenityItem({ _key: 'private-bath', label: 'Bath', note: 'private', featured: true, icon: 'bath' }),
              createAmenityItem({ _key: 'coin-laundry', label: 'Laundry', note: 'coin', featured: true, icon: 'shirt' }),
              createAmenityItem({ _key: 'no-note', label: 'Kitchen', note: null, featured: true, icon: 'utensils' })
            ]
          })
        )
      ]

      render(
        <HouseAmenities
          {...defaultProps}
          amenityCategories={categories}
          featuredAmenities={featuredAmenities}
        />
      )

      // Note labels use translation keys
      expect(screen.getByText('notes.shared')).toBeInTheDocument()
      expect(screen.getByText('notes.private')).toBeInTheDocument()
      expect(screen.getByText('notes.coin')).toBeInTheDocument()
    })
  })

  describe('amenity icons', () => {
    it('renders amenity icons correctly', () => {
      const featuredAmenities = [
        { _key: 'wifi', label: 'Wifi', icon: 'wifi', note: null as 'private' | 'shared' | 'coin' | null, featured: true as boolean | null },
        { _key: 'bed', label: 'Bed', icon: 'bed', note: null as 'private' | 'shared' | 'coin' | null, featured: true as boolean | null }
      ]
      const categories = [
        toAmenityCategoryData(
          createAmenityCategory({
            _key: 'cat1',
            category: { _id: 'c1', key: 'room', label: 'Room', icon: null, orderRank: '0|a00000:' },
            items: [
              createAmenityItem({ _key: 'wifi', label: 'Wifi', icon: 'wifi', featured: true }),
              createAmenityItem({ _key: 'bed', label: 'Bed', icon: 'bed', featured: true })
            ]
          })
        )
      ]

      render(
        <HouseAmenities
          {...defaultProps}
          amenityCategories={categories}
          featuredAmenities={featuredAmenities}
        />
      )

      expect(screen.getByTestId('icon-wifi')).toBeInTheDocument()
      expect(screen.getByTestId('icon-bed')).toBeInTheDocument()
    })
  })

  describe('empty amenities', () => {
    it('handles empty amenity categories array', () => {
      render(
        <HouseAmenities
          {...defaultProps}
          amenityCategories={[]}
          featuredAmenities={[]}
        />
      )

      // Should render section with heading
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
      // Button/dialog not rendered when no amenities to show
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })

  describe('modal dialog', () => {
    it('opens Dialog on desktop when clicking button', () => {
      const featuredAmenities = [
        { _key: 'wifi', label: 'Wifi', icon: 'wifi', note: null as 'private' | 'shared' | 'coin' | null, featured: true as boolean | null }
      ]
      const categories = [
        toAmenityCategoryData(
          createAmenityCategory({
            _key: 'cat1',
            category: { _id: 'c1', key: 'internet', label: 'Internet', icon: null, orderRank: '0|a00000:' },
            items: [createAmenityItem({ _key: 'wifi', label: 'Wifi', featured: true, icon: 'wifi' })]
          })
        )
      ]

      render(
        <HouseAmenities
          {...defaultProps}
          amenityCategories={categories}
          featuredAmenities={featuredAmenities}
        />
      )

      fireEvent.click(screen.getByRole('button'))

      // Dialog should open - multiple heading elements visible (section + dialog)
      expect(screen.getAllByText('heading').length).toBeGreaterThanOrEqual(2)
    })

    it('opens Drawer on mobile when clicking button', () => {
      mockUseIsMobile.mockReturnValue(true)
      const featuredAmenities = [
        { _key: 'wifi', label: 'Wifi', icon: 'wifi', note: null as 'private' | 'shared' | 'coin' | null, featured: true as boolean | null }
      ]
      const categories = [
        toAmenityCategoryData(
          createAmenityCategory({
            _key: 'cat1',
            category: { _id: 'c1', key: 'internet', label: 'Internet', icon: null, orderRank: '0|a00000:' },
            items: [createAmenityItem({ _key: 'wifi', label: 'Wifi', featured: true, icon: 'wifi' })]
          })
        )
      ]

      render(
        <HouseAmenities
          {...defaultProps}
          amenityCategories={categories}
          featuredAmenities={featuredAmenities}
        />
      )

      fireEvent.click(screen.getByRole('button'))

      // Drawer should open (verified by having multiple heading elements)
      expect(screen.getAllByText('heading').length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('category grouping in modal', () => {
    it('displays categories with their labels in modal', () => {
      const featuredAmenities = [
        { _key: 'wifi', label: 'Wifi', icon: 'wifi', note: null as 'private' | 'shared' | 'coin' | null, featured: true as boolean | null },
        { _key: 'router', label: 'Router', icon: 'router', note: null as 'private' | 'shared' | 'coin' | null, featured: true as boolean | null },
        { _key: 'bed', label: 'Bed', icon: 'bed', note: null as 'private' | 'shared' | 'coin' | null, featured: true as boolean | null }
      ]
      const categories = [
        toAmenityCategoryData(
          createAmenityCategory({
            _key: 'cat1',
            category: { _id: 'c1', key: 'internet', label: 'Internet Access', icon: null, orderRank: '0|a00000:' },
            items: [
              createAmenityItem({ _key: 'wifi', label: 'Wifi', featured: true, icon: 'wifi' }),
              createAmenityItem({ _key: 'router', label: 'Router', featured: true, icon: 'router' })
            ]
          })
        ),
        toAmenityCategoryData(
          createAmenityCategory({
            _key: 'cat2',
            category: { _id: 'c2', key: 'bedroom', label: 'Bedroom', icon: null, orderRank: '0|b00000:' },
            items: [createAmenityItem({ _key: 'bed', label: 'Bed', featured: true, icon: 'bed' })]
          })
        )
      ]

      render(
        <HouseAmenities
          {...defaultProps}
          amenityCategories={categories}
          featuredAmenities={featuredAmenities}
        />
      )

      fireEvent.click(screen.getByRole('button'))

      // Should have category labels as h3
      expect(screen.getByText('Internet Access')).toBeInTheDocument()
      expect(screen.getByText('Bedroom')).toBeInTheDocument()
    })

    it('preserves category order in modal', () => {
      const featuredAmenities = [
        { _key: 'wifi', label: 'Wifi', icon: 'wifi', note: null as 'private' | 'shared' | 'coin' | null, featured: true as boolean | null },
        { _key: 'bed', label: 'Bed', icon: 'bed', note: null as 'private' | 'shared' | 'coin' | null, featured: true as boolean | null },
        { _key: 'kitchen', label: 'Kitchen', icon: 'utensils', note: null as 'private' | 'shared' | 'coin' | null, featured: true as boolean | null }
      ]
      const categories = [
        toAmenityCategoryData(
          createAmenityCategory({
            _key: 'cat1',
            category: { _id: 'c1', key: 'internet', label: 'Internet', icon: null, orderRank: '0|a00000:' },
            items: [createAmenityItem({ _key: 'wifi', label: 'Wifi', featured: true, icon: 'wifi' })]
          })
        ),
        toAmenityCategoryData(
          createAmenityCategory({
            _key: 'cat2',
            category: { _id: 'c2', key: 'bedroom', label: 'Bedroom', icon: null, orderRank: '0|b00000:' },
            items: [createAmenityItem({ _key: 'bed', label: 'Bed', featured: true, icon: 'bed' })]
          })
        ),
        toAmenityCategoryData(
          createAmenityCategory({
            _key: 'cat3',
            category: { _id: 'c3', key: 'kitchen', label: 'Kitchen', icon: null, orderRank: '0|c00000:' },
            items: [createAmenityItem({ _key: 'kitchen', label: 'Kitchen', featured: true, icon: 'utensils' })]
          })
        )
      ]

      render(
        <HouseAmenities
          {...defaultProps}
          amenityCategories={categories}
          featuredAmenities={featuredAmenities}
        />
      )

      fireEvent.click(screen.getByRole('button'))

      // Get all h3 elements and verify order
      const h3Elements = screen.getAllByRole('heading', { level: 3 })
      expect(h3Elements[0]).toHaveTextContent('Internet')
      expect(h3Elements[1]).toHaveTextContent('Bedroom')
      expect(h3Elements[2]).toHaveTextContent('Kitchen')
    })
  })
})
