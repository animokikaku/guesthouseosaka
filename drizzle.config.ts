import { defineConfig } from 'drizzle-kit'

// `bun run db:generate` writes a migration for a change to db/schema.ts. Add
// `STRICT` to its tables by hand (see the note in that file).
export default defineConfig({
  dialect: 'sqlite',
  schema: './db/schema.ts',
  out: './db/migrations',
  migrations: { prefix: 'timestamp' }
})
