import { useState, useEffect } from 'react'
import { useI18nStore } from '../../stores'
import { MetricsService } from '../../services'
import { StatCard, LoadingSkeleton, PageMeta, MonthFilter, DashboardChart } from '../../components'
import type { DashboardMetrics } from '../../interfaces'

const STAT_CARD_CONFIG = [
  { key: 'totalApplications', color: 'bg-primary' },
  { key: 'activeApplications', color: 'bg-secondary' },
  { key: 'pendingInterviews', color: 'bg-tertiary' },
  { key: 'offersReceived', color: 'bg-primary-container' },
  { key: 'responseRate', color: 'bg-secondary-container' },
] as const

const STATUS_BADGE_COLORS: Record<string, string> = {
  APPLIED: 'bg-primary-container text-primary',
  INTERVIEW: 'bg-tertiary-container text-tertiary',
  OFFER: 'bg-secondary-container text-secondary',
  HIRED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
}

function getRelativeTime(dateStr: string, locale: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return locale === 'es' ? 'Hoy' : 'Today'
  if (days === 1) return locale === 'es' ? 'Ayer' : 'Yesterday'
  if (days < 7) return locale === 'es' ? `Hace ${days} días` : `${days} days ago`
  if (days < 30) return locale === 'es' ? 'Hace 1 sem' : '1 week ago'
  return locale === 'es' ? 'Hace 1 mes' : '1 month ago'
}

export default function DashboardPage() {
  const { t, locale } = useI18nStore()
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchMetrics() {
      setLoading(true)
      setError(null)
      try {
        const data = await MetricsService.getDashboard(selectedMonth)
        if (!cancelled) setMetrics(data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : t.dashboard.errorLoading)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchMetrics()
    return () => { cancelled = true }
  }, [selectedMonth, t.dashboard.errorLoading])

  if (loading) return <LoadingSkeleton />

  if (error) {
    return (
      <>
        <PageMeta title="Dashboard" description="Panel de control de métricas" />
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="font-body-md text-body-md text-red-500">{error}</p>
        </div>
      </>
    )
  }

  const months = metrics?.byMonth.map(m => m.month) ?? []

  const statCards = STAT_CARD_CONFIG.map(({ key, color }) => {
    let value: string
    if (key === 'responseRate') {
      value = metrics ? `${metrics.responseRate}%` : '0%'
    } else {
      value = metrics ? String(metrics[key as keyof typeof metrics]) : '0'
    }
    return {
      label: t.dashboard[key],
      value,
      color,
      key,
    }
  })

  const byMonth = metrics?.byMonth.map(m => ({ ...m, Applications: m.count })) ?? []
  const byStatus = metrics?.byStatus.map(s => ({ ...s, Applications: s.count })) ?? []
  const conversionFunnel = metrics?.conversionFunnel.map(c => ({ ...c, Applications: c.count })) ?? []
  const bySource = metrics?.bySource.map(s => ({ ...s, Applications: s.count })) ?? []

  return (
    <>
      <PageMeta title="Dashboard" description={t.dashboard.pageDescription} />
      <div className="space-y-lg">
        <div className="flex items-center justify-between">
          <h1 className="font-headline-lg text-headline-lg text-on-surface">{t.dashboard.title}</h1>
          <MonthFilter months={months} value={selectedMonth} onChange={setSelectedMonth} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-md">
          {statCards.map(stat => (
            <StatCard key={stat.key} label={stat.label} value={stat.value} color={stat.color} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
          <DashboardChart
            title={t.dashboard.monthlyEvolution}
            type="bar"
            data={byMonth}
            dataKey="Applications"
            xAxisKey="month"
          />
          <DashboardChart
            title={t.dashboard.statusDistribution}
            type="donut"
            data={byStatus}
            dataKey="Applications"
            xAxisKey="status"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
          <DashboardChart
            title={t.dashboard.conversionFunnel}
            type="bar"
            data={conversionFunnel}
            dataKey="Applications"
            xAxisKey="stage"
          />
          <DashboardChart
            title={t.dashboard.bySource}
            type="bar"
            data={bySource}
            dataKey="Applications"
            xAxisKey="source"
          />
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-md">{t.dashboard.recentActivity}</h2>
          {metrics && metrics.recentApplications.length > 0 ? (
            <ul className="space-y-sm">
              {metrics.recentApplications.map(app => (
                <li key={app.id} className="flex items-center justify-between py-sm border-b border-outline-variant last:border-b-0">
                  <div className="flex flex-col">
                    <span className="font-body-md text-body-md text-on-surface">{app.jobTitle}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">{app.companyName}</span>
                  </div>
                  <div className="flex items-center gap-md">
                    <span className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm ${STATUS_BADGE_COLORS[app.status] ?? 'bg-surface-container-high text-on-surface-variant'}`}>
                      {app.status}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant whitespace-nowrap">
                      {getRelativeTime(app.createdAt, locale)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="font-body-md text-body-md text-on-surface-variant">{t.dashboard.noActivity}</p>
          )}
        </div>
      </div>
    </>
  )
}
