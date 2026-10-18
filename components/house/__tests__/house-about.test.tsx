import { render, screen } from '@testing-library/react'
import { HouseAbout } from '../house-about'
import { HouseProvider } from '../house-context'
import type { HousePortableTextContent } from '@/lib/types/components'

function renderAbout(props: Partial<React.ComponentProps<typeof HouseAbout>> = {}) {
  return render(
    <HouseProvider id="house-123" type="house" slug="orange">
      <HouseAbout title="Test House" building={null} about={null} {...props} />
    </HouseProvider>
  )
}

/** One PortableText block holding a single span of text. */
function block(key: string, text: string, listItem?: 'bullet' | 'number') {
  return {
    _type: 'block' as const,
    _key: key,
    ...(listItem ? { listItem, level: 1 } : { style: 'normal' as const }),
    children: [{ _type: 'span' as const, _key: `${key}-span`, text }]
  }
}

describe('HouseAbout', () => {
  it('introduces the house by name above its building summary', () => {
    renderAbout()

    expect(screen.getByRole('heading', { level: 2, name: /\bTest House\b/ })).toBeInTheDocument()
    // The building summary sits under the heading.
    expect(screen.getByText(/\brooms\b/i)).toBeInTheDocument()
  })

  it('keeps the heading when the title is missing', () => {
    renderAbout({ title: null })

    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  it('renders no body copy when about is null', () => {
    const { container } = renderAbout({ about: null })

    expect(container.querySelectorAll('section > p')).toHaveLength(0)
  })

  it.each([
    ['paragraphs', undefined],
    ['bullet list items', 'bullet' as const],
    ['numbered list items', 'number' as const]
  ])('renders %s from PortableText', (_name, listItem) => {
    const about: NonNullable<HousePortableTextContent> = [
      block('first', 'First entry.', listItem),
      block('second', 'Second entry.', listItem)
    ]

    renderAbout({ about })

    expect(screen.getByText('First entry.')).toBeInTheDocument()
    expect(screen.getByText('Second entry.')).toBeInTheDocument()
  })

  it('shows the availability where editors placed it in the text', () => {
    renderAbout({
      about: [
        block('intro', 'Intro paragraph.'),
        { _type: 'houseRoomAvailabilityBlock', _key: 'availability' },
        block('perk', 'A perk.', 'bullet')
      ],
      availability: <p>1 room available now</p>
    })

    const intro = screen.getByText('Intro paragraph.')
    const marker = screen.getByText('1 room available now')
    expect(screen.getAllByText('1 room available now')).toHaveLength(1)
    expect(intro.compareDocumentPosition(marker)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
    expect(marker.compareDocumentPosition(screen.getByText('A perk.'))).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    )
  })

  it('shows the availability above the text when editors have not placed it', () => {
    renderAbout({
      about: [block('intro', 'Intro paragraph.')],
      availability: <p>1 room available now</p>
    })

    expect(
      screen
        .getByText('1 room available now')
        .compareDocumentPosition(screen.getByText('Intro paragraph.'))
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })
})
