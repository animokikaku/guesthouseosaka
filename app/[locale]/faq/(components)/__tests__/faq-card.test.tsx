import { createHouse, type Houses } from '@/lib/__tests__/utils/faq-fixtures'
import { render, screen, within } from '@testing-library/react'
import FAQCard from '../faq-card'

vi.mock('next/image', () => import('@/components/__tests__/mocks/next-image'))

const contactSection = [
  {
    _type: 'block' as const,
    _key: 'heading',
    children: [
      { _type: 'span' as const, _key: 'heading-text', text: 'Still have questions?', marks: [] }
    ],
    markDefs: [],
    style: 'h2' as const
  }
]

const houses: Houses = [
  {
    ...createHouse('h1', 'orange'),
    phone: { _type: 'housePhone', domestic: '06-6131-6677', international: '+81-6-6131-6677' }
  },
  {
    ...createHouse('h2', 'apple'),
    phone: { _type: 'housePhone', domestic: '06-6627-0790', international: '+81-6-6627-0790' }
  }
]

describe('FAQCard', () => {
  it('heads the card with the CMS contact section and its note', () => {
    render(
      <FAQCard contactSection={contactSection} contactNote="Open 10:00–20:00" houses={houses} />
    )

    expect(screen.getByRole('heading', { name: 'Still have questions?' })).toBeInTheDocument()
    expect(screen.getByText('Open 10:00–20:00')).toBeInTheDocument()
  })

  // The table (desktop) lists both numbers; the cards (mobile) dial the
  // international one, which works from anywhere.
  it('lets visitors call each house from Japan or from abroad', () => {
    render(<FAQCard contactSection={null} houses={houses} />)

    const table = screen.getByRole('table')
    const orange = within(table).getByRole('row', { name: /\bOrange House\b/ })
    expect(within(orange).getByRole('link', { name: '06-6131-6677' })).toHaveAttribute(
      'href',
      'tel:06-6131-6677'
    )
    expect(within(orange).getByRole('link', { name: '+81-6-6131-6677' })).toHaveAttribute(
      'href',
      'tel:+81-6-6131-6677'
    )
    expect(within(table).getByRole('columnheader', { name: /\bjapan\b/i })).toBeInTheDocument()
    expect(within(table).getByRole('columnheader', { name: /\boverseas\b/i })).toBeInTheDocument()

    const cards = screen.getAllByRole('link').filter((link) => !table.contains(link))
    expect(cards.map((card) => card.getAttribute('href'))).toEqual([
      'tel:+81-6-6131-6677',
      'tel:+81-6-6627-0790'
    ])
  })

  it('leaves out the footer without a note', () => {
    render(<FAQCard contactSection={contactSection} contactNote={null} houses={houses} />)

    expect(screen.queryByText('Open 10:00–20:00')).not.toBeInTheDocument()
  })
})
