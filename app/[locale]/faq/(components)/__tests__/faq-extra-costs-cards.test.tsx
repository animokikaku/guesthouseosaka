import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { FAQExtraCostsCards } from '../faq-extra-costs-cards'
import type {
  FaqPageQueryResult,
  HousesBuildingQueryResult
} from '@/sanity.types'

// Mock stegaClean to return values unchanged
vi.mock('@sanity/client/stega', () => ({
  stegaClean: <T,>(value: T) => value
}))

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

type CategoryOrder = NonNullable<FaqPageQueryResult>['categoryOrder']
type Houses = NonNullable<HousesBuildingQueryResult>

const createCategory = (
  slug: string,
  title: string
): NonNullable<CategoryOrder>[number] => ({
  _key: `key-${slug}`,
  category: { _id: `cat-${slug}`, slug, title }
})

const createHouse = (
  id: string,
  slug: 'orange' | 'apple' | 'lemon',
  extraCosts: Houses[number]['extraCosts'] = []
): Houses[number] => ({
  _id: id,
  _type: 'house',
  title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} House`,
  slug,
  building: null,
  phone: null,
  extraCosts
})

const createExtraCost = (
  categorySlug: string,
  value: string
): NonNullable<Houses[number]['extraCosts']>[number] => ({
  _key: `cost-${categorySlug}`,
  category: { _id: `cat-${categorySlug}`, slug: categorySlug, title: '' },
  value: [
    {
      _type: 'block',
      _key: 'block1',
      children: [{ _type: 'span', _key: 'span1', text: value }]
    }
  ]
})

describe('FAQExtraCostsCards', () => {
  describe('empty states', () => {
    it('returns null when houses is undefined', () => {
      const categoryOrder: CategoryOrder = [createCategory('deposit', 'Deposit')]

      const { container } = render(
        <FAQExtraCostsCards
          houses={undefined as unknown as Houses}
          categoryOrder={categoryOrder}
        />
      )

      expect(container.firstChild).toBeNull()
    })

    it('returns null when houses array is empty', () => {
      const categoryOrder: CategoryOrder = [createCategory('deposit', 'Deposit')]

      const { container } = render(
        <FAQExtraCostsCards houses={[]} categoryOrder={categoryOrder} />
      )

      expect(container.firstChild).toBeNull()
    })

    it('returns null when categoryOrder is undefined', () => {
      const houses: Houses = [createHouse('h1', 'orange')]

      const { container } = render(
        <FAQExtraCostsCards houses={houses} categoryOrder={undefined} />
      )

      expect(container.firstChild).toBeNull()
    })

    it('returns null when categoryOrder is empty', () => {
      const houses: Houses = [createHouse('h1', 'orange')]

      const { container } = render(
        <FAQExtraCostsCards houses={houses} categoryOrder={[]} />
      )

      expect(container.firstChild).toBeNull()
    })
  })

  describe('missing category data', () => {
    it('skips category row when category slug is missing', () => {
      const houses: Houses = [
        createHouse('h1', 'orange', [createExtraCost('deposit', '¥30,000')])
      ]
      const categoryOrder: CategoryOrder = [
        createCategory('deposit', 'Deposit'),
        { _key: 'no-slug', category: { _id: 'cat-null', slug: '', title: 'No Slug Category' } }
      ]

      render(<FAQExtraCostsCards houses={houses} categoryOrder={categoryOrder} />)

      expect(screen.getByText('Deposit')).toBeInTheDocument()
      expect(screen.queryByText('No Slug Category')).not.toBeInTheDocument()
    })

    it('skips category row when category is null', () => {
      const houses: Houses = [
        createHouse('h1', 'orange', [createExtraCost('deposit', '¥30,000')])
      ]
      const categoryOrder: CategoryOrder = [
        createCategory('deposit', 'Deposit'),
        { _key: 'null-cat', category: null } as unknown as NonNullable<CategoryOrder>[number]
      ]

      render(<FAQExtraCostsCards houses={houses} categoryOrder={categoryOrder} />)

      expect(screen.getByText('Deposit')).toBeInTheDocument()
    })
  })

  describe('missing house values', () => {
    it('displays dash when house has no value for a category', () => {
      const houses: Houses = [createHouse('h1', 'orange', [])]
      const categoryOrder: CategoryOrder = [createCategory('deposit', 'Deposit')]

      render(<FAQExtraCostsCards houses={houses} categoryOrder={categoryOrder} />)

      expect(screen.getByText('–')).toBeInTheDocument()
    })

    it('displays dash when extraCosts is null', () => {
      const houses: Houses = [
        { ...createHouse('h1', 'orange'), extraCosts: null }
      ]
      const categoryOrder: CategoryOrder = [createCategory('deposit', 'Deposit')]

      render(<FAQExtraCostsCards houses={houses} categoryOrder={categoryOrder} />)

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
      const categoryOrder: CategoryOrder = [createCategory('deposit', 'Deposit')]

      render(<FAQExtraCostsCards houses={houses} categoryOrder={categoryOrder} />)

      expect(screen.getByText('Orange House')).toBeInTheDocument()
      expect(screen.getByText('Apple House')).toBeInTheDocument()
      expect(screen.getByText('Lemon House')).toBeInTheDocument()
    })

    it('renders category labels in each card', () => {
      const houses: Houses = [createHouse('h1', 'orange')]
      const categoryOrder: CategoryOrder = [
        createCategory('deposit', 'Deposit'),
        createCategory('internet', 'Internet')
      ]

      render(<FAQExtraCostsCards houses={houses} categoryOrder={categoryOrder} />)

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
      const categoryOrder: CategoryOrder = [
        createCategory('deposit', 'Deposit'),
        createCategory('internet', 'Internet')
      ]

      render(<FAQExtraCostsCards houses={houses} categoryOrder={categoryOrder} />)

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
      const categoryOrder: CategoryOrder = [createCategory('deposit', 'Deposit')]

      render(<FAQExtraCostsCards houses={houses} categoryOrder={categoryOrder} />)

      expect(screen.getByTestId('carousel')).toBeInTheDocument()
      expect(screen.getByTestId('carousel-content')).toBeInTheDocument()
      // 3 carousel items for 3 houses
      expect(screen.getAllByTestId('carousel-item')).toHaveLength(3)
    })
  })

  describe('visual editing attributes', () => {
    it('applies categoryOrderAttr.list() to card content', () => {
      const houses: Houses = [createHouse('h1', 'orange')]
      const categoryOrder: CategoryOrder = [createCategory('deposit', 'Deposit')]
      const categoryOrderAttr = {
        list: () => 'data-list-attr',
        item: (key: string) => `data-item-${key}`
      }

      const { container } = render(
        <FAQExtraCostsCards
          houses={houses}
          categoryOrder={categoryOrder}
          categoryOrderAttr={categoryOrderAttr}
        />
      )

      const listContainer = container.querySelector('[data-sanity="data-list-attr"]')
      expect(listContainer).toBeInTheDocument()
    })

    it('applies categoryOrderAttr.item() to each category row', () => {
      const houses: Houses = [createHouse('h1', 'orange')]
      const categoryOrder: CategoryOrder = [
        createCategory('deposit', 'Deposit'),
        createCategory('internet', 'Internet')
      ]
      const categoryOrderAttr = {
        list: () => 'data-list-attr',
        item: (key: string) => `data-item-${key}`
      }

      const { container } = render(
        <FAQExtraCostsCards
          houses={houses}
          categoryOrder={categoryOrder}
          categoryOrderAttr={categoryOrderAttr}
        />
      )

      expect(
        container.querySelector('[data-sanity="data-item-key-deposit"]')
      ).toBeInTheDocument()
      expect(
        container.querySelector('[data-sanity="data-item-key-internet"]')
      ).toBeInTheDocument()
    })
  })
})
