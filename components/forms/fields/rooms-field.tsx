import { fieldComponent } from '@/components/forms/field-brand'
import { FieldControlHeader, useFieldControl } from '@/components/forms/fields/field-control'
import { HouseIcon } from '@/components/house-icon'
import { formatRoomDate } from '@/components/house/room-date'
import { useRoomPrice } from '@/components/house/room-price'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor
} from '@/components/ui/combobox'
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { Field } from '@/components/ui/field'
import { useIsMobile } from '@/hooks/use-mobile'
import type { RoomOption } from '@/lib/rooms'
import type { HouseIdentifier } from '@/lib/types'
import { cn } from '@/lib/utils'
import type { FieldWithValue } from '@tanstack/react-form'
import { CalendarClockIcon, CalendarIcon, CheckIcon, CircleCheckIcon, XIcon } from 'lucide-react'
import { useFormatter, useTranslations } from 'use-intl'

/** A house's rooms to choose from, under its title. */
export interface RoomGroup {
  house: HouseIdentifier
  title: string
  rooms: RoomOption[]
  /** Whether the house's prices are starting prices (see `useRoomPrice`). */
  pricesFrom?: boolean
}

interface RoomsFieldProps {
  /** The chosen rooms' keys (see `roomKey`). */
  field: FieldWithValue<string[]>
  /** The rooms of the houses the visitor selected, house by house. */
  groups: RoomGroup[]
}

/**
 * The move-in form's optional "Rooms" field: the rooms of the selected houses
 * that are free or freeing up, to choose any number of. A list under the field
 * on a wide screen, a sheet from the bottom on a phone, where a list that
 * needed the keyboard would have no room. Nothing when the selected houses
 * have no rooms to offer.
 */
function RoomsField({ field, groups }: RoomsFieldProps) {
  const t = useTranslations('forms.fields.rooms')
  const isMobile = useIsMobile()
  const { isInvalid, ids, controlProps } = useFieldControl('rooms', field)

  const options = groups.flatMap((group) => group.rooms)
  if (options.length === 0) return null

  const chosen = options.filter((room) => field.value.includes(room.key))
  // The form keeps the rooms of a house the visitor unselects, out of sight,
  // in case they select it again (see `createMoveInFormSchema`).
  const others = field.value.filter((key) => !options.some((room) => room.key === key))
  const choose = (rooms: RoomOption[]) =>
    field.handleChange([...others, ...rooms.map((room) => room.key)])

  const Control = isMobile ? RoomsSheet : RoomsCombobox
  return (
    <Field data-invalid={isInvalid}>
      <FieldControlHeader
        field={field}
        ids={ids}
        label={
          <div>
            {t('label')} <span className="text-muted-foreground text-xs">{t('optional')}</span>
          </div>
        }
      />
      <Control
        groups={groups.filter((group) => group.rooms.length > 0)}
        chosen={chosen}
        onChoose={choose}
        controlProps={controlProps}
      />
    </Field>
  )
}

interface ControlProps {
  groups: RoomGroup[]
  chosen: RoomOption[]
  onChoose: (rooms: RoomOption[]) => void
  controlProps: ReturnType<typeof useFieldControl>['controlProps']
}

/** "Room 208", which the list also filters by as the visitor types. */
function useRoomName() {
  const t = useTranslations('HouseRooms')
  return (room: RoomOption) => t('room', { number: room.roomNumber })
}

