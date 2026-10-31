import { validateGallerySearch } from '@/lib/gallery-search'
import { useRouter } from '@tanstack/react-router'
import { useEffect, useEffectEvent, useRef, useState } from 'react'

/** Moves the address bar to `photo`, or off any photo when `undefined`. */
export type PhotoNavigate = (photo: string | undefined, options: { replace: boolean }) => void

/**
 * Drives a controlled lightbox from the `photo` search param, so each photo has
 * its own URL. Opening pushes a history entry, moving between photos replaces
 * it, and closing steps back off it, so the browser's Back button closes the
 * viewer.
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
  const photoInUrl = (search: string) =>
    validateGallerySearch(router.options.parseSearch(search)).photo

  const [initialIndex] = useState(() => indexOf(photo))
  const [open, setOpen] = useState(initialIndex !== undefined)
  const [value, setValue] = useState(initialIndex ?? 0)
  // Whether opening pushed the history entry the URL sits on, so closing can
  // step back off it instead of leaving it behind for Back to land on.
  const pushedRef = useRef(false)

  const onTraverse = useEffectEvent((search: string) => {
    pushedRef.current = false
    const index = indexOf(photoInUrl(search))
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
        if (action.type !== 'PUSH' && action.type !== 'REPLACE') onTraverse(location.search)
      }),
    [router]
  )

  const syncUrl = useEffectEvent((isOpen: boolean, index: number) => {
    const current = photoInUrl(router.history.location.search)
    const target = isOpen ? keys[index] : undefined
    if (target === current) return

    if (target === undefined) {
      if (pushedRef.current) {
        pushedRef.current = false
        router.history.back()
      } else {
        // A deep link, or a key no photo has: drop the param in place.
        navigate(undefined, { replace: true })
      }
    } else if (current === undefined) {
      pushedRef.current = true
      navigate(target, { replace: false })
    } else {
      navigate(target, { replace: true })
    }
  })

  useEffect(() => syncUrl(open, value), [open, value])

  return {
    open,
    value,
    /** Whether the lightbox was open on first render, as it is for a deep link. */
    openedOnLoad: initialIndex !== undefined,
    onOpenChange: setOpen,
    onValueChange: (index: number) => setValue(index)
  }
}
