import { useState } from 'react'
import { Link } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/#features', label: 'Características' },
  { to: '/#pricing', label: 'Precios' },
  { to: '/login', label: 'Iniciar sesión' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 h-16">
      <div className="h-full px-xl flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <img alt="KanbanCareer Logo" className="h-8 w-auto" src="/logo.png" />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container-low rounded-lg px-3 py-2"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/register"
            className="ml-2 bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-all shadow-sm active:scale-95"
          >
            Empezar
          </Link>
        </div>

        <button
          className="md:hidden text-on-surface-variant p-2 hover:bg-surface-container-low rounded-lg transition-colors"
          onClick={() => setMobileOpen(prev => !prev)}
          aria-label="Menú"
        >
          <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute top-16 inset-x-0 bg-surface border-b border-outline-variant/30 shadow-lg md:hidden">
          <div className="flex flex-col p-md gap-sm">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="font-label-md text-label-md text-on-surface-variant hover:text-primary px-3 py-2 rounded-lg hover:bg-surface-container-low"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/register"
              className="bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg text-center"
              onClick={() => setMobileOpen(false)}
            >
              Empezar
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
