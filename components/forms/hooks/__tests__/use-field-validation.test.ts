import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'

const mockFieldApi = {
  name: 'testField',
  state: {
    value: '',
    meta: {
      isTouched: false,
      isValid: true,
      errors: [] as Array<{ message: string }>
    }
  },
  handleChange: vi.fn(),
  handleBlur: vi.fn()
}

vi.mock('@/components/forms/form-context', () => ({
  useFieldContext: () => mockFieldApi
}))

import { useFieldValidation } from '../use-field-validation'

describe('useFieldValidation', () => {
  it('returns field from context', () => {
    const { result } = renderHook(() => useFieldValidation<string>())

    expect(result.current.field).toBe(mockFieldApi)
  })

  it('returns isInvalid false when not touched', () => {
    mockFieldApi.state.meta.isTouched = false
    mockFieldApi.state.meta.isValid = false

    const { result } = renderHook(() => useFieldValidation<string>())

    expect(result.current.isInvalid).toBe(false)
  })

  it('returns isInvalid false when touched and valid', () => {
    mockFieldApi.state.meta.isTouched = true
    mockFieldApi.state.meta.isValid = true

    const { result } = renderHook(() => useFieldValidation<string>())

    expect(result.current.isInvalid).toBe(false)
  })

  it('returns isInvalid true when touched and invalid', () => {
    mockFieldApi.state.meta.isTouched = true
    mockFieldApi.state.meta.isValid = false

    const { result } = renderHook(() => useFieldValidation<string>())

    expect(result.current.isInvalid).toBe(true)
  })

  it('returns errors from field state', () => {
    const errors = [{ message: 'Required' }, { message: 'Too short' }]
    mockFieldApi.state.meta.errors = errors

    const { result } = renderHook(() => useFieldValidation<string>())

    expect(result.current.errors).toBe(errors)
  })

  it('returns empty errors when field has no errors', () => {
    mockFieldApi.state.meta.errors = []

    const { result } = renderHook(() => useFieldValidation<string>())

    expect(result.current.errors).toEqual([])
  })
})
