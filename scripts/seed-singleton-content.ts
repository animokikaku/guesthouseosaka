/**
 * Seeds FAQ, Contact, and Settings singleton documents with proper i18n keys
 *
 * Usage: bun --env-file=.env.local run scripts/seed-singleton-content.ts
 */

import { createClient } from '@sanity/client'

const PROJECT_ID = '515wijoz'
const DATASET = 'development'

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2025-12-16',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN
})

// Helper to create i18n string array
const i18nString = (en: string, ja: string, fr: string) => [
  { _key: 'en', _type: 'internationalizedArrayStringValue', value: en },
  { _key: 'ja', _type: 'internationalizedArrayStringValue', value: ja },
  { _key: 'fr', _type: 'internationalizedArrayStringValue', value: fr }
]

const i18nText = (en: string, ja: string, fr: string) => [
  { _key: 'en', _type: 'internationalizedArrayTextValue', value: en },
  { _key: 'ja', _type: 'internationalizedArrayTextValue', value: ja },
  { _key: 'fr', _type: 'internationalizedArrayTextValue', value: fr }
]

// Block helper for portable text
const textBlock = (text: string) => ({
  _type: 'block',
  _key: Math.random().toString(36).substring(2, 10),
  style: 'normal',
  markDefs: [],
  children: [{ _type: 'span', _key: 's1', text, marks: [] }]
})

type TextPart = { text: string; bold?: boolean }

const boldTextBlock = (parts: TextPart[]) => ({
  _type: 'block',
  _key: Math.random().toString(36).substring(2, 10),
  style: 'normal',
  markDefs: [],
  children: parts.map((part, i) => ({
    _type: 'span',
    _key: `s${i}`,
    text: part.text,
    marks: part.bold ? ['strong'] : []
  }))
})

// Helper for localized portable text answers
type PortableTextBlock = ReturnType<typeof textBlock>
const i18nPortableText = (
  en: PortableTextBlock[],
  ja: PortableTextBlock[],
  fr: PortableTextBlock[]
) => [
  { _key: 'en', _type: 'internationalizedArrayPortableTextValue', value: en },
  { _key: 'ja', _type: 'internationalizedArrayPortableTextValue', value: ja },
  { _key: 'fr', _type: 'internationalizedArrayPortableTextValue', value: fr }
]

// Parse HTML-like string with <strong> tags to Portable Text block
const parseHtmlToBlock = (html: string): PortableTextBlock => {
  const parts: TextPart[] = []
  const regex = /<strong>(.*?)<\/strong>/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(html)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push({ text: html.slice(lastIndex, match.index) })
    }
    // Add bold text
    parts.push({ text: match[1], bold: true })
    lastIndex = regex.lastIndex
  }

  // Add remaining text
  if (lastIndex < html.length) {
    parts.push({ text: html.slice(lastIndex) })
  }

  return parts.length === 1 && !parts[0].bold
    ? textBlock(parts[0].text)
    : boldTextBlock(parts)
}

