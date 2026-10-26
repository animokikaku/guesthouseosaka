import { ContactForm } from '@/components/forms/contact-form'
import { MoveInForm } from '@/components/forms/move-in-form'
import { TourForm } from '@/components/forms/tour-form'
import { LegalNoticeProvider } from '@/components/legal-notice-context'
import { Toaster } from '@/components/ui/toast'
import type { ContactFormConfig } from '@/lib/types/components'
import type { HousesTitlesQueryResult } from '@/sanity.types'
import { fireEvent, render, screen } from '@testing-library/react'

/**
 * Shared by the contact form suites, which are split so they run in parallel:
 * rendering the real forms is the slowest thing the unit suite does.
 */

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

export const account = {
  name: 'Jo Tanaka',
  age: '25',
  gender: 'male',
  nationality: 'Japan',
  email: 'jo@example.com',
  phone: ''
}

type Form = typeof ContactForm | typeof MoveInForm | typeof TourForm

export const TURNSTILE_TOKEN = 'turnstile-token'

/** Stands in for Cloudflare's script, which jsdom never loads: every challenge passes at once. */
function installTurnstile() {
  window.turnstile = {
    render: () => 'widget',
    getResponse: () => TURNSTILE_TOKEN,
    reset: () => {},
    remove: () => {}
  }
}

export function renderForm(Form: Form) {
  installTurnstile()
  return render(
    <LegalNoticeProvider data={null}>
      <Form title="Contact us" description={null} fields={fields} houseTitles={houseTitles} />
      <Toaster />
    </LegalNoticeProvider>
  )
}

export function setInput(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } })
}

export function choose(label: string, option: RegExp) {
  fireEvent.click(screen.getByRole('combobox', { name: label }))
  // Base UI only selects the highlighted item, and jsdom has no pointer to hover it.
  const item = screen.getByRole('option', { name: option })
  fireEvent.mouseMove(item)
  fireEvent.click(item)
}

/** Everything the three forms share: a house, the account group, a message and consent. */
export function fillSharedFields() {
  fireEvent.click(screen.getByRole('button', { name: 'Orange House' }))
  choose('Gender', /\bmale\b/i)
  setInput('Name', account.name)
  setInput('Age', account.age)
  setInput('Nationality', account.nationality)
  setInput('Email', account.email)
  // Optional on the tour and move-in forms, which append that to its label.
  fireEvent.change(screen.getByRole('textbox', { name: /\bMessage\b/ }), {
    target: { value: 'Hello there' }
  })
  fireEvent.click(screen.getByRole('checkbox'))
}

export function submit() {
  fireEvent.click(screen.getByRole('button', { name: /\bsubmit\b/i }))
}

/** Submits past the browser's own `required` checks, so the form's validation runs. */
export function submitIncomplete() {
  document.querySelector('form')!.noValidate = true
  submit()
}
