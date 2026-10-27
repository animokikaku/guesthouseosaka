// @vitest-environment node

import {
  contactFormPayloadSchema,
  createGeneralInquirySchema,
  createMoveInFormSchema,
  createTourFormSchema,
  type ValidationMessages
} from '../contact-form'

type ValidationKey = keyof ValidationMessages

// Reports which message each rule asks for; the copy itself lives in the catalogs.
const t = new Proxy({}, { get: (_, key) => key }) as ValidationMessages

const account = {
  name: 'Jo Tanaka',
  age: '25',
  gender: 'male',
  nationality: 'Japan',
  email: 'jo@example.com',
  phone: ''
} as const

const inquiry = {
  places: ['orange'],
  account,
  message: 'Hello, I have a question.',
  privacyPolicy: true
} as const

// Far enough ahead that "today or later" never depends on the clock.
const tour = { ...inquiry, date: '2099-01-15', hour: '14:00' } as const
const moveIn = { ...inquiry, date: '2099-01-15', stayDuration: '3-months' } as const

const forms = [
  { name: 'tour', schema: createTourFormSchema(t), valid: tour },
  { name: 'move-in', schema: createMoveInFormSchema(t), valid: moveIn },
  { name: 'general inquiry', schema: createGeneralInquirySchema(t), valid: inquiry }
]

/** The submitted value with one part replaced, e.g. `{ account: { age: '0' } }`. */
function withPatch<T extends { account: object }>(
  valid: T,
  { account: accountPatch, ...patch }: Record<string, unknown> & { account?: object }
) {
  return { ...valid, ...patch, account: { ...valid.account, ...accountPatch } }
}

/** The localized message the user sees for each failing field, keyed by its path. */
function errorsOf(result: {
  success: boolean
  error?: { issues: { path: PropertyKey[]; message: string }[] }
}) {
  return Object.fromEntries(
    (result.error?.issues ?? []).map((issue) => [issue.path.join('.'), issue.message])
  )
}

describe.each(forms)('$name form', ({ schema, valid }) => {
  it('accepts a complete submission', () => {
    expect(schema.safeParse(valid).success).toBe(true)
  })

  it.each<[string, Record<string, unknown>]>([
    ['three houses', { places: ['orange', 'apple', 'lemon'] }],
    ['a two-letter name', { account: { name: 'Jo' } }],
    ['an international phone number', { account: { phone: '+81 90 1234 5678' } }]
  ])('accepts %s', (_name, patch) => {
    expect(schema.safeParse(withPatch(valid, patch)).success).toBe(true)
  })

  // Every form shares these rules, so each runs against all three schemas.
  it.each<[string, Record<string, unknown>, string, ValidationKey]>([
    ['no house', { places: [] }, 'places', 'places_min'],
    ['four houses', { places: ['orange', 'apple', 'lemon', 'orange'] }, 'places', 'places_max'],
    ['a one-letter name', { account: { name: 'J' } }, 'account.name', 'name_min'],
    ['a 101-letter name', { account: { name: 'a'.repeat(101) } }, 'account.name', 'name_max'],
    ['an age of zero', { account: { age: '0' } }, 'account.age', 'age_positive'],
    ['an age in words', { account: { age: 'twenty' } }, 'account.age', 'age_positive'],
    ['no gender', { account: { gender: '' } }, 'account.gender', 'gender_required'],
    [
      'no nationality',
      { account: { nationality: '' } },
      'account.nationality',
      'nationality_required'
    ],
    ['a malformed email', { account: { email: 'jo@' } }, 'account.email', 'email'],
    ['a malformed phone', { account: { phone: 'call me' } }, 'account.phone', 'phone'],
    ['an unchecked privacy policy', { privacyPolicy: false }, 'privacyPolicy', 'privacy_policy'],
    ['a 3001-character message', { message: 'a'.repeat(3001) }, 'message', 'message_max']
  ])('rejects %s with its message', (_name, patch, path, key) => {
    const result = schema.safeParse(withPatch(valid, patch))

    expect(errorsOf(result)).toEqual({ [path]: key })
  })

  it('rejects a house that does not exist', () => {
    expect(schema.safeParse(withPatch(valid, { places: ['banana'] })).success).toBe(false)
  })
})

describe('tour form', () => {
  const schema = createTourFormSchema(t)

  it.each(['10:00', '20:00', '14:30'])('accepts a %s visit', (hour) => {
    expect(schema.safeParse({ ...tour, hour }).success).toBe(true)
  })

  it.each(['09:59', '20:01'])('rejects a %s visit outside contact hours', (hour) => {
    expect(errorsOf(schema.safeParse({ ...tour, hour }))).toEqual({ hour: 'time_range' })
  })

  describe('date', () => {
    afterEach(() => {
      vi.useRealTimers()
    })

    // 20:00 on Jan 14 in New York is already 10:00 on Jan 15 in Osaka, where the
    // visit happens; the browser and the server must agree on "today".
    it('compares against the current date in Osaka, not the local one', () => {
      vi.useFakeTimers({ now: new Date('2026-01-15T01:00:00Z') })

      expect(schema.safeParse({ ...tour, date: '2026-01-15' }).success).toBe(true)
      expect(errorsOf(schema.safeParse({ ...tour, date: '2026-01-14' }))).toEqual({
        date: 'date_future'
      })
    })
  })
})

describe('move-in form', () => {
  const schema = createMoveInFormSchema(t)

  it.each(['1-month', '3-months', 'long-term'])('accepts a %s stay', (stayDuration) => {
    expect(schema.safeParse({ ...moveIn, stayDuration }).success).toBe(true)
  })

  it('requires a stay duration', () => {
    expect(errorsOf(schema.safeParse({ ...moveIn, stayDuration: '' }))).toEqual({
      stayDuration: 'stay_duration'
    })
  })
})

describe('general inquiry form', () => {
  const schema = createGeneralInquirySchema(t)

  it('requires a message of at least five characters', () => {
    expect(schema.safeParse({ ...inquiry, message: 'Hello' }).success).toBe(true)
    expect(errorsOf(schema.safeParse({ ...inquiry, message: 'Hi' }))).toEqual({
      message: 'message_min'
    })
  })

  it('does not ask for a date', () => {
    expect(schema.safeParse(inquiry).success).toBe(true)
  })
})

describe('contactFormPayloadSchema', () => {
  it.each([
    ['tour', tour],
    ['move-in', moveIn],
    ['other', inquiry]
  ])('accepts a %s submission', (type, data) => {
    expect(contactFormPayloadSchema.safeParse({ type, data }).success).toBe(true)
  })

  // The server re-validates against the schema the type names, so a request
  // can't skip the date or hour by claiming a different form.
  it('rejects data that does not match its form type', () => {
    expect(contactFormPayloadSchema.safeParse({ type: 'tour', data: inquiry }).success).toBe(false)
  })
})
