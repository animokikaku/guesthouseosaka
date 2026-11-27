import { useAppForm } from '@/components/forms/app-form'
import { formats, timeZone } from '@/i18n/formats'
import { toRoomOptions, type RoomsByHouse } from '@/lib/rooms'
import messages from '@/messages/en.json'
import { IntlProvider } from 'use-intl'

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
  lemon: null
}

const titles = { orange: 'Orange House', apple: 'Apple House' } as const

/** The field as the move-in form shows it with Orange House and Apple House selected, Room 208 chosen. */
export function TwoHouses() {
  const form = useAppForm({ defaultValues: { rooms: ['orange-208'] } })
  const groups = toRoomOptions(rooms, ['orange', 'apple']).map((group) => ({
    ...group,
    title: titles[group.house === 'apple' ? 'apple' : 'orange'],
    // Apple House's prices depend on the contract.
    pricesFrom: group.house === 'apple'
  }))

  return (
    <IntlProvider locale="en" messages={messages} formats={formats} timeZone={timeZone}>
      <main className="mx-auto max-w-2xl p-6">
        <form.Field name="rooms" children={(field) => <field.RoomsField groups={groups} />} />
      </main>
    </IntlProvider>
  )
}
