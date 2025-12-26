'use client'

import { FAQExtraCostsTable } from '@/app/[locale]/faq/(components)/faq-extra-costs-table'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { createDataAttribute } from '@/lib/sanity-data-attributes'
import type {
  FaqPageQueryResult,
  HousesBuildingQueryResult
} from '@/sanity.types'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { useFormatter, useTranslations } from 'next-intl'

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>
  }
}

type FAQAccordionProps = {
  faqItems: NonNullable<FaqPageQueryResult>['items']
  housesBuilding: HousesBuildingQueryResult
}

export function FAQAccordion({ faqItems, housesBuilding }: FAQAccordionProps) {
  const t = useTranslations('FAQAccordion')
  const formatter = useFormatter()

  return (
    <Accordion type="multiple">
      {faqItems?.map((item) => (
        <AccordionItem key={item._key} value={item._key}>
          <AccordionTrigger className="text-md sm:text-lg">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground flex flex-col gap-4 text-sm sm:text-base">
            {item.answer && (
              <PortableText value={item.answer} components={components} />
            )}
          </AccordionContent>
        </AccordionItem>
      ))}

      <AccordionItem value="floors-and-rooms">
        <AccordionTrigger className="text-md sm:text-lg">
          {t('floors_and_rooms.question')}
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground flex flex-col gap-4 text-sm sm:text-base">
          <ul className="text-muted-foreground list-disc space-y-2">
            {housesBuilding.map((house) => {
              const floors = house.building?.floors ?? 0
              const rooms = house.building?.rooms ?? 0
              const dataAttribute = createDataAttribute({
                id: house._id,
                type: house._type
              })
              return (
                <li
                  key={`floors-and-rooms-${house.slug}`}
                  data-sanity={dataAttribute('building')}
                >
                  <strong>{house.title}: </strong>
                  {t('floors_and_rooms.format', {
                    floors: formatter.number(floors),
                    rooms: formatter.number(rooms)
                  })}
                </li>
              )
            })}
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="extra-costs">
        <AccordionTrigger className="text-md sm:text-lg">
          {t('extra_costs.question')}
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground flex flex-col gap-4 text-sm sm:text-base">
          <FAQExtraCostsTable />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
