import {
  BuildingIcon,
  GalleryHorizontal,
  HelpCircleIcon,
  HomeIcon,
  ImagesIcon,
  MailIcon
} from 'lucide-react'
import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('homePage').title('Home Page').icon(HomeIcon),
      S.documentTypeListItem('housePage')
        .title('House Page')
        .icon(BuildingIcon),
      S.documentTypeListItem('faqPage').title('FAQ Page').icon(HelpCircleIcon),
      S.documentTypeListItem('contactPage')
        .title('Contact Page')
        .icon(MailIcon),
      S.divider(),
      S.documentTypeListItem('galleryWall').title('Gallery Wall').icon(ImagesIcon),
      S.documentTypeListItem('collection')
        .title('Collection')
        .icon(GalleryHorizontal),
      S.documentTypeListItem('house').title('House').icon(BuildingIcon)
    ])
