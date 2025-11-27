import { Icons } from '@/components/icons'
import { LanguageSwitcher } from '@/components/language-switcher'
import { MainNav } from '@/components/main-nav'
import { MobileNav } from '@/components/mobile-nav'
import { ModeSwitcher } from '@/components/mode-switcher'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'
import { assets } from '@/lib/assets'
import { NavItems } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

export function SiteHeader() {
  const t = useTranslations()

  const navItems: NavItems = [
    {
      label: t('navigation.shareHouses'),
      key: 'share-houses',
      items: [
        {
          key: 'orange',
          href: '/orange',
          label: t('houses.orange.name'),
          description: t('houses.orange.summary'),
          caption: t('houses.orange.caption'),
          icon: assets.orange.icon,
          background: assets.orange.background
        },
        {
          key: 'apple',
          href: '/apple',
          label: t('houses.apple.name'),
          description: t('houses.apple.summary'),
          caption: t('houses.apple.caption'),
          icon: assets.apple.icon,
          background: assets.apple.background
        },
        {
          key: 'lemon',
          href: '/lemon',
          label: t('houses.lemon.name'),
          description: t('houses.lemon.summary'),
          caption: t('houses.lemon.caption'),
          icon: assets.lemon.icon,
          background: assets.lemon.background
        }
      ]
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
              <span className="sr-only">{t('meta.siteName')}</span>
            </Link>
          </Button>
          <MainNav items={navItems} className="hidden lg:flex" />
          <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
            <div className="hidden w-full flex-1 md:flex md:w-auto md:flex-none"></div>
            <LanguageSwitcher size="icon-sm" />
            <ModeSwitcher />
            {/* <HouseSwitcher /> */}
          </div>
        </div>
      </div>
    </header>
  )
}