async function seedFaqPage() {
  console.log('Seeding FAQ Page...')

  await client.createOrReplace({
    _id: 'faqPage',
    _type: 'faqPage',
    title: i18nString(
      'Frequently asked questions',
      'よくある質問',
      'Foire aux questions'
    ),
    description: i18nText(
      "Here you'll find the key information to make the most of your stay. If you don't see your question here, please contact us via the inquiry form or by phone.",
      '滞在を最大限に楽しむための重要な情報をまとめました。ご質問が見つからない場合は、問い合わせフォームまたはお電話でお問い合わせください。',
      "Découvrez ici les informations essentielles pour profiter pleinement de votre séjour. Si votre question n'y figure pas, contactez-nous via le formulaire ou par téléphone."
    ),
    contactTitle: i18nString(
      'Still have questions?',
      'まだご不明な点がありますか？',
      "Vous avez d'autres questions ?"
    ),
    contactDescription: i18nText(
      'If you have questions, feel free to reach us by email or phone. We may not be able to answer calls at certain times.',
      'ご質問がある場合は、メールまたはお電話でお気軽にお問い合わせください。時間帯によってお電話に出れない場合もありますのであらかじめご了承ください。',
      "Si vous avez des questions, contactez-nous par e-mail ou par téléphone. Selon l'heure, il se peut que nous ne puissions pas répondre au téléphone."
    ),
    items: [
      {
        _key: 'curfew',
        _type: 'faqItem',
        question: i18nString(
          'Is there a curfew?',
          '門限はありますか？',
          'Y a-t-il un couvre-feu ?'
        ),
        answer: i18nPortableText(
          [
            textBlock(
              'There is no curfew in any house; please keep noise low in the early mornings and late evenings.'
            )
          ],
          [
            textBlock(
              'どのハウスにも門限はありません。早朝や深夜は静かにお過ごしください。'
            )
          ],
          [
            textBlock(
              "Il n'y a pas de couvre-feu dans aucune maison ; merci de limiter le bruit tôt le matin et tard le soir."
            )
          ]
        )
      },
      {
        _key: 'room_occupancy',
        _type: 'faqItem',
        question: i18nString(
          'Up to how many people can stay in a room?',
          '1部屋に何人まで滞在できますか？',
          'Combien de personnes peuvent séjourner dans une chambre ?'
        ),
        answer: i18nPortableText(
          [textBlock('All houses accommodate up to 2 guests per room.')],
          [textBlock('すべてのハウスで1部屋につき最大2名まで滞在できます。')],
          [
            textBlock(
              "Toutes les maisons peuvent accueillir jusqu'à 2 personnes par chambre."
            )
          ]
        )
      },
      {
        _key: 'manager',
        _type: 'faqItem',
        question: i18nString(
          'Is there a manager in residence?',
          '管理人は常駐していますか？',
          'Y a-t-il un responsable sur place ?'
        ),
        answer: i18nPortableText(
          [
            parseHtmlToBlock(
              '<strong>Orange House</strong> has an on-site manager, while <strong>Lemon House</strong> and <strong>Apple House</strong> do not.'
            )
          ],
          [
            parseHtmlToBlock(
              '<strong>オレンジハウス</strong>には常駐管理人がいますが、<strong>レモンハウス</strong>と<strong>アップルハウス</strong>にはいません。'
            )
          ],
          [
            parseHtmlToBlock(
              "<strong>Orange House</strong> dispose d'un responsable sur place. <strong>Lemon House</strong> et <strong>Apple House</strong> n'en ont pas."
            )
          ]
        )
      },
      {
        _key: 'move_in',
        _type: 'faqItem',
        question: i18nString(
          'What do I need when I move in?',
          '入居時に必要なものは？',
          'Que dois-je apporter lors de mon emménagement ?'
        ),
        answer: i18nPortableText(
          [
            textBlock(
              'Each house requires you to bring consumables and a valid ID.'
            )
          ],
          [
            textBlock(
              '各ハウスでは消耗品と有効な身分証明書をご持参ください。'
            )
          ],
          [
            textBlock(
              "Chaque maison nécessite que vous apportiez des consommables et une pièce d'identité valide."
            )
          ]
        )
      },
      {
        _key: 'rent_due',
        _type: 'faqItem',
        question: i18nString(
          'When do I need to pay the rent every month?',
          '毎月いつ家賃を支払えばいいですか？',
          'Quand dois-je payer le loyer chaque mois ?'
        ),
        answer: i18nPortableText(
          [
            parseHtmlToBlock(
              '<strong>Orange House</strong> rent is due by the 10th of each month, while <strong>Lemon House</strong> and <strong>Apple House</strong> pay on the calendar day that matches their move-in date. For example, if you move in on the 23rd, rent is due every 23rd.'
            )
          ],
          [
            parseHtmlToBlock(
              '<strong>オレンジハウス</strong>の家賃は毎月10日までにお支払いください。<strong>レモンハウス</strong>と<strong>アップルハウス</strong>は入居日と同じ日付が毎月の支払期日になります。例えば23日に入居した場合、毎月23日が支払日です。'
            )
          ],
          [
            parseHtmlToBlock(
              'Le loyer de <strong>Orange House</strong> est dû le 10 de chaque mois, tandis que <strong>Lemon House</strong> et <strong>Apple House</strong> paient le jour du mois correspondant à leur date d\'emménagement. Par exemple, si vous emménagez le 23, le loyer est dû chaque 23.'
            )
          ]
        )
      }
    ]
  })

  console.log('  Done!')
}

