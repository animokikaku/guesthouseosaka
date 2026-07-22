import { fireEvent, render, screen } from '@testing-library/react'
import type { ComponentProps } from 'react'

vi.mock('@/app/[locale]/faq/(components)/faq-extra-costs', () => ({
  FAQExtraCosts: () => <div>Extra costs</div>
}))

vi.mock('next-sanity', () => ({
  createDataAttribute: () => (path: string) => path
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
})
