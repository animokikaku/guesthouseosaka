'use client'

import { useThemeConfig } from '@/components/active-theme'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useIsMobile } from '@/hooks/use-mobile'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { useExtracted } from 'next-intl'
import { useEffect } from 'react'

interface LinkProps {
  href: string
  name: string
  className?: string
}

export function HousesNav({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { setActiveTheme } = useThemeConfig()
  const t = useExtracted()
  const pathname = usePathname()
  const isMobile = useIsMobile()

  const links: LinkProps[] = [
    {
      href: '/orange#tabs',
      name: t('Orange House'),
      className:
        'data-[active=true]:text-orange-600 dark:data-[active=true]:text-orange-500'
    },
    {
      href: '/apple#tabs',
      name: t('Apple House'),
      className:
        'data-[active=true]:text-red-600 dark:data-[active=true]:text-red-500'
    },
    {
      href: '/lemon#tabs',
      name: t('Lemon House'),
      className:
        'data-[active=true]:text-yellow-400 dark:data-[active=true]:text-yellow-500'
    }
  ] as const

  useEffect(() => {
    if (pathname.startsWith('/orange')) {
      setActiveTheme('orange')
    } else if (pathname.startsWith('/apple')) {
      setActiveTheme('red')
    } else if (pathname.startsWith('/lemon')) {
      setActiveTheme('yellow')
    }
    return () => {
      setActiveTheme('default')
    }
  }, [pathname, setActiveTheme])

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
                'text-muted-foreground hover:text-primary flex h-7 shrink-0 items-center justify-center px-4 text-center text-base font-medium transition-colors',
                link.className
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
