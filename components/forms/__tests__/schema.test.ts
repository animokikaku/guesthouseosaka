import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import {
  useTourFormSchema,
  useMoveInFormSchema,
  useGeneralInquirySchema
} from '../schema'

// Helper to get schema from hook
function getSchema<T>(hook: () => T): T {
  const { result } = renderHook(hook)
  return result.current
}

// Valid base data for tour form
const validTourData = {
  places: ['orange'] as const,
  date: '2030-01-15',
  hour: '14:00:00',
  account: {
    name: 'John Doe',
    age: '25',
    gender: 'male' as const,
    nationality: 'USA',
    email: 'john@example.com',
    phone: ''
  },
  message: 'Test message',
  privacyPolicy: true as const
}

describe('useTourFormSchema', () => {
  const getSchemaInstance = () => getSchema(useTourFormSchema)

  describe('places field', () => {
    it('accepts array of 1-3 valid house identifiers', () => {
      const schema = getSchemaInstance()
      const result = schema.safeParse(validTourData)
      expect(result.success).toBe(true)
    })

    it('accepts array with 3 places', () => {
      const schema = getSchemaInstance()
      const result = schema.safeParse({
        ...validTourData,
        places: ['orange', 'apple', 'lemon']
      })
      expect(result.success).toBe(true)
    })

    it('rejects empty array', () => {
      const schema = getSchemaInstance()
      const result = schema.safeParse({
        ...validTourData,
        places: []
      })
      expect(result.success).toBe(false)
    })

    it('rejects invalid house identifiers', () => {
      const schema = getSchemaInstance()
      const result = schema.safeParse({
        ...validTourData,
        places: ['invalid-house']
      })
      expect(result.success).toBe(false)
    })
  })

  describe('account.name field', () => {
    it('accepts strings >= 2 characters', () => {
      const schema = getSchemaInstance()
      const result = schema.safeParse({
        ...validTourData,
        account: { ...validTourData.account, name: 'Jo' }
      })
      expect(result.success).toBe(true)
    })

    it('rejects strings < 2 characters', () => {
      const schema = getSchemaInstance()
      const result = schema.safeParse({
        ...validTourData,
        account: { ...validTourData.account, name: 'J' }
      })
      expect(result.success).toBe(false)
    })
  })

  describe('account.age field', () => {
    it('accepts positive numeric strings', () => {
      const schema = getSchemaInstance()
      const result = schema.safeParse({
        ...validTourData,
        account: { ...validTourData.account, age: '30' }
      })
      expect(result.success).toBe(true)
    })

    it('rejects non-numeric strings', () => {
      const schema = getSchemaInstance()
      const result = schema.safeParse({
        ...validTourData,
        account: { ...validTourData.account, age: 'twenty' }
      })
      expect(result.success).toBe(false)
    })

    it('rejects zero and negative values', () => {
      const schema = getSchemaInstance()
      const result1 = schema.safeParse({
        ...validTourData,
        account: { ...validTourData.account, age: '0' }
      })
      expect(result1.success).toBe(false)

      const result2 = schema.safeParse({
        ...validTourData,
        account: { ...validTourData.account, age: '-5' }
      })
      expect(result2.success).toBe(false)
    })
  })

  describe('account.phone field', () => {
    it('accepts empty string (optional)', () => {
      const schema = getSchemaInstance()
      const result = schema.safeParse({
        ...validTourData,
        account: { ...validTourData.account, phone: '' }
      })
      expect(result.success).toBe(true)
    })

    it('accepts valid phone numbers', () => {
      const schema = getSchemaInstance()
      // Use a standard international format that validator recognizes
      const result = schema.safeParse({
        ...validTourData,
        account: { ...validTourData.account, phone: '+12025551234' }
      })
      expect(result.success).toBe(true)
    })

    it('rejects invalid phone formats', () => {
      const schema = getSchemaInstance()
      const result = schema.safeParse({
        ...validTourData,
        account: { ...validTourData.account, phone: 'not-a-phone' }
      })
      expect(result.success).toBe(false)
    })
  })

  describe('hour field', () => {
    it('accepts times between 10:00 and 20:00', () => {
      const schema = getSchemaInstance()
      const result = schema.safeParse({
        ...validTourData,
        hour: '15:00:00'
      })
      expect(result.success).toBe(true)
    })

    it('accepts boundary time 10:00', () => {
      const schema = getSchemaInstance()
      const result = schema.safeParse({
        ...validTourData,
        hour: '10:00:00'
      })
      expect(result.success).toBe(true)
    })

    it('accepts boundary time 20:00', () => {
      const schema = getSchemaInstance()
      const result = schema.safeParse({
        ...validTourData,
        hour: '20:00:00'
      })
      expect(result.success).toBe(true)
    })

    it('rejects times before 10:00', () => {
      const schema = getSchemaInstance()
      const result = schema.safeParse({
        ...validTourData,
        hour: '09:00:00'
      })
      expect(result.success).toBe(false)
    })

    it('rejects times after 20:00', () => {
      const schema = getSchemaInstance()
      const result = schema.safeParse({
        ...validTourData,
        hour: '21:00:00'
      })
      expect(result.success).toBe(false)
    })
  })
})

