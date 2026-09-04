import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { fields, houseTitles } from './fixtures'
import { ContactForm } from '../contact-form'

vi.mock('../use-form-submit', () => import('./mocks/use-form-submit'))
vi.mock('@/components/legal-notice-dialog', () => import('./mocks/legal-notice-dialog'))

const baseProps = {
  title: 'Contact Us',
  description: 'Send us a message',
  fields,
  houseTitles
}

describe('ContactForm', () => {
  it('renders the card header and the fields this form owns', () => {
    render(<ContactForm {...baseProps} />)

    expect(screen.getByText('Contact Us')).toBeInTheDocument()
    expect(screen.getByText('Send us a message')).toBeInTheDocument()
    expect(screen.getByLabelText(/your name/i)).toHaveAttribute('placeholder', 'Enter name')
    expect(screen.getByLabelText(/your email/i)).toHaveAttribute('placeholder', 'Enter email')
    expect(screen.getByLabelText(/your message/i)).toHaveAttribute('placeholder', 'Enter message')
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
    // Submit and reset
    expect(screen.getAllByRole('button').length).toBeGreaterThanOrEqual(2)
  })

  it('renders without header when title and description are empty', () => {
    render(<ContactForm {...baseProps} title="" description={null} />)

    expect(screen.queryByText('Contact Us')).not.toBeInTheDocument()
  })

  it('wires the submit button to the form id', () => {
    const { container } = render(<ContactForm {...baseProps} />)

    expect(container.querySelector('form')).toHaveAttribute('id', 'other-form')
    expect(screen.getByRole('button', { name: 'label' })).toHaveAttribute('form', 'other-form')
  })

  it('surfaces schema errors on the matching fields after an invalid submit', async () => {
    const { container } = render(<ContactForm {...baseProps} />)

    expect(screen.getByLabelText(/your name/i)).toHaveAttribute('aria-invalid', 'false')

    fireEvent.submit(container.querySelector('form')!)

    // Form-level schema errors are routed to their fields, including the
    // nested `account.*` paths owned by the user account field group.
    await waitFor(() =>
      expect(screen.getByLabelText(/your name/i)).toHaveAttribute('aria-invalid', 'true')
    )
    expect(screen.getByLabelText(/your email/i)).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getAllByRole('alert').length).toBeGreaterThan(0)
  })
})
