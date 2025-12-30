import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FAQExtraCostsTable } from '../faq-extra-costs-table'
import type {
  HousesBuildingQueryResult,
  PricingCategoriesQueryResult
} from '@/sanity.types'

type PricingCategories = NonNullable<PricingCategoriesQueryResult>
type Houses = NonNullable<HousesBuildingQueryResult>
type ExtraCost = NonNullable<Houses[number]['extraCosts']>[number]

const createCategory = (
  slug: string,
  title: string
): PricingCategories[number] => ({
  _id: `cat-${slug}`,
  slug,
  title,
  orderRank: `0|${slug}:`
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
  phone: null,
  extraCosts
})

const createExtraCost = (slug: string, text: string): ExtraCost => ({
  slug,
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

describe('FAQExtraCostsTable', () => {
  describe('empty states', () => {
    it('returns null when houses array is empty', () => {
      const pricingCategories: PricingCategories = [
        createCategory('deposit', 'Deposit')
      ]

      const { container } = render(
        <FAQExtraCostsTable houses={[]} pricingCategories={pricingCategories} />
      )

      expect(container.firstChild).toBeNull()
    })

    it('returns null when pricingCategories is empty', () => {
      const houses: Houses = [createHouse('h1', 'orange')]

      const { container } = render(
        <FAQExtraCostsTable houses={houses} pricingCategories={[]} />
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
        <FAQExtraCostsTable
          houses={houses}
          pricingCategories={pricingCategories}
        />
      )

      expect(screen.getByText('–')).toBeInTheDocument()
    })

    it('shows values for some houses and dashes for others', () => {
      const houses: Houses = [
        createHouse('h1', 'orange', [createExtraCost('deposit', '¥30,000')]),
        createHouse('h2', 'apple', [])
      ]
      const pricingCategories: PricingCategories = [
        createCategory('deposit', 'Deposit')
      ]

      render(
        <FAQExtraCostsTable
          houses={houses}
          pricingCategories={pricingCategories}
        />
      )

      expect(screen.getByText('¥30,000')).toBeInTheDocument()
      expect(screen.getByText('–')).toBeInTheDocument()
    })
  })

  describe('complete data rendering', () => {
    it('renders table with house headers', () => {
      const houses: Houses = [
        createHouse('h1', 'orange'),
        createHouse('h2', 'apple'),
        createHouse('h3', 'lemon')
      ]
      const pricingCategories: PricingCategories = [
        createCategory('deposit', 'Deposit')
      ]

      render(
        <FAQExtraCostsTable
          houses={houses}
          pricingCategories={pricingCategories}
        />
      )

      expect(screen.getByText('Orange House')).toBeInTheDocument()
      expect(screen.getByText('Apple House')).toBeInTheDocument()
      expect(screen.getByText('Lemon House')).toBeInTheDocument()
    })

    it('renders category labels in rows', () => {
      const houses: Houses = [createHouse('h1', 'orange')]
      const pricingCategories: PricingCategories = [
        createCategory('deposit', 'Deposit'),
        createCategory('common-fees', 'Common fees'),
        createCategory('internet', 'Internet')
      ]

      render(
        <FAQExtraCostsTable
          houses={houses}
          pricingCategories={pricingCategories}
        />
      )

      expect(screen.getByText('Deposit')).toBeInTheDocument()
      expect(screen.getByText('Common fees')).toBeInTheDocument()
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
        <FAQExtraCostsTable
          houses={houses}
          pricingCategories={pricingCategories}
        />
      )

      expect(screen.getByText('¥30,000')).toBeInTheDocument()
      expect(screen.getByText('Free')).toBeInTheDocument()
    })

    it('matches category by slug correctly', () => {
      const houses: Houses = [
        createHouse('h1', 'orange', [
          createExtraCost('utility-fees', '¥3,000/month')
        ])
      ]
      const pricingCategories: PricingCategories = [
        createCategory('deposit', 'Deposit'),
        createCategory('utility-fees', 'Utility fees')
      ]

      render(
        <FAQExtraCostsTable
          houses={houses}
          pricingCategories={pricingCategories}
        />
      )

      expect(screen.getByText('¥3,000/month')).toBeInTheDocument()
      // First row (Deposit) should have a dash
      expect(screen.getByText('–')).toBeInTheDocument()
    })
  })
})
