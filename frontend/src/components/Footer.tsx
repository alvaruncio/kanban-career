import { Link } from 'react-router-dom'
import { useI18nStore } from '../stores/i18nStore'

export default function Footer() {
  const { t } = useI18nStore()

  const FOOTER_LINKS = [
    { to: '/#features', label: t.nav.features },
    { to: '/#pricing', label: t.nav.pricing },
    { to: '/privacy', label: t.footer.privacy },
    { to: '/terms', label: t.footer.terms },
    { to: '/support', label: t.footer.support },
  ]

  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-gutter py-xl flex flex-col md:flex-row justify-between items-center gap-lg">
        <div className="flex items-center gap-2">
          <span className="font-headline-md text-headline-md font-bold text-primary">KanbanCareer</span>
        </div>
        <div className="flex flex-wrap justify-center gap-x-lg gap-y-sm font-label-sm text-label-sm">
          {FOOTER_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="text-on-surface-variant hover:text-primary hover:underline transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">&copy; 2026 KanbanCareer. {t.footer.copyright}</p>
      </div>
    </footer>
  )
}
