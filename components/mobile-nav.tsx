'use client'

import { Link } from '@/i18n/navigation'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { NavItem, NavItems, NavListItem } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'

export function MobileNav({
  items,
  className
}: {
  items: NavItems
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const t = useTranslations('MobileNav')

  const { mobileItems, mobileListItems } = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        if ('href' in item) acc.mobileItems.push(item)
        else if ('items' in item) acc.mobileListItems.push(item)
        return acc
      },
      { mobileItems: [] as NavItem[], mobileListItems: [] as NavListItem[] }
    )
  }, [items])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            'extend-touch-target h-8 touch-manipulation items-center justify-start gap-2.5 p-0! hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 active:bg-transparent dark:hover:bg-transparent',
            className
          )}
        >
          <div className="relative flex h-8 w-4 items-center justify-center">
            <div className="relative size-4">
              <span
                className={cn(
                  'bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100',
                  open ? 'top-[0.4rem] -rotate-45' : 'top-1'
                )}
              />
              <span
                className={cn(
                  'bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100',
                  open ? 'top-[0.4rem] rotate-45' : 'top-2.5'
                )}
              />
            </div>
            <span className="sr-only">{t('toggle_menu')}</span>
          </div>
          <span className="flex h-8 items-center text-lg leading-none font-medium">
            {t('menu_label')}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="bg-background/90 no-scrollbar h-(--radix-popper-available-height) w-(--radix-popper-available-width) overflow-y-auto rounded-none border-none p-0 shadow-none backdrop-blur duration-100"
        align="start"
        side="bottom"
      >
        <div className="flex flex-col gap-12 overflow-auto px-6 py-6">
          <div className="flex flex-col gap-4">
            <div className="text-muted-foreground text-sm font-medium">
              {t('menu_label')}
            </div>
            <div className="flex flex-col gap-3">
              <MobileLink href="/" onOpenChange={setOpen}>
                {t('home_label')}
              </MobileLink>
              {mobileItems.map((item, index) => (
                <MobileLink key={index} href={item.href} onOpenChange={setOpen}>
                  {item.label}
                </MobileLink>
              ))}
            </div>
          </div>
          {mobileListItems.map((item, index) => (
            <div
              key={`mobile-list-item-${index}`}
              className="flex flex-col gap-4"
            >
              <div className="text-muted-foreground text-sm font-medium">
                {item.label}
              </div>
              <div className="flex flex-col gap-3">
                {item.items.map((item, index) => (
                  <MobileLink
                    key={index}
                    href={item.href}
                    onOpenChange={setOpen}
                  >
                    {item.label}
                  </MobileLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: React.ComponentProps<typeof Link> & {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      onClick={() => {
        onOpenChange?.(false)
      }}
      className={cn('text-2xl font-medium', className)}
      {...props}
    >
      {children}
    </Link>
  )
}
