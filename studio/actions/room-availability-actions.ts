/**
 * The Room Availability field's actions, in its "…" menu with the Studio's
 * own: show or hide the rooms on the site, and sync them now (see
 * docs/rooms.md). Turning it on or off edits the draft, so Presentation
 * previews it before it's published.
 */
import { syncRooms, useRoomSync } from '@/studio/components/room-sync'
import { EyeClosedIcon } from '@sanity/icons/EyeClosed'
import { EyeOpenIcon } from '@sanity/icons/EyeOpen'
import { SyncIcon } from '@sanity/icons/Sync'
import {
  defineDocumentFieldAction,
  useClient,
  useCurrentUser,
  useDocumentOperation,
  useEditState,
  type DocumentFieldActionProps
} from 'sanity'
import { useCallback } from 'react'

const FIELD = 'roomAvailability'

// Each `useAction` keeps its `onAction` the same between renders: the Studio
// compares what it returns, and a new function each time renders it again,
// without end.

function isRoomAvailability({ path }: DocumentFieldActionProps) {
  return path.length === 1 && path[0] === FIELD
}

/**
 * Whether the field is on in the document as edited: its draft, else what's
 * published. Field actions render outside the form, so `useFormValue` can't.
 */
function useEnabled({ documentId, documentType }: DocumentFieldActionProps) {
  const { draft, published } = useEditState(documentId, documentType)
  return (draft ?? published)?.[FIELD] === true
}

const toggleRoomAvailability = defineDocumentFieldAction({
  name: 'roomAvailability/toggle',
  useAction(props) {
    const enabled = useEnabled(props)
    const { patch } = useDocumentOperation(props.documentId, props.documentType)
    const onAction = useCallback(
      () => patch.execute([{ set: { [FIELD]: !enabled } }]),
      [patch, enabled]
    )
    return {
      type: 'action',
      hidden: !isRoomAvailability(props),
      icon: enabled ? EyeClosedIcon : EyeOpenIcon,
      title: enabled ? 'Hide from the site' : 'Show on the site',
      onAction
    }
  }
})

const syncRoomsNow = defineDocumentFieldAction({
  name: 'roomAvailability/sync',
  useAction(props) {
    const client = useClient({ apiVersion: '2025-02-19' })
    const user = useCurrentUser()
    const syncing = useRoomSync().status === 'syncing'
    const onAction = useCallback(() => void syncRooms(client, user?.id), [client, user?.id])
    return {
      type: 'action',
      // On or off: a sync keeps the list current, and a draft can preview fresh rooms.
      hidden: !isRoomAvailability(props),
      disabled: syncing,
      icon: SyncIcon,
      title: syncing ? 'Syncing…' : 'Sync now',
      onAction
    }
  }
})

/** Ahead of the Studio's own (copy, paste…). */
export const roomAvailabilityActions = [toggleRoomAvailability, syncRoomsNow]
