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

  it('toggles the theme with the d shortcut', () => {
    render(<ModeSwitcher />)

    fireEvent.keyDown(document, { key: 'd' })

    expect(setTheme).toHaveBeenCalledWith('dark')
  })

  it.each([
    ['Command', { metaKey: true }],
    ['Control', { ctrlKey: true }],
    ['Alt', { altKey: true }],
    ['Shift', { shiftKey: true }],
    ['Command+Shift', { metaKey: true, shiftKey: true }],
    ['Control+Shift', { ctrlKey: true, shiftKey: true }]
  ])('ignores %s+D', (_shortcut, modifiers) => {
    render(<ModeSwitcher />)

    fireEvent.keyDown(document, { key: 'd', ...modifiers })

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

  it('ignores the shortcut in editable content', () => {
    render(
      <>
        <ModeSwitcher />
        <div contentEditable suppressContentEditableWarning>
          Editor
        </div>
      </>
    )

    fireEvent.keyDown(screen.getByText('Editor'), { key: 'd' })

    expect(setTheme).not.toHaveBeenCalled()
  })
})
