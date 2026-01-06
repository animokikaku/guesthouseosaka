import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { FAQExtraCostsCards } from '../faq-extra-costs-cards'
import type {
  HousesBuildingQueryResult,
  PricingCategoriesQueryResult
} from '@/sanity.types'

// Create a mock API factory with proper type
type MockCarouselApi = {
  selectedScrollSnap: () => number
  scrollTo: (index: number) => void
  on: (event: string, callback: () => void) => void
  off: (event: string, callback: () => void) => void
}

let mockApi: MockCarouselApi | null = null
let apiCallbacks: Map<string, (() => void)[]> = new Map()
let setApiCallback: ((api: MockCarouselApi) => void) | null = null
let currentSelectedIndex = 0

function createMockApi(): MockCarouselApi {
  return {
    selectedScrollSnap: () => currentSelectedIndex,
    scrollTo: vi.fn((index: number) => {
      currentSelectedIndex = index
      // Trigger select callbacks
      apiCallbacks.get('select')?.forEach((cb) => cb())
    }),
    on: vi.fn((event: string, callback: () => void) => {
      const callbacks = apiCallbacks.get(event) || []
      callbacks.push(callback)
      apiCallbacks.set(event, callbacks)
    }),
    off: vi.fn((event: string, callback: () => void) => {
      const callbacks = apiCallbacks.get(event) || []
      const index = callbacks.indexOf(callback)
      if (index > -1) callbacks.splice(index, 1)
      apiCallbacks.set(event, callbacks)
    })
  }
}

// Mock the Carousel components with API support
vi.mock('@/components/ui/carousel', () => ({
  Carousel: ({
    children,
    setApi
  }: {
    children: React.ReactNode
    setApi?: (api: MockCarouselApi) => void
  }) => {
    // Store the setApi callback for triggering later
    if (setApi) {
      setApiCallback = setApi
    }
    return <div data-testid="carousel">{children}</div>
  },
  CarouselContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="carousel-content">{children}</div>
  ),
  CarouselItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="carousel-item">{children}</div>
  )
}))

type PricingCategories = NonNullable<PricingCategoriesQueryResult>
type Houses = NonNullable<HousesBuildingQueryResult>
type ExtraCost = NonNullable<Houses[number]['extraCosts']>[number]

const createCategory = (
  id: string,
  title: string
): PricingCategories[number] => ({
  _id: id,
  title,
  orderRank: `0|${id}:`
})

