import { vi } from 'vitest'
import { createContext } from 'react'

export interface MockFieldState<T> {
  value: T
  meta: {
    isTouched: boolean
    isValid: boolean
    errors: Array<{ message: string }>
  }
}

export interface MockFieldApi<T> {
  name: string
  state: MockFieldState<T>
  handleChange: ReturnType<typeof vi.fn>
  handleBlur: ReturnType<typeof vi.fn>
}

export function createMockFieldState<T>(
  defaultValue: T,
  overrides: {
    value?: T
    isTouched?: boolean
    isValid?: boolean
    errors?: Array<{ message: string }>
  } = {}
): MockFieldState<T> {
  return {
    value: overrides.value ?? defaultValue,
    meta: {
      isTouched: overrides.isTouched ?? false,
      isValid: overrides.isValid ?? true,
      errors: overrides.errors ?? []
    }
  }
}

export function createMockFieldApi<T>(
  name: string,
  defaultValue: T,
  overrides: {
    value?: T
    isTouched?: boolean
    isValid?: boolean
    errors?: Array<{ message: string }>
  } = {}
): MockFieldApi<T> {
  return {
    name,
    state: createMockFieldState(defaultValue, overrides),
    handleChange: vi.fn(),
    handleBlur: vi.fn()
  }
}

export function createFieldContext<T>() {
  return createContext<MockFieldApi<T> | null>(null)
}

export function FieldContextWrapper<T>({
  children,
  fieldApi,
  context
}: {
  children: React.ReactNode
  fieldApi: MockFieldApi<T>
  context: React.Context<MockFieldApi<T> | null>
}) {
  return <context.Provider value={fieldApi}>{children}</context.Provider>
}
