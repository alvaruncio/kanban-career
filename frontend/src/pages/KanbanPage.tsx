import { useEffect, useState } from 'react'
import { useI18nStore } from '../stores/i18nStore'
import { useApplicationsStore } from '../stores/applicationsStore'
import { useCompaniesStore } from '../stores/companiesStore'
import { usePageMeta } from '../hooks/usePageMeta'
import KanbanColumn from '../components/KanbanColumn'
import KanbanCard from '../components/KanbanCard'
import { APPLICATION_STATUS } from '../interfaces/application'

const KANBAN_COLUMNS_CONFIG = [
  { status: APPLICATION_STATUS.APPLIED,   color: 'bg-primary',             labelKey: 'columnApplied'  as const, showCreate: true  },
  { status: APPLICATION_STATUS.INTERVIEW, color: 'bg-tertiary-fixed-dim',  labelKey: 'columnInterview' as const, showCreate: false },
  { status: APPLICATION_STATUS.OFFER,     color: 'bg-secondary',          labelKey: 'columnOffer'     as const, showCreate: false },
  { status: APPLICATION_STATUS.HIRED,     color: 'bg-secondary-fixed-dim', labelKey: 'columnHired'     as const, showCreate: false },
  { status: APPLICATION_STATUS.REJECTED,  color: 'bg-error',              labelKey: 'columnRejected'  as const, showCreate: false },
]

export default function KanbanPage() {
  const pageMeta = usePageMeta('Kanban', 'Tablero kanban para gestionar visualmente tus candidaturas por etapas.')
  const { t, locale } = useI18nStore()

  const { applications, fetchApplications } = useApplicationsStore()
  const { companies, fetchCompanies } = useCompaniesStore()

  useEffect(() => {
    fetchApplications()
    fetchCompanies()
  }, [])

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedCompany, setSelectedCompany] = useState('all')

  const monthValues = [...new Set(applications.map(a => a.applicationDate.slice(0, 7)))].sort().reverse()
  const formatter = new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-US', { year: 'numeric', month: 'long' })
  const monthOptions = monthValues.map(v => {
    const [year, month] = v.split('-')
    const date = new Date(Number(year), Number(month) - 1)
    return { value: v, label: formatter.format(date) }
  })

  const companyOptions = companies.map(c => ({ value: c.name, id: c.id }))

  const filtered = applications.filter(app => {
    const matchesMonth = !selectedMonth || app.applicationDate.slice(0, 7) === selectedMonth
    const matchesCompany = selectedCompany === 'all' || app.company.name === selectedCompany
    const q = searchQuery.toLowerCase()
    const matchesSearch = !q
      || app.jobTitle.toLowerCase().includes(q)
      || app.company.name.toLowerCase().includes(q)
      || app.category.toLowerCase().includes(q)
    return matchesMonth && matchesCompany && matchesSearch
  })

  const COLUMNS = KANBAN_COLUMNS_CONFIG.map(col => ({
    ...col,
    label: t.kanban[col.labelKey],
    applications: filtered.filter(app => app.status === col.status),
  }))

  return (
    <>
      {pageMeta}
      <div className="flex flex-col min-h-0 h-full bg-background">
        <header className="h-16 border-b border-outline-variant bg-surface flex items-center justify-between px-lg flex-shrink-0">
          <div className="flex items-center gap-sm mr-lg">
            <span className="material-symbols-outlined text-primary">view_kanban</span>
            <span className="font-headline-md text-primary font-bold">KanbanCareer</span>
          </div>
          <div>
            <h1 className="font-headline-md text-on-surface">{t.kanban.subtitle}</h1>
          </div>
          <div className="flex items-center gap-md">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
              <input
                className="pl-xl pr-md py-xs rounded-full border border-outline-variant bg-surface text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64"
                placeholder={t.kanban.searchPlaceholder}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </header>

        <div className="px-lg py-sm border-b border-outline-variant bg-surface flex items-center gap-sm flex-shrink-0">
          <div className="flex items-center gap-lg">
            <div className="flex items-center gap-md">
              <label className="font-label-md text-on-surface-variant" htmlFor="month-filter">{t.kanban.filterBy}</label>
              <div className="relative">
                <select
                  id="month-filter"
                  className="appearance-none pl-md pr-xl py-xs rounded-lg border border-outline-variant bg-surface text-sm font-label-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer transition-colors"
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(e.target.value)}
                >
                  <option value="">{t.kanban.months.all}</option>
                  {monthOptions.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">expand_more</span>
              </div>
            </div>
            <div className="flex items-center gap-md">
              <label className="font-label-md text-on-surface-variant" htmlFor="company-filter">{t.kanban.company}</label>
              <div className="relative">
                <select
                  id="company-filter"
                  className="appearance-none pl-md pr-xl py-xs rounded-lg border border-outline-variant bg-surface text-sm font-label-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer transition-colors"
                  value={selectedCompany}
                  onChange={e => setSelectedCompany(e.target.value)}
                >
                  <option value="all">{t.kanban.companies.all}</option>
                  {companyOptions.map(c => (
                    <option key={c.id} value={c.value}>{c.value}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-sm top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">expand_more</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-x-auto overflow-y-hidden p-lg kanban-scroll">
          <div className="flex gap-lg h-full items-start">
            {COLUMNS.map(col => (
              <KanbanColumn
                key={col.status}
                label={col.label}
                count={col.applications.length}
                color={col.color}
                showCreateButton={col.showCreate}
              >
                {col.applications.map(app => (
                  <KanbanCard
                    key={app.id}
                    application={app}
                    isRejected={app.status === APPLICATION_STATUS.REJECTED}
                  />
                ))}
              </KanbanColumn>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
