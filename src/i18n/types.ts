import type en from './locales/en'

// Augment i18next to make t() fully type-safe based on the English locale shape
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: {
      translation: typeof en
    }
  }
}
