'use client'

import { PageNavTabs, pageNavTabClass } from '@/components/page-nav'
import { useIsMobile } from '@/hooks/use-mobile'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { HOUSE_COLORS } from '@/lib/utils/theme'
import type { HousesTitlesQueryResult } from '@/sanity.types'
import { stegaClean } from 'next-sanity'
import { useParams } from 'next/navigation'

export function HousesNav({
  houses,
  ...props
}: React.ComponentProps<'div'> & {
  houses: HousesTitlesQueryResult
}) {
  const isMobile = useIsMobile()
  const params = useParams()

  return (
    <PageNavTabs {...props}>
      {houses.map(({ slug, title }) => {
        if (!title) return null
        return (
          <Link
            prefetch
            key={`house-nav-${slug}`}
            href={{ pathname: '/[house]', params: { house: slug } }}
            aria-current={slug === params.house ? 'page' : undefined}
            data-active={slug === params.house}
            className={cn(pageNavTabClass, HOUSE_COLORS[slug].activeText)}
            scroll={!isMobile}
          >
            {stegaClean(title)}
          </Link>
        )
      })}
    </PageNavTabs>
  )
}
