export type ContactFormRejectionCode = 'validation' | 'rate_limit'

export class ContactFormRejectedError extends Error {
  readonly code: ContactFormRejectionCode

  constructor(code: ContactFormRejectionCode) {
    super('')
    this.name = 'ContactFormRejectedError'
    this.code = code
  }
}
