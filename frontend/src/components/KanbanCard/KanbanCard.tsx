import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18nStore } from '../../stores'
import type { ApplicationKanbanDTO } from '../../interfaces'
import type { Translation } from '../../locales'

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
  const navigate = useNavigate()
  const timeAgo = t.kanban.timeAgo
  const pointerStart = useRef<{ x: number; y: number } | null>(null)

  const style = CATEGORY_STYLES[application.category] ?? CATEGORY_STYLES.FRONTEND
  const categoryLabel = t.kanban.categories[application.category.toLowerCase() as 'frontend' | 'backend' | 'fullStack']

  // Track pointer down to distinguish click from drag
  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY }
  }

  const handleClick = (e: React.MouseEvent) => {
    // If the click target is the offer link, don't navigate
    const target = e.target as HTMLElement
    if (target.closest('a[href]')) return

    // If pointer moved significantly, it was a drag — don't navigate
    if (pointerStart.current) {
      const dx = e.clientX - pointerStart.current.x
      const dy = e.clientY - pointerStart.current.y
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) return
    }

    navigate(`/application/${application.id}`)
  }

  return (
    <div
      className={`bg-surface p-md rounded-lg shadow-sm border border-outline-variant hover:border-primary transition-colors cursor-pointer ${isRejected ? 'opacity-75' : ''}`}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
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
      <div className="flex items-center gap-sm mt-auto" onClick={(e) => e.stopPropagation()}>
        <span className={`material-symbols-outlined text-[16px] ${isRejected ? 'text-error' : 'text-primary'}`}>link</span>
        <a
          className={`text-xs ${isRejected ? 'text-error' : 'text-primary'} hover:underline`}
          href={application.offerUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.kanban.viewOffer}
        </a>
      </div>
    </div>
  )
}