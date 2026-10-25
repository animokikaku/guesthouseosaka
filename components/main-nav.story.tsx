import { MainNav } from '@/components/main-nav'
import messages from '@/messages/en.json'
import { navItems } from '@/playwright/gallery/nav-items'
import { IntlProvider } from 'use-intl'

function Header({ children }: { children: React.ReactNode }) {
  return (
    <IntlProvider locale="en" messages={messages}>
      <header className="p-6">{children}</header>
    </IntlProvider>
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
