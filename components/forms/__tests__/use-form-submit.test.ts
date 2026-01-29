import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type {
  GeneralInquiryFields,
  MoveInFormFields,
  TourFormFields
} from '../schema'
import { useFormSubmit } from '../use-form-submit'

// Mock the contact action
const mockSubmitContactForm = vi.fn()
vi.mock('@/app/actions/contact', () => ({
  submitContactForm: (data: unknown) => mockSubmitContactForm(data)
}))

// Mock router
const mockPush = vi.fn()
vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: mockPush })
}))

// Mock toast
const mockToastPromise = vi.fn()
vi.mock('sonner', () => ({
  toast: {
    promise: (promise: Promise<unknown>, options: unknown) =>
      mockToastPromise(promise, options)
  }
}))

describe('useFormSubmit', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSubmitContactForm.mockResolvedValue({ success: true })
  })

  describe('onSubmitInvalid', () => {
    it('focuses first input with aria-invalid="true"', () => {
      const mockElement = { focus: vi.fn() }
      vi.spyOn(document, 'querySelector').mockReturnValue(
        mockElement as unknown as HTMLElement
      )

      const { result } = renderHook(() => useFormSubmit())

      act(() => {
        result.current.onSubmitInvalid()
      })

      expect(document.querySelector).toHaveBeenCalledWith(
        '[aria-invalid="true"]'
      )
      expect(mockElement.focus).toHaveBeenCalled()
    })

    it('handles no invalid input found', () => {
      vi.spyOn(document, 'querySelector').mockReturnValue(null)

      const { result } = renderHook(() => useFormSubmit())

      // Should not throw
      expect(() => {
        act(() => {
          result.current.onSubmitInvalid()
        })
      }).not.toThrow()
    })
  })

  describe('createOnSubmit', () => {
    const mockTourData: TourFormFields = {
      places: ['orange'],
      date: '2030-01-15',
      hour: '14:00:00',
      account: {
        name: 'John Doe',
        age: '25',
        gender: 'male',
        nationality: 'USA',
        email: 'john@example.com',
        phone: ''
      },
      message: 'Test message',
      privacyPolicy: true
    }

    const mockMoveInData: MoveInFormFields = {
      places: ['orange'],
      date: '2030-01-15',
      stayDuration: '3-months',
      account: {
        name: 'Jane Doe',
        age: '30',
        gender: 'female',
        nationality: 'Japan',
        email: 'jane@example.com',
        phone: ''
      },
      message: 'Moving in',
      privacyPolicy: true
    }

    const mockGeneralData: GeneralInquiryFields = {
      places: ['orange'],
      account: {
        name: 'Bob',
        age: '28',
        gender: 'male',
        nationality: 'Canada',
        email: 'bob@example.com',
        phone: ''
      },
      message: 'General question',
      privacyPolicy: true
    }

    it('creates handler for tour form type', async () => {
      const { result } = renderHook(() => useFormSubmit())

      const onSubmit = result.current.createOnSubmit('tour')

      await act(async () => {
        await onSubmit({ value: mockTourData })
      })

      expect(mockSubmitContactForm).toHaveBeenCalledWith({
        type: 'tour',
        data: mockTourData
      })
    })

    it('creates handler for move-in form type', async () => {
      const { result } = renderHook(() => useFormSubmit())

      const onSubmit = result.current.createOnSubmit('move-in')

      await act(async () => {
        await onSubmit({ value: mockMoveInData })
      })

      expect(mockSubmitContactForm).toHaveBeenCalledWith({
        type: 'move-in',
        data: mockMoveInData
      })
    })

    it('creates handler for other (general inquiry) form type', async () => {
      const { result } = renderHook(() => useFormSubmit())

      const onSubmit = result.current.createOnSubmit('other')

      await act(async () => {
        await onSubmit({ value: mockGeneralData })
      })

      expect(mockSubmitContactForm).toHaveBeenCalledWith({
        type: 'other',
        data: mockGeneralData
      })
    })

    it('calls toast.promise with the submit promise', async () => {
      const { result } = renderHook(() => useFormSubmit())

      const onSubmit = result.current.createOnSubmit('tour')

      await act(async () => {
        await onSubmit({ value: mockTourData })
      })

      expect(mockToastPromise).toHaveBeenCalled()
      const [promise, options] = mockToastPromise.mock.calls[0]
      expect(promise).toBeInstanceOf(Promise)
      expect(options).toHaveProperty('loading')
      expect(options).toHaveProperty('success')
      expect(options).toHaveProperty('error')
    })

    it('success callback redirects to /contact', async () => {
      const { result } = renderHook(() => useFormSubmit())

      const onSubmit = result.current.createOnSubmit('tour')

      await act(async () => {
        await onSubmit({ value: mockTourData })
      })

      const [, options] = mockToastPromise.mock.calls[0]
      const successResult = options.success()

      expect(mockPush).toHaveBeenCalledWith('/contact')
      expect(successResult).toHaveProperty('message')
      expect(successResult).toHaveProperty('description')
    })

    it('error callback returns error message', async () => {
      const { result } = renderHook(() => useFormSubmit())

      const onSubmit = result.current.createOnSubmit('tour')

      await act(async () => {
        await onSubmit({ value: mockTourData })
      })

      const [, options] = mockToastPromise.mock.calls[0]
      const errorResult = options.error(new Error('Network error'))

      expect(errorResult).toHaveProperty('message', 'Network error')
      expect(errorResult).toHaveProperty('description')
    })
  })
})
