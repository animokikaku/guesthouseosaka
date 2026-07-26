import { LegalNoticeDialog } from '@/components/legal-notice-dialog'
import { LegalNoticeProvider } from '@/hooks/use-legal-notice'
import messages from '@/messages/en.json'
import { NextIntlClientProvider } from 'next-intl'
import { useState } from 'react'

const legalNotice = {
  _id: 'legal-notice-story',
  _type: 'legalNotice' as const,
  title: 'Privacy Policy',
  lastUpdated: '2026-01-15T00:00:00.000Z',
  content: [
    {
      _key: 'policy-content',
      _type: 'block' as const,
      children: [
        {
          _key: 'policy-text',
          _type: 'span' as const,
          marks: [],
          text: 'Policy content rendered in the browser.'
        }
      ],
      markDefs: [],
      style: 'normal' as const
    }
  ]
}

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale="en" messages={messages} timeZone="Asia/Tokyo">
      <LegalNoticeProvider data={legalNotice}>{children}</LegalNoticeProvider>
    </NextIntlClientProvider>
  )
}

export function Closable() {
  return (
    <Providers>
      <main className="p-6">
        <LegalNoticeDialog>Privacy Policy</LegalNoticeDialog>
      </main>
    </Providers>
  )
}

export function Agreeable() {
  const [agreements, setAgreements] = useState(0)

  return (
    <Providers>
      <main className="p-6">
        <LegalNoticeDialog onAgree={() => setAgreements((count) => count + 1)}>
          Privacy Policy
        </LegalNoticeDialog>
        <form hidden>
          <input data-testid="agreement-count" readOnly value={String(agreements)} />
        </form>
      </main>
    </Providers>
  )
}
