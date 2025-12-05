'use client'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'
import { useIsMobile } from '@/hooks/use-mobile'
import { Link } from '@/i18n/navigation'
import { NavGroupItem, NavItem, NavListItem } from '@/lib/types'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useSelectedLayoutSegment } from 'next/navigation'
import { useState } from 'react'

export function MainNav({
  items,
  ...props
}: React.ComponentProps<typeof NavigationMenu> & {
  items: Array<NavItem | NavListItem>
}) {
  const isMobile = useIsMobile()
  const selectedLayoutSegment = useSelectedLayoutSegment()
  const pathname = selectedLayoutSegment ? `/${selectedLayoutSegment}` : '/'

  return (
    <NavigationMenu viewport={isMobile} {...props}>
      <NavigationMenuList className="flex-wrap">
        {items.map((entry) => {
          if ('items' in entry) {
            return (
              <NavigationMenuGroupItem
                key={`nav-item-group-${entry.key}`}
                title={entry.label}
                items={entry.items}
                pathname={pathname}
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
  pathname
}: {
  title: string
  items: NavGroupItem[]
  pathname: string
}) {
  const [item, setHoverItem] = useState<NavGroupItem>(items[0])

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="bg-transparent">
        {title}
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[500px] grid-cols-[1fr_1fr] gap-2">
          <div className="row-span-3 flex flex-col gap-2">
            {items.map((item, i) => (
              <li
                key={`list-item-${i}`}
                onMouseEnter={() => setHoverItem(item)}
              >
                <NavigationMenuLink
                  data-active={pathname === item.href}
                  asChild
                >
                  <Link href={item.href}>
                    <div className="text-sm leading-none font-medium">
                      {item.label}
                    </div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                      {item.description}
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            ))}
          </div>

          <li className="row-span-3">
            <div className="group relative h-full w-full overflow-hidden rounded-md">
              {items.map((it, idx) => {
                const isActive = it.key === item.key
                return (
                  <div
                    key={`preview-${idx}`}
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
                      placeholder="blur"
                      blurDataURL={it.background.blurDataURL}
                      loading={isActive ? 'eager' : 'lazy'}
                      {...(isActive ? { preload: true } : {})}
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

                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 via-black/60 to-transparent p-4">
                      <p className="text-left text-sm leading-relaxed font-medium text-white/90">
                        {it.caption}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  )
}
