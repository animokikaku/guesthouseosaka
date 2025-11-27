'use client'

import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { Apple, Circle, Citrus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useSelectedLayoutSegment } from 'next/navigation'

export function HouseSwitcher() {
  const selectedLayoutSegment = useSelectedLayoutSegment()
  const pathname = selectedLayoutSegment ? `/${selectedLayoutSegment}` : '/'
  const toggle = (href: string) => (href === pathname ? '/' : href)
  const t = useTranslations('houses')

  return (
    <div className="border-border inline-flex items-center rounded-full border p-1">
      <Button
        variant="ghost"
        size="icon"
        asChild
        data-active={pathname === '/orange'}
        className={cn(
          'hover:bg-background size-6.5 rounded-full p-1.5 hover:text-orange-500/70',
          pathname === '/orange'
            ? 'bg-accent dark:bg-accent/50 hover:bg-accent text-orange-500/70'
            : 'text-muted-foreground'
        )}
      >
        <Link href={toggle('/orange')}>
          <span className="sr-only">{t('orange.name')}</span>
          <Circle />
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        asChild
        className={cn(
          'hover:bg-background size-6.5 rounded-full p-1.5 hover:text-red-500/70',
          pathname === '/apple'
            ? 'bg-accent dark:bg-accent/50 hover:bg-accent text-red-500/70'
            : 'text-muted-foreground'
        )}
      >
        <Link href={toggle('/apple')}>
          <span className="sr-only">{t('apple.name')}</span>
          <Apple />
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        asChild
        className={cn(
          'hover:bg-background size-6.5 rounded-full p-1.5 hover:text-yellow-500/70',
          pathname === '/lemon'
            ? 'bg-accent dark:bg-accent/50 hover:bg-accent text-yellow-500/70'
            : 'text-muted-foreground'
        )}
      >
        <Link href={toggle('/lemon')}>
          <span className="sr-only">{t('lemon.name')}</span>
          <Citrus />
        </Link>
      </Button>
    </div>
  )
}
