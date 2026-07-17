import { useI18nStore } from '../../stores'

interface MonthFilterProps {
  months: string[]
  value: string | null
  onChange: (month: string | null) => void
}

function formatMonthLabel(month: string): string {
  const [year, num] = month.split('-').map(Number)
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  return `${months[num - 1]} ${year}`
}

export default function MonthFilter({ months, value, onChange }: MonthFilterProps) {
  const { t, locale } = useI18nStore()

  const formatLabel = (month: string) => {
    if (locale === 'en') {
      const [year, num] = month.split('-').map(Number)
      const enMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      return `${enMonths[num - 1]} ${year}`
    }
    return formatMonthLabel(month)
  }

  return (
    <select
      value={value ?? ''}
      onChange={e => onChange(e.target.value || null)}
      className="px-3 py-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary transition-shadow duration-150"
    >
      <option value="">{t.dashboard.allMonths}</option>
      {months.map(m => (
        <option key={m} value={m}>{formatLabel(m)}</option>
      ))}
    </select>
  )
}
