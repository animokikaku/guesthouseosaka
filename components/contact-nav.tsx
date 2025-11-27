'use client'

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useIsMobile } from '@/hooks/use-mobile'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

export function ContactNav({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const t = useTranslations('contact')
  const pathname = usePathname()
  const isMobile = useIsMobile()

  const links = [
    {
      name: t('nav.tour'),
      href: '/contact/tour#tabs'
    },
    {
      name: t('nav.moveIn'),
      href: '/contact/move-in#tabs'
    },
    {
      name: t('nav.general'),
      href: '/contact/other#tabs'
    }
  ]

  return (
    <div className="relative overflow-hidden">
      <ScrollArea className="max-w-[600px] lg:max-w-none">
        <div className={cn('flex items-center', className)} {...props}>
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              data-active={link.href.startsWith(pathname)}
              className={cn(
                'text-muted-foreground hover:text-primary data-[active=true]:text-primary flex h-7 shrink-0 items-center justify-center px-4 text-center text-base font-medium transition-colors'
              )}
              scroll={!isMobile}
            >
              {link.name}
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  )
}
