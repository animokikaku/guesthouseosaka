'use client'

import { HouseBuilding } from '@/components/house/house-building'
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
    <section aria-labelledby="house-about-title">
      <h2 id="house-about-title" className="mb-6 text-2xl font-semibold">
        {t('heading', { house: title ? stegaClean(title) : '' })}
      </h2>
      <div className="mb-4">
        <HouseBuilding building={building} />
      </div>

      {about ? (
        <PortableText value={about} components={defaultPortableText} />
      ) : null}
    </section>
  )
}
