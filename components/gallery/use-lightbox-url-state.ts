import { validateGallerySearch } from '@/lib/gallery-search'
import { type HistoryLocation, type HistoryState, useRouter } from '@tanstack/react-router'
import { useEffect, useEffectEvent, useRef, useState } from 'react'

declare module '@tanstack/react-router' {
  interface HistoryState {
    /** Marks a photo entry the lightbox pushed, so Forward back onto it can still step off it on close. */
    galleryPhotoPushed?: boolean
  }
}

/** Moves the address bar to `photo`, or off any photo when `undefined`. */
export type PhotoNavigate = (
  photo: string | undefined,
  options: { replace: boolean; state: HistoryState }
) => void

/**
 * Drives a controlled lightbox from the `photo` search param, so each photo has
 * its own URL. Opening pushes a history entry, moving between photos replaces
 * it, and closing steps back off it, so the browser's Back button closes the
 * viewer, including after Forward back onto a photo it opened.
 *
 * The lightbox reads React state, not the URL: its gesture callbacks must
 * update the controlled props synchronously to keep the open morph, and a
 * router navigation lands a beat later. The URL follows that state, and the
 * state only follows the URL on Back and Forward.
 */
export function useLightboxUrlState({
  photo,
  keys,
  navigate
}: {
  /** The `photo` search param on first render. */
  photo: string | undefined
  /** The lightbox items' photo keys, in order. */
  keys: readonly string[]
  navigate: PhotoNavigate
}) {
  const router = useRouter()

  const indexOf = (key: string | undefined) => {
    const index = key === undefined ? -1 : keys.indexOf(key)
    return index === -1 ? undefined : index
  }
  // Parsed by the router, which unwraps a masked entry (the house page's
  // modal) to the location and state it stands for.
  const parse = (location: HistoryLocation) => {
    const { search, state } = router.parseLocation(location)
    return { photo: validateGallerySearch(search).photo, state }
  }

  const [initialIndex] = useState(() => indexOf(photo))
  const [open, setOpen] = useState(initialIndex !== undefined)
  const [value, setValue] = useState(initialIndex ?? 0)
  // Whether opening pushed the history entry the URL sits on, so closing can
  // step back off it instead of leaving it behind for Back to land on.
  const pushedRef = useRef(false)

  const onTraverse = useEffectEvent((location: HistoryLocation) => {
    const { photo: photoInUrl, state } = parse(location)
    pushedRef.current = state.galleryPhotoPushed === true
    const index = indexOf(photoInUrl)
    if (index === undefined) {
      setOpen(false)
    } else {
      setValue(index)
      setOpen(true)
    }
  })

  useEffect(
    () =>
      router.history.subscribe(({ location, action }) => {
        if (action.type !== 'PUSH' && action.type !== 'REPLACE') onTraverse(location)
      }),
    [router]
  )

  const syncUrl = useEffectEvent((isOpen: boolean, target: string | undefined) => {
    const current = parse(router.history.location).photo
    if (target === current) return

    if (target === undefined) {
      // Open on a photo a draft edit just removed: keep its URL until the
      // lightbox moves to another.
      if (isOpen) return
      if (pushedRef.current) {
        pushedRef.current = false
        router.history.back()
      } else {
        // A deep link, or a key no photo has: drop the param in place.
        navigate(undefined, { replace: true, state: {} })
      }
    } else if (current === undefined) {
      pushedRef.current = true
      navigate(target, { replace: false, state: { galleryPhotoPushed: true } })
    } else {
      navigate(target, { replace: true, state: { galleryPhotoPushed: pushedRef.current } })
    }
  })

  // Follows the photo's key rather than its index, which a draft edit to the
  // gallery can point at another photo.
  const activeKey = open ? keys[value] : undefined
  useEffect(() => syncUrl(open, activeKey), [open, activeKey])

  return {
    open,
    value,
    /** Whether the lightbox was open on first render, as it is for a deep link. */
    openedOnLoad: initialIndex !== undefined,
    onOpenChange: setOpen,
    onValueChange: (index: number) => setValue(index)
  }
}
