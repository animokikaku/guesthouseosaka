import { MoveInForm } from '@/components/forms/move-in-form'
import type { RoomsByHouse } from '@/lib/rooms'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { choose, fillSharedFields, renderMoveInForm, submit } from './utils/contact-form'
import { TURNSTILE_TOKEN } from './utils/turnstile'

const { submitContactForm } = vi.hoisted(() => ({ submitContactForm: vi.fn() }))

vi.mock('@/app/actions/contact.functions', () => ({ submitContactForm }))

const rooms: RoomsByHouse = {
  orange: {
    today: '2026-11-02',
    available: [{ roomNumber: '103', availableFrom: null, price: 53000 }],
    upcoming: [{ roomNumber: '208', availableFrom: '2026-12-08', price: 58000 }]
  },
  apple: {
    today: '2026-11-02',
    available: [],
    upcoming: [{ roomNumber: '402', availableFrom: '2027-03-15', price: 63000 }]
  },
  // Fully booked, and not known.
  lemon: { today: '2026-11-02', available: [], upcoming: [] }
}

function press(house: string) {
  fireEvent.click(screen.getByRole('button', { name: house }))
}

/** Opens the "Rooms" list, which a press does rather than a click. */
function openRooms() {
  fireEvent.mouseDown(screen.getByRole('combobox', { name: /Rooms/ }))
}

/** Picks a room from the list, as `choose` does for a select. */
function pick(room: RegExp) {
  openRooms()
  const option = screen.getByRole('option', { name: room })
  fireEvent.mouseMove(option)
  fireEvent.click(option)
  // The list stays open for another room, and hides the rest of the page meanwhile.
  fireEvent.keyDown(screen.getByRole('combobox', { name: /Rooms/ }), { key: 'Escape' })
}

/** The rooms the form sent. */
async function sentRooms() {
  await waitFor(() => expect(submitContactForm).toHaveBeenCalled())
  const [{ data }] = submitContactForm.mock.calls[0]
  expect(data.turnstileToken).toBe(TURNSTILE_TOKEN)
  return data.payload.data.rooms
}

beforeEach(() => {
  submitContactForm.mockReset().mockResolvedValue({ ok: true })
})

describe('the move-in form’s rooms', () => {
  it('has no "Rooms" field without rooms to offer', () => {
    renderMoveInForm({ rooms: null }, MoveInForm)
    press('Orange House')

    expect(screen.queryByRole('combobox', { name: /Rooms/ })).not.toBeInTheDocument()
  })

  it('offers the rooms of the selected houses only, each with its date and price', () => {
    renderMoveInForm({ rooms }, MoveInForm)
    // No house yet, then one that is fully booked.
    expect(screen.queryByRole('combobox', { name: /Rooms/ })).not.toBeInTheDocument()
    press('Lemon House')
    expect(screen.queryByRole('combobox', { name: /Rooms/ })).not.toBeInTheDocument()

    press('Orange House')
    openRooms()

    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      'Room 103Available now¥53,000',
      'Room 208Dec 8¥58,000'
    ])
    expect(screen.getByRole('group', { name: 'Orange House' })).toBeInTheDocument()
  })

  it('sends the rooms the visitor chose', async () => {
    renderMoveInForm({ rooms }, MoveInForm)
    fillSharedFields()
    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2099-01-15' } })
    choose('Length of stay', /\b3 months\b/)
    pick(/Room 208/)
    submit()

    expect(await sentRooms()).toEqual(['orange-208'])
  })

  it('starts from the room a house page’s link asked for', async () => {
    renderMoveInForm({ rooms, room: 'orange-208' }, MoveInForm)

    expect(screen.getByRole('button', { name: 'Orange House' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(screen.getByRole('button', { name: 'Remove Room 208' })).toBeInTheDocument()
    // The room isn't free before then.
    expect(screen.getByLabelText('Date')).toHaveValue('2026-12-08')
  })

  it('ignores a room that isn’t on offer', () => {
    renderMoveInForm({ rooms, room: 'orange-999' }, MoveInForm)

    expect(screen.getByRole('button', { name: 'Orange House' })).toHaveAttribute(
      'aria-pressed',
      'false'
    )
    expect(screen.queryByRole('button', { name: /^Remove Room/ })).not.toBeInTheDocument()
  })

  it('doesn’t send the rooms of a house the visitor unselected', async () => {
    renderMoveInForm({ rooms, room: 'orange-208' }, MoveInForm)
    // Orange House is selected already: `fillSharedFields` clicks it off.
    fillSharedFields()
    press('Apple House')
    fireEvent.change(screen.getByLabelText('Date'), { target: { value: '2099-01-15' } })
    choose('Length of stay', /\b3 months\b/)
    // Out of sight with its house.
    expect(screen.queryByRole('button', { name: 'Remove Room 208' })).not.toBeInTheDocument()
    submit()

    expect(await sentRooms()).toEqual([])
  })
})
