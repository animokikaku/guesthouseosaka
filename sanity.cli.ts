/**
 * This configuration file lets you run `$ sanity [command]` in this folder
 * Go to https://www.sanity.io/docs/cli to learn more.
 **/
import { defineCliConfig } from 'sanity/cli'
import { mergeConfig } from 'vite'
import { SANITY_PROJECT_ID, SANITY_STUDIO_HOSTS } from './lib/config'

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
  // The Studio exposes `SANITY_STUDIO_*` by default; `lib/env.ts` reads `VITE_*`.
  vite: (config) => mergeConfig(config, { envPrefix: ['VITE_'] }),
  typegen: {
    path: [
      './**/*.{ts,tsx,js,jsx}',
      '!node_modules',
      '!.sanity',
      '!.tanstack',
      '!.wrangler',
      '!dist',
      '!**/__tests__/**',
      '!**/*.test.{ts,tsx,js,jsx}',
      '!**/*.spec.{ts,tsx,js,jsx}'
    ], // glob pattern to your typescript files. Can also be an array of paths
    schema: './schema.json', // path to your schema file, generated with 'sanity schema extract' command
    generates: './sanity.types.ts', // path to the output file for generated type definitions
    overloadClientMethods: true // set to false to disable automatic overloading the sanity client
  }
})
