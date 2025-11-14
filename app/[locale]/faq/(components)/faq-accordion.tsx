import type { ReactNode } from 'react'

import { FAQExtraCostsTable } from '@/app/[locale]/faq/(components)/faq-extra-costs-table'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { useExtracted } from 'next-intl'

type FaqItem = {
  id: string
  question: string
  body: ReactNode
}

export function FAQAccordion() {
  const t = useExtracted()

  const items: FaqItem[] = [
    {
      id: 'room-occupancy',
      question: t('Up to how many people can stay in a room?'),
      body: <p>{t('All houses accommodate up to 2 guests per room.')}</p>
    },
    {
      id: 'rent-due-date',
      question: t('When do I need to pay the rent every month?'),
      body: (
        <p>
          {t.rich(
            '<strong>Orange House</strong> rent is due by the 10th of each month, while <strong>Lemon House</strong> and <strong>Apple House</strong> pay on the calendar day that matches their move-in date. For example, if you move in on the 23rd, rent is due every 23rd.',
            {
              strong: (chunks) => <strong>{chunks}</strong>
            }
          )}
        </p>
      )
    },
    {
      id: 'manager-in-residence',
      question: t('Is there a manager in residence?'),
      body: (
        <p>
          {t.rich(
            '<strong>Orange House</strong> has an on-site manager, while <strong>Lemon House</strong> and <strong>Apple House</strong> do not.',
            {
              strong: (chunks) => <strong>{chunks}</strong>
            }
          )}
        </p>
      )
    },
    {
      id: 'move-in-requirements',
      question: t('What do I need when I move in?'),
      body: (
        <p>
          {t('Each house requires you to bring consumables and a valid ID.')}
        </p>
      )
    },
    {
      id: 'curfew',
      question: t('Is there a curfew?'),
      body: (
        <p>
          {t(
            'There is no curfew in any house; please keep noise low in the early mornings and late evenings.'
          )}
        </p>
      )
    },
    {
      id: 'floors-and-rooms',
      question: t('How many floors and rooms?'),
      body: (
        <ul className="text-muted-foreground list-disc space-y-2">
          <li>
            <strong>{t('Orange House')}: </strong>
            {t('{floors}-story building with {rooms} rooms.', {
              floors: '3',
              rooms: '28'
            })}
          </li>
          <li>
            <strong>{t('Lemon House')}: </strong>
            {t('{floors}-story building with {rooms} rooms.', {
              floors: '7',
              rooms: '12'
            })}
          </li>
          <li>
            <strong>{t('Apple House')}: </strong>
            {t('{floors}-story building with {rooms} rooms.', {
              floors: '8',
              rooms: '24'
            })}
          </li>
        </ul>
      )
    },
    {
      id: 'extra-costs',
      question: t('What extra costs are there besides rent?'),
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
