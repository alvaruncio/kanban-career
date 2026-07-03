import { useI18nStore } from '../stores/i18nStore'
import type { ApplicationKanbanDTO } from '../interfaces/application'
import type { Translation } from '../locales/types'

interface KanbanCardProps {
  application: ApplicationKanbanDTO
  isRejected?: boolean
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string }> = {
  FRONTEND: { bg: 'bg-primary-container', text: 'text-primary' },
  BACKEND: { bg: 'bg-secondary-container', text: 'text-secondary' },
  FULL_STACK: { bg: 'bg-tertiary-container', text: 'text-tertiary' },
}

function getRelativeTime(dateStr: string, timeAgo: Translation['kanban']['timeAgo']) {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.round(diffMs / 86_400_000)

  if (diffDays === 0) return timeAgo.today
  if (diffDays === -1) return timeAgo.tomorrow
  if (diffDays === 1) return timeAgo.yesterday
  if (diffDays >= 2 && diffDays <= 6) return timeAgo.daysAgo.replace('{n}', String(diffDays))
  if (diffDays >= 7 && diffDays <= 13) return timeAgo.weekAgo
  if (diffDays >= 14) return timeAgo.daysAgo.replace('{n}', String(diffDays))
  return timeAgo.today
}

export default function KanbanCard({ application, isRejected }: KanbanCardProps) {
  const { t } = useI18nStore()
  const timeAgo = t.kanban.timeAgo

  const style = CATEGORY_STYLES[application.category] ?? CATEGORY_STYLES.FRONTEND
  const categoryLabel = t.kanban.categories[application.category.toLowerCase() as 'frontend' | 'backend' | 'fullStack']

  return (
    <div
      className={`bg-surface p-md rounded-lg shadow-sm border border-outline-variant hover:border-primary transition-colors cursor-grab ${isRejected ? 'opacity-75' : ''}`}
    >
      <div className="flex justify-between items-start mb-sm">
        <span className={`text-xs font-label-sm ${style.bg} ${style.text} px-xs py-[2px] rounded`}>
          {categoryLabel}
        </span>
        {application.status === 'INTERVIEW' ? (
          <span className="text-xs text-tertiary-fixed-dim flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">event</span>
            {getRelativeTime(application.applicationDate, timeAgo)}
          </span>
        ) : (
          <span className="text-xs text-on-surface-variant">{getRelativeTime(application.applicationDate, timeAgo)}</span>
        )}
      </div>
      <h3 className={`font-label-md text-on-surface font-bold mb-xs ${isRejected ? 'line-through' : ''}`}>
        {application.jobTitle}
      </h3>
      <p className="text-sm text-on-surface-variant mb-md">{application.company.name}</p>
      <div className="flex items-center gap-sm mt-auto">
        <span className={`material-symbols-outlined text-[16px] ${isRejected ? 'text-error' : 'text-primary'}`}>link</span>
        <a
          className={`text-xs ${isRejected ? 'text-error' : 'text-primary'} hover:underline`}
          href={application.offerUrl}
        >
          {t.kanban.viewOffer}
        </a>
      </div>
    </div>
  )
}
