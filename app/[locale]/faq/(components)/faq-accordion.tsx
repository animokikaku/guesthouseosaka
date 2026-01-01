'use client'

import { FAQExtraCosts } from '@/app/[locale]/faq/(components)/faq-extra-costs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import type {
  FaqPageQueryResult,
  HousesBuildingQueryResult,
  PricingCategoriesQueryResult
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
type PricingCategories = NonNullable<PricingCategoriesQueryResult>

type FaqPageData = Pick<FaqPage, 'items'>

type FAQAccordionProps = {
  faqPage: FaqPageData
  pricingCategories: PricingCategories
  housesBuilding: Houses
}

export function FAQAccordion({
  faqPage,
  pricingCategories,
  housesBuilding
}: FAQAccordionProps) {
  const t = useTranslations('FAQAccordion')
  const formatter = useFormatter()
  const items = faqPage.items

  if (!items) return null

  return (
    <Accordion type="multiple">
      {items.map(({ _key, question, answer }) => {
        return (
          <AccordionItem key={_key} value={_key}>
            <AccordionTrigger className="text-md sm:text-lg">
              {question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground flex flex-col gap-4 text-sm sm:text-base">
              {answer && (
                <PortableText value={answer} components={components} />
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
          <FAQExtraCosts
            pricingCategories={pricingCategories}
            houses={housesBuilding}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
