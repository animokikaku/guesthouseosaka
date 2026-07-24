import { fireEvent, render, screen } from '@testing-library/react'

const { setTheme } = vi.hoisted(() => ({
  setTheme: vi.fn()
}))

vi.mock('next-themes', () => ({
  useTheme: () => ({
    resolvedTheme: 'light',
    setTheme
  })
}))

vi.mock('@/hooks/use-meta-color', () => ({
  useMetaColor: () => ({
    metaColor: '#ffffff',
    setMetaColor: vi.fn()
  })
}))

import { ModeSwitcher } from '../mode-switcher'

describe('ModeSwitcher', () => {
  beforeEach(() => {
    setTheme.mockClear()
  })

  it.each([
    ['d', false],
    ['D', true]
  ])('toggles the theme with %s', (key, shiftKey) => {
    render(<ModeSwitcher />)

    fireEvent.keyDown(window, { key, shiftKey })

    expect(setTheme).toHaveBeenCalledWith('dark')
  })

  it.each([
    ['repeated keydown', { repeat: true }],
    ['Command+D', { metaKey: true }],
    ['Control+D', { ctrlKey: true }],
    ['Alt+D', { altKey: true }]
  ])('ignores %s', (_shortcut, options) => {
    render(<ModeSwitcher />)

    fireEvent.keyDown(window, { key: 'd', ...options })

    expect(setTheme).not.toHaveBeenCalled()
  })

  it.each(['input', 'textarea', 'select'])('ignores the shortcut in %s elements', (tagName) => {
    render(
      <>
        <ModeSwitcher />
        {tagName === 'input' ? <input aria-label="Editor" /> : null}
        {tagName === 'textarea' ? <textarea aria-label="Editor" /> : null}
        {tagName === 'select' ? <select aria-label="Editor" /> : null}
      </>
    )

    fireEvent.keyDown(screen.getByLabelText('Editor'), { key: 'd' })

    expect(setTheme).not.toHaveBeenCalled()
  })

  it('ignores the shortcut in descendants of editable content', () => {
    render(
      <>
        <ModeSwitcher />
        <div contentEditable suppressContentEditableWarning>
          <span>Editor</span>
        </div>
      </>
    )

    fireEvent.keyDown(screen.getByText('Editor'), { key: 'd' })

    expect(setTheme).not.toHaveBeenCalled()
  })
})
