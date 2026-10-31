import { LightboxGallery } from '@/components/gallery/lightbox-gallery'
import { Lightbox } from '@/components/ui/lightbox'
import type { LightboxItem } from '@/lib/gallery-image'
import { fireEvent, render, screen } from '@testing-library/react'

// ramka sizes its slides and strip with ResizeObserver and waits on running
// animations to close, both of which jsdom lacks.
Object.defineProperty(Element.prototype, 'getAnimations', { configurable: true, value: () => [] })
vi.stubGlobal(
  'ResizeObserver',
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
)

vi.mock('@/components/image', () => import('@/components/__tests__/mocks/image'))

function photo(id: string): LightboxItem {
  return {
    id,
    src: `https://cdn.sanity.io/images/p/d/${id}-1600x1200.jpg`,
    thumb: `https://cdn.sanity.io/images/p/d/${id}-56x56.jpg`,
    alt: `Photo ${id}`,
    width: 1600,
    height: 1200
  }
}

function renderOpen(items: LightboxItem[], value = 0) {
  return render(
    <Lightbox.Root defaultOpen defaultValue={value}>
      <LightboxGallery items={items} ariaLabel="Orange House" />
    </Lightbox.Root>
  )
}

describe('LightboxGallery', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('shows where the open photo sits, by counter and thumbnail', () => {
    renderOpen([photo('a'), photo('b'), photo('c')], 1)

    expect(screen.getByRole('dialog', { name: 'Orange House' })).toBeInTheDocument()
    expect(screen.getByText('2 of 3')).toBeInTheDocument()
    expect(screen.getAllByRole('tab')).toHaveLength(3)
  })

  it('drops the counter and thumbnails for a single photo', () => {
    renderOpen([photo('a')])

    expect(screen.queryByText('1 of 1')).not.toBeInTheDocument()
    expect(screen.queryByRole('tab')).not.toBeInTheDocument()
  })

  it('switches between bleed and snug slides, and remembers the choice', () => {
    renderOpen([photo('a'), photo('b')])

    fireEvent.click(screen.getByRole('button', { name: 'Switch to snug slides' }))
    expect(screen.getByRole('button', { name: 'Switch to full-bleed slides' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(localStorage.getItem('ramka-lightbox-slides-layout')).toBe('snug')

    fireEvent.click(screen.getByRole('button', { name: 'Switch to full-bleed slides' }))
    expect(localStorage.getItem('ramka-lightbox-slides-layout')).toBe('bleed')
  })

  // The crossfade would otherwise lift the named site header over the lightbox.
  it('unnames the page while the layout switch crossfades', async () => {
    let attributeDuringSwitch: boolean | undefined
    let finish = () => {}
    const startViewTransition = vi.fn((update: () => void) => {
      attributeDuringSwitch = document.documentElement.hasAttribute('data-lightbox-layout-switch')
      update()
      return { finished: new Promise<void>((resolve) => (finish = resolve)) }
    })
    Object.assign(document, { startViewTransition })
    renderOpen([photo('a'), photo('b')])

    fireEvent.click(screen.getByRole('button', { name: 'Switch to snug slides' }))
    expect(startViewTransition).toHaveBeenCalledOnce()
    expect(attributeDuringSwitch).toBe(true)
    expect(screen.getByRole('button', { name: 'Switch to full-bleed slides' })).toBeInTheDocument()

    finish()
    await vi.waitFor(() =>
      expect(document.documentElement).not.toHaveAttribute('data-lightbox-layout-switch')
    )

    fireEvent.click(screen.getByRole('button', { name: 'Switch to full-bleed slides' }))
    finish()
    Reflect.deleteProperty(document, 'startViewTransition')
  })

  // The gallery modal around it closes on a document-level Escape listener.
  it('keeps Escape from reaching the dialog behind it', () => {
    const outer = vi.fn()
    document.addEventListener('keydown', outer)
    renderOpen([photo('a'), photo('b')])

    fireEvent.keyDown(screen.getByRole('dialog', { name: 'Orange House' }), { key: 'Escape' })

    expect(outer).not.toHaveBeenCalled()
    document.removeEventListener('keydown', outer)
  })
})
