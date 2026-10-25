/**
 * This configuration file lets you run `$ sanity [command]` in this folder
 * Go to https://www.sanity.io/docs/cli to learn more.
 **/
import { defineCliConfig } from 'sanity/cli'
import { mergeConfig } from 'vite'

const projectId = process.env.VITE_SANITY_PROJECT_ID || '515wijoz'
const dataset = process.env.VITE_SANITY_DATASET || 'development'

export default defineCliConfig({
  api: { projectId, dataset },
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
