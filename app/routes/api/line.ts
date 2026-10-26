/**
 * LINE webhook: managers update rooms' availability by messaging the LINE
 * Official Account, e.g. "Orange 106 free from Nov 27". Agent Actions Prompt
 * reads the message, the rooms are patched in Sanity, and the bot replies with
 * what changed. Managers are `lineManager` documents. Setup: docs/line-bot.md.
 */

import { intlConfig, loadMessages } from '@/i18n/messages'
import { getRoomStatus, openingDateFormat, tokyoMidnight, tokyoToday } from '@/lib/availability'
import { serverEnv } from '@/lib/env.server'
import {
  getLineDisplayName,
  isValidLineSignature,
  replyToLine,
  textMessageEvents,
  type LineTextMessageEvent
} from '@/lib/line'
import {
  FALLBACK_LOCALE,
  resolveRoomUpdates,
  ROOM_UPDATE_INSTRUCTION,
  roomUpdateParams,
  toRoomUpdateHouses,
  type RoomChange,
  type RoomUpdateHouse,
  type RoomUpdates
} from '@/lib/room-updates'
import { client } from '@/sanity/lib/client'
import { lineManagerQuery, roomUpdateHousesQuery } from '@/sanity/lib/queries'
import type { SanityClient } from '@sanity/client'
import { createFileRoute } from '@tanstack/react-router'
import { waitUntil } from 'cloudflare:workers'
import { createFormatter, createTranslator, type Locale } from 'use-intl'

export const Route = createFileRoute('/api/line')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const {
          LINE_CHANNEL_SECRET: secret,
          LINE_CHANNEL_ACCESS_TOKEN: accessToken,
          SANITY_API_WRITE_TOKEN: token
        } = serverEnv
        if (!secret || !accessToken || !token) {
          return new Response('The LINE bot is not configured', { status: 503 })
        }

        const body = await request.text()
        if (!isValidLineSignature(body, request.headers.get('x-line-signature'), secret)) {
          return new Response('Invalid signature', { status: 401 })
        }

        const events = textMessageEvents(JSON.parse(body))
        const sanity = client.withConfig({ token, perspective: 'raw' })

        // LINE retries a webhook that's slow to answer, and reading a message takes a few seconds.
        // `allSettled` keeps the Worker alive until every event is done, even if one reply fails.
        waitUntil(
          Promise.allSettled(
            events.map(async (event) => {
              const reply = (text: string) => replyToLine(event.replyToken, text, accessToken)
              // LINE doesn't always say who wrote in a group chat
              const { userId } = event.source
              if (!userId) return
              // The reply stays outside the `try`: a reply token works once, so a failed
              // reply mustn't be followed by the "failed" one
              let text: string
              try {
                const manager = await sanity.fetch(lineManagerQuery, { id: managerId(userId) })
                text = manager
                  ? await updateRooms(event, manager.houses ?? [], sanity)
                  : await requestAccess(userId, sanity, accessToken)
              } catch (error) {
                console.error('LINE room update failed', error)
                text = (await getIntl(FALLBACK_LOCALE)).t('LineBot.failed')
              }
              await reply(text)
            })
          ).then((results) => {
            for (const result of results) {
              if (result.status === 'rejected') console.error('LINE reply failed', result.reason)
            }
          })
        )

        return new Response(null, { status: 200 })
      }
    }
  }
})

/** The translator and formatter for a reply, as the pages get them from `IntlProvider`. */
async function getIntl(locale: Locale) {
  const messages = await loadMessages(locale)
  return {
    t: createTranslator({ locale, messages, ...intlConfig }),
    format: createFormatter({ locale, ...intlConfig })
  }
}

/** The ID the bot gives a manager's document, so it can find them again. */
const managerId = (userId: string) => `lineManager.${userId}`

/**
 * Adds a draft manager for someone new, which an admin publishes to let them
 * in. Later messages before that leave the draft as it is.
 */
