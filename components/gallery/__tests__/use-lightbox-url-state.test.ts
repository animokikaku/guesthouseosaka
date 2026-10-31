import {
  type PhotoNavigate,
  useLightboxUrlState
} from '@/components/gallery/use-lightbox-url-state'
import { routerState } from '@/lib/__tests__/utils/router'
import { act, renderHook } from '@testing-library/react'

const keys = ['kitchen', 'bedroom', 'garden']

/** Renders the hook on a URL; `navigate` moves the address bar as the route's would. */
function renderUrlState(photo?: string) {
  const { history } = routerState
  history.location = { search: photo ? `?photo=${photo}` : '', state: {} }
  const navigate = vi.fn<PhotoNavigate>((next, { state }) => {
    history.location = { search: next ? `?photo=${next}` : '', state: { ...state } }
  })
  const { result, rerender } = renderHook(
    (props) => useLightboxUrlState({ photo, keys: props.keys, navigate }),
    { initialProps: { keys } }
  )
  return { result, rerender, navigate, history }
}

describe('useLightboxUrlState', () => {
  it('opens on the photo a link names', () => {
    const { result, navigate } = renderUrlState('bedroom')

    expect(result.current).toMatchObject({ open: true, value: 1, openedOnLoad: true })
    expect(navigate).not.toHaveBeenCalled()
  })

  it('starts closed and drops a photo no item has', () => {
    const { result, navigate } = renderUrlState('attic')

    expect(result.current).toMatchObject({ open: false, openedOnLoad: false })
    expect(navigate).toHaveBeenCalledExactlyOnceWith(undefined, { replace: true, state: {} })
  })

  it('pushes the photo it opens on, then replaces it while browsing', () => {
    const { result, navigate } = renderUrlState()

    act(() => {
      result.current.onValueChange(2)
      result.current.onOpenChange(true)
    })
    expect(navigate).toHaveBeenLastCalledWith('garden', {
      replace: false,
      state: { galleryPhotoPushed: true }
    })

    act(() => result.current.onValueChange(0))
    expect(navigate).toHaveBeenLastCalledWith('kitchen', {
      replace: true,
      state: { galleryPhotoPushed: true }
    })
  })

  it('steps back off the entry it pushed when it closes', () => {
    const { result, navigate, history } = renderUrlState()
    act(() => result.current.onOpenChange(true))
    navigate.mockClear()

    act(() => result.current.onOpenChange(false))

    expect(history.back).toHaveBeenCalledOnce()
    expect(navigate).not.toHaveBeenCalled()
  })

  it("drops a link's photo in place when it closes, with no entry of its own to step off", () => {
    const { result, navigate, history } = renderUrlState('bedroom')

    act(() => result.current.onOpenChange(false))

    expect(navigate).toHaveBeenCalledExactlyOnceWith(undefined, { replace: true, state: {} })
    expect(history.back).not.toHaveBeenCalled()
  })

  it('follows Back and Forward', () => {
    const { result, navigate, history } = renderUrlState()

    act(() => history.traverse('?photo=garden', 'FORWARD'))
    expect(result.current).toMatchObject({ open: true, value: 2 })

    act(() => history.traverse('', 'BACK'))
    expect(result.current.open).toBe(false)
    // The URL already matches: nothing to write back.
    expect(navigate).not.toHaveBeenCalled()
  })

  it('steps back off a photo it pushed after Forward returns to it', () => {
    const { result, navigate, history } = renderUrlState()
    act(() => history.traverse('?photo=garden', 'FORWARD', { galleryPhotoPushed: true }))

    act(() => result.current.onOpenChange(false))

    expect(history.back).toHaveBeenCalledOnce()
    expect(navigate).not.toHaveBeenCalled()
  })

  it('closes in place after Forward onto a photo it never pushed', () => {
    const { result, navigate, history } = renderUrlState()
    act(() => history.traverse('?photo=garden', 'FORWARD'))

    act(() => result.current.onOpenChange(false))

    expect(history.back).not.toHaveBeenCalled()
    expect(navigate).toHaveBeenCalledExactlyOnceWith(undefined, { replace: true, state: {} })
  })

  it('updates the URL when a draft edit puts another photo at the open index', () => {
    const { result, rerender, navigate } = renderUrlState('bedroom')

    rerender({ keys: ['kitchen', 'attic', 'bedroom'] })

    expect(result.current.open).toBe(true)
    expect(navigate).toHaveBeenCalledExactlyOnceWith('attic', {
      replace: true,
      state: { galleryPhotoPushed: false }
    })
  })

  it('keeps the URL while the open photo has been removed', () => {
    const { result, rerender, navigate, history } = renderUrlState('garden')

    rerender({ keys: ['kitchen', 'bedroom'] })

    expect(result.current.open).toBe(true)
    expect(navigate).not.toHaveBeenCalled()
    expect(history.back).not.toHaveBeenCalled()
  })

  it('ignores pushes and replaces, which its own navigations make', () => {
    const { result, history } = renderUrlState()

    act(() => history.traverse('?photo=garden', 'PUSH'))

    expect(result.current.open).toBe(false)
  })
})
