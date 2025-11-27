import type { ReactNode } from 'react'

import { FAQExtraCostsTable } from '@/app/[locale]/faq/(components)/faq-extra-costs-table'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { useTranslations } from 'next-intl'

type FaqItem = {
  id: string
  question: string
  body: ReactNode
}

export function FAQAccordion() {
  const t = useTranslations()

  const items: FaqItem[] = [
    {
      id: 'room-occupancy',
      question: t('faq.qa.roomOccupancy.question'),
      body: <p>{t('faq.qa.roomOccupancy.answer')}</p>
    },
    {
      id: 'rent-due-date',
      question: t('faq.qa.rentDueDate.question'),
      body: (
        <p>
          {t.rich(
            'faq.qa.rentDueDate.answer',
            {
              strong: (chunks) => <strong>{chunks}</strong>
            }
          )}
        </p>
      )
    },
    {
      id: 'manager-in-residence',
      question: t('faq.qa.managerInResidence.question'),
      body: (
        <p>
          {t.rich(
            'faq.qa.managerInResidence.answer',
            {
              strong: (chunks) => <strong>{chunks}</strong>
            }
          )}
        </p>
      )
    },
    {
      id: 'move-in-requirements',
      question: t('faq.qa.moveInRequirements.question'),
      body: (
        <p>
          {t('faq.qa.moveInRequirements.answer')}
        </p>
      )
    },
    {
      id: 'curfew',
      question: t('faq.qa.curfew.question'),
      body: (
        <p>
          {t('faq.qa.curfew.answer')}
        </p>
      )
    },
    {
      id: 'floors-and-rooms',
      question: t('faq.qa.floorsAndRooms.question'),
      body: (
        <ul className="text-muted-foreground list-disc space-y-2">
          <li>
            <strong>{t('houses.orange.name')}: </strong>
            {t('faq.qa.floorsAndRooms.format', {
              floors: '3',
              rooms: '28'
            })}
          </li>
          <li>
            <strong>{t('houses.lemon.name')}: </strong>
            {t('faq.qa.floorsAndRooms.format', {
              floors: '7',
              rooms: '12'
            })}
          </li>
          <li>
            <strong>{t('houses.apple.name')}: </strong>
            {t('faq.qa.floorsAndRooms.format', {
              floors: '8',
              rooms: '24'
            })}
          </li>
        </ul>
      )
    },
    {
      id: 'extra-costs',
      question: t('faq.qa.extraCosts.question'),
      body: <FAQExtraCostsTable />
    }
  ]

  return (
    <Accordion type="multiple">
      {items.map(({ body, id, question }) => (
        <AccordionItem key={id} value={id}>
          <AccordionTrigger className="text-md sm:text-lg">
            {question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground flex flex-col gap-4 text-sm sm:text-base">
            {body}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
