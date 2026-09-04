import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { fields, houseTitles } from './fixtures'
import { MoveInForm } from '../move-in-form'

vi.mock('../use-form-submit', () => import('./mocks/use-form-submit'))
vi.mock('@/components/legal-notice-dialog', () => import('./mocks/legal-notice-dialog'))

const baseProps = {
  title: 'Move-In Application',
  description: 'Apply to live with us',
  fields,
  houseTitles
}

describe('MoveInForm', () => {
  it('renders the card header and the fields this form owns', () => {
    render(<MoveInForm {...baseProps} />)

    expect(screen.getByText('Move-In Application')).toBeInTheDocument()
    expect(screen.getByText('Apply to live with us')).toBeInTheDocument()
    expect(screen.getByLabelText(/preferred date/i)).toHaveAttribute('type', 'date')
    expect(screen.getByLabelText(/stay duration/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/your email/i)).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('wires the submit button to the form id', () => {
    const { container } = render(<MoveInForm {...baseProps} />)

    expect(container.querySelector('form')).toHaveAttribute('id', 'move-in-form')
    expect(screen.getByRole('button', { name: 'label' })).toHaveAttribute('form', 'move-in-form')
  })

  it('surfaces schema errors on the matching fields after an invalid submit', async () => {
    const { container } = render(<MoveInForm {...baseProps} />)

    fireEvent.submit(container.querySelector('form')!)

    // Form-level schema errors are routed to their fields, including the
    // nested `account.*` paths owned by the user account field group and
    // this form's own date field.
    await waitFor(() =>
      expect(screen.getByLabelText(/your name/i)).toHaveAttribute('aria-invalid', 'true')
    )
    expect(screen.getByLabelText('Preferred Date')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getAllByRole('alert').length).toBeGreaterThan(0)
  })
})
