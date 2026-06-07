'use client'

import { Link } from '@/i18n/navigation'
import { Popover as PopoverPrimitive } from '@base-ui/react/popover'
import * as React from 'react'

import { NavEmptyState } from '@/components/nav-empty-state'
import { Button } from '@/components/ui/button'
import { NavItem, NavItems, NavListItem } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'

export function MobileNav({ items, className }: { items: NavItems; className?: string }) {
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
    <PopoverPrimitive.Root data-slot="mobile-nav" open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger
        data-slot="mobile-nav-trigger"
        render={
          <Button
            variant="ghost"
            aria-expanded={open}
            className={cn(
              'extend-touch-target h-8 touch-manipulation items-center justify-start gap-2.5 rounded-sm p-0! hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-2 active:bg-transparent aria-expanded:bg-transparent aria-expanded:text-foreground dark:hover:bg-transparent dark:aria-expanded:bg-transparent',
              className
            )}
          >
            <div className="relative flex h-8 w-4 items-center justify-center">
              <div className="relative size-4">
                <span
                  className={cn(
                    'bg-foreground absolute left-0 block h-0.5 w-4 transition-[top,rotate] duration-100',
                    open ? 'top-[0.4rem] -rotate-45' : 'top-1'
                  )}
                />
                <span
                  className={cn(
                    'bg-foreground absolute left-0 block h-0.5 w-4 transition-[top,rotate] duration-100',
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
        }
      />
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner
          className="fixed! inset-x-0! top-(--header-height)! bottom-0! z-40! h-auto! w-screen! transform-none!"
          align="start"
          side="bottom"
          sideOffset={0}
        >
          <PopoverPrimitive.Popup
            data-slot="mobile-nav-content"
            className="bg-background/90 no-scrollbar data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 h-full w-full max-w-none overflow-y-auto overscroll-contain rounded-none border-none p-0 shadow-none ring-0 backdrop-blur duration-100 outline-none"
          >
            <MobileMenuPanel
              homeLabel={t('home_label')}
              menuLabel={t('menu_label')}
              mobileItems={mobileItems}
              mobileListItems={mobileListItems}
              onOpenChange={setOpen}
            />
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

function MobileMenuPanel({
  homeLabel,
  menuLabel,
  mobileItems,
  mobileListItems,
  onOpenChange
}: {
  homeLabel: string
  menuLabel: string
  mobileItems: NavItem[]
  mobileListItems: NavListItem[]
  onOpenChange: (open: boolean) => void
}) {
  return (
    <div className="flex flex-col gap-12 p-6">
      <div className="flex flex-col gap-4">
        <div className="text-muted-foreground text-sm font-medium">{menuLabel}</div>
        <div className="flex flex-col gap-3">
          <MobileLink href="/" onOpenChange={onOpenChange}>
            {homeLabel}
          </MobileLink>
          {mobileItems.map((item) => (
            <MobileLink key={item.key} href={item.href} onOpenChange={onOpenChange}>
              {item.label}
            </MobileLink>
          ))}
        </div>
      </div>
      {mobileListItems.map((listItem) => (
        <MobileListSection
          key={listItem.key}
          label={listItem.label}
          items={listItem.items}
          onOpenChange={onOpenChange}
        />
      ))}
    </div>
  )
}

function MobileListSection({
  label,
  items,
  onOpenChange
}: {
  label: string
  items: NavListItem['items']
  onOpenChange?: (open: boolean) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-muted-foreground text-sm font-medium">{label}</div>
      {items.length === 0 ? (
        <NavEmptyState className="rounded-lg border border-dashed border-amber-400/50 bg-amber-50/50 dark:border-amber-600/30 dark:bg-amber-950/20" />
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <MobileLink key={item.key} href={item.href} onOpenChange={onOpenChange}>
              {item.label}
            </MobileLink>
          ))}
        </div>
      )}
    </div>
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
      className={cn(
        'focus-visible:ring-ring rounded-sm text-2xl font-medium text-wrap hover:text-primary focus-visible:ring-2 focus-visible:outline-none',
        className
      )}
      {...props}
    >
      {children}
    </Link>
  )
}
