'use client'

import { Icons } from '@/components/icons'
import { LanguageSwitcher } from '@/components/language-switcher'
import { MainNav } from '@/components/main-nav'
import { MobileNav } from '@/components/mobile-nav'
import { ModeSwitcher } from '@/components/mode-switcher'
import { Button } from '@/components/ui/button'
import { useIsMobile } from '@/hooks/use-mobile'
import { Link } from '@/i18n/navigation'
import { NavGroupItem, NavItems } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Settings2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

// eslint-disable-next-line no-restricted-imports
import NextLink from 'next/link'

export function SiteHeader({
  houseItems
}: {
  houseItems: NavGroupItem[]
}) {
  const t = useTranslations('SiteHeader')
  const isMobile = useIsMobile()

  const navItems: NavItems = [
    {
      key: 'share-houses',
      items: houseItems,
      label: t('navigation.share_houses')
    },
    {
      key: 'faq',
      href: '/faq',
      label: t('navigation.faq')
    },
    {
      key: 'contact',
      href: '/contact',
      label: t('navigation.contact')
    }
  ]

  return (
    <header
      className={cn(
        'bg-background sticky top-0 z-50 w-full',
        'sm:supports-backdrop-filter:bg-background/60 sm:backdrop-blur'
      )}
    >
      <div className="container-wrapper 3xl:fixed:px-0 px-6">
        <div className="3xl:fixed:container flex h-(--header-height) items-center gap-2 **:data-[slot=separator]:h-4!">
          <MobileNav items={navItems} className="flex lg:hidden" />
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="hidden size-8 bg-transparent lg:flex"
          >
            <Link href="/">
              <Icons.logo className="size-5" />
              <span className="sr-only">{t('logo_label')}</span>
            </Link>
          </Button>
          <MainNav items={navItems} className="hidden lg:flex" />
          <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
            <LanguageSwitcher size={isMobile ? 'icon-sm' : 'default'} />
            <ModeSwitcher />
            <Button variant="ghost" size="icon" asChild>
              <NextLink href="/studio" target="_blank" prefetch={false}>
                <Settings2 className="size-4.5" />
                <span className="sr-only">Sanity Studio</span>
              </NextLink>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
