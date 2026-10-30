import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Image, type ImageLoader } from '../image'

const loader: ImageLoader = ({ src, width, quality }) => `${src}?w=${width}&q=${quality ?? 75}`
const lqip = 'data:image/jpeg;base64,AAAA'

describe('Image', () => {
  it('builds 1x and 2x candidates from a fixed width', () => {
    render(<Image src="https://cdn.test/a.jpg" alt="A" width={64} height={64} loader={loader} />)

    const img = screen.getByAltText('A')
    expect(img).toHaveAttribute(
      'srcset',
      'https://cdn.test/a.jpg?w=64&q=75 1x, https://cdn.test/a.jpg?w=128&q=75 2x'
    )
    expect(img).toHaveAttribute('src', 'https://cdn.test/a.jpg?w=128&q=75')
  })

  it('offers only the widths a vw-sized image can use', () => {
    render(<Image src="https://cdn.test/a.jpg" alt="A" fill sizes="50vw" loader={loader} />)

    const widths = screen
      .getByAltText('A')
      .getAttribute('srcset')!
      .split(', ')
      .map((candidate) => candidate.split(' ')[1])
    // Half of the smallest device width (480px) leaves out the icon sizes below 240px.
    expect(widths).toEqual([
      '256w',
      '384w',
      '480w',
      '640w',
      '750w',
      '828w',
      '1080w',
      '1200w',
      '1600w'
    ])
  })

  it('leaves inline sources to load as they are', () => {
    render(<Image src={lqip} alt="A" width={64} height={64} loader={loader} />)

    expect(screen.getByAltText('A')).toHaveAttribute('src', lqip)
    expect(screen.getByAltText('A')).not.toHaveAttribute('srcset')
  })

  it('paints a blurred preview until the image has decoded', async () => {
    render(
      <Image
        src="https://cdn.test/a.jpg"
        alt="A"
        width={400}
        height={300}
        placeholder="blur"
        blurDataURL={lqip}
      />
    )
    const img = screen.getByAltText('A')

    // The LQIP sits in an SVG blur filter, sized to the image.
    expect(img.style.backgroundImage).toContain('feGaussianBlur')
    expect(img.style.backgroundImage).toContain("viewBox='0 0 400 300'")
    expect(img.style.backgroundImage).toContain(lqip)

    Object.defineProperty(img, 'decode', { value: () => Promise.resolve() })
    fireEvent.load(img)

    await waitFor(() => expect(img.style.backgroundImage).toBe(''))
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
