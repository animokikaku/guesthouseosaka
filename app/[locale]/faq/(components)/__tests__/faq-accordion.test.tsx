import { createHouse } from '@/lib/__tests__/utils/faq-fixtures'
import { fireEvent, render, screen } from '@testing-library/react'
import type { ComponentProps } from 'react'

vi.mock('@/app/[locale]/faq/(components)/faq-extra-costs', () => ({
  FAQExtraCosts: () => <div>Extra costs</div>
}))

import { FAQAccordion } from '../faq-accordion'

type FAQAccordionProps = ComponentProps<typeof FAQAccordion>

const faqQuestions: FAQAccordionProps['faqQuestions'] = [
  {
    _id: 'first',
    _type: 'faqQuestion',
    question: 'First question',
    answer: [
      {
        _key: 'first-answer',
        _type: 'block',
        children: [{ _key: 'first-text', _type: 'span', marks: [], text: 'First answer' }],
        markDefs: [],
        style: 'normal'
      }
    ],
    componentKey: null
  },
  {
    _id: 'second',
    _type: 'faqQuestion',
    question: 'Second question',
    answer: [
      {
        _key: 'second-answer',
        _type: 'block',
        children: [{ _key: 'second-text', _type: 'span', marks: [], text: 'Second answer' }],
        markDefs: [],
        style: 'normal'
      }
    ],
    componentKey: null
  }
]

const props: FAQAccordionProps = {
  faqQuestions,
  housesBuilding: [],
  pricingCategories: []
}

describe('FAQAccordion', () => {
  it('expands an answer when its question is selected', () => {
    render(<FAQAccordion {...props} />)
    const firstTrigger = screen.getByRole('button', { name: 'First question' })

    expect(firstTrigger).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(firstTrigger)

    expect(firstTrigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('First answer')).toBeVisible()
  })

  it('allows multiple answers to remain expanded', () => {
    render(<FAQAccordion {...props} />)
    const firstTrigger = screen.getByRole('button', { name: 'First question' })
    const secondTrigger = screen.getByRole('button', { name: 'Second question' })

    fireEvent.click(firstTrigger)
    fireEvent.click(secondTrigger)

    expect(firstTrigger).toHaveAttribute('aria-expanded', 'true')
    expect(secondTrigger).toHaveAttribute('aria-expanded', 'true')
  })

  // An answer the CMS hands to code: it is built from each house's building data.
  it('answers the floors-and-rooms question from each house’s building', () => {
    render(
      <FAQAccordion
        {...props}
        faqQuestions={[{ ...faqQuestions[0], answer: null, componentKey: 'floors-and-rooms' }]}
        housesBuilding={[
          { ...createHouse('h1', 'orange'), building: { floors: 3, rooms: 12 } },
          createHouse('h2', 'apple')
        ]}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'First question' }))

    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(1)
    expect(items[0]).toHaveTextContent(/^Orange House: 3-story building with 12 rooms/)
  })
})
