import { HouseBuilding } from '@/components/house/house-building'
import type { HouseQueryResult } from '@/sanity.types'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { useTranslations } from 'next-intl'

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-foreground text-base leading-relaxed">{children}</p>
    )
  },
  list: {
    bullet: ({ children }) => <ul className="mt-4 space-y-2">{children}</ul>,
    number: ({ children }) => (
      <ol className="text-foreground mt-4 list-decimal space-y-2 pl-5">
        {children}
      </ol>
    )
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex items-start gap-3">
        <div className="bg-primary mt-2 h-2 w-2 shrink-0 rounded-full" />
        <span className="text-foreground">{children}</span>
      </li>
    ),
    number: ({ children }) => <li>{children}</li>
  }
}

type HouseAboutProps = Pick<
  NonNullable<HouseQueryResult>,
  '_id' | '_type' | 'about' | 'title' | 'building' | 'slug'
>

export function HouseAbout({
  _id,
  _type,
  about,
  title,
  building,
  slug
}: HouseAboutProps) {
  const t = useTranslations('HouseAbout')

  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold">
        {t('heading', { house: title ?? '' })}
      </h2>
      <div className="mb-4">
        <HouseBuilding
          _id={_id}
          _type={_type}
          slug={slug}
          building={building}
        />
      </div>

      {about ? <PortableText value={about} components={components} /> : null}
    </section>
  )
}
