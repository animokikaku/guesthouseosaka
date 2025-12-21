# Migration Notes: JSON Data to Sanity

This document tracks the data sources that were previously used and need to be migrated to Sanity.

## Gallery Images

### Source Files
- `lib/images/data/apple.json`
- `lib/images/data/lemon.json`
- `lib/images/data/orange.json`

### Data Structure
Each JSON file contains an array of images:
```json
{
  "id": 1,
  "src": "images/apple/1.jpg",
  "width": 1200,
  "height": 800,
  "blurDataURL": "data:image/jpeg;base64,...",
  "category": "room"
}
```

### Migration Target
- Upload images to Sanity asset storage
- Create `galleryImage` entries for each house document
- Assign categories based on `category` field

---

## Image Alt Text (Localized)

### Source File
- `lib/images/labels.ts` - maps image IDs to translation keys

### Translation Keys in `messages/*.json`
Located under `images` namespace. Example keys:
- `apple.room.wood_flooring`
- `apple.room.toilet_shower_and_bathtub`
- `apple.common-spaces.rooftop`
- `lemon.room.free_to_use_all_tablewares`
- `orange.room.all_rooms_set_in_traditional_japanese_style`

### Migration Target
- Add localized `alt` text to each `galleryImage.image.alt` field
- Use `internationalizedArrayString` type

---

## Gallery Categories

### Source
- `lib/images/storage.ts` - `CategoriesValues` array
- `messages/*.json` - `HouseGalleryClient.categories.*` translations

### Category Keys
1. `room` - Room
2. `common-spaces` - Common Spaces
3. `facilities` - Bathroom/Facilities
4. `building-features` - Building Features
5. `neighborhood` - Neighborhood
6. `floor-plan` - Floor Plan
7. `maps` - Maps

### Migration Target
- Create `galleryCategory` documents in Sanity
- Add localized labels (en, ja, fr)
- Set display order

---

## Files to Remove After Migration

Once data is migrated to Sanity, these files can be removed:

### Data Files
- `lib/images/data/apple.json`
- `lib/images/data/lemon.json`
- `lib/images/data/orange.json`

### Code Files (can be removed)
- `lib/images/client.tsx` - old ImagesProvider
- `lib/images/labels.ts` - image label mappings
- `lib/images/server.ts` - server-side image loading
- `lib/images/storage.ts` - HouseImageStorage class
- `lib/images/index.ts` - re-exports (partial cleanup)

### Translation Keys to Remove
From `messages/en.json`, `messages/ja.json`, `messages/fr.json`:
- `images.*` namespace
- `HouseGalleryClient.categories.*` keys

---

## Migration Order

1. **Seed gallery categories** - Create the 7 category documents
2. **Upload images** - Add images to Sanity CDN
3. **Create gallery entries** - For each house, create galleryImage entries with:
   - Image reference
   - Category reference
   - Localized alt text (en, ja, fr)
4. **Verify** - Check all images display correctly
5. **Cleanup** - Remove old files and translation keys
