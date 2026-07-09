import { Controller, type Control, type FieldError, type FieldValues, type Path } from 'react-hook-form'

interface SelectOption {
  value: string
  label: string
}

interface Props<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  label: string
  options: readonly SelectOption[] | SelectOption[]
  error?: FieldError
  placeholder?: string
}

export function SelectForm<T extends FieldValues>({
  name,
  control,
  label,
  options,
  error,
  placeholder,
}: Props<T>) {
  return (
    <div className="flex flex-col gap-sm">
      <label className="font-label-md text-label-md text-on-surface" htmlFor={name}>
        {label}
      </label>
      <div className="relative">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <select
              id={name}
              className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
              aria-invalid={!!error}
              {...field}
            >
              {placeholder && <option value="">{placeholder}</option>}
              {options.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {error && (
        <p className="font-body-sm text-body-sm text-error" role="alert">
          {error.message}
        </p>
      )}
    </div>
  )
}