async function seedContactPage() {
  console.log('Seeding Contact Page...')

  await client.createOrReplace({
    _id: 'contactPage',
    _type: 'contactPage',
    title: i18nString('Get in touch', 'お問い合わせ', 'Entrer en contact'),
    description: i18nText(
      "Reach us via the contact form or by phone. We'll reply as quickly as possible.",
      'お問い合わせフォーム、お電話で受け付けております。ご連絡をいただきましたらできるだけ早くお返事いたします。',
      'Nous recevons vos demandes via le formulaire de contact ou par téléphone. Dès réception, nous vous répondrons au plus vite.'
    ),
    contactTypes: [
      {
        _key: 'tour',
        _type: 'contactType',
        key: 'tour',
        title: i18nString(
          'Tour Request',
          '見学のご依頼',
          'Demande de visite'
        ),
        description: i18nText(
          'Schedule a visit to see our share houses in person.',
          'シェアハウスの見学をご予約ください。',
          'Planifiez une visite pour voir nos maisons en personne.'
        )
      },
      {
        _key: 'move-in',
        _type: 'contactType',
        key: 'move-in',
        title: i18nString(
          'Move-in Inquiry',
          '入居のお問い合わせ',
          "Demande d'emménagement"
        ),
        description: i18nText(
          'Ask about availability, pricing, and move-in procedures.',
          '空室状況、料金、入居手続きについてお問い合わせください。',
          "Renseignez-vous sur la disponibilité, les tarifs et les procédures d'emménagement."
        )
      },
      {
        _key: 'general',
        _type: 'contactType',
        key: 'general',
        title: i18nString(
          'General Inquiry',
          '一般的なお問い合わせ',
          'Demande générale'
        ),
        description: i18nText(
          "Any other questions or feedback you'd like to share.",
          'その他のご質問やご意見をお聞かせください。',
          'Toute autre question ou commentaire que vous souhaitez partager.'
        )
      }
    ]
  })

  console.log('  Done!')
}

async function seedSettings() {
  console.log('Seeding Settings...')

  await client.createOrReplace({
    _id: 'settings',
    _type: 'settings',
    brandName: i18nString(
      'Guest House Osaka',
      'ゲストハウス大阪',
      'Guest House Osaka'
    ),
    companyName: i18nString(
      'Animo Kikaku Co., Ltd.',
      '株式会社アニモ企画',
      'Animo Kikaku Co., Ltd.'
    ),
    socialLinks: [
      {
        _key: 'facebook',
        _type: 'socialLink',
        platform: 'facebook',
        url: 'https://www.facebook.com/guesthouseosaka'
      },
      {
        _key: 'instagram',
        _type: 'socialLink',
        platform: 'instagram',
        url: 'https://www.instagram.com/guesthouseosaka'
      }
    ]
  })

  console.log('  Done!')
}

async function main() {
  console.log('Seeding singleton content...')
  console.log(`Project: ${PROJECT_ID}`)
  console.log(`Dataset: ${DATASET}`)

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error(
      '\nError: SANITY_API_WRITE_TOKEN environment variable is required'
    )
    process.exit(1)
  }

  await seedFaqPage()
  await seedContactPage()
  await seedSettings()

  console.log('\nAll done!')
}

main().catch(console.error)
