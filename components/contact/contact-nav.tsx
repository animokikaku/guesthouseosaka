import { PageNavTabs, pageNavTabClass } from '@/components/page-nav'
import { useIsMobile } from '@/hooks/use-mobile'
import type { ContactNavItem } from '@/lib/types/components'
import { cn } from '@/lib/utils'
import { Link, useParams } from '@tanstack/react-router'
import { useLocale } from 'use-intl'

type ContactNavProps = React.ComponentProps<'div'> & {
  items: ContactNavItem[]
}

export function ContactNav({ items, ...props }: ContactNavProps) {
  const isMobile = useIsMobile()
  const locale = useLocale()
  const { slug: segment } = useParams({ strict: false })

  if (items.length === 0) return null

  return (
    <PageNavTabs {...props}>
      {items.map(({ id, slug, title }) => (
        <Link
          key={id}
          to="/$locale/contact/$slug"
          params={{ locale, slug }}
          hash="tabs"
          aria-current={segment === slug ? 'page' : undefined}
          data-active={segment === slug}
          className={cn(pageNavTabClass, 'data-[active=true]:text-primary')}
          // On phones the tabs stay put; on larger screens jump to them.
          resetScroll={!isMobile}
          hashScrollIntoView={!isMobile}
        >
          {title}
        </Link>
      ))}
    </PageNavTabs>
  )
}
