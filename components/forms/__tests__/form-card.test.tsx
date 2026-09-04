import { fireEvent, render, screen } from '@testing-library/react'
import { Store, type AnyReactFormApi } from '@tanstack/react-form'
import { FormCard } from '../form-card'

function createMockForm({ isSubmitting = false } = {}) {
  // FormCard only reads `handleSubmit` and the submitting state.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return {
    handleSubmit: vi.fn(),
    atom: new Store({ isSubmitting })
  } as unknown as AnyReactFormApi & { handleSubmit: ReturnType<typeof vi.fn> }
}

function TestInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input aria-label="Test input" name="test" {...props} />
}

function renderCard(props: Partial<React.ComponentProps<typeof FormCard>> = {}) {
  const form = props.form ?? createMockForm()
  const view = render(
    <FormCard formId="test-form" {...props} form={form}>
      {props.children ?? <TestInput />}
    </FormCard>
  )

  return { ...view, form: form as ReturnType<typeof createMockForm> }
}

describe('FormCard', () => {
  it('renders the form, its children, and a submit button bound to the form id', () => {
    const { container } = renderCard({
      formId: 'my-custom-form',
      children: <TestInput data-testid="email-input" />
    })

    expect(container.querySelector('form')).toHaveAttribute('id', 'my-custom-form')
    expect(screen.getByTestId('email-input')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'label' })).toHaveAttribute('form', 'my-custom-form')
  })

  it('applies custom className to the card', () => {
    const { container } = renderCard({ className: 'custom-class' })

    expect(container.firstChild).toHaveClass('custom-class')
  })

  describe('header', () => {
    it('renders whichever of title and description is provided', () => {
      renderCard({ title: 'Contact Us', description: 'Fill out this form' })

      expect(screen.getByText('Contact Us')).toBeInTheDocument()
      expect(screen.getByText('Fill out this form')).toBeInTheDocument()
    })

    it.each([
      ['both are missing', {}],
      ['both are null', { title: null, description: null }],
      ['title is empty', { title: '', description: null }]
    ])('omits the header when %s', (_name, props) => {
      const { container } = renderCard(props)

      expect(container.querySelector('[data-slot="card-header"]')).toBeNull()
    })
  })

  describe('form submission', () => {
    it('calls handleSubmit and prevents the browser submit', () => {
      const { container, form } = renderCard()
      const formElement = container.querySelector('form')!

      const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
      const preventDefault = vi.spyOn(submitEvent, 'preventDefault')
      formElement.dispatchEvent(submitEvent)

      expect(preventDefault).toHaveBeenCalled()

      fireEvent.submit(formElement)
      expect(form.handleSubmit).toHaveBeenCalledTimes(2)
    })
  })

  describe('submitting state', () => {
    it.each([
      [false, 'false'],
      [true, 'true']
    ])('isSubmitting=%s marks the button aria-busy=%s', (isSubmitting, ariaBusy) => {
      renderCard({ form: createMockForm({ isSubmitting }) })

      const button = screen.getByRole('button', { name: 'label' })
      expect(button).toHaveAttribute('aria-busy', ariaBusy)
      expect(button.hasAttribute('disabled')).toBe(isSubmitting)
    })
  })
})
