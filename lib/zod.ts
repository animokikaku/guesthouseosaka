import { en } from 'zod/locales'
import * as z from 'zod/mini'

// zod/mini ships without default error messages; keep the same English defaults as zod.
z.config(en())

export { z }
