import { useI18nStore } from '../stores/i18nStore'
import { usePageMeta } from '../hooks/usePageMeta'
import StatCard from '../components/StatCard'

const STATS_CONFIG = [
  { value: '12', color: 'bg-primary', labelKey: 'activeApplications' as const },
  { value: '4', color: 'bg-secondary', labelKey: 'pendingInterviews' as const },
  { value: '2', color: 'bg-tertiary', labelKey: 'offersReceived' as const },
  { value: '68%', color: 'bg-primary-container', labelKey: 'responseRate' as const },
]

export default function DashboardPage() {
  const pageMeta = usePageMeta('Dashboard', 'Panel de control con el resumen de tus candidaturas activas y entrevistas.')
  const { t } = useI18nStore()

  const stats = STATS_CONFIG.map(stat => ({
    ...stat,
    label: t.dashboard[stat.labelKey],
  }))

  return (
    <>
      {pageMeta}
      <div className="space-y-lg">
      <h1 className="font-headline-lg text-headline-lg text-on-surface">{t.dashboard.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
        {stats.map(stat => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} color={stat.color} />
        ))}
      </div>
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-md">{t.dashboard.upcomingInterviews}</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">{t.dashboard.noInterviews}</p>
      </div>
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-md">{t.dashboard.recentActivity}</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">{t.dashboard.activityDescription}</p>
      </div>
    </div>
    </>
  )
}
