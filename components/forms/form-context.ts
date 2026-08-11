'use client'

import { createFormHook } from '@tanstack/react-form'

/**
 * Form components registered with `createFormHook` read the surrounding form
 * through a module-level context, so a component-less hook instance is enough
 * to expose `useFormContext` without importing the app form hook itself.
 */
export const { useFormContext } = createFormHook({
  fieldComponents: {},
  formComponents: {}
})
