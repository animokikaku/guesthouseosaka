'use client'

import { HouseBuilding } from '@/components/house/house-building'
import {
  HouseSection,
  HouseSectionContent,
  HouseSectionHeading
} from '@/components/house/house-section'
import type { BuildingData } from '@/lib/types/components'
import type { PortableTextComponents } from '@portabletext/react'
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import { useTranslations } from 'next-intl'
import { stegaClean } from 'next-sanity'

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-foreground text-base leading-relaxed">{children}</p>
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
        <div className="bg-primary mt-2 h-2 w-2 shrink-0 rounded-full" />
        <span className="text-foreground">{children}</span>
      </li>
    ),
    number: ({ children }) => <li>{children}</li>
  }
}

interface HouseAboutProps {
  about: PortableTextBlock[] | null
  title: string | null
  building: BuildingData | null
}

export function HouseAbout({ about, title, building }: HouseAboutProps) {
  const t = useTranslations('HouseAbout')

  return (
    <HouseSection id="about" aria-labelledby="about-title">
      <HouseSectionHeading id="about-title">
        {t('heading', { house: title ? stegaClean(title) : '' })}
      </HouseSectionHeading>
      <HouseSectionContent className="space-y-4">
        <HouseBuilding building={building} />
        {about ? <PortableText value={about} components={portableTextComponents} /> : null}
      </HouseSectionContent>
    </HouseSection>
  )
}
