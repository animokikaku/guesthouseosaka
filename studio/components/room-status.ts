/**
 * What a house's row says in Site Settings' Room Availability field (see
 * `room-availability-input.tsx`).
 */
import type { HouseStatus, SyncResult } from '@/lib/rooms-sync/api'
import { isFresh } from '@/lib/rooms-sync/room'

export function describeError(error: string) {
  // shares.house refuses requests that don't come from Japan.
  return error.includes('HTTP 403')
    ? `shares.house refused the request (${error}). It only answers from Japan; the hourly sync will try again.`
    : error
}

/** A row's dot: green or red, what it's labelled, and when that happened. */
export interface SyncDot {
  ok: boolean
  label: string
  at: Date | null
}

/**
 * What a house's row says: its listed rooms (with what changed, or why it
 * failed, when this editor just synced), and its dot.
 */
export function describeHouse(
  status: HouseStatus,
  syncResult: SyncResult | undefined,
  finishedAt: Date | undefined
): { subtitle: string; dot: SyncDot } {
  const syncedAt = status.syncedAt === null ? null : new Date(status.syncedAt)
  const fresh = isFresh(status.syncedAt)
  // A failure that a later sync (the schedule's) superseded no longer applies.
  const superseded = syncResult?.ok === false && syncedAt && finishedAt && syncedAt > finishedAt
  const result = superseded ? undefined : syncResult
  const rooms = `${status.rooms} rooms`
  if (result && !result.ok) {
    return {
      subtitle: describeError(result.error),
      dot: { ok: false, label: 'Failed', at: finishedAt ?? null }
    }
  }
  if (result) {
    return {
      subtitle: `${rooms}, ${result.changed === 0 ? 'no changes' : `${result.changed} changed`}`,
      dot: { ok: fresh, label: 'Synced', at: syncedAt }
    }
  }
  if (!syncedAt) {
    return { subtitle: 'Not synced yet', dot: { ok: false, label: 'Never synced', at: null } }
  }
  // The site hides rooms last synced over two days ago.
  const label = fresh ? 'Synced' : 'Out of date, hidden on the site'
  return { subtitle: rooms, dot: { ok: fresh, label, at: syncedAt } }
}
