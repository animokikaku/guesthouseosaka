import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createContext } from 'react'
import { SubmitButton } from '../submit-button'

// Create a mock form context
interface MockFormApi {
  store: {
    subscribe: ReturnType<typeof vi.fn>
    getState: ReturnType<typeof vi.fn>
  }
}

const testFormContext = createContext<MockFormApi | null>(null)

vi.mock('@/components/forms/form-context', async () => {
  const React = await import('react')
  return {
    useFormContext: () => React.useContext(testFormContext)
  }
})

// Mock @tanstack/react-form useStore
let mockStoreState = { isSubmitting: false, canSubmit: true }

vi.mock('@tanstack/react-form', () => ({
  useStore: () => [mockStoreState.isSubmitting, mockStoreState.canSubmit]
}))

function createMockFormApi(): MockFormApi {
  return {
    store: {
      subscribe: vi.fn(),
      getState: vi.fn(() => mockStoreState)
    }
  }
}

function FormContextWrapper({
  children,
  formApi
}: {
  children: React.ReactNode
  formApi: MockFormApi
}) {
  return <testFormContext.Provider value={formApi}>{children}</testFormContext.Provider>
}

describe('SubmitButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockStoreState = { isSubmitting: false, canSubmit: true }
  })

  describe('rendering', () => {
    it('renders button with submit type', () => {
      const formApi = createMockFormApi()

      render(
        <FormContextWrapper formApi={formApi}>
          <SubmitButton />
        </FormContextWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
    })

    it('renders with translation key label', () => {
      const formApi = createMockFormApi()

      render(
        <FormContextWrapper formApi={formApi}>
          <SubmitButton />
        </FormContextWrapper>
      )

      expect(screen.getByRole('button')).toHaveTextContent('label')
    })
  })

  describe('disabled state', () => {
    it('is enabled when canSubmit is true and not submitting', () => {
      mockStoreState = { isSubmitting: false, canSubmit: true }
      const formApi = createMockFormApi()

      render(
        <FormContextWrapper formApi={formApi}>
          <SubmitButton />
        </FormContextWrapper>
      )

      expect(screen.getByRole('button')).not.toBeDisabled()
    })

    it('is disabled when submitting', () => {
      mockStoreState = { isSubmitting: true, canSubmit: true }
      const formApi = createMockFormApi()

      render(
        <FormContextWrapper formApi={formApi}>
          <SubmitButton />
        </FormContextWrapper>
      )

      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('is disabled when canSubmit is false', () => {
      mockStoreState = { isSubmitting: false, canSubmit: false }
      const formApi = createMockFormApi()

      render(
        <FormContextWrapper formApi={formApi}>
          <SubmitButton />
        </FormContextWrapper>
      )

      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('is disabled when both submitting and canSubmit is false', () => {
      mockStoreState = { isSubmitting: true, canSubmit: false }
      const formApi = createMockFormApi()

      render(
        <FormContextWrapper formApi={formApi}>
          <SubmitButton />
        </FormContextWrapper>
      )

      expect(screen.getByRole('button')).toBeDisabled()
    })
  })

  describe('props forwarding', () => {
    it('forwards className prop', () => {
      const formApi = createMockFormApi()

      render(
        <FormContextWrapper formApi={formApi}>
          <SubmitButton className="custom-class" />
        </FormContextWrapper>
      )

      expect(screen.getByRole('button')).toHaveClass('custom-class')
    })
  })
})
