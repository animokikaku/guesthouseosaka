import { HouseRooms } from '@/components/house/house-rooms'
import { formats, timeZone } from '@/i18n/formats'
import type { RoomAvailability } from '@/lib/rooms'
import messages from '@/messages/en.json'
import french from '@/messages/fr.json'
import { IntlProvider } from 'use-intl'

const rooms: RoomAvailability = {
  today: '2026-11-22',
  available: [{ roomNumber: '103', availableFrom: null, price: 53000 }],
  upcoming: [
    { roomNumber: '208', availableFrom: '2026-12-08', price: 58000 },
    { roomNumber: '209', availableFrom: '2026-12-08', price: 58000 },
    { roomNumber: '309', availableFrom: '2027-02-01', price: null },
    { roomNumber: '204', availableFrom: null, price: 56000 }
  ]
}

const catalogs = {
  en: messages,
  // The French catalog has the English one's shape (see docs/i18n.md), which its plain strings don't tell the types.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  fr: french as unknown as typeof messages
}

/** Inside Orange House's theme, as on its page. */
function Page({ children, locale = 'en' }: { children: React.ReactNode; locale?: 'en' | 'fr' }) {
  return (
    <IntlProvider locale={locale} messages={catalogs[locale]} formats={formats} timeZone={timeZone}>
      <div className="theme-orange">
        <main className="theme-container mx-auto max-w-3xl p-6">{children}</main>
      </div>
    </IntlProvider>
  )
}

export function WithRooms() {
  return (
    <Page>
      <HouseRooms
        house="orange"
        rooms={rooms}
        note="Monthly prices include management and common fees."
      />
    </Page>
  )
}

/** In French, whose "Available now" and prices are the longest. */
export function French() {
  return (
    <Page locale="fr">
      <HouseRooms house="orange" rooms={rooms} />
    </Page>
  )
}

export function FullyBooked() {
  return (
    <Page>
      <HouseRooms house="orange" rooms={{ today: '2026-11-22', available: [], upcoming: [] }} />
    </Page>
  )
}
