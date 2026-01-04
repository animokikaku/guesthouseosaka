'use client'

import { HouseBuilding } from '@/components/house/house-building'
import {
  HouseSection,
  HouseSectionContent,
  HouseSectionHeading
} from '@/components/house/house-section'
import { defaultPortableText } from '@/lib/portable-text'
import type { BuildingData } from '@/lib/types/components'
import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import { useTranslations } from 'next-intl'
import { stegaClean } from 'next-sanity'

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
        {about ? (
          <PortableText value={about} components={defaultPortableText} />
        ) : null}
      </HouseSectionContent>
    </HouseSection>
  )
}
