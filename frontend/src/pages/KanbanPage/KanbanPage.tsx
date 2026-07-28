import { useEffect, useMemo, useRef, useState } from 'react'
import { DragDropProvider, DragOverlay } from '@dnd-kit/react'
import { useI18nStore, useApplicationsStore, useCompaniesStore } from '../../stores'
import { KanbanColumn, KanbanCard, SortableKanbanCard, PageMeta, ApplicationFormModal } from '../../components'
import { APPLICATION_STATUS } from '../../interfaces'
import { ApplicationService, api } from '../../services'
import type { ApplicationFormData } from '../../models'
import type { ApplicationKanbanDTO, ApplicationStatus } from '../../interfaces'

const KANBAN_COLUMNS_CONFIG = [
  { status: APPLICATION_STATUS.APPLIED,   color: 'bg-primary',             labelKey: 'columnApplied'  as const, showCreate: true  },
  { status: APPLICATION_STATUS.INTERVIEW, color: 'bg-tertiary-fixed-dim',  labelKey: 'columnInterview' as const, showCreate: false },
  { status: APPLICATION_STATUS.OFFER,     color: 'bg-secondary',          labelKey: 'columnOffer'     as const, showCreate: false },
  { status: APPLICATION_STATUS.HIRED,     color: 'bg-secondary-fixed-dim', labelKey: 'columnHired'     as const, showCreate: false },
  { status: APPLICATION_STATUS.REJECTED,  color: 'bg-error',              labelKey: 'columnRejected'  as const, showCreate: false },
]

const ALL_COLUMNS = [APPLICATION_STATUS.APPLIED, APPLICATION_STATUS.INTERVIEW, APPLICATION_STATUS.OFFER, APPLICATION_STATUS.HIRED, APPLICATION_STATUS.REJECTED] as const
const emptyRecord = () => Object.fromEntries(ALL_COLUMNS.map(s => [s, [] as string[]])) as Record<ApplicationStatus, string[]>