// Valid base data for move-in form
const validMoveInData = {
  places: ['orange'] as const,
  date: '2030-01-15',
  stayDuration: '3-months' as const,
  account: {
    name: 'John Doe',
    age: '25',
    gender: 'male' as const,
    nationality: 'USA',
    email: 'john@example.com',
    phone: ''
  },
  message: 'Test message',
  privacyPolicy: true as const
}

describe('useMoveInFormSchema', () => {
  const getSchemaInstance = () => getSchema(useMoveInFormSchema)

  it('includes stayDuration field', () => {
    const schema = getSchemaInstance()
    const result = schema.safeParse(validMoveInData)
    expect(result.success).toBe(true)
  })

  it('rejects invalid stayDuration values', () => {
    const schema = getSchemaInstance()
    const result = schema.safeParse({
      ...validMoveInData,
      stayDuration: 'invalid'
    })
    expect(result.success).toBe(false)
  })

  it('does not include hour field', () => {
    const schema = getSchemaInstance()
    // Should pass without hour field - move-in doesn't need it
    const result = schema.safeParse(validMoveInData)
    expect(result.success).toBe(true)
  })
})

describe('useGeneralInquirySchema', () => {
  const getSchemaInstance = () => getSchema(useGeneralInquirySchema)

  it('requires only name, email, message, and privacyPolicy', () => {
    const schema = getSchemaInstance()
    const result = schema.safeParse({
      account: {
        name: 'John',
        email: 'john@example.com'
      },
      message: 'Hello, I have a question.',
      privacyPolicy: true
    })
    expect(result.success).toBe(true)
  })

  it('requires message length >= 5', () => {
    const schema = getSchemaInstance()
    const result = schema.safeParse({
      account: {
        name: 'John',
        email: 'john@example.com'
      },
      message: 'Hi',
      privacyPolicy: true
    })
    expect(result.success).toBe(false)
  })

  it('accepts message with exactly 5 characters', () => {
    const schema = getSchemaInstance()
    const result = schema.safeParse({
      account: {
        name: 'John',
        email: 'john@example.com'
      },
      message: 'Hello',
      privacyPolicy: true
    })
    expect(result.success).toBe(true)
  })

  it('does not require places, date, or hour', () => {
    const schema = getSchemaInstance()
    // Should pass without places, date, hour
    const result = schema.safeParse({
      account: {
        name: 'John',
        email: 'john@example.com'
      },
      message: 'I have a question about your guesthouse.',
      privacyPolicy: true
    })
    expect(result.success).toBe(true)
  })
})
