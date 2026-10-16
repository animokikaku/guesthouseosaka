import { MobileNav } from '@/components/mobile-nav'
import messages from '@/messages/en.json'
import { navItems } from '@/playwright/gallery/nav-items'
import { NextIntlClientProvider } from 'next-intl'

function Header({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <header className="flex h-(--header-height) items-center px-6">{children}</header>
    </NextIntlClientProvider>
  )
}

export function Houses() {
  return (
    <Header>
      <MobileNav items={navItems()} />
    </Header>
  )
}

export function NoHouses() {
  return (
    <Header>
      <MobileNav items={navItems([])} />
    </Header>
  )
}