async function requestAccess(userId: string, sanity: SanityClient, accessToken: string) {
  const name = (await getLineDisplayName(userId, accessToken)) ?? userId
  await sanity.createIfNotExists({
    _id: `drafts.${managerId(userId)}`,
    _type: 'lineManager',
    name,
    lineUserId: userId
  })
  const { t } = await getIntl(FALLBACK_LOCALE)
  return t('LineBot.pending', { name })
}

/** Reads the message, applies the room changes it reports and returns the reply. */
async function updateRooms(
  { message }: LineTextMessageEvent,
  houseIds: string[],
  sanity: SanityClient
) {
  const today = tokyoToday()
  const houses = toRoomUpdateHouses(await sanity.fetch(roomUpdateHousesQuery)).filter((house) =>
    houseIds.includes(house._id)
  )
  const response: unknown = await sanity.withConfig({ apiVersion: 'vX' }).agent.action.prompt({
    instruction: ROOM_UPDATE_INSTRUCTION,
    instructionParams: roomUpdateParams(message.text, houses, today),
    format: 'json',
    temperature: 0
  })

  const updates = resolveRoomUpdates(response, houses, today)
  if (!updates) {
    const { t } = await getIntl(FALLBACK_LOCALE)
    return t('LineBot.not_understood')
  }

  await saveChanges(updates.changes, sanity)
  return formatReply(updates, today)
}

/** One transaction, so a message about several rooms changes all of them or none. */
async function saveChanges(changes: RoomChange[], sanity: SanityClient) {
  const transaction = sanity.transaction()
  for (const { house, room, availableFrom, unchanged } of changes) {
    if (unchanged) continue
    const path = `rooms[_key=="${room._key}"].availableFrom`
    const ids = house.draftRoomKeys.includes(room._key)
      ? [house._id, `drafts.${house._id}`]
      : [house._id]
    for (const id of ids) {
      transaction.patch(id, (patch) =>
        availableFrom ? patch.set({ [path]: availableFrom }) : patch.unset([path])
      )
    }
  }
  if (transaction.toJSON().length > 0) await transaction.commit()
}

async function formatReply(
  { locale, changes, unknownHouses, unknownRooms, unplacedRooms }: RoomUpdates,
  today: string
) {
  const { t, format } = await getIntl(locale)

  const title = ({ titles, slug }: RoomUpdateHouse) =>
    titles.find(({ language }) => language === locale)?.value ??
    titles.find(({ language }) => language === 'en')?.value ??
    slug

  const status = (availableFrom: string | null) => {
    const roomStatus = getRoomStatus(availableFrom, today)
    // `!availableFrom` repeats the occupied check so TypeScript knows the date is set below
    if (!availableFrom || roomStatus === 'occupied') return t('HouseAvailability.occupied')
    if (roomStatus === 'available') return t('HouseAvailability.legend_available')
    const date = format.dateTime(
      tokyoMidnight(availableFrom),
      openingDateFormat(availableFrom, today)
    )
    return t('LineBot.available_from', { date })
  }

  const lines = [
    ...changes.map(({ house, room, availableFrom, unchanged }) => {
      const values = {
        house: title(house),
        room: t('HouseAvailability.room_number', { number: room.number })
      }
      return unchanged
        ? t('LineBot.unchanged', { ...values, status: status(room.availableFrom) })
        : t('LineBot.change', {
            ...values,
            before: status(room.availableFrom),
            after: status(availableFrom)
          })
    }),
    ...unknownRooms.map(({ house, number }) =>
      t('LineBot.unknown_room', { house: title(house), number })
    ),
    ...unknownHouses.map((house) => t('LineBot.unknown_house', { house })),
    ...unplacedRooms.map(({ number, houses }) =>
      houses.length > 0
        ? t('LineBot.ambiguous_room', { number, houses: format.list(houses.map(title)) })
        : t('LineBot.no_such_room', { number })
    )
  ]

  return lines.length > 0 ? lines.join('\n') : t('LineBot.not_understood')
}
