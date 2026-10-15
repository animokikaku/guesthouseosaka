import { ContactForm } from '@/components/forms/contact-form'
import { MoveInForm } from '@/components/forms/move-in-form'
import { TourForm } from '@/components/forms/tour-form'
import { LegalNoticeProvider } from '@/components/legal-notice-context'
import { Toaster } from '@/components/ui/toast'
import type { ContactFormConfig } from '@/lib/types/components'
import type { HousesTitlesQueryResult } from '@/sanity.types'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

// The server action and the router are the forms' only way out of the browser.
const { submitContactForm, router } = vi.hoisted(() => ({
  submitContactForm: vi.fn(),
  router: { push: vi.fn() }
}))

vi.mock('@/app/actions/contact', () => ({ submitContactForm }))
vi.mock('@/i18n/navigation', () => ({ useRouter: () => router }))

const houseTitles: HousesTitlesQueryResult = [
  { slug: 'orange', title: 'Orange House' },
  { slug: 'apple', title: 'Apple House' },
  { slug: 'lemon', title: 'Lemon House' }
]

/** Labels as an editor would configure them in Sanity. */
const fields: ContactFormConfig['fields'] = {
  places: { label: 'Houses', description: 'Choose up to three.' },
  date: { label: 'Date' },
  hour: { label: 'Time' },
  stayDuration: { label: 'Length of stay', placeholder: 'Select a length' },
  name: { label: 'Name' },
  age: { label: 'Age' },
  gender: { label: 'Gender', placeholder: 'Select gender' },
  nationality: { label: 'Nationality' },
  email: { label: 'Email', description: 'We reply to this address.' },
  phone: { label: 'Phone' },
  message: { label: 'Message' }
}

const account = {
  name: 'Jo Tanaka',
  age: '25',
  gender: 'male',
  nationality: 'Japan',
  email: 'jo@example.com',
  phone: ''
}

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
      choose('Length of stay', '3 months or more')
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

function renderForm(Form: (typeof forms)[number]['Form']) {
  return render(
    <LegalNoticeProvider data={null}>
      <Form title="Contact us" description={null} fields={fields} houseTitles={houseTitles} />
      <Toaster />
    </LegalNoticeProvider>
  )
}

function setInput(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } })
}

function choose(label: string, option: string) {
  fireEvent.click(screen.getByRole('combobox', { name: label }))
  // Base UI only selects the highlighted item, and jsdom has no pointer to hover it.
  const item = screen.getByRole('option', { name: option })
  fireEvent.mouseMove(item)
  fireEvent.click(item)
}

/** Everything the three forms share: a house, the account group, a message and consent. */
function fillSharedFields() {
  fireEvent.click(screen.getByRole('button', { name: 'Orange House' }))
  choose('Gender', 'Male')
  setInput('Name', account.name)
  setInput('Age', account.age)
  setInput('Nationality', account.nationality)
  setInput('Email', account.email)
  // Optional on the tour and move-in forms, which append that to its label.
  fireEvent.change(screen.getByRole('textbox', { name: /^Message/ }), {
    target: { value: 'Hello there' }
  })
  fireEvent.click(screen.getByRole('checkbox'))
}

function submit() {
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
}

/** Submits past the browser's own `required` checks, so the form's validation runs. */
function submitIncomplete() {
  document.querySelector('form')!.noValidate = true
  submit()
}

beforeEach(() => {
  submitContactForm.mockReset().mockResolvedValue({ ok: true })
  router.push.mockReset()
})

describe.each(forms)('$type form', ({ type, Form, fill, data }) => {
  it('sends the validated submission and confirms it', async () => {
    renderForm(Form)

    fillSharedFields()
    fill()
    submit()

    await waitFor(() => expect(submitContactForm).toHaveBeenCalledWith({ type, data }))
    expect(await screen.findByText('Message sent successfully!')).toBeInTheDocument()
    expect(router.push).toHaveBeenCalledWith('/contact')
  })

  it('flags every missing answer without sending anything', async () => {
    renderForm(Form)

    submitIncomplete()

    const name = screen.getByLabelText('Name')
    await waitFor(() => expect(name).toHaveAttribute('aria-invalid', 'true'))

    // Each error is announced and tied to its control.
    const error = document.getElementById(name.getAttribute('aria-errormessage')!)
    expect(error).toHaveAttribute('role', 'alert')
    expect(error).toHaveTextContent('Name must be at least 2 characters long.')
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Please select at least one share house.')).toBeInTheDocument()
    expect(screen.getByText('You must agree to the privacy policy.')).toBeInTheDocument()
    expect(submitContactForm).not.toHaveBeenCalled()
  })
})

describe('form validation and feedback', () => {
  it('moves focus to the first invalid control', async () => {
    renderForm(ContactForm)

    submitIncomplete()

    await waitFor(() => expect(document.activeElement).toHaveAttribute('aria-invalid', 'true'))
  })

  it('describes a field with both its description and its error', async () => {
    renderForm(ContactForm)

    setInput('Email', 'jo@')
    submitIncomplete()

    const email = screen.getByLabelText('Email')
    await waitFor(() => expect(email).toHaveAttribute('aria-invalid', 'true'))
    expect(email).toHaveAccessibleDescription('We reply to this address. Invalid email address.')
  })

  it('marks the message optional only where it is', () => {
    const { unmount } = renderForm(TourForm)
    expect(screen.getByRole('textbox', { name: 'Message (optional)' })).toBeInTheDocument()
    unmount()

    renderForm(ContactForm)
    expect(screen.getByRole('textbox', { name: 'Message' })).toBeInTheDocument()
  })

  it('counts message characters against the limit', () => {
    renderForm(ContactForm)

    setInput('Message', 'Hello')

    expect(screen.getByText('5 / 3000 characters')).toBeInTheDocument()
  })

  it('blocks a second submit while the first is in flight', async () => {
    let settle!: (result: { ok: true }) => void
    submitContactForm.mockReturnValueOnce(new Promise((resolve) => (settle = resolve)))
    renderForm(ContactForm)

    fillSharedFields()
    submit()

    const button = screen.getByRole('button', { name: 'Submit' })
    await waitFor(() => expect(button).toBeDisabled())
    expect(button).toHaveAttribute('aria-busy', 'true')

    settle({ ok: true })
    await waitFor(() => expect(button).toBeEnabled())
  })

  it('keeps the visitor on the form when delivery fails', async () => {
    submitContactForm.mockResolvedValueOnce({ ok: false, code: 'delivery_failed' })
    renderForm(ContactForm)

    fillSharedFields()
    submit()

    expect(await screen.findByText('Failed to send message.')).toBeInTheDocument()
    expect(
      screen.getByText('Please try again later or contact us directly at info@guesthouseosaka.com.')
    ).toBeInTheDocument()
    expect(router.push).not.toHaveBeenCalled()
  })
})
