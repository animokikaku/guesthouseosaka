import { HouseRooms } from '@/components/house/house-rooms'
import { formats, timeZone } from '@/i18n/formats'
import type { RoomAvailability } from '@/lib/rooms'
import messages from '@/messages/en.json'
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

/** Inside Orange House's theme, as on its page. */
function Page({ children }: { children: React.ReactNode }) {
  return (
    <IntlProvider locale="en" messages={messages} formats={formats} timeZone={timeZone}>
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

export function FullyBooked() {
  return (
    <Page>
      <HouseRooms house="orange" rooms={{ today: '2026-11-22', available: [], upcoming: [] }} />
    </Page>
  )
}
