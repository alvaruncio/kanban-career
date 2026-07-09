import { Controller, type Control, type FieldError, type FieldValues, type Path } from 'react-hook-form'

interface Props<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  label: string
  placeholder?: string
  error?: FieldError
  rows?: number
}

export function TextareaForm<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  error,
  rows = 3,
}: Props<T>) {
  return (
    <div className="flex flex-col gap-sm">
      <label className="font-label-md text-label-md text-on-surface" htmlFor={name}>
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <textarea
            id={name}
            placeholder={placeholder}
            rows={rows}
            className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
            aria-invalid={!!error}
            {...field}
          />
        )}
      />
      {error && (
        <p className="font-body-sm text-body-sm text-error" role="alert">
          {error.message}
        </p>
      )}
    </div>
  )
}