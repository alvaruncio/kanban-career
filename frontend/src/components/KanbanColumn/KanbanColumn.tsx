import { Children, type ReactNode } from 'react'
import { useDroppable } from '@dnd-kit/react'
import { CollisionPriority } from '@dnd-kit/abstract'
import { useI18nStore } from '../../stores'
import type { ApplicationStatus } from '../../interfaces'

interface KanbanColumnProps {
  id: ApplicationStatus
  label: string
  count: number
  color: string
  showCreateButton?: boolean
  onCreate?: () => void
  children?: ReactNode
}

export default function KanbanColumn({ id, label, count, color, showCreateButton, onCreate, children }: KanbanColumnProps) {
  const { t } = useI18nStore()
  const { ref, isDropTarget } = useDroppable({
    id,
    collisionPriority: CollisionPriority.Low,
  })

  return (
    <section
      ref={ref}
      data-column-id={id}
      aria-label={label}
      className={`w-80 flex-shrink-0 flex flex-col max-h-full bg-surface-container-lowest rounded-xl border shadow-sm transition-colors ${isDropTarget ? 'border-primary bg-primary-container/10' : 'border-outline-variant'}`}
      style={{ minWidth: 320 }}
    >
      <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low rounded-t-xl">
        <h2 className="font-label-md text-on-surface flex items-center gap-sm">
          <span className={`w-2 h-2 rounded-full ${color}`} />
          {label}
          <span className="bg-surface-variant text-on-surface-variant px-xs py-[2px] rounded text-xs ml-xs">{count}</span>
        </h2>
        <button className="text-on-surface-variant hover:text-on-surface">
          <span className="material-symbols-outlined text-sm">more_horiz</span>
        </button>
      </div>
      <div data-column-scroll className="flex-1 overflow-y-auto p-sm flex flex-col gap-sm kanban-scroll">
        {showCreateButton && (
          <button
            onClick={onCreate}
            className="mb-sm flex items-center gap-sm w-full p-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors font-label-md border border-outline-variant"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>{t.kanban.createCard}</span>
          </button>
        )}
        {children}
        {Children.count(children) === 0 && !showCreateButton && (
          <div className="h-24 border-2 border-dashed border-outline-variant rounded-lg flex items-center justify-center text-on-surface-variant text-sm">
            {t.kanban.dragHere}
          </div>
        )}
      </div>
    </section>
  )
}