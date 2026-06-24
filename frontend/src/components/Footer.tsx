import { Link } from 'react-router-dom'

const FOOTER_LINKS = [
  { to: '/#features', label: 'Características' },
  { to: '/#pricing', label: 'Precios' },
  { to: '/privacy', label: 'Privacidad' },
  { to: '/terms', label: 'Términos' },
  { to: '/support', label: 'Soporte' },
]

export default function Footer() {
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
        <p className="font-body-sm text-body-sm text-on-surface-variant">&copy; 2026 KanbanCareer. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}
