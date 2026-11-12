/**
 * Syncs room availability from shares.house on demand (see docs/rooms.md),
 * shared by the Room Availability field's "Sync now" action, which starts it,
 * and its input, which shows how it went. The site checks the request with a
 * preview secret the signed-in user creates, as Presentation does, so the
 * Studio holds no token.
 */
import {
  statusesSchema,
  syncResponseSchema,
  type HouseStatus,
  type SyncResponse
} from '@/lib/rooms-sync/api'
import { isFresh } from '@/lib/rooms-sync/room'
import { siteUrl } from '@/studio/site-url'
import { createPreviewSecret } from '@sanity/preview-url-secret/create-secret'
import { useSyncExternalStore } from 'react'
import type { SanityClient } from 'sanity'

/** Each house's sync status; undefined when the site can't say. */
export function loadStatuses(): Promise<HouseStatus[] | undefined> {
  return fetch(new URL('/api/sync-rooms', siteUrl))
    .then(async (response) => statusesSchema.parse(await response.json()).houses)
    .catch(() => undefined)
}

export type SyncState =
  | { status: 'idle' }
  | { status: 'syncing' }
  | ({ status: 'done'; finishedAt: Date } & SyncResponse)
  | { status: 'error'; message: string }

let state: SyncState = { status: 'idle' }
const listeners = new Set<() => void>()

function setState(next: SyncState) {
  state = next
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** The last sync this editor ran in this tab, if any. */
export function useRoomSync() {
  return useSyncExternalStore(subscribe, () => state)
}

/**
 * Syncs every house if the site hides any's rooms, synced too long ago, or
 * can't say: what the schedule skipped while room availability was off.
 */
export async function syncRoomsIfStale(client: SanityClient, userId: string | undefined) {
  const statuses = await loadStatuses()
  if (statuses?.every(({ syncedAt }) => isFresh(syncedAt))) return
  await syncRooms(client, userId)
}

/** Syncs every house now; `useRoomSync` follows it. */
export async function syncRooms(client: SanityClient, userId: string | undefined) {
  if (state.status === 'syncing') return
  setState({ status: 'syncing' })
  try {
    const { secret } = await createPreviewSecret(
      client,
      'guesthouseosaka/room-sync',
      location.origin,
      userId
    )
    // A text body, so the cross-origin request needs no preflight.
    const response = await fetch(new URL('/api/sync-rooms', siteUrl), {
      method: 'POST',
      body: secret
    }).catch(() => null)
    // The browser hides why: the site is down, unreachable, or refused the Studio's origin.
    if (!response) {
      setState({ status: 'error', message: `The Studio couldn’t reach the site at ${siteUrl}.` })
      return
    }
    if (response.status === 401) {
      setState({ status: 'error', message: 'The site couldn’t verify your Studio session.' })
      return
    }
    setState({
      status: 'done',
      finishedAt: new Date(),
      ...syncResponseSchema.parse(await response.json())
    })
  } catch (error) {
    setState({
      status: 'error',
      message: `The sync couldn’t run: ${error instanceof Error ? error.message : String(error)}`
    })
  }
}
