import type { ReactNode } from 'react'

interface PricingCardProps {
  title: string
  recommended?: boolean
  recommendedLabel?: string
  children?: ReactNode
}

export default function PricingCard({ title, recommended = false, recommendedLabel, children }: PricingCardProps) {
  return (
    <div
      className={`flex-1 bg-surface-container-lowest rounded-xl p-lg flex flex-col relative ${
        recommended
          ? 'border-2 border-primary shadow-md'
          : 'border border-outline-variant shadow-sm'
      }`}
    >
      {recommended && recommendedLabel && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-on-primary font-label-sm text-label-sm px-3 py-1 rounded-full">
          {recommendedLabel}
        </div>
      )}
      <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{title}</h3>
      <div className="flex-1 flex items-center justify-center py-xl">
        {children}
      </div>
    </div>
  )
}
