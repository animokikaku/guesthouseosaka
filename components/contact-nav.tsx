'use client'

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useIsMobile } from '@/hooks/use-mobile'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { ContactPageQueryResult } from '@/sanity.types'
import { stegaClean } from 'next-sanity'

type ContactTypes = NonNullable<ContactPageQueryResult>['contactTypes']

const HREFS = {
  tour: { pathname: '/contact/tour', hash: '#tabs' },
  'move-in': { pathname: '/contact/move-in', hash: '#tabs' },
  general: { pathname: '/contact/other', hash: '#tabs' }
} as const

type ContactNavProps = React.ComponentProps<'div'> & {
  contactTypes: ContactTypes
}

export function ContactNav({
  className,
  contactTypes,
  ...props
}: ContactNavProps) {
  const pathname = usePathname()
  const isMobile = useIsMobile()

  if (!contactTypes || contactTypes.length === 0) return null

  return (
    <div className="relative overflow-hidden">
      <ScrollArea className="max-w-[600px] lg:max-w-none">
        <div className={cn('flex items-center', className)} {...props}>
          {contactTypes.map(({ _key, key, title }) => {
            const href = HREFS[stegaClean(key)]
            if (!href || !title) return null
            return (
              <Link
                key={_key}
                href={href}
                data-active={href.pathname === pathname}
                className={cn(
                  'text-muted-foreground hover:text-primary data-[active=true]:text-primary flex h-7 shrink-0 items-center justify-center px-4 text-center text-base font-medium transition-colors'
                )}
                scroll={!isMobile}
              >
                {title}
              </Link>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  )
}
