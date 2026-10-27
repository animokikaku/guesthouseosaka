import { Icons } from '@/components/icons'
import { LanguageSwitcher } from '@/components/language-switcher'
import { MainNav } from '@/components/main-nav'
import { MobileNav } from '@/components/mobile-nav'
import { ModeSwitcher } from '@/components/mode-switcher'
import { buttonVariants } from '@/components/ui/button'
import type { NavGroupItem, NavItems } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'
import { useLocale, useTranslations } from 'use-intl'

export function SiteHeader({ houseItems }: { houseItems: NavGroupItem[] }) {
  const t = useTranslations('SiteHeader')
  const locale = useLocale()

  const navItems: NavItems = [
    {
      key: 'share-houses',
      items: houseItems,
      label: t('navigation.share_houses')
    },
    {
      key: 'faq',
      link: { to: '/$locale/faq', params: { locale } },
      label: t('navigation.faq')
    },
    {
      key: 'contact',
      link: { to: '/$locale/contact', params: { locale } },
      label: t('navigation.contact')
    }
  ]

  return (
    <header
      className={cn(
        // Named so page transitions leave it in place rather than crossfading it.
        'bg-background fixed inset-x-0 top-0 z-50 w-full [view-transition-name:site-header]',
        'sm:supports-backdrop-filter:bg-background/60 sm:backdrop-blur'
      )}
    >
      <div className="container-wrapper px-6">
        <div className="flex h-(--header-height) items-center gap-2 **:data-[slot=separator]:h-4!">
          <MobileNav items={navItems} className="flex lg:hidden" />
          <Link
            to="/$locale"
            params={{ locale }}
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
            <LanguageSwitcher />
            <ModeSwitcher />
          </div>
        </div>
      </div>
    </header>
  )
}
