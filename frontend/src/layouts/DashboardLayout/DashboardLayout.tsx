import { Link, useLocation } from 'react-router-dom'
import { Header } from '../../components'
import type { DashboardLayoutProps } from '../../interfaces'

const SIDEBAR_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/kanban', label: 'Kanban', icon: 'view_column' },
  { to: '/applications', label: 'Candidaturas', icon: 'description' },
  { to: '/companies', label: 'Empresas', icon: 'business' },
  { to: '/profile', label: 'Perfil', icon: 'person' },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body-md antialiased overflow-x-hidden">
      <Header />
      <div className="flex pt-16">
        <aside className="hidden md:flex flex-col w-60 border-r border-outline-variant/30 bg-surface-container-low min-h-[calc(100vh-4rem)] p-md gap-xs">
          {SIDEBAR_LINKS.map(link => {
            const isActive = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-label-md text-label-md ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{link.icon}</span>
                {link.label}
              </Link>
            )
          })}
        </aside>
        <main className="flex-1 p-lg">
          {children}
        </main>
      </div>
    </div>
  )
}