export default function KanbanPage() {
  const { t, locale } = useI18nStore()

  const { applications, fetchApplications } = useApplicationsStore()
  const { companies, fetchCompanies } = useCompaniesStore()

  useEffect(() => {
    fetchApplications()
    fetchCompanies()
  }, [fetchApplications, fetchCompanies])

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedCompany, setSelectedCompany] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  const [items, setItems] = useState<Record<ApplicationStatus, string[]>>(emptyRecord)
  const [activeApp, setActiveApp] = useState<ApplicationKanbanDTO | null>(null)
  const isDraggingRef = useRef(false)
  const blockFilterSync = useRef(false)
  const lastDragOverRef = useRef({ column: '', index: -1 })

  const handleCreateApplication = async (data: ApplicationFormData) => {
    setServerError('')
    setIsSubmitting(true)
    try {
      await ApplicationService.create(data)
      await fetchApplications()
      setModalOpen(false)
    } catch (err) {
      setServerError((err as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const monthValues = [...new Set(applications.map(a => a.applicationDate.slice(0, 7)))].sort().reverse()
  const formatter = new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-US', { year: 'numeric', month: 'long' })
  const monthOptions = monthValues.map(v => {
    const [year, month] = v.split('-')
    const date = new Date(Number(year), Number(month) - 1)
    return { value: v, label: formatter.format(date) }
  })

  const companyOptions = companies.map(c => ({ value: c.name, id: c.id }))

  const filtered = useMemo(() => applications.filter(app => {
    const matchesMonth = !selectedMonth || app.applicationDate.slice(0, 7) === selectedMonth
    const matchesCompany = selectedCompany === 'all' || app.company.name === selectedCompany
    const q = searchQuery.toLowerCase()
    const matchesSearch = !q
      || app.jobTitle.toLowerCase().includes(q)
      || app.company.name.toLowerCase().includes(q)
      || app.category.toLowerCase().includes(q)
    return matchesMonth && matchesCompany && matchesSearch
  }), [applications, selectedMonth, selectedCompany, searchQuery])

  useEffect(() => {
    if (isDraggingRef.current || blockFilterSync.current) return
    const newItems = emptyRecord()
    for (const app of filtered) {
      newItems[app.status].push(app.id)
    }
    setItems(newItems)
  }, [filtered])

  const appById = useMemo(() => {
    const map = new Map<string, ApplicationKanbanDTO>()
    for (const app of filtered) {
      map.set(app.id, app)
    }
    return map
  }, [filtered])

  const COLUMNS = KANBAN_COLUMNS_CONFIG.map(col => ({
    ...col,
    label: t.kanban[col.labelKey],
    appIds: items[col.status] ?? [],
  }))

  return (
    <>
      <PageMeta title="Kanban" description="Tablero kanban para gestionar visualmente tus candidaturas por etapas." />
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
                type="search"
                aria-label={t.kanban.searchPlaceholder}
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

        <DragDropProvider
          onDragStart={(event) => {
            const source = event.operation.source
            if (!source) return
            isDraggingRef.current = true
            blockFilterSync.current = false
            lastDragOverRef.current = { column: '', index: -1 }
            const app = applications.find(a => a.id === source.id)
            setActiveApp(app ?? null)
          }}
          onDragOver={(event) => {
            const { source, target } = event.operation
            if (!source || !target) return

            const sourceId = source.id as string
            const columnId = target.id as ApplicationStatus

            const apps = useApplicationsStore.getState().applications
            const sourceApp = apps.find(a => a.id === sourceId)
            if (!sourceApp || sourceApp.status !== columnId) return

            const columnEl = document.querySelector(`[data-column-id="${columnId}"]`)
            if (!columnEl) return

            const scrollEl = columnEl.querySelector('[data-column-scroll]')
            if (!scrollEl) return

            const cardEls = [...scrollEl.querySelectorAll(':scope > [data-draggable-id]')] as HTMLElement[]
            if (cardEls.length === 0) return

            const cursorY = event.operation.position.current.y

            let insertIndex = cardEls.length
            for (let i = 0; i < cardEls.length; i++) {
              const rect = cardEls[i].getBoundingClientRect()
              if (cursorY < rect.top + rect.height / 2) {
                insertIndex = i
                break
              }
            }

            if (lastDragOverRef.current.column === columnId && lastDragOverRef.current.index === insertIndex) return
            lastDragOverRef.current = { column: columnId, index: insertIndex }

            setItems(prev => {
              const currentIds = [...prev[columnId]]
              const currentIndex = currentIds.indexOf(sourceId)
              if (currentIndex === -1) return prev

              let targetIndex = insertIndex
              if (targetIndex > currentIndex) targetIndex--
              if (targetIndex === currentIndex) return prev

              currentIds.splice(currentIndex, 1)
              currentIds.splice(targetIndex, 0, sourceId)
              return { ...prev, [columnId]: currentIds }
            })
          }}
          onDragEnd={(event) => {
            setActiveApp(null)

            if (event.canceled) return

            const { source, target } = event.operation
            if (!source || !target) return

            const id = source.id as string
            const destGroup = target.id as ApplicationStatus

            const apps = useApplicationsStore.getState().applications
            const app = apps.find(a => a.id === id)
            if (!app) return

            const initialGroup = app.status
            if (initialGroup === destGroup) return

            setItems(prev => {
              if (!prev[initialGroup].includes(id)) return prev
              const next = { ...prev }
              next[initialGroup] = prev[initialGroup].filter(x => x !== id)
              next[destGroup] = [...prev[destGroup], id]
              return next
            })

            blockFilterSync.current = true
            requestAnimationFrame(() => { blockFilterSync.current = false })

            useApplicationsStore.setState(state => ({
              applications: state.applications.map(a =>
                a.id === id ? { ...a, status: destGroup } : a
              ),
            }))

            api.patch(`/applications/${id}`, { status: destGroup }).catch(() => {})

            isDraggingRef.current = false
          }}
        >
          <div className="flex-1 overflow-x-auto overflow-y-hidden p-lg kanban-scroll">
            <div className="flex gap-lg h-full items-start">
              {COLUMNS.map(col => (
                <KanbanColumn
                  key={col.status}
                  id={col.status}
                  label={col.label}
                  count={col.appIds.length}
                  color={col.color}
                  showCreateButton={col.showCreate}
                  onCreate={() => setModalOpen(true)}
                >
                  {col.appIds.map((appId) => {
                    const app = appById.get(appId)
                    if (!app) return null
                    return (
                      <SortableKanbanCard key={app.id} id={app.id}>
                        <KanbanCard
                          application={app}
                          isRejected={app.status === APPLICATION_STATUS.REJECTED}
                        />
                      </SortableKanbanCard>
                    )
                  })}
                </KanbanColumn>
              ))}
            </div>
          </div>

          <DragOverlay>
            {activeApp && (
              <div className="rotate-3 opacity-90">
                <KanbanCard
                  application={activeApp}
                  isRejected={activeApp.status === APPLICATION_STATUS.REJECTED}
                />
              </div>
            )}
          </DragOverlay>
        </DragDropProvider>
      </div>

      <ApplicationFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateApplication}
        isSubmitting={isSubmitting}
        serverError={serverError}
      />
    </>
  )
}