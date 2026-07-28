import { Controller, type Control, type FieldError, type FieldValues, type Path } from 'react-hook-form'

interface Props<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  label: string
  type?: string
  placeholder?: string
  error?: FieldError
  onFocus?: () => void
  onBlur?: () => void
}

export function InputForm<T extends FieldValues>({
  name,
  control,
  label,
  type = 'text',
  placeholder,
  error,
onFocus,
  onBlur,
}: Props<T>) {
  const errorId = `${name}-error`

  return (
    <div className="flex flex-col gap-sm">
      <label className="font-label-md text-label-md text-on-surface" htmlFor={name}>
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            id={name}
            type={type}
            placeholder={placeholder}
            className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            {...field}
            onFocus={() => onFocus?.()}
            onBlur={() => { field.onBlur(); onBlur?.() }}
          />
        )}
      />
      {error && (
        <p id={errorId} className="font-body-sm text-body-sm text-error" role="alert">
          {error.message}
        </p>
      )}
    </div>
  )
}
