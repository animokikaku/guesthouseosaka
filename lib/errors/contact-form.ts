export type ContactFormRejectionCode = 'validation' | 'rate_limit'

export class ContactFormRejectedError extends Error {
  readonly code: ContactFormRejectionCode

  constructor(code: ContactFormRejectionCode) {
    super(`Contact form rejected: ${code}`)
    this.name = 'ContactFormRejectedError'
    this.code = code
  }
}
