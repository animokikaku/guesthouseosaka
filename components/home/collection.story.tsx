import { Collection } from '@/components/home/collection'
import type { RoomsByHouse } from '@/lib/rooms'
import messages from '@/messages/en.json'
import type { HomePageQueryResult } from '@/sanity.types'
import { IntlProvider } from 'use-intl'

type House = NonNullable<HomePageQueryResult['houses']>[number]

const houses = (
  [
    ['orange', 'Orange House', 'Relaxed spacious Japanese-style lounge'],
    ['apple', 'Apple House', 'Well-appointed private rooms and a luxe lounge'],
    ['lemon', 'Lemon House', 'Share house 8 minutes from Namba Station']
  ] as const
).map(([slug, title, description], index): House => ({
  _id: slug,
  slug,
  title,
  description,
  image: {
    asset: { _ref: `image-${String(index + 1).repeat(24)}-1200x800-jpg`, _type: 'reference' },
    hotspot: null,
    crop: null,
    alt: title,
    blurHash: null
  }
}))

const rooms: RoomsByHouse = {
  orange: {
    today: '2026-11-22',
    available: [{ roomNumber: '103', availableFrom: null, price: 53000 }],
    upcoming: [{ roomNumber: '208', availableFrom: '2026-12-08', price: 58000 }]
  },
  apple: {
    today: '2026-11-22',
    available: [],
    upcoming: [{ roomNumber: '402', availableFrom: '2027-03-15', price: 63000 }]
  },
  lemon: { today: '2026-11-22', available: [], upcoming: [] }
}

/** The home page's houses, each with its availability over its photo's corner. */
export function WithRooms() {
  return (
    <IntlProvider locale="en" messages={messages}>
      <main className="mx-auto max-w-5xl p-6">
        <Collection houses={houses} rooms={rooms} />
      </main>
    </IntlProvider>
  )
}
