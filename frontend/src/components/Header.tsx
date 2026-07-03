import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LanguageSelector from './LanguageSelector'
import { useAuth } from '../contexts/AuthContext'
import { useI18nStore } from '../stores/i18nStore'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { t } = useI18nStore()

  const PUBLIC_LINKS = [
    { to: '/#features', label: t.nav.features },
    { to: '/#pricing', label: t.nav.pricing },
    { to: '/register', label: t.nav.register },
  ]

  const AUTH_LINKS = [
    { to: '/#features', label: t.nav.features },
    { to: '/#pricing', label: t.nav.pricing },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 h-16">
      <div className="h-full px-xl flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <img alt="KanbanCareer Logo" className="h-8 w-auto" src="/logo.png" />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {(user ? AUTH_LINKS : PUBLIC_LINKS).map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container-low rounded-lg px-3 py-2"
            >
              {link.label}
            </Link>
          ))}
          <LanguageSelector />
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container-low rounded-lg px-3 py-2"
              >
                {t.nav.profile}
              </Link>
              <button
                onClick={handleLogout}
                className="ml-2 font-label-md text-label-md text-on-surface-variant border border-outline-variant rounded-lg px-4 py-2 hover:bg-surface-container-low transition-colors active:scale-95"
              >
                {t.nav.logout}
              </button>
            </>
          ) : (
            <Link
              to="/register"
              className="ml-2 bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-all shadow-sm active:scale-95"
            >
              {t.nav.register}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSelector />
          <button
            className="text-on-surface-variant p-2 hover:bg-surface-container-low rounded-lg transition-colors"
            onClick={() => setMobileOpen(prev => !prev)}
            aria-label={t.nav.menu}
          >
            <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="absolute top-16 inset-x-0 bg-surface border-b border-outline-variant/30 shadow-lg md:hidden">
          <div className="flex flex-col p-md gap-sm">
            {(user ? AUTH_LINKS : PUBLIC_LINKS).map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="font-label-md text-label-md text-on-surface-variant hover:text-primary px-3 py-2 rounded-lg hover:bg-surface-container-low"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="font-label-md text-label-md text-on-surface-variant hover:text-primary px-3 py-2 rounded-lg hover:bg-surface-container-low"
                  onClick={() => setMobileOpen(false)}
                >
                  {t.nav.profile}
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false) }}
                  className="w-full font-label-md text-label-md text-on-surface-variant border border-outline-variant rounded-lg px-4 py-2 hover:bg-surface-container-low transition-colors"
                >
                  {t.nav.logout}
                </button>
              </>
            ) : (
              <Link
                to="/register"
                className="bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg text-center"
                onClick={() => setMobileOpen(false)}
              >
                {t.nav.register}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
