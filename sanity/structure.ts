import { BuildingIcon, HelpCircleIcon, HomeIcon, MailIcon } from 'lucide-react'
import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Pages')
    .items([
      S.listItem()
        .title('Home')
        .icon(HomeIcon)
        .child(S.document().schemaType('homePage').documentId('homePage')),
      S.documentTypeListItem('housePage').title('House').icon(BuildingIcon),
      S.listItem()
        .title('FAQ')
        .icon(HelpCircleIcon)
        .child(S.document().schemaType('faqPage').documentId('faqPage')),
      S.listItem()
        .title('Contact')
        .icon(MailIcon)
        .child(S.document().schemaType('contactPage').documentId('contactPage'))
    ])
