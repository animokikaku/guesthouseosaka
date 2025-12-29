'use client'

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useIsMobile } from '@/hooks/use-mobile'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { ContactPageQueryResult } from '@/sanity.types'
import { useSelectedLayoutSegment } from 'next/navigation'

type ContactTypes = NonNullable<ContactPageQueryResult>['contactTypes']

type ContactNavProps = React.ComponentProps<'div'> & {
  contactTypes: ContactTypes
}

export function ContactNav({
  className,
  contactTypes,
  ...props
}: ContactNavProps) {
  const isMobile = useIsMobile()
  const segment = useSelectedLayoutSegment()

  if (!contactTypes || contactTypes.length === 0) return null

  return (
    <div className="relative overflow-hidden">
      <ScrollArea className="max-w-[600px] lg:max-w-none">
        <div className={cn('flex items-center', className)} {...props}>
          {contactTypes.map(({ _id, slug, title }) => {
            if (!title) return null
            return (
              <Link
                key={_id}
                href={{
                  pathname: '/contact/[slug]',
                  params: { slug },
                  hash: '#tabs'
                }}
                data-active={segment === slug}
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
