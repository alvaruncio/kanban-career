import type { ReactNode } from 'react'

interface KanbanColumnProps {
  label: string
  count: number
  color: string
  children?: ReactNode
}

export default function KanbanColumn({ label, count, color, children }: KanbanColumnProps) {
  return (
    <div className="w-72 flex-shrink-0 flex flex-col gap-sm bg-surface-container-low rounded-xl p-md border border-outline-variant/30">
      <div className="flex items-center gap-2 px-2 pb-2 border-b border-outline-variant/50">
        <span className={`w-2 h-2 rounded-full ${color}`} />
        <span className="font-label-md text-label-md text-on-surface">
          {label} <span className="text-on-surface-variant ml-1">{count}</span>
        </span>
      </div>
      <div className="flex-1 flex flex-col gap-sm">
        {children}
      </div>
    </div>
  )
}
