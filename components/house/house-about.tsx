'use client'

import { HouseBuilding } from '@/components/house/house-building'
import { useNestedOptimistic } from '@/hooks/use-optimistic'
import type { HouseQueryResult } from '@/sanity.types'
import { useTranslations } from 'next-intl'

type AboutData = Pick<
  NonNullable<HouseQueryResult>,
  'about' | 'title' | '_id' | '_type' | 'building' | 'slug'
>

type HouseAboutProps = {
  data: AboutData
}

export function HouseAbout({ data }: HouseAboutProps) {
  const t = useTranslations('HouseAbout')
  const { about, title, _id, _type, building, slug } = data

  const [highlights, attr] = useNestedOptimistic(
    data,
    'about.highlights',
    about?.highlights
  )

  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold">
        {t('heading', { house: title ?? '' })}
      </h2>
      <div className="mb-4">
        <HouseBuilding data={{ _id, _type, slug, building }} />
      </div>

      <p className="text-foreground text-base leading-relaxed">
        {about?.description}
      </p>

      {highlights && highlights.length > 0 ? (
        <div className="mt-4">
          <ul className="space-y-2" data-sanity={attr.list()}>
            {highlights.map((highlight) => (
              <li
                key={highlight._key}
                className="flex items-start gap-3"
                data-sanity={attr.item(highlight._key)}
              >
                <div className="bg-primary mt-2 h-2 w-2 shrink-0 rounded-full" />
                <span className="text-foreground">{highlight.text}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  )
}
