import { PageNavTabs, pageNavTabClass } from '@/components/page-nav'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { HOUSE_COLORS } from '@/lib/house-theme'
import type { HousesTitlesQueryResult } from '@/sanity.types'
import { stegaClean } from '@sanity/client/stega'
import { Link, useParams } from '@tanstack/react-router'
import { useLocale } from 'use-intl'

export function HousesNav({
  houses,
  ...props
}: React.ComponentProps<'div'> & {
  houses: HousesTitlesQueryResult
}) {
  const isMobile = useIsMobile()
  const locale = useLocale()
  const params = useParams({ strict: false })

  return (
    <PageNavTabs {...props}>
      {houses.map(({ slug, title }) => {
        if (!title) return null
        return (
          <Link
            key={`house-nav-${slug}`}
            to="/$locale/$house"
            params={{ locale, house: slug }}
            aria-current={slug === params.house ? 'page' : undefined}
            data-active={slug === params.house}
            className={cn(pageNavTabClass, HOUSE_COLORS[slug].activeText)}
            resetScroll={!isMobile}
          >
            {stegaClean(title)}
          </Link>
        )
      })}
    </PageNavTabs>
  )
}
