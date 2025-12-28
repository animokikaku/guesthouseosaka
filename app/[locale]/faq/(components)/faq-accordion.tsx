'use client'

import { FAQExtraCostsCards } from '@/app/[locale]/faq/(components)/faq-extra-costs-cards'
import { FAQExtraCostsTable } from '@/app/[locale]/faq/(components)/faq-extra-costs-table'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { useOptimistic } from '@/hooks/use-optimistic'
import type {
  FaqPageQueryResult,
  HousesBuildingQueryResult
} from '@/sanity.types'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { stegaClean } from '@sanity/client/stega'
import { useFormatter, useTranslations } from 'next-intl'
import { createDataAttribute } from 'next-sanity'

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>
  }
}

type FaqPage = NonNullable<FaqPageQueryResult>
type Houses = NonNullable<HousesBuildingQueryResult>

// Narrowed type for useOptimistic (avoids union with 'actions' array)
type FaqPageData = Pick<FaqPage, '_id' | '_type' | 'items'>

type FAQAccordionProps = {
  faqPage: FaqPageData
  housesBuilding: Houses
}

export function FAQAccordion({ faqPage, housesBuilding }: FAQAccordionProps) {
  const t = useTranslations('FAQAccordion')
  const formatter = useFormatter()
  const [items, attr] = useOptimistic(faqPage, 'items')

  if (!items) return null

  return (
    <Accordion type="multiple">
      {items.map((item) => {
        const key = stegaClean(item._key)
        const question = stegaClean(item.question)
        return (
          <AccordionItem key={key} value={key}>
            <AccordionTrigger
              className="text-md sm:text-lg"
              data-sanity={attr.item(key)}
            >
              {question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground flex flex-col gap-4 text-sm sm:text-base">
              {item.answer && (
                <PortableText value={item.answer} components={components} />
              )}
            </AccordionContent>
          </AccordionItem>
        )
      })}

      <AccordionItem value="floors-and-rooms">
        <AccordionTrigger className="text-md sm:text-lg">
          {t('floors_and_rooms.question')}
        </AccordionTrigger>
        <AccordionContent className="text-muted-foreground flex flex-col gap-4 text-sm sm:text-base">
          <ul className="text-muted-foreground list-disc space-y-2">
            {housesBuilding.map(({ _id, _type, slug, title, building }) => {
              if (!building) return null
              const { floors, rooms } = building
              const dataAttr = createDataAttribute({ id: _id, type: _type })
              return (
                <li key={`floors-and-rooms-${slug}`}>
                  <strong>{stegaClean(title)}: </strong>
                  {t.rich('floors_and_rooms.format', {
                    floors: formatter.number(floors),
                    rooms: formatter.number(rooms),
                    floorsTag: (chunks) => (
                      <span data-sanity={dataAttr('building.floors')}>
                        {chunks}
                      </span>
                    ),
                    roomsTag: (chunks) => (
                      <span data-sanity={dataAttr('building.rooms')}>
                        {chunks}
                      </span>
                    )
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
          <div className="md:hidden">
            <FAQExtraCostsCards houses={housesBuilding} />
          </div>
          <div className="hidden md:block">
            <FAQExtraCostsTable houses={housesBuilding} />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
