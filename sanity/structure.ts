import {
  BuildingIcon,
  HelpCircleIcon,
  HomeIcon,
  ImagesIcon,
  MailIcon
} from 'lucide-react'
import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Pages')
    .items([
      S.documentTypeListItem('homePage').title('Home').icon(HomeIcon),
      S.documentTypeListItem('housePage').title('House').icon(BuildingIcon),
      S.listItem()
        .title('FAQ')
        .icon(HelpCircleIcon)
        .child(S.document().schemaType('faqPage').documentId('faqPage')),
      S.listItem()
        .title('Contact')
        .icon(MailIcon)
        .child(
          S.document().schemaType('contactPage').documentId('contactPage')
        ),
      S.divider(),
      S.documentTypeListItem('galleryWall')
        .title('Gallery Wall')
        .icon(ImagesIcon)
    ])
