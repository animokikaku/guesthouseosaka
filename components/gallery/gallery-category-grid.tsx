import { GalleryGridItem } from '@/components/gallery/gallery-grid-item'
import type { GalleryCategory } from '@/lib/gallery'

type DataAttributeFn = (path: string) => string

type CategoryGridProps = {
  category: GalleryCategory
  dataAttribute?: DataAttributeFn
}

export function CategoryGrid({ category, dataAttribute }: CategoryGridProps) {
  if (category.items.length === 0) return null

  return (
    <div
      id={category._id}
      className="scroll-mt-3 space-y-4"
      data-sanity={dataAttribute?.(
        `galleryCategories[_key=="${category._key}"]`
      )}
    >
      <h3 className="text-xl font-semibold">{category.label}</h3>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {category.items.map((item) => (
          <GalleryGridItem
            key={item._key}
            item={item}
            categoryKey={category._key}
            dataAttribute={dataAttribute}
          />
        ))}
      </div>
    </div>
  )
}
