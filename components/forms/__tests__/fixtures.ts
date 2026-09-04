import type { HouseTitles } from '@/components/forms'
import type { ContactFormConfig } from '@/lib/types/components'

export const houseTitles: HouseTitles = [
  { slug: 'orange', title: 'Orange House' },
  { slug: 'apple', title: 'Apple House' },
  { slug: 'lemon', title: 'Lemon House' }
]

/**
 * Labels for every field the contact forms can configure. Each form renders the
 * subset it owns, so the three form suites can share one fixture.
 */
export const fields: ContactFormConfig['fields'] = {
  places: { label: 'Preferred Houses', description: 'Choose up to 3' },
  date: { label: 'Preferred Date', description: 'Select a date' },
  hour: { label: 'Preferred Time', description: 'Select a time' },
  stayDuration: { label: 'Stay Duration', description: 'How long?' },
  name: { label: 'Your Name', placeholder: 'Enter name' },
  age: { label: 'Your Age', placeholder: 'Enter age' },
  gender: { label: 'Gender', placeholder: 'Select gender' },
  nationality: { label: 'Nationality', placeholder: 'Enter nationality' },
  email: { label: 'Your Email', placeholder: 'Enter email' },
  phone: { label: 'Phone', placeholder: 'Enter phone' },
  message: { label: 'Your Message', placeholder: 'Enter message', description: 'Optional' }
}
