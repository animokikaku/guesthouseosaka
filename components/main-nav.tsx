'use client'

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'
import { Link } from '@/i18n/navigation'
import { HouseIdentifier, NavGroupItem, NavItem, NavListItem } from '@/lib/types'
import { cn } from '@/lib/utils'
import { FileWarningIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { stegaClean } from 'next-sanity'
import Image from 'next/image'
import { useParams, useSelectedLayoutSegment } from 'next/navigation'
import { useState } from 'react'

interface PreviewImageItemProps {
  item: NavGroupItem
  isActive: boolean
}

function PreviewImageItem({ item: it, isActive }: PreviewImageItemProps) {
  return (
    <div
      data-active={isActive}
      aria-hidden={!isActive}
      className={cn(
        'absolute inset-0 transition-opacity duration-300',
        isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
      )}
    >
      <Image
        src={it.background.src}
        alt={it.background.alt}
        placeholder={it.background.blurDataURL ? 'blur' : undefined}
        blurDataURL={it.background.blurDataURL}
        loading={isActive ? 'eager' : 'lazy'}
        fill
        sizes="250px"
        className="h-full w-full object-cover opacity-90"
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src={it.icon.src}
          alt={it.icon.alt}
          width={40}
          height={40}
          loading={isActive ? 'eager' : 'lazy'}
          className="h-10 w-10 object-contain opacity-50 drop-shadow-lg"
        />
      </div>

      {it.caption ? (
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 via-black/60 to-transparent p-4">
          <p className="text-left text-sm leading-relaxed font-medium text-white/90">
            {it.caption}
          </p>
        </div>
      ) : null}
    </div>
  )
}

export function MainNav({
  items,
  ...props
}: React.ComponentProps<typeof NavigationMenu> & {
  items: Array<NavItem | NavListItem>
}) {
  const selectedLayoutSegment = useSelectedLayoutSegment()
  const pathname = selectedLayoutSegment ? `/${selectedLayoutSegment}` : '/'
  const { house } = useParams<{ house?: HouseIdentifier }>()

  return (
    <NavigationMenu viewport={false} {...props}>
      <NavigationMenuList className="flex-wrap">
        {items.map((entry) => {
          if ('items' in entry) {
            return (
              <NavigationMenuGroupItem
                key={`nav-item-group-${entry.key}`}
                title={entry.label}
                items={entry.items}
                house={house}
              />
            )
          }
          return (
            <NavigationMenuItem key={`nav-item-${entry.key}`}>
              <NavigationMenuLink
                asChild
                data-active={pathname === entry.href}
                className={cn(navigationMenuTriggerStyle(), 'bg-transparent')}
              >
                <Link href={entry.href}>{entry.label}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function NavigationMenuGroupItem({
  title,
  items,
  house
}: {
  title: string
  items: NavGroupItem[]
  house?: HouseIdentifier
}) {
  const [hoveredItem, setHoverItem] = useState<NavGroupItem | undefined>(items[0])
  const t = useTranslations('PageEmptyState')

  // Show empty state when no items
  if (items.length === 0) {
    return (
      <NavigationMenuItem>
        <NavigationMenuTrigger className="bg-transparent">{title}</NavigationMenuTrigger>
        <NavigationMenuContent>
          <Empty className="w-[300px] gap-3 border-none p-6">
            <EmptyHeader className="gap-1">
              <EmptyMedia variant="warning">
                <FileWarningIcon />
              </EmptyMedia>
              <EmptyTitle className="text-sm">{t('title')}</EmptyTitle>
              <EmptyDescription>{t('description')}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </NavigationMenuContent>
      </NavigationMenuItem>
    )
  }

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="bg-transparent">{title}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[500px] grid-cols-[1fr_1fr] gap-2">
          <div className="row-span-3 flex flex-col gap-2">
            {items.map((item, i) => (
              <li key={`list-item-${i}`} onMouseEnter={() => setHoverItem(item)}>
                <NavigationMenuLink data-active={house === item.key} asChild>
                  <Link href={item.href}>
                    <div className="text-sm leading-none font-medium">{stegaClean(item.label)}</div>
                    {item.description ? (
                      <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                        {stegaClean(item.description)}
                      </p>
                    ) : null}
                  </Link>
                </NavigationMenuLink>
              </li>
            ))}
          </div>

          <li className="row-span-3">
            <div className="group relative h-full w-full overflow-hidden rounded-md">
              {items.map((it) => (
                <PreviewImageItem key={it.key} item={it} isActive={it.key === hoveredItem?.key} />
              ))}
            </div>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}
