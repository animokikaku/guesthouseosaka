import type { FieldWithValue } from '@tanstack/react-form'

export type MockFieldApi<T> = FieldWithValue<T> & {
  handleChange: ReturnType<typeof vi.fn>
  handleBlur: ReturnType<typeof vi.fn>
}

interface MockFieldOverrides<T> {
  value?: T
  isTouched?: boolean
  isValid?: boolean
  errors?: Array<{ message: string }>
}

/**
 * Builds a TanStack Form v2 shaped field API for field component tests.
 *
 * v2 filters errors through the form's `errorVisibility` policy before they
 * reach `field.errors`, so this mock mirrors the "visible once touched" policy
 * that these field components are used with.
 */
export function createMockFieldApi<T>(
  name: string,
  defaultValue: T,
  overrides: MockFieldOverrides<T> = {}
): MockFieldApi<T> {
  const isTouched = overrides.isTouched ?? false
  const isValid = overrides.isValid ?? true
  const isInvalid = isTouched && !isValid
  const errors = isInvalid ? (overrides.errors ?? []) : []

  // The field components only read this subset of the field API.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return {
    name,
    value: overrides.value ?? defaultValue,
    errors,
    meta: { isTouched, isValid, isInvalid, errors },
    handleChange: vi.fn(),
    handleBlur: vi.fn()
  } as unknown as MockFieldApi<T>
}
