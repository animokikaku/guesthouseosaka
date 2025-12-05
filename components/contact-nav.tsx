'use client'

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  ContactNavigationKey,
  useContactNavigation
} from '@/hooks/use-contact-navigation'
import { useIsMobile } from '@/hooks/use-mobile'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

export function ContactNav({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const navLabel = useContactNavigation()
  const keys: ContactNavigationKey[] = ['tour', 'move-in', 'general']
  const pathname = usePathname()
  const isMobile = useIsMobile()

  return (
    <div className="relative overflow-hidden">
      <ScrollArea className="max-w-[600px] lg:max-w-none">
        <div className={cn('flex items-center', className)} {...props}>
          {keys.map((key) => {
            const { href, title } = navLabel(key)
            return (
              <Link
                key={`contact-nav-${key}`}
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
