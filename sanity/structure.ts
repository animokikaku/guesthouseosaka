import { BuildingIcon, HomeIcon } from 'lucide-react'
import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('homePage').title('Home Page').icon(HomeIcon),
      S.divider(),
      S.documentTypeListItem('house').title('House').icon(BuildingIcon)
    ])
