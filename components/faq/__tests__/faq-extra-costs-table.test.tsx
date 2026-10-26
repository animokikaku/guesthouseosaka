import {
  createCategory,
  createExtraCost,
  createExtraCostWithList,
  createHouse
} from '@/lib/__tests__/utils/faq-fixtures'
import { render, screen } from '@testing-library/react'
import { FAQExtraCostsTable } from '../faq-extra-costs-table'

/** The table as rows of cell text, header row first. */
function grid() {
  return screen
    .getAllByRole('row')
    .map((row) => [...row.querySelectorAll('th, td')].map((cell) => cell.textContent))
}

describe('FAQExtraCostsTable', () => {
  it('lays out each house’s cost per category, with a dash where it has none', () => {
    render(
      <FAQExtraCostsTable
        houses={[
          createHouse('h1', 'orange', [
            createExtraCost('deposit', '¥30,000'),
            createExtraCost('internet', 'Free')
          ]),
          createHouse('h2', 'apple', [createExtraCost('internet', '¥1,000')]),
          createHouse('h3', 'lemon', null)
        ]}
        pricingCategories={[
          createCategory('deposit', 'Deposit'),
          createCategory('internet', 'Internet')
        ]}
      />
    )

    expect(grid()).toEqual([
      ['', 'Orange House', 'Apple House', 'Lemon House'],
      ['Deposit', '¥30,000', '–', '–'],
      ['Internet', 'Free', '¥1,000', '–']
    ])
  })

  it.each(['bullet', 'number'] as const)('renders %s lists as list items', (listItem) => {
    render(
      <FAQExtraCostsTable
        houses={[
          createHouse('h1', 'orange', [
            createExtraCostWithList('utilities', ['Water', 'Gas'], listItem)
          ])
        ]}
        pricingCategories={[createCategory('utilities', 'Utilities')]}
      />
    )

    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      'Water',
      'Gas'
    ])
  })

  it.each([
    ['houses', [], [createCategory('deposit', 'Deposit')]],
    ['categories', [createHouse('h1', 'orange')], []]
  ])('renders nothing without %s', (_name, houses, pricingCategories) => {
    const { container } = render(
      <FAQExtraCostsTable houses={houses} pricingCategories={pricingCategories} />
    )

    expect(container).toBeEmptyDOMElement()
  })
})
