import type { FieldWithValue } from '@tanstack/react-form'

export type MockFieldApi<T> = FieldWithValue<T> & {
  handleChange: ReturnType<typeof vi.fn>
  handleBlur: ReturnType<typeof vi.fn>
}

interface MockFieldOverrides<T> {
  value?: T
  /**
   * The field's *visible* errors.
   *
   * In v2 the form's `errorVisibility` policy runs before errors reach the
   * field API, so `field.errors` is already the display-ready list and
   * `meta.isInvalid` follows from it. Tests therefore describe the outcome of
   * that policy rather than re-deriving it from `isTouched`.
   */
  errors?: Array<{ message: string }>
  isTouched?: boolean
}

/** Builds a TanStack Form v2 shaped field API for field component tests. */
export function createMockFieldApi<T>(
  name: string,
  defaultValue: T,
  overrides: MockFieldOverrides<T> = {}
): MockFieldApi<T> {
  const errors = overrides.errors ?? []
  const isInvalid = errors.length > 0

  // The field components only read this subset of the field API.
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return {
    name,
    value: overrides.value ?? defaultValue,
    errors,
    meta: {
      isTouched: overrides.isTouched ?? false,
      isValid: !isInvalid,
      isInvalid,
      errors
    },
    handleChange: vi.fn(),
    handleBlur: vi.fn()
  } as unknown as MockFieldApi<T>
}
