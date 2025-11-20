import { ContactFormFields } from '@/components/forms/schema'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text
} from '@react-email/components'

// Helper for date formatting
const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// --- Tour Request Email ---

interface TourRequestEmailProps {
  data: Pick<
    ContactFormFields,
    'places' | 'date' | 'hour' | 'account' | 'message'
  >
}

export function TourRequestEmail({ data }: TourRequestEmailProps) {
  const { account, message, places, date, hour } = data

  return (
    <Html>
      <Head />
      <Preview>Guesthouse Osakaから新しい内覧希望が届きました</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>内覧希望</Heading>
          <AccountDetails account={account} />
          <Hr style={hr} />
          <Text style={text}>
            <strong>希望物件:</strong> {places.join(', ')}
          </Text>
          <Text style={text}>
            <strong>希望日時:</strong> {formatDate(date)} {hour}
          </Text>
          <Hr style={hr} />
          <MessageSection message={message} />
        </Container>
      </Body>
    </Html>
  )
}

// --- Move-in Request Email ---

interface MoveInRequestEmailProps {
  data: Pick<
    ContactFormFields,
    'places' | 'date' | 'stayDuration' | 'account' | 'message'
  >
}

export function MoveInRequestEmail({ data }: MoveInRequestEmailProps) {
  const { account, message, places, date, stayDuration } = data

  const stayDurationLabel = {
    '1-month': '1ヶ月以上',
    '3-months': '3ヶ月以上',
    'long-term': '長期'
  }[stayDuration]

  return (
    <Html>
      <Head />
      <Preview>Guesthouse Osakaから新しい入居希望が届きました</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>入居希望</Heading>
          <AccountDetails account={account} />
          <Hr style={hr} />
          <Text style={text}>
            <strong>希望物件:</strong> {places.join(', ')}
          </Text>
          <Text style={text}>
            <strong>希望日:</strong> {formatDate(date)}
          </Text>
          <Text style={text}>
            <strong>滞在期間:</strong> {stayDurationLabel}
          </Text>
          <Hr style={hr} />
          <MessageSection message={message} />
        </Container>
      </Body>
    </Html>
  )
}

// --- General Inquiry Email ---

interface GeneralInquiryEmailProps {
  data: {
    account: Pick<ContactFormFields['account'], 'name' | 'email'>
    message: string
  }
}

export function GeneralInquiryEmail({ data }: GeneralInquiryEmailProps) {
  const { account, message } = data

  return (
    <Html>
      <Head />
      <Preview>Guesthouse Osakaから新しいお問い合わせが届きました</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>お問い合わせ</Heading>
          <Text style={text}>
            <strong>名前:</strong> {account.name}
          </Text>
          <Text style={text}>
            <strong>メールアドレス:</strong> {account.email}
          </Text>
          <Hr style={hr} />
          <MessageSection message={message} />
        </Container>
      </Body>
    </Html>
  )
}

// --- Shared Components ---

function AccountDetails({
  account
}: {
  account: ContactFormFields['account']
}) {
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
