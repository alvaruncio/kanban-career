import { useI18nStore } from '../../stores'

interface ProfileFieldProps {
  label: string
  value: string | undefined | null
}

export function ProfileField({ label, value }: ProfileFieldProps) {
  const { t } = useI18nStore()

  return (
    <div className="flex flex-col gap-xs">
      <span className="font-label-sm text-label-sm text-on-surface-variant">{label}</span>
      <span className="font-body-md text-body-md text-on-surface">
        {value || <span className="text-on-surface-variant italic">{t.profile.notSet}</span>}
      </span>
    </div>
  )
}
