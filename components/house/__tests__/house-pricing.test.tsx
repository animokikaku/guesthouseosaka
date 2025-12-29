import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { HousePricing } from '../house-pricing'
import type { PricingRowData } from '@/lib/types/components'

// Mock PortableText component
vi.mock('@portabletext/react', () => ({
  PortableText: ({ value }: { value: unknown[] }) => (
    <div data-testid="portable-text">{value?.length ?? 0} blocks</div>
  )
}))

const mockPricing: PricingRowData[] = [
  { _key: '1', label: 'Monthly Rent', content: null },
  { _key: '2', label: 'Deposit', content: null },
  { _key: '3', label: 'Utilities', content: null }
]

const mockPricingWithContent: PricingRowData[] = [
  {
    _key: '1',
    label: 'Monthly Rent',
    content: [
      {
        _type: 'block',
        _key: 'block1',
        children: [{ _type: 'span', text: '45,000 JPY' }]
      }
    ] as PricingRowData['content']
  },
  {
    _key: '2',
    label: 'Deposit',
    content: [
      {
        _type: 'block',
        _key: 'block2',
        children: [{ _type: 'span', text: '1 month' }]
      }
    ] as PricingRowData['content']
  }
]

describe('HousePricing', () => {
  it('renders pricing rows', () => {
    render(<HousePricing pricing={mockPricing} />)

    expect(screen.getByText('Monthly Rent')).toBeInTheDocument()
    expect(screen.getByText('Deposit')).toBeInTheDocument()
    expect(screen.getByText('Utilities')).toBeInTheDocument()
  })

  it('returns null when no pricing', () => {
    const { container } = render(<HousePricing pricing={[]} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders the heading', () => {
    render(<HousePricing pricing={mockPricing} />)

    // The heading uses the translation key
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'heading'
    )
  })

  it('renders section with correct id for anchor linking', () => {
    render(<HousePricing pricing={mockPricing} />)

    expect(document.getElementById('pricing')).toBeInTheDocument()
  })

  it('renders pricing row labels as headings', () => {
    render(<HousePricing pricing={mockPricing} />)

    const labels = screen.getAllByRole('heading', { level: 4 })
    expect(labels).toHaveLength(3)
    expect(labels[0]).toHaveTextContent('Monthly Rent')
    expect(labels[1]).toHaveTextContent('Deposit')
    expect(labels[2]).toHaveTextContent('Utilities')
  })

  it('renders PortableText content when provided', () => {
    render(<HousePricing pricing={mockPricingWithContent} />)

    const portableTextElements = screen.getAllByTestId('portable-text')
    expect(portableTextElements).toHaveLength(2)
  })

  it('does not render PortableText when content is null', () => {
    render(<HousePricing pricing={mockPricing} />)

    expect(screen.queryByTestId('portable-text')).not.toBeInTheDocument()
  })

  it('renders correct number of pricing rows', () => {
    const singlePricing: PricingRowData[] = [
      { _key: 'single', label: 'Price', content: null }
    ]

    render(<HousePricing pricing={singlePricing} />)

    expect(screen.getByText('Price')).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 4 })).toHaveLength(1)
  })
})
