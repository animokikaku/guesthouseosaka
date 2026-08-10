import { CategoryGrid } from '@/components/gallery/gallery-category-grid'
import { type GalleryCategory } from '@/lib/gallery'

type DataAttributeFn = (path: string) => string

type HouseGalleryProps = {
  categories: GalleryCategory[]
  /** Data attribute helper for Sanity visual editing */
  dataAttribute?: DataAttributeFn
}

export function HouseGallery({ categories, dataAttribute }: HouseGalleryProps) {
  if (categories.length === 0) {
    return null
  }

  return (
    // The first section sits flush with the top so jumping to it leaves nothing
    // to scroll back up to.
    <div className="pb-10 [&>section:first-child>h3]:pt-0">
      {categories.map((category) => (
        <CategoryGrid
          key={`grid-${category._id}`}
          category={category}
          dataAttribute={dataAttribute}
        />
      ))}
    </div>
  )
}
