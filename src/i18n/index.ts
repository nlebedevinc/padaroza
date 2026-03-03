import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en'
import ru from './locales/ru'

// Side-effect import to register the TypeScript augmentation
import './types'

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'ru'],
    // LanguageDetector order: localStorage → browser navigator → fallback
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'padaroza:lang',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false, // React escapes by default
    },
  })

export default i18next
