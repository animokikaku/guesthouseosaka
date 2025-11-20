/* eslint-disable react-hooks/error-boundaries */

import { EmailTemplate } from '@/components/email-template'
import { env } from '@/lib/env'
import { Resend } from 'resend'

const resend = new Resend(env.RESEND_API_KEY)

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'ORANGE HOUSE <orange@guesthouseosaka.com>',
      to: ['melkir13@gmail.com'],
      subject: 'Hello world',
      react: <EmailTemplate data={{ account: { name: 'Thibault', email: 'test@example.com' }, message: 'Hello world' }} type="other" />
    })

    if (error) {
      return Response.json({ error }, { status: 500 })
    }

    return Response.json({ data })
  } catch (error) {
    return Response.json({ error }, { status: 500 })
  }
}
