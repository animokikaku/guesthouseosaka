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
import { useExtracted } from 'next-intl'

export function SiteHeader() {
  const t = useExtracted()

  const navItems: NavItems = [
    {
      label: t('Share Houses'),
      key: 'share-houses',
      items: [
        {
          key: 'orange',
          href: '/orange',
          label: t('Orange House'),
          description: t('Relaxed spacious Japanese-style lounge'),
          caption: t('Vibrant space designed for memorable experiences'),
          icon: assets.orange.icon,
          background: assets.orange.background
        },
        {
          key: 'apple',
          href: '/apple',
          label: t('Apple House'),
          description: t('Share house 8 minutes walk from Namba Station'),
          caption: t('Experience the warmth and comfort with modern amenities'),
          icon: assets.apple.icon,
          background: assets.apple.background
        },
        {
          key: 'lemon',
          href: '/lemon',
          label: t('Lemon House'),
          description: t('Well-equipped private rooms and a luxurious lounge'),
          caption: t(
            'Bright and cheerful accommodation perfect for a refreshing stay'
          ),
          icon: assets.lemon.icon,
          background: assets.lemon.background
        }
      ]
    },
    {
      key: 'faq',
      href: '/faq',
      label: t('FAQ')
    },
    {
      key: 'contact',
      href: '/contact',
      label: t('Contact')
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
              <span className="sr-only">{t('Share House Osaka')}</span>
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
