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

export function SiteHeader({ houseItems }: { houseItems: NavGroupItem[] }) {
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
        'bg-background fixed inset-x-0 top-0 z-50 w-full',
        'sm:supports-backdrop-filter:bg-background/60 sm:backdrop-blur'
      )}
    >
      <div className="container-wrapper px-6">
        <div className="flex h-(--header-height) items-center gap-2 **:data-[slot=separator]:h-4!">
          <MobileNav items={navItems} className="flex lg:hidden" />
          <Button
            render={<Link href="/" />}
            nativeButton={false}
            variant="ghost"
            size="icon"
            className="hidden size-8 bg-transparent lg:flex"
          >
            <Icons.logo className="size-5" />
            <span className="sr-only">{t('logo_label')}</span>
          </Button>
          <MainNav items={navItems} className="hidden lg:flex" />
          <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
            <LanguageSwitcher size={isMobile ? 'icon-sm' : 'default'} />
            <ModeSwitcher />
            <Button
              variant="ghost"
              size="icon"
              render={<NextLink href="/studio" target="_blank" prefetch={false} />}
              nativeButton={false}
            >
              <Settings2 className="size-4.5" />
              <span className="sr-only">{t('studio_label')}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
