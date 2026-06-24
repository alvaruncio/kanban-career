import { useI18nStore } from '../stores/i18nStore'

export default function DashboardPage() {
  const { t } = useI18nStore()

  const stats = [
    { label: t.dashboard.activeApplications, value: '12', color: 'bg-primary' },
    { label: t.dashboard.pendingInterviews, value: '4', color: 'bg-secondary' },
    { label: t.dashboard.offersReceived, value: '2', color: 'bg-tertiary' },
    { label: t.dashboard.responseRate, value: '68%', color: 'bg-primary-container' },
  ]

  return (
    <div className="space-y-lg">
      <h1 className="font-headline-lg text-headline-lg text-on-surface">{t.dashboard.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
        {stats.map(stat => (
          <div key={stat.label} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm">
            <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-sm`}>
              <span className="text-on-primary font-label-md text-label-md">{stat.value}</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{stat.label}</p>
          </div>
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
  )
}
