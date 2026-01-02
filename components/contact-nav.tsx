'use client'

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useIsMobile } from '@/hooks/use-mobile'
import { Link } from '@/i18n/navigation'
import type { ContactNavItem } from '@/lib/types/components'
import { cn } from '@/lib/utils'
import { useSelectedLayoutSegment } from 'next/navigation'

type ContactNavProps = React.ComponentProps<'div'> & {
  items: ContactNavItem[]
}

export function ContactNav({ className, items, ...props }: ContactNavProps) {
  const isMobile = useIsMobile()
  const segment = useSelectedLayoutSegment()

  if (items.length === 0) return null

  return (
    <div className="relative overflow-hidden">
      <ScrollArea className="max-w-[600px] lg:max-w-none">
        <div className={cn('flex items-center', className)} {...props}>
          {items.map(({ id, slug, title }) => (
            <Link
              key={id}
              href={{
                pathname: '/contact/[slug]',
                params: { slug },
                hash: '#tabs'
              }}
              aria-current={segment === slug ? 'page' : undefined}
              data-active={segment === slug}
              className={cn(
                'text-muted-foreground hover:text-primary data-[active=true]:text-primary flex h-7 shrink-0 items-center justify-center px-4 text-center text-base font-medium transition-colors'
              )}
              scroll={!isMobile}
            >
              {title}
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  )
}
