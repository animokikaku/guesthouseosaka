import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import {
  type Houses,
  type PricingCategories,
  createCategory,
  createExtraCost,
  createExtraCostWithList,
  createHouse
} from '@/lib/__tests__/utils/faq-fixtures'
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

      const { container } = render(
        <FAQExtraCostsCards houses={houses} pricingCategories={[]} />
      )

      expect(container.firstChild).toBeNull()
    })
  })

  describe('data rendering', () => {
    it('renders cards with house titles and category labels', () => {
      const houses: Houses = [
        createHouse('h1', 'orange'),
        createHouse('h2', 'apple'),
        createHouse('h3', 'lemon')
      ]
      const pricingCategories: PricingCategories = [
        createCategory('deposit', 'Deposit'),
        createCategory('internet', 'Internet')
      ]

      render(<FAQExtraCostsCards houses={houses} pricingCategories={pricingCategories} />)

      expect(screen.getByText('Orange House')).toBeInTheDocument()
      expect(screen.getByText('Apple House')).toBeInTheDocument()
      expect(screen.getByText('Lemon House')).toBeInTheDocument()
      expect(screen.getAllByText('Deposit')).toHaveLength(3)
      expect(screen.getAllByText('Internet')).toHaveLength(3)
    })

    it('renders values for matching categories and dashes for missing ones', () => {
      const houses: Houses = [
        createHouse('h1', 'orange', [
          createExtraCost('deposit', '¥30,000'),
          createExtraCost('internet', 'Free')
        ]),
        createHouse('h2', 'apple', [])
      ]
      const pricingCategories: PricingCategories = [
        createCategory('deposit', 'Deposit'),
        createCategory('internet', 'Internet')
      ]

      render(<FAQExtraCostsCards houses={houses} pricingCategories={pricingCategories} />)

      expect(screen.getByText('¥30,000')).toBeInTheDocument()
      expect(screen.getByText('Free')).toBeInTheDocument()
      // Apple house has no costs
      expect(screen.getAllByText('–')).toHaveLength(2)
    })

    it('handles house with null extraCosts', () => {
      const pricingCategories: PricingCategories = [createCategory('deposit', 'Deposit')]

      render(
        <FAQExtraCostsCards
          houses={[createHouse('h1', 'orange', null)]}
          pricingCategories={pricingCategories}
        />
      )

      expect(screen.getByText('–')).toBeInTheDocument()
    })

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

  describe('navigation dots', () => {
    it('renders navigation dots for each house', () => {
      const houses: Houses = [
        createHouse('h1', 'orange'),
        createHouse('h2', 'apple'),
        createHouse('h3', 'lemon')
      ]
      const pricingCategories: PricingCategories = [createCategory('deposit', 'Deposit')]

      render(<FAQExtraCostsCards houses={houses} pricingCategories={pricingCategories} />)

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

      carouselState.mockApi = createMockCarouselApi(carouselState)
      act(() => {
        carouselState.setApiCallback?.(carouselState.mockApi!)
      })

      fireEvent.click(screen.getByLabelText('Go to Apple House'))

      expect(carouselState.mockApi.scrollTo).toHaveBeenCalledWith(1)
    })
  })

  describe('carousel API integration', () => {
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
      expect(dots[0]).toHaveClass('w-6')
      expect(dots[1]).toHaveClass('w-2')

      // Simulate scrolling to second item
      act(() => {
        carouselState.currentSelectedIndex = 1
        carouselState.apiCallbacks.get('select')?.forEach((cb) => cb())
      })

      expect(dots[0]).toHaveClass('w-2')
      expect(dots[1]).toHaveClass('w-6')
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

      expect(carouselState.mockApi.off).toHaveBeenCalledWith('select', expect.any(Function))
      expect(carouselState.mockApi.off).toHaveBeenCalledWith('reInit', expect.any(Function))
    })
  })
})
