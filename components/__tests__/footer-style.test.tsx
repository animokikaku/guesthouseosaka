import { render } from '@testing-library/react'
import { Activity } from 'react'
import { FooterStyle } from '../footer-style'

function getStyle(container: HTMLElement) {
  const style = container.querySelector('style')
  if (!style) throw new Error('FooterStyle rendered no <style>')
  return style
}

describe('FooterStyle', () => {
  it('emits only the requested rules', () => {
    const { container: snap } = render(<FooterStyle snap />)
    expect(getStyle(snap).textContent).toContain('scroll-snap-align: end')
    expect(getStyle(snap).textContent).not.toContain('background-color')

    const { container: plain } = render(<FooterStyle plain />)
    expect(getStyle(plain).textContent).toContain('background-color: transparent')
    expect(getStyle(plain).textContent).not.toContain('scroll-snap-align')
  })

  it('applies only while mounted', () => {
    const { container, unmount } = render(<FooterStyle plain />)
    const style = getStyle(container)
    expect(style.media).toBe('all')

    unmount()
    expect(style.media).toBe('not all')
  })

  it('stays disabled inside a hidden Activity until it is shown', () => {
    const { container, rerender } = render(
      <Activity mode="hidden">
        <FooterStyle plain />
      </Activity>
    )
    const style = getStyle(container)
    expect(style.media).toBe('not all')

    rerender(
      <Activity mode="visible">
        <FooterStyle plain />
      </Activity>
    )
    expect(style.media).toBe('all')

    rerender(
      <Activity mode="hidden">
        <FooterStyle plain />
      </Activity>
    )
    expect(style.media).toBe('not all')
  })
})
