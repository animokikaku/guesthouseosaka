'use client'

import { PageEmptyState } from '@/components/page-empty-state'
import {
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
import { NavigationMenu as NavigationMenuPrimitive } from '@base-ui/react/navigation-menu'
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
          className="size-10 object-contain opacity-50 drop-shadow-lg"
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
  align = 'start',
  className,
  ...props
}: NavigationMenuPrimitive.Root.Props &
  Pick<NavigationMenuPrimitive.Positioner.Props, 'align'> & {
    items: Array<NavItem | NavListItem>
  }) {
  const selectedLayoutSegment = useSelectedLayoutSegment()
  const pathname = selectedLayoutSegment ? `/${selectedLayoutSegment}` : '/'
  const { house } = useParams<{ house?: HouseIdentifier }>()

  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      className={cn(
        'group/navigation-menu relative flex max-w-max flex-1 items-center justify-center',
        className
      )}
      {...props}
    >
      <NavigationMenuList className="flex-wrap gap-1">
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
                render={<Link href={entry.href} />}
                data-active={pathname === entry.href}
                className={cn(navigationMenuTriggerStyle(), 'bg-transparent')}
              >
                {entry.label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
      <MainNavPositioner align={align} />
    </NavigationMenuPrimitive.Root>
  )
}

function MainNavPositioner({
  className,
  side = 'bottom',
  sideOffset = 8,
  align = 'start',
  alignOffset = 0,
  ...props
}: NavigationMenuPrimitive.Positioner.Props) {
  return (
    <NavigationMenuPrimitive.Portal>
      <NavigationMenuPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        disableAnchorTracking
        positionMethod="fixed"
        className={cn(
          'isolate z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) data-[side=bottom]:before:top-[-10px] data-[side=bottom]:before:right-0 data-[side=bottom]:before:left-0',
          className
        )}
        {...props}
      >
        <NavigationMenuPrimitive.Popup className="data-[ending-style]:ease-out-ui xs:w-(--popup-width) bg-popover text-popover-foreground ring-foreground/10 ease-out-ui relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) rounded-lg shadow ring-1 transition-[opacity,transform,width,height,scale,translate] duration-200 outline-none data-ending-style:scale-90 data-ending-style:opacity-0 data-ending-style:duration-150 data-starting-style:scale-90 data-starting-style:opacity-0">
          <NavigationMenuPrimitive.Viewport className="relative size-full overflow-hidden" />
        </NavigationMenuPrimitive.Popup>
      </NavigationMenuPrimitive.Positioner>
    </NavigationMenuPrimitive.Portal>
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

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="bg-transparent">{title}</NavigationMenuTrigger>
      <NavigationMenuContent>
        {items.length === 0 ? (
          <PageEmptyState variant="nav" className="w-[300px] border-none" />
        ) : (
          <ul className="grid w-[500px] grid-cols-[1fr_1fr] gap-2">
            <li className="row-span-3">
              <ul className="flex flex-col gap-2">
                {items.map((item) => (
                  <li key={item.key}>
                    <NavigationMenuLink
                      data-active={house === item.key}
                      render={<Link href={item.href} />}
                      onFocus={() => setHoverItem(item)}
                      onMouseEnter={() => setHoverItem(item)}
                      className="flex flex-col items-start gap-1 rounded-md text-left"
                    >
                      <div className="text-sm leading-none font-medium">
                        {stegaClean(item.label)}
                      </div>
                      {item.description ? (
                        <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                          {stegaClean(item.description)}
                        </p>
                      ) : null}
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </li>
            <li className="row-span-3">
              <div className="group relative h-full w-full overflow-hidden rounded-md">
                {items.map((it) => (
                  <PreviewImageItem key={it.key} item={it} isActive={it.key === hoveredItem?.key} />
                ))}
              </div>
            </li>
          </ul>
        )}
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}
