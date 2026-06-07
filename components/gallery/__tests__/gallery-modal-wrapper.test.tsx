import { fireEvent, render, screen } from '@testing-library/react'

import {
  GalleryModalCloseButton,
  GalleryModalWrapper
} from '@/components/gallery/gallery-modal-wrapper'

const mockPush = vi.fn()
const onOpenChangeComplete = vi.fn<(open: boolean) => void>()

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: mockPush })
}))

vi.mock('@/components/gallery/gallery-dialog', async () => {
  const actual = await vi.importActual<typeof import('@/components/gallery/gallery-dialog')>(
    '@/components/gallery/gallery-dialog'
  )

  return {
    ...actual,
    GalleryDialog: ({
      children,
      onOpenChangeComplete: handler,
      ...props
    }: React.ComponentProps<typeof actual.GalleryDialog>) => {
      if (handler) {
        onOpenChangeComplete.mockImplementation(handler)
      }

      return <actual.GalleryDialog {...props}>{children}</actual.GalleryDialog>
    }
  }
})

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, values?: Record<string, string>) =>
    values?.title ? `${key} ${values.title}` : key
}))

describe('GalleryModalWrapper', () => {
  beforeEach(() => {
    mockPush.mockClear()
    onOpenChangeComplete.mockClear()
  })

  it('routes back to the house page after the gallery close animation completes', () => {
    render(
      <GalleryModalWrapper house="orange" title="Orange House">
        <GalleryModalCloseButton />
      </GalleryModalWrapper>
    )

    fireEvent.click(screen.getByRole('button', { name: 'close' }))

    expect(mockPush).not.toHaveBeenCalled()

    onOpenChangeComplete(false)

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/[house]',
      params: { house: 'orange' }
    })
  })
})
