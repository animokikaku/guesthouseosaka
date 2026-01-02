'use client'

import { FAQExtraCosts } from '@/app/[locale]/faq/(components)/faq-extra-costs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import type {
  FaqQuestionsQueryResult,
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

type FaqQuestions = NonNullable<FaqQuestionsQueryResult>
type Houses = NonNullable<HousesBuildingQueryResult>
type PricingCategories = NonNullable<PricingCategoriesQueryResult>

type FAQAccordionProps = {
  faqQuestions: FaqQuestions
  pricingCategories: PricingCategories
  housesBuilding: Houses
}

function FloorsAndRoomsContent({ houses }: { houses: Houses }) {
  const t = useTranslations('FAQAccordion')
  const formatter = useFormatter()

  return (
    <ul className="text-muted-foreground list-disc space-y-2">
      {houses.map(({ _id, _type, slug, title, building }) => {
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
                <span data-sanity={dataAttr('building.floors')}>{chunks}</span>
              ),
              roomsTag: (chunks) => (
                <span data-sanity={dataAttr('building.rooms')}>{chunks}</span>
              )
            })}
          </li>
        )
      })}
    </ul>
  )
}

export function FAQAccordion({
  faqQuestions,
  pricingCategories,
  housesBuilding
}: FAQAccordionProps) {
  return (
    <Accordion type="multiple">
      {faqQuestions.map(({ _id, question, answer, componentKey }) => {
        const component = componentKey ? stegaClean(componentKey) : null
        return (
          <AccordionItem key={_id} value={_id}>
            <AccordionTrigger className="text-md sm:text-lg">
              {question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground flex flex-col gap-4 text-sm sm:text-base">
              {/* Component-based content */}
              {component === 'floors-and-rooms' && (
                <FloorsAndRoomsContent houses={housesBuilding} />
              )}
              {component === 'extra-costs' && (
                <FAQExtraCosts
                  pricingCategories={pricingCategories}
                  houses={housesBuilding}
                />
              )}
              {/* Regular text answer */}
              {!component && answer && (
                <PortableText value={answer} components={components} />
              )}
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
