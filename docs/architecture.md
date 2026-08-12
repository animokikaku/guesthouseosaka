# Architecture & Project Structure

## Directory Layout

```
app/
├── [locale]/          # Locale-based routing (en, ja, fr)
├── studio/            # Embedded Sanity Studio at /studio
└── layout.tsx         # Root layout with shared wrappers

components/
├── ui/                # BaseUI shadcn primitives
├── house/             # House/room feature components
├── gallery/           # Gallery components
├── forms/             # Forms with @tanstack/react-form + Zod
└── map/               # Map components

sanity/
├── schemaTypes/       # Document and block type definitions
└── lib/queries.ts     # GROQ queries using defineQuery()

messages/              # Translation JSON files (en.json, ja.json, fr.json)
lib/                   # Shared utilities and config
hooks/                 # Custom React hooks
public/                # Static assets only
```

## Key Patterns

### Routing

- All pages under `app/[locale]/` with `generateStaticParams()` for static generation
- Route folders use kebab-case

### Components

- Named exports for reusable components
- UI primitives in `components/ui/`, feature components grouped by domain

### Forms

- Built with `@tanstack/react-form` v2 and Zod validation
- `forms/app-form.tsx` registers the field components with `createFormHook`, so
  `form.Field` render props expose them typed against the field's value
- Schemas run as form-level validators (`validators: [{ run: schema, triggers: [] }]`),
  which validate on submit and route errors to the matching fields
- Sections reused across forms are field groups created with `defineAppFieldGroup`,
  bound to concrete paths by the caller

### Environment

- Type-safe env via `@t3-oss/env-nextjs` in `lib/env.ts`
- Server: `SANITY_API_READ_TOKEN`, `RESEND_API_KEY`
- Client: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_BLOB_STORAGE_URL`
