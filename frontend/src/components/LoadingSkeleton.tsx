import { useI18nStore } from '../stores/i18nStore'

export default function LoadingSkeleton() {
  const { t } = useI18nStore()

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="flex flex-col items-center gap-md">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="font-body-sm text-body-sm text-on-surface-variant">{t.common.loading}</p>
      </div>
    </div>
  )
}
