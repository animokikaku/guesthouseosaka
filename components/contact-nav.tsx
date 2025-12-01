'use client'

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useContactNavigation } from '@/hooks/use-contact-navigation'
import { useIsMobile } from '@/hooks/use-mobile'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

export function ContactNav({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const nav = useContactNavigation()
  const pathname = usePathname()
  const isMobile = useIsMobile()

  const links = Object.entries(nav).map(([key, { title, href }]) => ({
    key: `contact-nav-${key}`,
    name: title,
    href
  }))

  return (
    <div className="relative overflow-hidden">
      <ScrollArea className="max-w-[600px] lg:max-w-none">
        <div className={cn('flex items-center', className)} {...props}>
          {links.map(({ key, name, href }) => (
            <Link
              key={key}
              href={href}
              data-active={href.startsWith(pathname)}
              className={cn(
                'text-muted-foreground hover:text-primary data-[active=true]:text-primary flex h-7 shrink-0 items-center justify-center px-4 text-center text-base font-medium transition-colors'
              )}
              scroll={!isMobile}
            >
              {name}
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  )
}
