/** Stubs submission so form tests exercise rendering and validation only. */
export function useFormSubmit() {
  return {
    onSubmitInvalid: vi.fn(),
    createOnSubmit: () => vi.fn()
  }
}
