import { FAQContactTable } from '@/app/[locale]/faq/(components)/faq-contact-table'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import type {
  FaqPageQueryResult,
  HousesBuildingQueryResult
} from '@/sanity.types'
import { PortableText, type PortableTextComponents } from '@portabletext/react'

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="text-2xl font-bold">{children}</h2>,
    normal: ({ children }) => (
      <p className="text-muted-foreground text-md">{children}</p>
    )
  }
}

type FAQCardProps = {
  contactSection?: NonNullable<FaqPageQueryResult>['contactSection'] | null
  contactNote?: NonNullable<FaqPageQueryResult>['contactNote'] | null
  houses: NonNullable<HousesBuildingQueryResult>
}

export default function FAQCard({
  contactSection,
  contactNote,
  houses
}: FAQCardProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        {contactSection && (
          <PortableText value={contactSection} components={components} />
        )}
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <FAQContactTable houses={houses} />
        </div>
      </CardContent>
      {contactNote && (
        <CardFooter className="flex items-center justify-center">
          <div className="text-muted-foreground text-sm">{contactNote}</div>
        </CardFooter>
      )}
    </Card>
  )
}
