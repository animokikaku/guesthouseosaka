import { render, screen } from '@testing-library/react'
import { Image, type ImageLoader } from '../image'

const loader: ImageLoader = ({ src, width, quality }) => `${src}?w=${width}&q=${quality ?? 75}`
const blurHash = 'VDD]rFx[9vxv?w_NI[yDtR%gMv%MaKM|t78_s8r;t6Ri'

describe('Image', () => {
  it('builds 1x and 2x candidates from a fixed width', () => {
    render(<Image src="https://cdn.test/a.jpg" alt="A" width={64} height={64} loader={loader} />)

    const img = screen.getByAltText('A')
    expect(img.getAttribute('srcset')?.split(/,\s*/)).toEqual([
      'https://cdn.test/a.jpg?w=64&q=75 64w',
      'https://cdn.test/a.jpg?w=128&q=75 128w'
    ])
    expect(img).toHaveAttribute('sizes', '64px')
    expect(img).toHaveAttribute('src', 'https://cdn.test/a.jpg?w=64&q=75')
    expect(img).toHaveAttribute('width', '64')
  })

  it('offers every breakpoint to an image sized by `sizes`', () => {
    render(
      <Image
        src="https://cdn.test/a.jpg"
        alt="A"
        width={800}
        height={600}
        sizes="50vw"
        loader={loader}
      />
    )

    const img = screen.getByAltText('A')
    const widths = img
      .getAttribute('srcset')!
      .split(/,\s*/)
      .map((candidate) => candidate.split(' ')[1])
    expect(widths.at(0)).toBe('64w')
    expect(widths.at(-1)).toBe('1600w')
    expect(img).toHaveAttribute('sizes', '50vw')
    // The intrinsic size stays on the element, so it reserves its space.
    expect(img).toHaveAttribute('width', '800')
  })

  it('leaves inline sources to load as they are', () => {
    const inline = 'data:image/png;base64,AAAA'
    render(<Image src={inline} alt="A" width={64} height={64} loader={loader} />)

    expect(screen.getByAltText('A')).toHaveAttribute('src', inline)
    expect(screen.getByAltText('A')).not.toHaveAttribute('srcset')
  })

  it('paints the blurhash as CSS gradients behind the image', () => {
    render(
      <Image src="https://cdn.test/a.jpg" alt="A" width={400} height={300} blurHash={blurHash} />
    )

    expect(screen.getByAltText('A').style.backgroundImage).toContain('radial-gradient')
  })

  it('skips a blurhash that does not decode', () => {
    render(<Image src="https://cdn.test/a.jpg" alt="A" width={400} height={300} blurHash="x" />)

    expect(screen.getByAltText('A').style.backgroundImage).toBe('')
  })

  it('loads lazily unless preloaded', () => {
    render(
      <>
        <Image src="https://cdn.test/a.jpg" alt="Lazy" width={10} height={10} />
        <Image src="https://cdn.test/b.jpg" alt="Hero" width={10} height={10} preload />
      </>
    )

    expect(screen.getByAltText('Lazy')).toHaveAttribute('loading', 'lazy')
    expect(screen.getByAltText('Hero')).toHaveAttribute('loading', 'eager')
    expect(screen.getByAltText('Hero')).toHaveAttribute('fetchpriority', 'high')
  })
})
