import { HouseBuilding } from '@/components/house/house-building'
import { HouseSectionContent, HouseSectionHeading } from '@/components/house/house-section'
import type { BuildingData, HousePortableTextContent } from '@/lib/types/components'
import type { PortableTextComponents } from '@portabletext/react'
import { PortableText } from '@portabletext/react'
import { useTranslations } from 'next-intl'
import { stegaClean } from 'next-sanity'
import type { ReactNode } from 'react'

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-foreground max-w-prose text-base leading-relaxed">{children}</p>
    )
  },
  list: {
    bullet: ({ children }) => <ul className="mt-4 space-y-2">{children}</ul>,
    number: ({ children }) => (
      <ol className="text-foreground mt-4 list-decimal space-y-2 pl-5">{children}</ol>
    )
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="flex items-start gap-3">
        <div className="bg-primary mt-2 size-2 shrink-0 rounded-full" />
        <span className="text-foreground">{children}</span>
      </li>
    ),
    number: ({ children }) => <li>{children}</li>
  }
}

interface HouseAboutProps {
  about: HousePortableTextContent
  title: string | null
  building: BuildingData | null
  /**
   * The room availability marker, shown where editors placed a "Room availability" block
   * in the text, or between the building figures and the text when they haven't.
   */
  availability?: ReactNode
}

export function HouseAbout({ about, title, building, availability }: HouseAboutProps) {
  const t = useTranslations('HouseAbout')

  const placed = about?.some((block) => block._type === 'houseRoomAvailabilityBlock')
  const components: PortableTextComponents = {
    ...portableTextComponents,
    types: { houseRoomAvailabilityBlock: () => availability }
  }

  return (
    <section id="about" aria-labelledby="about-title">
      <HouseSectionHeading id="about-title">
        {t('heading', { house: title ? stegaClean(title) : '' })}
      </HouseSectionHeading>
      <HouseSectionContent className="space-y-4">
        <HouseBuilding building={building} />
        {placed ? null : availability}
        {about ? <PortableText value={about} components={components} /> : null}
      </HouseSectionContent>
    </section>
  )
}
