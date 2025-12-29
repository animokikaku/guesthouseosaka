import { describe, expect, it } from 'vitest'
import { toContactFormConfig, toFormFieldsConfig } from '../form'

describe('toFormFieldsConfig', () => {
  it('transforms fields config with all fields', () => {
    const fields = {
      places: {
        label: 'Select Places',
        placeholder: 'Choose...',
        description: 'Select which houses to visit'
      },
      date: {
        label: 'Date',
        placeholder: 'Pick a date',
        description: null
      },
      hour: {
        label: 'Time',
        placeholder: null,
        description: 'Preferred time'
      },
      name: {
        label: 'Full Name',
        placeholder: 'Enter your name',
        description: null
      },
      email: {
        label: 'Email Address',
        placeholder: 'email@example.com',
        description: null
      }
    }

    const result = toFormFieldsConfig(
      fields as Parameters<typeof toFormFieldsConfig>[0]
    )

    expect(result).toEqual({
      places: {
        label: 'Select Places',
        placeholder: 'Choose...',
        description: 'Select which houses to visit'
      },
      date: {
        label: 'Date',
        placeholder: 'Pick a date',
        description: null
      },
      hour: {
        label: 'Time',
        placeholder: null,
        description: 'Preferred time'
      },
      name: {
        label: 'Full Name',
        placeholder: 'Enter your name',
        description: null
      },
      email: {
        label: 'Email Address',
        placeholder: 'email@example.com',
        description: null
      }
    })
  })

  it('returns empty object for null fields', () => {
    const result = toFormFieldsConfig(null)

    expect(result).toEqual({})
  })

  it('returns empty object for undefined fields', () => {
    const result = toFormFieldsConfig(undefined as Parameters<typeof toFormFieldsConfig>[0])

    expect(result).toEqual({})
  })

  it('handles partial fields config', () => {
    const fields = {
      name: {
        label: 'Name',
        placeholder: null,
        description: null
      },
      message: {
        label: 'Message',
        placeholder: 'Your message...',
        description: 'Tell us what you need'
      }
    }

    const result = toFormFieldsConfig(
      fields as Parameters<typeof toFormFieldsConfig>[0]
    )

    expect(result).toEqual({
      name: {
        label: 'Name',
        placeholder: null,
        description: null
      },
      message: {
        label: 'Message',
        placeholder: 'Your message...',
        description: 'Tell us what you need'
      }
    })
  })

  it('transforms all possible field types', () => {
    const fields = {
      places: { label: 'Places', placeholder: null, description: null },
      date: { label: 'Date', placeholder: null, description: null },
      hour: { label: 'Hour', placeholder: null, description: null },
      stayDuration: { label: 'Stay Duration', placeholder: null, description: null },
      name: { label: 'Name', placeholder: null, description: null },
      age: { label: 'Age', placeholder: null, description: null },
      gender: { label: 'Gender', placeholder: null, description: null },
      nationality: { label: 'Nationality', placeholder: null, description: null },
      email: { label: 'Email', placeholder: null, description: null },
      phone: { label: 'Phone', placeholder: null, description: null },
      message: { label: 'Message', placeholder: null, description: null }
    }

    const result = toFormFieldsConfig(
      fields as Parameters<typeof toFormFieldsConfig>[0]
    )

    expect(Object.keys(result)).toHaveLength(11)
    expect(result.places?.label).toBe('Places')
    expect(result.stayDuration?.label).toBe('Stay Duration')
    expect(result.nationality?.label).toBe('Nationality')
  })
})

describe('toContactFormConfig', () => {
  it('transforms full contact type data', () => {
    const contactType = {
      title: 'Book a Tour',
      description: 'Schedule a visit to our properties',
      fields: {
        places: {
          label: 'Properties',
          placeholder: 'Select properties',
          description: null
        },
        date: {
          label: 'Tour Date',
          placeholder: null,
          description: 'When would you like to visit?'
        },
        name: {
          label: 'Your Name',
          placeholder: 'Enter your full name',
          description: null
        },
        email: {
          label: 'Email',
          placeholder: 'email@example.com',
          description: null
        }
      }
    }

    const result = toContactFormConfig(
      contactType as Parameters<typeof toContactFormConfig>[0]
    )

    expect(result).toEqual({
      title: 'Book a Tour',
      description: 'Schedule a visit to our properties',
      fields: {
        places: {
          label: 'Properties',
          placeholder: 'Select properties',
          description: null
        },
        date: {
          label: 'Tour Date',
          placeholder: null,
          description: 'When would you like to visit?'
        },
        name: {
          label: 'Your Name',
          placeholder: 'Enter your full name',
          description: null
        },
        email: {
          label: 'Email',
          placeholder: 'email@example.com',
          description: null
        }
      }
    })
  })

  it('returns default config for null contact type', () => {
    const result = toContactFormConfig(null)

    expect(result).toEqual({
      fields: {}
    })
  })

  it('handles contact type with missing title and description', () => {
    const contactType = {
      fields: {
        message: {
          label: 'Message',
          placeholder: 'Type here...',
          description: null
        }
      }
    }

    const result = toContactFormConfig(
      contactType as Parameters<typeof toContactFormConfig>[0]
    )

    expect(result).toEqual({
      title: null,
      description: null,
      fields: {
        message: {
          label: 'Message',
          placeholder: 'Type here...',
          description: null
        }
      }
    })
  })

  it('handles contact type with null fields', () => {
    const contactType = {
      title: 'Contact Us',
      description: null,
      fields: null
    }

    const result = toContactFormConfig(
      contactType as Parameters<typeof toContactFormConfig>[0]
    )

    expect(result).toEqual({
      title: 'Contact Us',
      description: null,
      fields: {}
    })
  })
})
