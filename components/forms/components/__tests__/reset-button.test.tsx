import { fireEvent, render, screen } from '@testing-library/react'
import type { AnyReactFormApi } from '@tanstack/react-form'
import { ResetButton } from '../reset-button'

function createMockForm() {
  // The button only calls `reset`.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return { reset: vi.fn() } as unknown as AnyReactFormApi & { reset: ReturnType<typeof vi.fn> }
}

describe('ResetButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders button with reset type', () => {
      render(<ResetButton formApi={createMockForm()} />)

      expect(screen.getByRole('button')).toHaveAttribute('type', 'reset')
    })

    it('renders with translation key label', () => {
      render(<ResetButton formApi={createMockForm()} />)

      // The label uses t('label') which returns 'label' in mocked translations
      expect(screen.getByRole('button')).toHaveTextContent('label')
    })
  })

  describe('click handler', () => {
    it('prevents default behavior on click', () => {
      render(<ResetButton formApi={createMockForm()} />)

      const button = screen.getByRole('button')
      const preventDefaultSpy = vi.fn()

      const event = new MouseEvent('click', { bubbles: true })
      Object.defineProperty(event, 'preventDefault', { value: preventDefaultSpy })

      button.dispatchEvent(event)

      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('calls form.reset() on click', () => {
      const form = createMockForm()

      render(<ResetButton formApi={form} />)
      fireEvent.click(screen.getByRole('button'))

      expect(form.reset).toHaveBeenCalled()
    })

    it('calls form.reset() once per click', () => {
      const form = createMockForm()

      render(<ResetButton formApi={form} />)
      fireEvent.click(screen.getByRole('button'))
      fireEvent.click(screen.getByRole('button'))

      expect(form.reset).toHaveBeenCalledTimes(2)
    })
  })

  describe('props forwarding', () => {
    it('forwards className prop', () => {
      render(<ResetButton formApi={createMockForm()} className="custom-class" />)

      expect(screen.getByRole('button')).toHaveClass('custom-class')
    })

    it('forwards disabled prop', () => {
      render(<ResetButton formApi={createMockForm()} disabled />)

      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('does not call form.reset() when disabled', () => {
      const form = createMockForm()

      render(<ResetButton formApi={form} disabled />)
      fireEvent.click(screen.getByRole('button'))

      expect(form.reset).not.toHaveBeenCalled()
    })
  })
})
