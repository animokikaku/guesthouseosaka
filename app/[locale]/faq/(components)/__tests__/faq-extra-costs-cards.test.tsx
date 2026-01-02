import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { FAQExtraCostsCards } from '../faq-extra-costs-cards'
import type {
  HousesBuildingQueryResult,
  PricingCategoriesQueryResult
} from '@/sanity.types'

// Mock the Carousel components to avoid embla-carousel complexity
vi.mock('@/components/ui/carousel', () => ({
  Carousel: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="carousel">{children}</div>
  ),
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
  phone: { domestic: '06-1234-5678', international: '+81-6-1234-5678' },
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
})
