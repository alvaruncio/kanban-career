import { type ReactNode } from 'react'
import { useDraggable } from '@dnd-kit/react'

interface SortableKanbanCardProps {
  id: string
  children: ReactNode
}

export default function SortableKanbanCard({ id, children }: SortableKanbanCardProps) {
  const { ref, isDragSource } = useDraggable({ id })

  return (
    <div
      ref={ref}
      data-draggable-id={id}
      className={isDragSource ? 'opacity-50' : ''}
    >
      {children}
    </div>
  )
}