/** Chips in an input, with the list under it. */
function RoomsCombobox({ groups, chosen, onChoose, controlProps }: ControlProps) {
  const t = useTranslations('forms.fields.rooms')
  const roomName = useRoomName()
  const anchor = useComboboxAnchor()

  return (
    <Combobox
      multiple
      // Base UI's shape for grouped items.
      items={groups.map((group) => ({ ...group, value: group.house, items: group.rooms }))}
      value={chosen}
      onValueChange={onChoose}
      itemToStringLabel={roomName}
      isItemEqualToValue={(room, value) => room.key === value.key}
    >
      <ComboboxChips ref={anchor}>
        <ComboboxValue>
          {(rooms: RoomOption[]) => (
            <>
              {rooms.map((room) => (
                <ComboboxChip
                  key={room.key}
                  removeLabel={t('remove', { room: roomName(room) })}
                  className="[&>svg]:size-3.5"
                >
                  <HouseIcon name={room.house} strokeWidth={1.5} />
                  {roomName(room)}
                </ComboboxChip>
              ))}
              <ComboboxChipsInput {...controlProps} />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>{t('empty')}</ComboboxEmpty>
        <ComboboxList>
          {(group: RoomGroup & { items: RoomOption[] }) => (
            <ComboboxGroup key={group.house} items={group.items}>
              <ComboboxLabel className="flex items-center gap-1.5 [&>svg]:size-3.5">
                <HouseIcon name={group.house} strokeWidth={1.25} />
                {group.title}
              </ComboboxLabel>
              <ComboboxCollection>
                {(room: RoomOption) => (
                  <ComboboxItem key={room.key} value={room}>
                    <RoomDetails room={room} pricesFrom={group.pricesFrom} />
                  </ComboboxItem>
                )}
              </ComboboxCollection>
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

/** The same field and chips, opening a sheet of rooms to tick. */
function RoomsSheet({ groups, chosen, onChoose, controlProps }: ControlProps) {
  const t = useTranslations('forms.fields.rooms')
  const roomName = useRoomName()
  const isChosen = (room: RoomOption) => chosen.some(({ key }) => key === room.key)
  const without = (room: RoomOption) => chosen.filter(({ key }) => key !== room.key)

  return (
    <Drawer>
      {/* Drawn as the combobox's chips are (see `ComboboxChips`). */}
      <div className="border-input focus-within:border-ring focus-within:ring-ring/50 has-aria-invalid:border-destructive dark:bg-input/30 flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border bg-transparent px-1.5 py-1.5 text-sm shadow-xs transition-[color,box-shadow] focus-within:ring-3">
        {chosen.map((room) => (
          <span
            key={room.key}
            className="bg-muted text-foreground flex h-5.5 items-center gap-1 rounded-sm pl-1.5 text-xs font-medium whitespace-nowrap [&>svg]:size-3.5"
          >
            <HouseIcon name={room.house} strokeWidth={1.5} />
            {roomName(room)}
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="-ml-1 opacity-50 hover:opacity-100"
              aria-label={t('remove', { room: roomName(room) })}
              onClick={() => onChoose(without(room))}
            >
              <XIcon />
            </Button>
          </span>
        ))}
        <DrawerTrigger
          render={
            <button
              type="button"
              {...controlProps}
              aria-label={t('choose')}
              className="text-muted-foreground h-5.5 min-w-16 flex-1 px-1 text-left outline-none"
            />
          }
        >
          {chosen.length === 0 && t('choose')}
        </DrawerTrigger>
      </div>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t('label')}</DrawerTitle>
          <DrawerDescription className="sr-only">{t('choose')}</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          {groups.map((group) => (
            <fieldset key={group.house}>
              <legend className="text-muted-foreground flex items-center gap-1.5 pt-3 pb-1 text-xs [&>svg]:size-3.5">
                <HouseIcon name={group.house} strokeWidth={1.25} />
                {group.title}
              </legend>
              {group.rooms.map((room) => (
                // A checkbox drawn as a row with a tick, tall enough for a finger.
                <label
                  key={room.key}
                  className="has-focus-visible:bg-muted flex h-12 items-center gap-2.5 rounded-sm text-[15px]"
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isChosen(room)}
                    onChange={() => onChoose(isChosen(room) ? without(room) : [...chosen, room])}
                  />
                  <RoomDetails room={room} pricesFrom={group.pricesFrom} />
                  <CheckIcon
                    className={cn('size-4.5 shrink-0', !isChosen(room) && 'invisible')}
                    aria-hidden="true"
                  />
                </label>
              ))}
            </fieldset>
          ))}
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose render={<Button type="button" size="lg" />}>{t('done')}</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

/** A room's row in either list: its name, when it's free, and what it costs a month. */
function RoomDetails({ room, pricesFrom }: { room: RoomOption; pricesFrom?: boolean }) {
  const t = useTranslations('HouseRooms')
  const formatter = useFormatter()
  const roomPrice = useRoomPrice()

  let when = t('date_unknown')
  let Icon = CalendarClockIcon
  if (room.free) {
    when = t('now')
    Icon = CircleCheckIcon
  } else if (room.availableFrom !== null) {
    when = formatRoomDate(formatter, room.availableFrom, room.today)
    Icon = CalendarIcon
  }

  return (
    <>
      <span className="min-w-20 whitespace-nowrap">{t('room', { number: room.roomNumber })}</span>
      <span className="text-muted-foreground flex flex-1 items-center gap-1.5 whitespace-nowrap [&>svg]:size-3.5">
        <Icon />
        {when}
      </span>
      {room.price !== null && (
        <Badge variant="outline" className="tabular-nums">
          {roomPrice(room.price, pricesFrom)}
        </Badge>
      )}
    </>
  )
}

export default fieldComponent.loose(RoomsField, 'field')
