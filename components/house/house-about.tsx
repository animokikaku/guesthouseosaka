import { HouseBuilding } from '@/components/house/house-building'
import { HouseHighlights } from '@/components/house/house-highlights'
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

  if (!about) {
    return null
  }

  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold">
        {t('heading', { house: title ?? '' })}
      </h2>
      <div className="mb-4">
        <HouseBuilding data={{ _id, _type, slug, building }} />
      </div>

      <p className="text-foreground text-base leading-relaxed">
        {about.description}
      </p>

      <HouseHighlights data={{ _id, _type, highlights: about.highlights }} />
    </section>
  )
}
