import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string
  color: string
  children?: ReactNode
}

export default function StatCard({ label, value, color, children }: StatCardProps) {
  return (
    <article className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
      <div className={`h-1 ${color}`} />
      <div className="p-md pt-sm">
        <p className="font-headline-md text-headline-md text-on-surface">{value}</p>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs">{label}</p>
        {children}
      </div>
    </article>
  )
}
