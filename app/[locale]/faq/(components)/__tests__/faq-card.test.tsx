import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { HousesBuildingQueryResult } from '@/sanity.types'

// Mock FAQContactTable since it has its own complex dependencies (next-intl, next/image, sanity)
vi.mock('@/app/[locale]/faq/(components)/faq-contact-table', () => ({
  FAQContactTable: ({ houses }: { houses: unknown[] }) => (
    <div data-testid="faq-contact-table">
      {houses.length} houses
    </div>
  )
}))

import FAQCard from '../faq-card'

type Houses = NonNullable<HousesBuildingQueryResult>

const createHouse = (id: string, slug: 'orange' | 'apple' | 'lemon'): Houses[number] => ({
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
  extraCosts: null
})

const contactSection = [
  {
    _type: 'block' as const,
    _key: 'block1',
    children: [{ _type: 'span' as const, _key: 'span1', text: 'Contact Us', marks: [] }],
    markDefs: [],
    style: 'h2' as const
  },
  {
    _type: 'block' as const,
    _key: 'block2',
    children: [
      { _type: 'span' as const, _key: 'span2', text: 'Feel free to reach out', marks: [] }
    ],
    markDefs: [],
    style: 'normal' as const
  }
]

describe('FAQCard', () => {
  const houses: Houses = [createHouse('h1', 'orange'), createHouse('h2', 'apple')]

  it('renders contact section portable text', () => {
    render(<FAQCard contactSection={contactSection} houses={houses} />)

    expect(screen.getByText('Contact Us')).toBeInTheDocument()
    expect(screen.getByText('Feel free to reach out')).toBeInTheDocument()
  })

  it('renders the FAQContactTable', () => {
    render(<FAQCard contactSection={contactSection} houses={houses} />)

    expect(screen.getByTestId('faq-contact-table')).toBeInTheDocument()
  })

  it('renders contact note when provided', () => {
    render(
      <FAQCard contactSection={contactSection} contactNote="Available 24/7" houses={houses} />
    )

    expect(screen.getByText('Available 24/7')).toBeInTheDocument()
  })

  it('does not render footer when contactNote is null', () => {
    const { container } = render(
      <FAQCard contactSection={contactSection} contactNote={null} houses={houses} />
    )

    expect(container.querySelector('[data-slot="card-footer"]')).not.toBeInTheDocument()
  })

  it('does not render contact section when null', () => {
    render(<FAQCard contactSection={null} contactNote="Note" houses={houses} />)

    expect(screen.queryByText('Contact Us')).not.toBeInTheDocument()
    expect(screen.getByText('Note')).toBeInTheDocument()
  })
})
