import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FAQExtraCostsTable } from '../faq-extra-costs-table'
import {
  type Houses,
  type PricingCategories,
  createCategory,
  createExtraCost,
  createExtraCostWithList,
  createHouse
} from '@/lib/__tests__/utils/faq-fixtures'

describe('FAQExtraCostsTable', () => {
  describe('empty states', () => {
    it('returns null when houses array is empty', () => {
      const pricingCategories: PricingCategories = [createCategory('deposit', 'Deposit')]

      const { container } = render(
        <FAQExtraCostsTable houses={[]} pricingCategories={pricingCategories} />
      )

      expect(container.firstChild).toBeNull()
    })

    it('returns null when pricingCategories is empty', () => {
      const houses: Houses = [createHouse('h1', 'orange')]

      const { container } = render(<FAQExtraCostsTable houses={houses} pricingCategories={[]} />)

      expect(container.firstChild).toBeNull()
    })
  })

  describe('data rendering', () => {
    it('renders table with house headers', () => {
      const houses: Houses = [
        createHouse('h1', 'orange'),
        createHouse('h2', 'apple'),
        createHouse('h3', 'lemon')
      ]
      const pricingCategories: PricingCategories = [createCategory('deposit', 'Deposit')]

      render(<FAQExtraCostsTable houses={houses} pricingCategories={pricingCategories} />)

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

      render(<FAQExtraCostsTable houses={houses} pricingCategories={pricingCategories} />)

      expect(screen.getByText('Deposit')).toBeInTheDocument()
      expect(screen.getByText('Common fees')).toBeInTheDocument()
      expect(screen.getByText('Internet')).toBeInTheDocument()
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

      render(<FAQExtraCostsTable houses={houses} pricingCategories={pricingCategories} />)

      expect(screen.getByText('¥30,000')).toBeInTheDocument()
      expect(screen.getByText('Free')).toBeInTheDocument()
      // Apple house has no costs
      expect(screen.getAllByText('–')).toHaveLength(2)
    })

    it('renders bullet list items', () => {
      const houses: Houses = [
        createHouse('h1', 'orange', [
          createExtraCostWithList('utilities', ['Water', 'Gas', 'Electricity'], 'bullet')
        ])
      ]
      const pricingCategories: PricingCategories = [createCategory('utilities', 'Utilities')]

      render(<FAQExtraCostsTable houses={houses} pricingCategories={pricingCategories} />)

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

      render(<FAQExtraCostsTable houses={houses} pricingCategories={pricingCategories} />)

      expect(screen.getByText('Step 1')).toBeInTheDocument()
      expect(screen.getByText('Step 2')).toBeInTheDocument()
    })
  })
})
