import { ContactForm } from '@/components/forms/contact-form'
import { TourForm } from '@/components/forms/tour-form'
import { CONTACT_EMAIL } from '@/lib/config'
import { routerState } from '@/lib/__tests__/utils/router'
import { act, screen, waitFor } from '@testing-library/react'
import {
  fillSharedFields,
  renderForm,
  setInput,
  submit,
  submitIncomplete
} from './utils/contact-form'
import { failTurnstile, holdTurnstile, TURNSTILE_TOKEN } from './utils/turnstile'

// The server function and the router are the forms' only way out of the browser. Turnstile's
// widget is mocked for every test in vitest.setup.ts.
const { submitContactForm } = vi.hoisted(() => ({ submitContactForm: vi.fn() }))

vi.mock('@/app/actions/contact.functions', () => ({ submitContactForm }))

beforeEach(() => {
  submitContactForm.mockReset().mockResolvedValue({ ok: true })
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
    // The editor's description first, then the error.
    expect(email).toHaveAccessibleDescription(/^We reply to this address\. \S/)
  })

  it('marks the message optional only where it is', () => {
    const { unmount } = renderForm(TourForm)
    expect(screen.getByRole('textbox', { name: /^Message \(optional\)$/ })).toBeInTheDocument()
    unmount()

    renderForm(ContactForm)
    expect(screen.getByRole('textbox', { name: 'Message' })).toBeInTheDocument()
  })

  it('counts message characters against the limit', () => {
    renderForm(ContactForm)

    setInput('Message', 'Hello')

    expect(screen.getByText(/^5 \/ 3000\b/)).toBeInTheDocument()
  })

  it('blocks a second submit while the first is in flight', async () => {
    let settle!: (result: { ok: true }) => void
    submitContactForm.mockReturnValueOnce(new Promise((resolve) => (settle = resolve)))
    renderForm(ContactForm)

    fillSharedFields()
    submit()

    const button = screen.getByRole('button', { name: /\bsubmit\b/i })
    await waitFor(() => expect(button).toBeDisabled())
    expect(button).toHaveAttribute('aria-busy', 'true')

    settle({ ok: true })
    await waitFor(() => expect(button).toBeEnabled())
  })

  it('keeps submit disabled until the bot check passes', async () => {
    const pass = holdTurnstile()
    renderForm(ContactForm)

    const button = screen.getByRole('button', { name: /\bsubmit\b/i })
    expect(button).toBeDisabled()

    act(() => pass())
    await waitFor(() => expect(button).toBeEnabled())
  })

  it('says how else to reach us when the bot check cannot run', async () => {
    failTurnstile()
    renderForm(ContactForm)

    const fallback = await screen.findByRole('alert')
    expect(fallback).toHaveTextContent(/\bcouldn’t load the verification\b/i)
    expect(fallback).toHaveTextContent(CONTACT_EMAIL)
    expect(screen.getByRole('button', { name: /\bsubmit\b/i })).toBeDisabled()
  })

  it('keeps the visitor on the form when delivery fails', async () => {
    submitContactForm.mockResolvedValueOnce({ ok: false, code: 'delivery_failed' })
    renderForm(ContactForm)

    fillSharedFields()
    submit()

    expect(await screen.findByText(/failed/i)).toBeInTheDocument()
    // Tells the visitor where to write instead.
    expect(screen.getByText((text) => text.includes(CONTACT_EMAIL))).toBeInTheDocument()
    expect(routerState.navigate).not.toHaveBeenCalled()
  })

  it('asks the visitor to retry when the bot check rejects them', async () => {
    submitContactForm.mockResolvedValueOnce({ ok: false, code: 'verification_failed' })
    renderForm(ContactForm)

    fillSharedFields()
    submit()

    expect(
      await screen.findByText(/couldn’t confirm this was sent by a person/i)
    ).toBeInTheDocument()
    expect(screen.getByText((text) => text.includes(CONTACT_EMAIL))).toBeInTheDocument()
    expect(submitContactForm).toHaveBeenCalledWith({
      data: expect.objectContaining({ turnstileToken: TURNSTILE_TOKEN })
    })
    expect(routerState.navigate).not.toHaveBeenCalled()
  })
})
