import { ContactForm } from '@/components/forms/contact-form'
import { MoveInForm } from '@/components/forms/move-in-form'
import { TourForm } from '@/components/forms/tour-form'
import { routerState } from '@/lib/__tests__/utils/router'
import { screen, waitFor } from '@testing-library/react'
import {
  account,
  choose,
  fillSharedFields,
  renderForm,
  setInput,
  submit,
  submitIncomplete
} from './utils/contact-form'
import { TURNSTILE_TOKEN } from './utils/turnstile'

// The server function and the router are the forms' only way out of the browser.
const { submitContactForm } = vi.hoisted(() => ({ submitContactForm: vi.fn() }))

vi.mock('@/app/actions/contact.functions', () => ({ submitContactForm }))
vi.mock('@marsidev/react-turnstile', () => import('./utils/turnstile'))

const forms = [
  {
    type: 'tour',
    Form: TourForm,
    fill: () => {
      setInput('Date', '2099-01-15')
      setInput('Time', '14:00')
    },
    data: {
      places: ['orange'],
      date: '2099-01-15',
      hour: '14:00',
      account,
      message: 'Hello there',
      privacyPolicy: true
    }
  },
  {
    type: 'move-in',
    Form: MoveInForm,
    fill: () => {
      setInput('Date', '2099-01-15')
      choose('Length of stay', /\b3 months\b/)
    },
    data: {
      places: ['orange'],
      date: '2099-01-15',
      stayDuration: '3-months',
      account,
      message: 'Hello there',
      privacyPolicy: true
    }
  },
  {
    type: 'other',
    Form: ContactForm,
    fill: () => {},
    data: { places: ['orange'], account, message: 'Hello there', privacyPolicy: true }
  }
] as const

beforeEach(() => {
  submitContactForm.mockReset().mockResolvedValue({ ok: true })
})

describe.each(forms)('$type form', ({ type, Form, fill, data }) => {
  it('sends the validated submission and confirms it', async () => {
    renderForm(Form)

    fillSharedFields()
    fill()
    submit()

    await waitFor(() =>
      expect(submitContactForm).toHaveBeenCalledWith({
        data: { payload: { type, data }, turnstileToken: TURNSTILE_TOKEN }
      })
    )
    expect(await screen.findByText(/sent successfully/i)).toBeInTheDocument()
    expect(routerState.navigate).toHaveBeenCalledWith({
      to: '/$locale/contact',
      params: { locale: 'en' }
    })
  })

  it('flags every missing answer without sending anything', async () => {
    renderForm(Form)

    submitIncomplete()

    const name = screen.getByLabelText('Name')
    await waitFor(() => expect(name).toHaveAttribute('aria-invalid', 'true'))

    // Each error is announced and tied to its control; which message a rule
    // produces is covered by the schema tests.
    const error = document.getElementById(name.getAttribute('aria-errormessage')!)
    expect(error).toHaveAttribute('role', 'alert')
    expect(error).not.toBeEmptyDOMElement()
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('button', { name: 'Orange House' })).toHaveAttribute(
      'aria-invalid',
      'true'
    )
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true')
    expect(submitContactForm).not.toHaveBeenCalled()
  })
})
