import type { ContactFormFields } from '@/lib/schemas/contact-form'
import { HouseIdentifier } from '@/lib/types'
import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from 'react-email'

/** Formats the form's `YYYY-MM-DD` value, which `Date` parses as UTC midnight. */
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  })
}

const formatPlaces = (places: HouseIdentifier[]) => {
  const placeNames: Record<HouseIdentifier, string> = {
    apple: 'アップルハウス',
    lemon: 'レモンハウス',
    orange: 'オレンジハウス'
  }
  return places.map((place) => placeNames[place]).join(', ')
}

// --- Tour Request Email ---

interface TourRequestEmailProps {
  data: Pick<ContactFormFields, 'places' | 'date' | 'hour' | 'account' | 'message'>
}

export function TourRequestEmail({ data }: TourRequestEmailProps) {
  return (
    <InquiryEmail
      preview="Guesthouse Osakaから新しい内覧希望が届きました"
      heading="内覧希望"
      data={data}
    >
      <Text style={text}>
        <strong>希望日時:</strong> {formatDate(data.date)} {data.hour}
      </Text>
    </InquiryEmail>
  )
}

// --- Move-in Request Email ---

interface MoveInRequestEmailProps {
  data: Pick<ContactFormFields, 'places' | 'date' | 'stayDuration' | 'account' | 'message'>
}

const stayDurationLabels: Record<ContactFormFields['stayDuration'], string> = {
  '1-month': '1ヶ月以上',
  '3-months': '3ヶ月以上',
  'long-term': '長期'
}

export function MoveInRequestEmail({ data }: MoveInRequestEmailProps) {
  return (
    <InquiryEmail
      preview="Guesthouse Osakaから新しい入居希望が届きました"
      heading="入居希望"
      data={data}
    >
      <Text style={text}>
        <strong>希望日:</strong> {formatDate(data.date)}
      </Text>
      <Text style={text}>
        <strong>滞在期間:</strong> {stayDurationLabels[data.stayDuration]}
      </Text>
    </InquiryEmail>
  )
}

// --- General Inquiry Email ---

interface GeneralInquiryEmailProps {
  data: Pick<ContactFormFields, 'places' | 'account' | 'message'>
}

export function GeneralInquiryEmail({ data }: GeneralInquiryEmailProps) {
  return (
    <InquiryEmail
      preview="Guesthouse Osakaから新しいお問い合わせが届きました"
      heading="お問い合わせ"
      data={data}
    />
  )
}

// --- Shared Components ---

/** Every inquiry email: the sender's details, their chosen houses, any form-specific lines, then the message. */
function InquiryEmail({
  preview,
  heading,
  data: { account, places, message },
  children
}: {
  preview: string
  heading: string
  data: Pick<ContactFormFields, 'places' | 'account' | 'message'>
  children?: React.ReactNode
}) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{heading}</Heading>
          <AccountDetails account={account} />
          <Hr style={hr} />
          <Text style={text}>
            <strong>希望物件:</strong> {formatPlaces(places)}
          </Text>
          {children}
          <Hr style={hr} />
          <MessageSection message={message} />
        </Container>
      </Body>
    </Html>
  )
}

function AccountDetails({ account }: { account: ContactFormFields['account'] }) {
  return (
    <>
      <Text style={text}>
        <strong>名前:</strong> {account.name}
      </Text>
      <Text style={text}>
        <strong>メールアドレス:</strong> {account.email}
      </Text>
      {account.phone && (
        <Text style={text}>
          <strong>電話番号:</strong> {account.phone}
        </Text>
      )}
      <Text style={text}>
        <strong>国籍:</strong> {account.nationality}
      </Text>
      <Text style={text}>
        <strong>性別:</strong> {account.gender === 'male' ? '男性' : '女性'}
      </Text>
      <Text style={text}>
        <strong>年齢:</strong> {account.age}
      </Text>
    </>
  )
}

function MessageSection({ message }: { message: string }) {
  return (
    <Section>
      <Heading as="h2" style={h2}>
        メッセージ
      </Heading>
      <Text style={paragraph}>{message}</Text>
    </Section>
  )
}

// --- Styles ---

const main = {
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px'
}

const h1 = {
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  color: '#1a1a1a'
}

const h2 = {
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '20px 0',
  padding: '0',
  color: '#1a1a1a'
}

const text = {
  fontSize: '16px',
  margin: '10px 0',
  color: '#333'
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#333'
}

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0'
}
