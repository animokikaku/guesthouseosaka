import type { PricingRowData } from '@/lib/types/components'
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HousePricing } from '../house-pricing'

// Test data with no content
const mockPricing: PricingRowData[] = [
  { _key: '1', label: 'Monthly Rent', content: null },
  { _key: '2', label: 'Deposit', content: null },
  { _key: '3', label: 'Utilities', content: null }
]

// Test data with normal block content
const mockPricingWithContent: PricingRowData[] = [
  {
    _key: '1',
    label: 'Monthly Rent',
    content: [
      {
        _type: 'block',
        _key: 'block1',
        style: 'normal',
        children: [
          { _type: 'span', _key: 'span1', text: '45,000 JPY', marks: [] }
        ],
        markDefs: []
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
        style: 'normal',
        children: [
          { _type: 'span', _key: 'span2', text: '1 month', marks: [] }
        ],
        markDefs: []
      }
    ] as PricingRowData['content']
  }
]

// Test data with bullet list
const mockPricingWithBulletList: PricingRowData[] = [
  {
    _key: '1',
    label: 'Included',
    content: [
      {
        _type: 'block',
        _key: 'li1',
        style: 'normal',
        listItem: 'bullet',
        level: 1,
        children: [{ _type: 'span', _key: 's1', text: 'Water', marks: [] }],
        markDefs: []
      },
      {
        _type: 'block',
        _key: 'li2',
        style: 'normal',
        listItem: 'bullet',
        level: 1,
        children: [
          { _type: 'span', _key: 's2', text: 'Electricity', marks: [] }
        ],
        markDefs: []
      }
    ] as PricingRowData['content']
  }
]

// Test data with numbered list
const mockPricingWithNumberedList: PricingRowData[] = [
  {
    _key: '1',
    label: 'Payment Steps',
    content: [
      {
        _type: 'block',
        _key: 'li1',
        style: 'normal',
        listItem: 'number',
        level: 1,
        children: [
          { _type: 'span', _key: 's1', text: 'Submit application', marks: [] }
        ],
        markDefs: []
      },
      {
        _type: 'block',
        _key: 'li2',
        style: 'normal',
        listItem: 'number',
        level: 1,
        children: [
          { _type: 'span', _key: 's2', text: 'Pay deposit', marks: [] }
        ],
        markDefs: []
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

  it('renders correct number of pricing rows', () => {
    const singlePricing: PricingRowData[] = [
      { _key: 'single', label: 'Price', content: null }
    ]

    render(<HousePricing pricing={singlePricing} />)

    expect(screen.getByText('Price')).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 4 })).toHaveLength(1)
  })

  describe('PortableText content rendering', () => {
    it('does not render content when content is null', () => {
      render(<HousePricing pricing={mockPricing} />)

      // mockPricing has null content, verify no list elements are rendered
      expect(screen.queryByRole('list')).not.toBeInTheDocument()

      // Verify the content containers are empty (only contain whitespace)
      const labels = screen.getAllByRole('heading', { level: 4 })
      labels.forEach((label) => {
        const row = label.closest('div')?.parentElement
        const contentArea = row?.querySelector('div:last-child')
        expect(contentArea?.textContent?.trim()).toBe('')
      })
    })

    it('renders block content', () => {
      render(<HousePricing pricing={mockPricingWithContent} />)

      expect(screen.getByText('45,000 JPY')).toBeInTheDocument()
      expect(screen.getByText('1 month')).toBeInTheDocument()
    })

    it('renders bullet list content', () => {
      render(<HousePricing pricing={mockPricingWithBulletList} />)

      expect(screen.getByText('Water')).toBeInTheDocument()
      expect(screen.getByText('Electricity')).toBeInTheDocument()

      const items = within(screen.getByRole('list')).getAllByRole('listitem')
      expect(items).toHaveLength(2)
    })

    it('renders numbered list content', () => {
      render(<HousePricing pricing={mockPricingWithNumberedList} />)

      expect(screen.getByText('Submit application')).toBeInTheDocument()
      expect(screen.getByText('Pay deposit')).toBeInTheDocument()

      const items = within(screen.getByRole('list')).getAllByRole('listitem')
      expect(items).toHaveLength(2)
    })
  })
})
