import type { ReactNode } from 'react'

import { FAQExtraCostsTable } from '@/app/[locale]/faq/(components)/faq-extra-costs-table'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import type { HousesBuildingQueryResult } from '@/sanity.types'
import { useFormatter, useTranslations } from 'next-intl'

type FaqItem = {
  id: string
  question: string
  body: ReactNode
}

type FAQAccordionProps = {
  housesBuilding: HousesBuildingQueryResult
}

export function FAQAccordion({ housesBuilding }: FAQAccordionProps) {
  const t = useTranslations('FAQAccordion')
  const formatter = useFormatter()

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
          {housesBuilding.map((house) => {
            const floors = house.building?.floors ?? 0
            const rooms = house.building?.rooms ?? 0
            return (
              <li key={`floors-and-rooms-${house.slug}`}>
                <strong>{house.title}: </strong>
                {t('floors_and_rooms.format', {
                  floors: formatter.number(floors),
                  rooms: formatter.number(rooms)
                })}
              </li>
            )
          })}
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
