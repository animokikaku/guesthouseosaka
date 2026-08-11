import { render, screen } from '@testing-library/react'
import { Store, type AnyReactFormApi } from '@tanstack/react-form'
import { SubmitButton } from '../submit-button'

/**
 * The button subscribes to the real form atom, so back the mock with an actual
 * store rather than stubbing `useSelector`.
 */
function createMockForm(state: { isSubmitting: boolean }) {
  // The button only reads `atom`.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return { atom: new Store(state) } as unknown as AnyReactFormApi
}

describe('SubmitButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders button with submit type', () => {
      render(<SubmitButton formApi={createMockForm({ isSubmitting: false })} formId="test-form" />)

      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
    })

    it('renders with translation key label', () => {
      render(<SubmitButton formApi={createMockForm({ isSubmitting: false })} formId="test-form" />)

      expect(screen.getByRole('button')).toHaveTextContent('label')
    })

    it('associates the button with its form element', () => {
      render(<SubmitButton formApi={createMockForm({ isSubmitting: false })} formId="my-form" />)

      expect(screen.getByRole('button')).toHaveAttribute('form', 'my-form')
    })
  })

  describe('submitting state', () => {
    it('is enabled when the form is idle', () => {
      render(<SubmitButton formApi={createMockForm({ isSubmitting: false })} formId="test-form" />)

      const button = screen.getByRole('button')
      expect(button).not.toBeDisabled()
      expect(button).toHaveAttribute('aria-busy', 'false')
    })

    it('is disabled while submitting', () => {
      render(<SubmitButton formApi={createMockForm({ isSubmitting: true })} formId="test-form" />)

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveAttribute('aria-busy', 'true')
    })
  })

  describe('props forwarding', () => {
    it('forwards className prop', () => {
      render(
        <SubmitButton
          formApi={createMockForm({ isSubmitting: false })}
          formId="test-form"
          className="custom-class"
        />
      )

      expect(screen.getByRole('button')).toHaveClass('custom-class')
    })
  })
})
