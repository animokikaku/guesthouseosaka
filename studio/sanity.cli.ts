/**
 * The Sanity CLI's configuration, for `sanity dev`, `deploy` and `typegen` in
 * this folder (see the scripts in package.json).
 * @see https://www.sanity.io/docs/cli
 **/
import { fileURLToPath } from 'node:url'
import { defineCliConfig } from 'sanity/cli'
import { mergeConfig } from 'vite'
import { SANITY_PROJECT_ID, SANITY_STUDIO_HOSTS } from '../lib/config'

/** The repository root: `@/` in imports, and where `.env` lives. */
const root = fileURLToPath(new URL('..', import.meta.url))

const dataset = process.env.VITE_SANITY_DATASET === 'production' ? 'production' : 'development'

/** The Sanity application of each hosted Studio, so `sanity deploy` never asks for one. */
const studioAppIds = {
  production: 'gntlcvsmiwihcdn4q5lc2iei',
  development: 'il6rzjk5xwzp7wp01q1gg784'
}

export default defineCliConfig({
  api: { projectId: SANITY_PROJECT_ID, dataset },
  // `sanity deploy` publishes to the Studio of the dataset it builds for.
  studioHost: SANITY_STUDIO_HOSTS[dataset],
  // Auto-updates load the `sanity` package from Sanity's CDN, so a version bump needs no deploy.
  // Each Studio's update channel is set in sanity.io/manage → Studios.
  deployment: { appId: studioAppIds[dataset], autoUpdates: true },
  // The Studio exposes `SANITY_STUDIO_*` by default; `lib/env.ts` reads `VITE_*`,
  // from the site's `.env`.
  vite: (config) =>
    mergeConfig(config, { envPrefix: ['VITE_'], envDir: root, resolve: { alias: { '@': root } } }),
  // The site's queries, typed against this schema (`bun run typegen`).
  typegen: {
    path: [
      '../{app,components,lib,sanity}/**/*.{ts,tsx}',
      '!../**/__tests__/**',
      '!../**/*.test.{ts,tsx}'
    ],
    schema: '../schema.json',
    generates: '../sanity.types.ts',
    overloadClientMethods: true
  }
})
