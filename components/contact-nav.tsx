'use client'

import { PageNavTabs, pageNavTabClass } from '@/components/page-nav'
import { useIsMobile } from '@/hooks/use-mobile'
import { Link } from '@/i18n/navigation'
import type { ContactNavItem } from '@/lib/types/components'
import { cn } from '@/lib/utils'
import { useSelectedLayoutSegment } from 'next/navigation'

type ContactNavProps = React.ComponentProps<'div'> & {
  items: ContactNavItem[]
}

export function ContactNav({ items, ...props }: ContactNavProps) {
  const isMobile = useIsMobile()
  const segment = useSelectedLayoutSegment()

  if (items.length === 0) return null

  return (
    <PageNavTabs {...props}>
      {items.map(({ id, slug, title }) => (
        <Link
          prefetch
          key={id}
          href={{
            pathname: '/contact/[slug]',
            params: { slug },
            hash: '#tabs'
          }}
          aria-current={segment === slug ? 'page' : undefined}
          data-active={segment === slug}
          className={cn(pageNavTabClass, 'data-[active=true]:text-primary')}
          scroll={!isMobile}
        >
          {title}
        </Link>
      ))}
    </PageNavTabs>
  )
}
