import type { PricingRowData } from '@/lib/types/components'
import { render, screen, within } from '@testing-library/react'
import { HousePricing } from '../house-pricing'

/** A pricing row whose content is one PortableText block per entry. */
function row(
  label: string,
  entries: string[] = [],
  listItem?: 'bullet' | 'number'
): PricingRowData {
  return {
    _key: label,
    label,
    content: entries.length
      ? entries.map((text, index) => ({
          _type: 'block' as const,
          _key: `${label}-${index}`,
          style: 'normal',
          ...(listItem ? { listItem, level: 1 } : {}),
          children: [{ _type: 'span' as const, _key: `${label}-${index}-span`, text, marks: [] }],
          markDefs: []
        }))
      : null
  }
}

const emptyRows = [row('Monthly Rent'), row('Deposit'), row('Utilities')]

describe('HousePricing', () => {
  it('renders each row label as a heading under the anchor section', () => {
    render(<HousePricing pricing={emptyRows} />)

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Pricing')
    expect(document.getElementById('pricing')).toBeInTheDocument()
    expect(
      screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)
    ).toEqual(['Monthly Rent', 'Deposit', 'Utilities'])
  })

  it.each([
    ['empty', []],
    ['missing', null]
  ])('renders nothing when pricing is %s', (_name, pricing) => {
    const { container } = render(<HousePricing pricing={pricing} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders block content next to its label', () => {
    render(
      <HousePricing pricing={[row('Monthly Rent', ['45,000 JPY']), row('Deposit', ['1 month'])]} />
    )

    expect(screen.getByText('45,000 JPY')).toBeInTheDocument()
    expect(screen.getByText('1 month')).toBeInTheDocument()
  })

  it.each(['bullet', 'number'] as const)('renders %s list content as a list', (listItem) => {
    render(<HousePricing pricing={[row('Included', ['Water', 'Electricity'], listItem)]} />)

    const items = within(screen.getByRole('list')).getAllByRole('listitem')
    expect(items.map((item) => item.textContent)).toEqual(['Water', 'Electricity'])
  })
})
