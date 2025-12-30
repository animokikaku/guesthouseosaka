import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HousePricing } from '../house-pricing'
import type { PricingRowData } from '@/lib/types/components'

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
        children: [{ _type: 'span', _key: 'span1', text: '45,000 JPY', marks: [] }],
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
        children: [{ _type: 'span', _key: 'span2', text: '1 month', marks: [] }],
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
        children: [{ _type: 'span', _key: 's2', text: 'Electricity', marks: [] }],
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
        children: [{ _type: 'span', _key: 's1', text: 'Submit application', marks: [] }],
        markDefs: []
      },
      {
        _type: 'block',
        _key: 'li2',
        style: 'normal',
        listItem: 'number',
        level: 1,
        children: [{ _type: 'span', _key: 's2', text: 'Pay deposit', marks: [] }],
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
    it('renders normal block content as paragraphs', () => {
      render(<HousePricing pricing={mockPricingWithContent} />)

      // Check that the actual content text is rendered
      expect(screen.getByText('45,000 JPY')).toBeInTheDocument()
      expect(screen.getByText('1 month')).toBeInTheDocument()

      // Verify the text is rendered inside paragraphs with correct styling
      const priceText = screen.getByText('45,000 JPY')
      expect(priceText.tagName).toBe('P')
      expect(priceText).toHaveClass('text-muted-foreground', 'text-sm')
    })

    it('does not render content area when content is null', () => {
      render(<HousePricing pricing={mockPricing} />)

      // Should have no paragraph elements for content
      const section = document.getElementById('pricing')!
      const paragraphs = section.querySelectorAll('p')
      expect(paragraphs).toHaveLength(0)
    })

    it('renders bullet list content with correct structure', () => {
      render(<HousePricing pricing={mockPricingWithBulletList} />)

      // Check list items are rendered
      expect(screen.getByText('Water')).toBeInTheDocument()
      expect(screen.getByText('Electricity')).toBeInTheDocument()

      // Verify bullet list structure
      const list = screen.getByRole('list')
      expect(list.tagName).toBe('UL')
      expect(list).toHaveClass('list-disc')

      // Verify list items
      const items = within(list).getAllByRole('listitem')
      expect(items).toHaveLength(2)
    })

    it('renders numbered list content with correct structure', () => {
      render(<HousePricing pricing={mockPricingWithNumberedList} />)

      // Check list items are rendered
      expect(screen.getByText('Submit application')).toBeInTheDocument()
      expect(screen.getByText('Pay deposit')).toBeInTheDocument()

      // Verify numbered list structure
      const list = screen.getByRole('list')
      expect(list.tagName).toBe('OL')
      expect(list).toHaveClass('list-decimal')

      // Verify list items
      const items = within(list).getAllByRole('listitem')
      expect(items).toHaveLength(2)
    })
  })

  describe('responsive layout', () => {
    it('applies responsive flex classes to pricing rows', () => {
      render(<HousePricing pricing={mockPricing} />)

      const section = document.getElementById('pricing')!
      // Get the first pricing row (after the heading container)
      const pricingRows = section.querySelectorAll('.flex.flex-col')
      expect(pricingRows.length).toBeGreaterThan(0)

      // Check that rows have mobile-first flex-col and md:flex-row classes
      const firstRow = pricingRows[0]
      expect(firstRow).toHaveClass('flex', 'flex-col', 'md:flex-row')
    })

    it('applies correct label column width on desktop', () => {
      render(<HousePricing pricing={mockPricing} />)

      // Get label containers
      const labelContainer = screen.getByText('Monthly Rent').closest('div')
      expect(labelContainer).toHaveClass('md:w-1/3', 'md:shrink-0')
    })

    it('applies correct content column flex on desktop', () => {
      render(<HousePricing pricing={mockPricingWithContent} />)

      // Get content container (parent of the paragraph with content)
      const contentContainer = screen.getByText('45,000 JPY').closest('div')
      expect(contentContainer).toHaveClass('md:flex-1')
    })
  })

  describe('styling', () => {
    it('applies border styling to container', () => {
      render(<HousePricing pricing={mockPricing} />)

      const section = document.getElementById('pricing')!
      const container = section.querySelector('.border-border.rounded-lg')
      expect(container).toBeInTheDocument()
      expect(container).toHaveClass('overflow-hidden')
    })

    it('applies background color to label column', () => {
      render(<HousePricing pricing={mockPricing} />)

      const labelContainer = screen.getByText('Monthly Rent').closest('div')
      expect(labelContainer).toHaveClass('bg-muted/50')
    })
  })
})
