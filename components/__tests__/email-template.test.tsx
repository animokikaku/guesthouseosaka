// @vitest-environment node

import type { ContactFormFields } from '@/lib/schemas/contact-form'
import { render } from 'react-email'
import { GeneralInquiryEmail, MoveInRequestEmail, TourRequestEmail } from '../email-template'

const account: ContactFormFields['account'] = {
  name: 'Jo Tanaka',
  age: '25',
  gender: 'female',
  nationality: 'France',
  email: 'jo@example.com',
  phone: ''
}

const base: Pick<ContactFormFields, 'places' | 'account' | 'message'> = {
  places: ['orange', 'apple'],
  account,
  message: 'Is there a room in March?'
}

/** The email as staff read it, one line per entry. */
async function text(email: React.ReactElement) {
  const plain = await render(email, { plainText: true })
  return plain
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

describe('inquiry emails', () => {
  it('gives staff the sender, the houses and the message in Japanese', async () => {
    const lines = await text(<GeneralInquiryEmail data={base} />)

    expect(lines).toEqual(
      expect.arrayContaining([
        'お問い合わせ',
        '名前: Jo Tanaka',
        'メールアドレス: jo@example.com',
        '国籍: France',
        '性別: 女性',
        '年齢: 25',
        '希望物件: オレンジハウス, アップルハウス',
        'Is there a room in March?'
      ])
    )
  })

  it('lists a phone number only when the sender gave one', async () => {
    expect((await text(<GeneralInquiryEmail data={base} />)).join('\n')).not.toContain('電話番号')

    const withPhone = { ...base, account: { ...account, phone: '+81 90 1234 5678' } }
    expect(await text(<GeneralInquiryEmail data={withPhone} />)).toContain(
      '電話番号: +81 90 1234 5678'
    )
  })

  // The suite runs behind UTC (see vitest.config.mts), so this also pins the
  // date to the one the visitor picked rather than the server's local day.
  it('adds the requested visit date and time to a tour request', async () => {
    const lines = await text(
      <TourRequestEmail data={{ ...base, date: '2099-03-01', hour: '14:00' }} />
    )

    expect(lines).toEqual(expect.arrayContaining(['内覧希望', '希望日時: 2099年3月1日 14:00']))
  })

  it('adds the move-in date and length of stay to a move-in request', async () => {
    const lines = await text(
      <MoveInRequestEmail data={{ ...base, date: '2099-03-01', stayDuration: '3-months' }} />
    )

    expect(lines).toEqual(
      expect.arrayContaining(['入居希望', '希望日: 2099年3月1日', '滞在期間: 3ヶ月以上'])
    )
  })
})
