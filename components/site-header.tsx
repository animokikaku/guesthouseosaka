'use client'

import { Icons } from '@/components/icons'
import { LanguageSwitcher } from '@/components/language-switcher'
import { MainNav } from '@/components/main-nav'
import { MobileNav } from '@/components/mobile-nav'
import { ModeSwitcher } from '@/components/mode-switcher'
import { buttonVariants } from '@/components/ui/button'
import { useHouseTheme } from '@/hooks/use-house-theme'
import { Link } from '@/i18n/navigation'
import { NavGroupItem, NavItems } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

export function SiteHeader({ houseItems }: { houseItems: NavGroupItem[] }) {
  const t = useTranslations('SiteHeader')
  useHouseTheme()

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
          <Link
            href="/"
            className={cn(
              buttonVariants({
                variant: 'ghost',
                size: 'icon'
              }),
              'hidden size-8 bg-transparent lg:flex'
            )}
          >
            <Icons.logo aria-hidden="true" className="size-5" />
            <span className="sr-only">{t('logo_label')}</span>
          </Link>
          <MainNav items={navItems} aria-label={t('navigation_label')} className="hidden lg:flex" />
          <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
            <LanguageSwitcher size="responsive" />
            <ModeSwitcher />
          </div>
        </div>
      </div>
    </header>
  )
}