const createHouse = (
  id: string,
  slug: 'orange' | 'apple' | 'lemon',
  extraCosts: ExtraCost[] = []
): Houses[number] => ({
  _id: id,
  _type: 'house',
  title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} House`,
  slug,
  building: null,
  phone: { _type: 'housePhone', domestic: '06-1234-5678', international: '+81-6-1234-5678' },
  image: {
    asset: null,
    hotspot: null,
    crop: null,
    alt: null,
    preview: null
  },
  extraCosts
})

const createExtraCost = (categoryId: string, text: string): ExtraCost => ({
  categoryId,
  value: [
    {
      _type: 'block',
      _key: 'block1',
      children: [{ _type: 'span', _key: 'span1', text, marks: [] }],
      markDefs: [],
      style: 'normal'
    }
  ]
})

describe('FAQExtraCostsCards', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockApi = null
    apiCallbacks = new Map()
    setApiCallback = null
    currentSelectedIndex = 0
  })

  describe('empty states', () => {
    it('returns null when houses array is empty', () => {
      const pricingCategories: PricingCategories = [
        createCategory('deposit', 'Deposit')
      ]

      const { container } = render(
        <FAQExtraCostsCards houses={[]} pricingCategories={pricingCategories} />
      )

      expect(container.firstChild).toBeNull()
    })

    it('returns null when pricingCategories is empty', () => {
      const houses: Houses = [createHouse('h1', 'orange')]

      const { container } = render(
        <FAQExtraCostsCards houses={houses} pricingCategories={[]} />
      )

      expect(container.firstChild).toBeNull()
    })
  })

  describe('missing house values', () => {
    it('displays dash when house has no value for a category', () => {
      const houses: Houses = [createHouse('h1', 'orange', [])]
      const pricingCategories: PricingCategories = [
        createCategory('deposit', 'Deposit')
      ]

      render(
        <FAQExtraCostsCards
          houses={houses}
          pricingCategories={pricingCategories}
        />
      )

      expect(screen.getByText('–')).toBeInTheDocument()
    })
  })

  describe('complete data rendering', () => {
    it('renders cards with house titles', () => {
      const houses: Houses = [
        createHouse('h1', 'orange'),
        createHouse('h2', 'apple'),
        createHouse('h3', 'lemon')
      ]
      const pricingCategories: PricingCategories = [
        createCategory('deposit', 'Deposit')
      ]

      render(
        <FAQExtraCostsCards
          houses={houses}
          pricingCategories={pricingCategories}
        />
      )

      expect(screen.getByText('Orange House')).toBeInTheDocument()
      expect(screen.getByText('Apple House')).toBeInTheDocument()
      expect(screen.getByText('Lemon House')).toBeInTheDocument()
    })

    it('renders category labels in each card', () => {
      const houses: Houses = [createHouse('h1', 'orange')]
      const pricingCategories: PricingCategories = [
        createCategory('deposit', 'Deposit'),
        createCategory('internet', 'Internet')
      ]

      render(
        <FAQExtraCostsCards
          houses={houses}
          pricingCategories={pricingCategories}
        />
      )

      expect(screen.getByText('Deposit')).toBeInTheDocument()
      expect(screen.getByText('Internet')).toBeInTheDocument()
    })

    it('renders portable text values correctly', () => {
      const houses: Houses = [
        createHouse('h1', 'orange', [
          createExtraCost('deposit', '¥30,000'),
          createExtraCost('internet', 'Free')
        ])
      ]
      const pricingCategories: PricingCategories = [
        createCategory('deposit', 'Deposit'),
        createCategory('internet', 'Internet')
      ]

      render(
        <FAQExtraCostsCards
          houses={houses}
          pricingCategories={pricingCategories}
        />
      )

      expect(screen.getByText('¥30,000')).toBeInTheDocument()
      expect(screen.getByText('Free')).toBeInTheDocument()
    })
  })

  describe('carousel structure', () => {
    it('renders carousel container', () => {
      const houses: Houses = [
        createHouse('h1', 'orange'),
        createHouse('h2', 'apple'),
        createHouse('h3', 'lemon')
      ]
      const pricingCategories: PricingCategories = [
        createCategory('deposit', 'Deposit')
      ]

      render(
        <FAQExtraCostsCards
          houses={houses}
          pricingCategories={pricingCategories}
        />
      )

      expect(screen.getByTestId('carousel')).toBeInTheDocument()
      expect(screen.getByTestId('carousel-content')).toBeInTheDocument()
      // 3 carousel items for 3 houses
      expect(screen.getAllByTestId('carousel-item')).toHaveLength(3)
    })
  })

  describe('navigation dots', () => {
    it('renders navigation dots for each house', () => {
      const houses: Houses = [
        createHouse('h1', 'orange'),
        createHouse('h2', 'apple'),
        createHouse('h3', 'lemon')
      ]
      const pricingCategories: PricingCategories = [
        createCategory('deposit', 'Deposit')
      ]

      render(
        <FAQExtraCostsCards
          houses={houses}
          pricingCategories={pricingCategories}
        />
      )

      // Should have navigation dots with aria-labels
      expect(screen.getByLabelText('Go to Orange House')).toBeInTheDocument()
      expect(screen.getByLabelText('Go to Apple House')).toBeInTheDocument()
      expect(screen.getByLabelText('Go to Lemon House')).toBeInTheDocument()
    })

    it('calls api.scrollTo when navigation dot is clicked', () => {
      const houses: Houses = [
        createHouse('h1', 'orange'),
        createHouse('h2', 'apple'),
        createHouse('h3', 'lemon')
      ]
      const pricingCategories: PricingCategories = [
        createCategory('deposit', 'Deposit')
      ]

      render(
        <FAQExtraCostsCards
          houses={houses}
          pricingCategories={pricingCategories}
        />
      )

      // Simulate API being set after render
      mockApi = createMockApi()
      act(() => {
        setApiCallback?.(mockApi!)
      })

      // Click on the second navigation dot
      const appleButton = screen.getByLabelText('Go to Apple House')
      fireEvent.click(appleButton)

      expect(mockApi.scrollTo).toHaveBeenCalledWith(1)
    })
  })

  describe('carousel API integration', () => {
    it('registers select and reInit event handlers', () => {
      const houses: Houses = [
        createHouse('h1', 'orange'),
        createHouse('h2', 'apple')
      ]
      const pricingCategories: PricingCategories = [
        createCategory('deposit', 'Deposit')
      ]

      render(
        <FAQExtraCostsCards
          houses={houses}
          pricingCategories={pricingCategories}
        />
      )

      mockApi = createMockApi()
      act(() => {
        setApiCallback?.(mockApi!)
      })

      // Verify event handlers were registered
      expect(mockApi.on).toHaveBeenCalledWith('select', expect.any(Function))
      expect(mockApi.on).toHaveBeenCalledWith('reInit', expect.any(Function))
    })

    it('updates current index when select event fires', () => {
      const houses: Houses = [
        createHouse('h1', 'orange'),
        createHouse('h2', 'apple'),
        createHouse('h3', 'lemon')
      ]
      const pricingCategories: PricingCategories = [
        createCategory('deposit', 'Deposit')
      ]

      render(
        <FAQExtraCostsCards
          houses={houses}
          pricingCategories={pricingCategories}
        />
      )

      mockApi = createMockApi()
      act(() => {
        setApiCallback?.(mockApi!)
      })

      // Initial state: first dot should be active (w-6 class)
      const dots = screen.getAllByRole('button').filter(
        (btn) => btn.getAttribute('aria-label')?.startsWith('Go to')
      )
      expect(dots).toHaveLength(3)
      expect(dots[0]).toHaveClass('w-6')
      expect(dots[1]).toHaveClass('w-2')
      expect(dots[2]).toHaveClass('w-2')

      // Simulate scrolling to second item
      act(() => {
        currentSelectedIndex = 1
        apiCallbacks.get('select')?.forEach((cb) => cb())
      })

      // After selection: second dot should now be active
      expect(dots[0]).toHaveClass('w-2')
      expect(dots[1]).toHaveClass('w-6')
      expect(dots[2]).toHaveClass('w-2')
    })

    it('cleans up event handlers on unmount', () => {
      const houses: Houses = [
        createHouse('h1', 'orange'),
        createHouse('h2', 'apple')
      ]
      const pricingCategories: PricingCategories = [
        createCategory('deposit', 'Deposit')
      ]

      const { unmount } = render(
        <FAQExtraCostsCards
          houses={houses}
          pricingCategories={pricingCategories}
        />
      )

      mockApi = createMockApi()
      act(() => {
        setApiCallback?.(mockApi!)
      })

      unmount()

      // Verify off was called to clean up handlers
      expect(mockApi.off).toHaveBeenCalledWith('select', expect.any(Function))
      expect(mockApi.off).toHaveBeenCalledWith('reInit', expect.any(Function))
    })
  })
})
