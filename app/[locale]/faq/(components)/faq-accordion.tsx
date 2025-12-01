import type { ReactNode } from 'react'

import { FAQExtraCostsTable } from '@/app/[locale]/faq/(components)/faq-extra-costs-table'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { useHouseLabels } from '@/hooks/use-house-labels'
import { useTranslations } from 'next-intl'

type FaqItem = {
  id: string
  question: string
  body: ReactNode
}

export function FAQAccordion() {
  const t = useTranslations('FAQAccordion')
  const houses = useHouseLabels()

  const items: FaqItem[] = [
    {
      id: 'room-occupancy',
      question: t('room_occupancy.question'),
      body: <p>{t('room_occupancy.answer')}</p>
    },
    {
      id: 'rent-due-date',
      question: t('rent_due_date.question'),
      body: (
        <p>
          {t.rich('rent_due_date.answer', {
            strong: (chunks) => <strong>{chunks}</strong>
          })}
        </p>
      )
    },
    {
      id: 'manager-in-residence',
      question: t('manager_in_residence.question'),
      body: (
        <p>
          {t.rich('manager_in_residence.answer', {
            strong: (chunks) => <strong>{chunks}</strong>
          })}
        </p>
      )
    },
    {
      id: 'move-in-requirements',
      question: t('move_in_requirements.question'),
      body: <p>{t('move_in_requirements.answer')}</p>
    },
    {
      id: 'curfew',
      question: t('curfew.question'),
      body: <p>{t('curfew.answer')}</p>
    },
    {
      id: 'floors-and-rooms',
      question: t('floors_and_rooms.question'),
      body: (
        <ul className="text-muted-foreground list-disc space-y-2">
          <li>
            <strong>{houses.orange.name}: </strong>
            {t('floors_and_rooms.format', {
              floors: '3',
              rooms: '28'
            })}
          </li>
          <li>
            <strong>{houses.lemon.name}: </strong>
            {t('floors_and_rooms.format', {
              floors: '7',
              rooms: '12'
            })}
          </li>
          <li>
            <strong>{houses.apple.name}: </strong>
            {t('floors_and_rooms.format', {
              floors: '8',
              rooms: '24'
            })}
          </li>
        </ul>
      )
    },
    {
      id: 'extra-costs',
      question: t('extra_costs.question'),
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
