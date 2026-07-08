import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string
  color: string
  children?: ReactNode
}

export default function StatCard({ label, value, color, children }: StatCardProps) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm">
      <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center mb-sm`}>
        <span className="text-on-primary font-label-md text-label-md">{value}</span>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant">{label}</p>
      {children}
    </div>
  )
}
