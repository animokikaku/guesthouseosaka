import type { HouseQueryResult } from '@/sanity.types'
import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'

type HouseAboutProps = {
  title: NonNullable<HouseQueryResult>['title']
  about: NonNullable<HouseQueryResult>['about']
  building: ReactNode
}

export function HouseAbout({ title, about, building }: HouseAboutProps) {
  const t = useTranslations('HouseAbout')
  const highlights = about?.highlights ?? []

  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold">
        {t('heading', { house: title ?? '' })}
      </h2>
      <div className="mb-4">{building}</div>

      <p className="text-foreground text-base leading-relaxed">
        {about?.description}
      </p>

      {highlights.length > 0 && (
        <div className="mt-4">
          <ul className="space-y-2">
            {highlights.map((highlight) => (
              <li key={highlight._key} className="flex items-start gap-3">
                <div className="bg-primary mt-2 h-2 w-2 shrink-0 rounded-full" />
                <span className="text-foreground">{highlight.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
