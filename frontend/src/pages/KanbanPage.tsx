import { useI18nStore } from '../stores/i18nStore'
import { usePageMeta } from '../hooks/usePageMeta'
import KanbanColumn from '../components/KanbanColumn'

const KANBAN_COLUMNS_CONFIG = [
  { id: 'applied' as const, color: 'bg-outline', count: 0, labelKey: 'columnApplied' as const },
  { id: 'interview' as const, color: 'bg-primary', count: 0, labelKey: 'columnInterview' as const },
  { id: 'offer' as const, color: 'bg-secondary', count: 0, labelKey: 'columnOffer' as const },
  { id: 'hired' as const, color: 'bg-secondary-container', count: 0, labelKey: 'columnHired' as const },
  { id: 'rejected' as const, color: 'bg-error', count: 0, labelKey: 'columnRejected' as const },
]

export default function KanbanPage() {
  const pageMeta = usePageMeta('Kanban', 'Tablero kanban para gestionar visualmente tus candidaturas por etapas.')
  const { t } = useI18nStore()

  const KANBAN_COLUMNS = KANBAN_COLUMNS_CONFIG.map(col => ({
    ...col,
    label: t.kanban[col.labelKey],
  }))

  return (
    <>
      {pageMeta}
      <div className="h-full">
      <div className="flex items-center justify-between mb-lg">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">{t.kanban.title}</h1>
        <button className="bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-all shadow-sm active:scale-95">
          {t.kanban.addApplication}
        </button>
      </div>
      <div className="flex gap-md overflow-x-auto pb-md content-visibility-auto" style={{ minHeight: 'calc(100vh - 12rem)' }}>
        {KANBAN_COLUMNS.map(col => (
          <KanbanColumn key={col.id} label={col.label} count={col.count} color={col.color}>
            <div className="bg-surface-container-lowest p-sm rounded-lg border border-outline-variant/30 shadow-sm opacity-40 flex items-center justify-center" style={{ minHeight: 80 }}>
              <p className="font-body-sm text-body-sm text-on-surface-variant">{t.kanban.dragHere}</p>
            </div>
          </KanbanColumn>
        ))}
      </div>
    </div>
    </>
  )
}
