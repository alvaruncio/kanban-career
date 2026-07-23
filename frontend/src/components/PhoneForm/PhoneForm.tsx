import { Controller, type Control, type FieldError, type FieldValues, type Path } from 'react-hook-form'
import PhoneInput, { type Value as PhoneInputValue } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

interface Props<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  label: string
  error?: FieldError
}

const COUNTRY_ONLY_RE = /^\+\d{1,4}$/

function normalizePhone(value: PhoneInputValue | undefined): string {
  // react-phone-number-input may pass the bare country prefix (e.g. "+34")
  // when defaultCountry is set but no actual number has been entered.
  // Normalize to empty so the Zod schema's refine(v => v === '' || ...) passes.
  if (value === undefined || value === '' || COUNTRY_ONLY_RE.test(value)) {
    return ''
  }
  return value
}

export function PhoneForm<T extends FieldValues>({
  name,
  control,
  label,
  error,
}: Props<T>) {
  return (
    <div className="flex flex-col gap-sm">
      <label className="font-label-md text-label-md text-on-surface" htmlFor={name}>
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, onBlur } }) => (
          <PhoneInput
            id={name}
            international
            defaultCountry="ES"
            value={value || ''}
            onChange={(v) => onChange(normalizePhone(v))}
            onBlur={onBlur}
            className="PhoneForm"
            aria-invalid={!!error}
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
