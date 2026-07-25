import { Link, useLocation } from 'react-router-dom'
import { useI18nStore } from '../../stores'
import { Header } from '../../components'
import type { DashboardLayoutProps } from '../../interfaces'

const SIDEBAR_LINKS = [
  { to: '/dashboard', labelKey: 'dashboard' as const, icon: 'dashboard' },
  { to: '/kanban', labelKey: 'kanban' as const, icon: 'view_column' },
  { to: '/applications', labelKey: 'applications' as const, icon: 'description' },
  { to: '/companies', labelKey: 'companies' as const, icon: 'business' },
  { to: '/profile', labelKey: 'profile' as const, icon: 'person' },
] as const

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { t } = useI18nStore()
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
                    ? 'bg-primary-container text-on-primary-container border-l-4 border-primary pl-[calc(0.75rem-4px)]'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface border-l-4 border-transparent pl-3'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{link.icon}</span>
                {t.nav[link.labelKey]}
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
