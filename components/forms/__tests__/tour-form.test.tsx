import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { fields, houseTitles } from './fixtures'
import { TourForm } from '../tour-form'

vi.mock('../use-form-submit', () => import('./mocks/use-form-submit'))
vi.mock('@/components/legal-notice-dialog', () => import('./mocks/legal-notice-dialog'))

const baseProps = {
  title: 'Book a Tour',
  description: 'Schedule your visit',
  fields,
  houseTitles
}

describe('TourForm', () => {
  it('renders the card header and the fields this form owns', () => {
    render(<TourForm {...baseProps} />)

    expect(screen.getByText('Book a Tour')).toBeInTheDocument()
    expect(screen.getByText('Schedule your visit')).toBeInTheDocument()
    expect(screen.getByLabelText(/preferred date/i)).toHaveAttribute('type', 'date')
    expect(screen.getByLabelText(/preferred time/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/your email/i)).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('wires the submit button to the form id', () => {
    const { container } = render(<TourForm {...baseProps} />)

    expect(container.querySelector('form')).toHaveAttribute('id', 'tour-form')
    expect(screen.getByRole('button', { name: 'label' })).toHaveAttribute('form', 'tour-form')
  })

  it('surfaces schema errors on the matching fields after an invalid submit', async () => {
    const { container } = render(<TourForm {...baseProps} />)

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
