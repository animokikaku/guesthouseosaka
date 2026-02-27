import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { HousesBuildingQueryResult, PricingCategoriesQueryResult } from '@/sanity.types'
import {
  type CarouselMockState,
  type MockCarouselApi,
  createMockCarouselApi,
  resetCarouselMockState
} from '@/lib/__tests__/utils/carousel-mock'

// Use vi.hoisted to create state that can be used in vi.mock
const { carouselState } = vi.hoisted(() => {
  const state: CarouselMockState = {
    mockApi: null,
    apiCallbacks: new Map(),
    setApiCallback: null,
    currentSelectedIndex: 0
  }
  return { carouselState: state }
})

// Mock the Carousel components with state capture
vi.mock('@/components/ui/carousel', () => ({
  Carousel: ({
    children,
    setApi
  }: {
    children: React.ReactNode
    setApi?: (api: MockCarouselApi) => void
  }) => {
    if (setApi) {
      carouselState.setApiCallback = setApi
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

// Import component after mocks
import { FAQExtraCostsCards } from '../faq-extra-costs-cards'

type PricingCategories = NonNullable<PricingCategoriesQueryResult>
type Houses = NonNullable<HousesBuildingQueryResult>
type ExtraCost = NonNullable<Houses[number]['extraCosts']>[number]

const createCategory = (id: string, title: string): PricingCategories[number] => ({
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
  phone: {
    _type: 'housePhone',
    domestic: '06-1234-5678',
    international: '+81-6-1234-5678'
  },
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

const createExtraCostWithList = (
  categoryId: string,
  items: string[],
  listItem: 'bullet' | 'number'
): ExtraCost => ({
  categoryId,
  value: items.map((text, i) => ({
    _type: 'block' as const,
    _key: `list-block-${i}`,
    children: [{ _type: 'span' as const, _key: `span${i}`, text, marks: [] as string[] }],
    markDefs: [] as never[],
    style: 'normal' as const,
    listItem,
    level: 1
  }))
})

describe('FAQExtraCostsCards', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetCarouselMockState(carouselState)
  })

  describe('empty states', () => {
    it('returns null when houses array is empty', () => {
      const pricingCategories: PricingCategories = [createCategory('deposit', 'Deposit')]

      const { container } = render(
        <FAQExtraCostsCards houses={[]} pricingCategories={pricingCategories} />
      )

      expect(container.firstChild).toBeNull()
    })

    it('returns null when pricingCategories is empty', () => {
      const houses: Houses = [createHouse('h1', 'orange')]

      const { container } = render(<FAQExtraCostsCards houses={houses} pricingCategories={[]} />)

      expect(container.firstChild).toBeNull()
    })
  })

  describe('missing house values', () => {
    it('displays dash when house has no value for a category', () => {
      const houses: Houses = [createHouse('h1', 'orange', [])]
      const pricingCategories: PricingCategories = [createCategory('deposit', 'Deposit')]

      render(<FAQExtraCostsCards houses={houses} pricingCategories={pricingCategories} />)

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
      const pricingCategories: PricingCategories = [createCategory('deposit', 'Deposit')]

      render(<FAQExtraCostsCards houses={houses} pricingCategories={pricingCategories} />)

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

      render(<FAQExtraCostsCards houses={houses} pricingCategories={pricingCategories} />)

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

      render(<FAQExtraCostsCards houses={houses} pricingCategories={pricingCategories} />)

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
      const pricingCategories: PricingCategories = [createCategory('deposit', 'Deposit')]

      render(<FAQExtraCostsCards houses={houses} pricingCategories={pricingCategories} />)

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
      const pricingCategories: PricingCategories = [createCategory('deposit', 'Deposit')]

      render(<FAQExtraCostsCards houses={houses} pricingCategories={pricingCategories} />)

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
      const pricingCategories: PricingCategories = [createCategory('deposit', 'Deposit')]

      render(<FAQExtraCostsCards houses={houses} pricingCategories={pricingCategories} />)

      // Simulate API being set after render
      carouselState.mockApi = createMockCarouselApi(carouselState)
      act(() => {
        carouselState.setApiCallback?.(carouselState.mockApi!)
      })

      // Click on the second navigation dot
      const appleButton = screen.getByLabelText('Go to Apple House')
      fireEvent.click(appleButton)

      expect(carouselState.mockApi.scrollTo).toHaveBeenCalledWith(1)
    })
  })

  describe('carousel API integration', () => {
    it('registers select and reInit event handlers', () => {
      const houses: Houses = [createHouse('h1', 'orange'), createHouse('h2', 'apple')]
      const pricingCategories: PricingCategories = [createCategory('deposit', 'Deposit')]

      render(<FAQExtraCostsCards houses={houses} pricingCategories={pricingCategories} />)

      carouselState.mockApi = createMockCarouselApi(carouselState)
      act(() => {
        carouselState.setApiCallback?.(carouselState.mockApi!)
      })

      // Verify event handlers were registered
      expect(carouselState.mockApi.on).toHaveBeenCalledWith('select', expect.any(Function))
      expect(carouselState.mockApi.on).toHaveBeenCalledWith('reInit', expect.any(Function))
    })

    it('updates current index when select event fires', () => {
      const houses: Houses = [
        createHouse('h1', 'orange'),
        createHouse('h2', 'apple'),
        createHouse('h3', 'lemon')
      ]
      const pricingCategories: PricingCategories = [createCategory('deposit', 'Deposit')]

      render(<FAQExtraCostsCards houses={houses} pricingCategories={pricingCategories} />)

      carouselState.mockApi = createMockCarouselApi(carouselState)
      act(() => {
        carouselState.setApiCallback?.(carouselState.mockApi!)
      })

      // Initial state: first dot should be active (w-6 class)
      const dots = screen
        .getAllByRole('button')
        .filter((btn) => btn.getAttribute('aria-label')?.startsWith('Go to'))
      expect(dots).toHaveLength(3)
      expect(dots[0]).toHaveClass('w-6')
      expect(dots[1]).toHaveClass('w-2')
      expect(dots[2]).toHaveClass('w-2')

      // Simulate scrolling to second item
      act(() => {
        carouselState.currentSelectedIndex = 1
        carouselState.apiCallbacks.get('select')?.forEach((cb) => cb())
      })

      // After selection: second dot should now be active
      expect(dots[0]).toHaveClass('w-2')
      expect(dots[1]).toHaveClass('w-6')
      expect(dots[2]).toHaveClass('w-2')
    })

    it('cleans up event handlers on unmount', () => {
      const houses: Houses = [createHouse('h1', 'orange'), createHouse('h2', 'apple')]
      const pricingCategories: PricingCategories = [createCategory('deposit', 'Deposit')]

      const { unmount } = render(
        <FAQExtraCostsCards houses={houses} pricingCategories={pricingCategories} />
      )

      carouselState.mockApi = createMockCarouselApi(carouselState)
      act(() => {
        carouselState.setApiCallback?.(carouselState.mockApi!)
      })

      unmount()

      // Verify off was called to clean up handlers
      expect(carouselState.mockApi.off).toHaveBeenCalledWith('select', expect.any(Function))
      expect(carouselState.mockApi.off).toHaveBeenCalledWith('reInit', expect.any(Function))
    })
  })

  describe('portable text list rendering', () => {
    it('renders bullet list items', () => {
      const houses: Houses = [
        createHouse('h1', 'orange', [
          createExtraCostWithList('utilities', ['Water', 'Gas', 'Electricity'], 'bullet')
        ])
      ]
      const pricingCategories: PricingCategories = [createCategory('utilities', 'Utilities')]

      render(<FAQExtraCostsCards houses={houses} pricingCategories={pricingCategories} />)

      expect(screen.getByText('Water')).toBeInTheDocument()
      expect(screen.getByText('Gas')).toBeInTheDocument()
      expect(screen.getByText('Electricity')).toBeInTheDocument()
    })

    it('renders numbered list items', () => {
      const houses: Houses = [
        createHouse('h1', 'orange', [
          createExtraCostWithList('steps', ['Step 1', 'Step 2'], 'number')
        ])
      ]
      const pricingCategories: PricingCategories = [createCategory('steps', 'Steps')]

      render(<FAQExtraCostsCards houses={houses} pricingCategories={pricingCategories} />)

      expect(screen.getByText('Step 1')).toBeInTheDocument()
      expect(screen.getByText('Step 2')).toBeInTheDocument()
    })
  })

  describe('null extraCosts handling', () => {
    it('handles house with null extraCosts', () => {
      const house = createHouse('h1', 'orange')
      house.extraCosts = null
      const pricingCategories: PricingCategories = [createCategory('deposit', 'Deposit')]

      render(<FAQExtraCostsCards houses={[house]} pricingCategories={pricingCategories} />)

      expect(screen.getByText('–')).toBeInTheDocument()
    })
  })
})
