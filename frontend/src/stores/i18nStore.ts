import { create } from 'zustand'
import type { Locale, Translation } from '../locales/types'
import es from '../locales/es'
import en from '../locales/en'

const translations: Record<Locale, Translation> = { es, en }

interface I18nState {
  locale: Locale
  t: Translation
  setLocale: (locale: Locale) => void
}

const getInitialLocale = (): Locale => {
  const stored = localStorage.getItem('locale')
  if (stored === 'es' || stored === 'en') return stored
  return 'es'
}

export const useI18nStore = create<I18nState>((set) => ({
  locale: getInitialLocale(),
  t: translations[getInitialLocale()],
  setLocale: (locale: Locale) => {
    localStorage.setItem('locale', locale)
    set({ locale, t: translations[locale] })
  },
}))
