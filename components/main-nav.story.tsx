import { MainNav } from '@/components/main-nav'
import messages from '@/messages/en.json'
import { navItems } from '@/playwright/gallery/nav-items'
import { NextIntlClientProvider } from 'next-intl'

function Header({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <header className="p-6">{children}</header>
    </NextIntlClientProvider>
  )
}

export function Houses() {
  return (
    <Header>
      <MainNav items={navItems()} aria-label="Main navigation" />
    </Header>
  )
}

export function NoHouses() {
  return (
    <Header>
      <MainNav items={navItems([])} aria-label="Main navigation" />
    </Header>
  )
}
