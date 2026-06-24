import { useState, useRef, useEffect } from 'react'
import { useI18nStore } from '../stores/i18nStore'
import type { Locale } from '../locales/types'

const FLAGS: Record<Locale, string> = {
  es: '🇪🇸',
  en: '🇬🇧',
}

export default function LanguageSelector() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { locale, setLocale, t } = useI18nStore()

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const options: Locale[] = ['es', 'en']

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all font-label-sm text-label-sm"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t.language[locale]}
      >
        <span className="text-base leading-none">{FLAGS[locale]}</span>
        <span className="hidden sm:inline">{t.language[locale]}</span>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 min-w-[140px] bg-surface-container-lowest border border-outline-variant rounded-lg shadow-md z-50 overflow-hidden"
          role="listbox"
        >
          {options.map(loc => (
            <button
              key={loc}
              onClick={() => {
                setLocale(loc)
                setOpen(false)
              }}
              className={`flex items-center gap-2 w-full px-3 py-2 font-label-sm text-label-sm transition-colors ${
                loc === locale
                  ? 'bg-primary-container/20 text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
              role="option"
              aria-selected={loc === locale}
            >
              <span className="text-base leading-none">{FLAGS[loc]}</span>
              {t.language[loc]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
