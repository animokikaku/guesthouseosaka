import { GalleryPageBackLink } from '@/components/gallery/gallery-back-button'
import { render, screen } from '@testing-library/react'

describe('GalleryPageBackLink', () => {
  it("links back to the house's page", () => {
    render(<GalleryPageBackLink house="orange" />)

    expect(screen.getByRole('link', { name: 'Close gallery' })).toHaveAttribute(
      'href',
      '/en/orange'
    )
  })
})
