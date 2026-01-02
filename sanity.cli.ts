/**
 * This configuration file lets you run `$ sanity [command]` in this folder
 * Go to https://www.sanity.io/docs/cli to learn more.
 **/
import { defineCliConfig } from 'sanity/cli'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '515wijoz'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'development'

export default defineCliConfig({
  api: {
    projectId,
    dataset
  },
  typegen: {
    path: [
      './**/*.{ts,tsx,js,jsx}',
      '!node_modules',
      '!.next',
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
