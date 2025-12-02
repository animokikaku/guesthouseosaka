'use client'

import { Icons } from '@/components/icons'
import { LanguageSwitcher } from '@/components/language-switcher'
import { MainNav } from '@/components/main-nav'
import { MobileNav } from '@/components/mobile-nav'
import { ModeSwitcher } from '@/components/mode-switcher'
import { Button } from '@/components/ui/button'
import { useHouseLabels } from '@/hooks/use-house-labels'
import { Link } from '@/i18n/navigation'
import { assets } from '@/lib/assets'
import { NavItems } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

export function SiteHeader() {
  const t = useTranslations('SiteHeader')
  const houseLabel = useHouseLabels()

  const navItems: NavItems = [
    {
      key: 'share-houses',
      items: (['orange', 'apple', 'lemon'] as const).map((house) => {
        const { name, summary, caption } = houseLabel(house)
        const { icon, background } = assets[house]
        return {
          key: house,
          href: `/${house}`,
          label: name,
          description: summary,
          caption,
          icon,
          background
        }
      }),
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
            <div className="hidden w-full flex-1 md:flex md:w-auto md:flex-none"></div>
            <LanguageSwitcher size="icon-sm" />
            <ModeSwitcher />
          </div>
        </div>
      </div>
    </header>
  )
}
