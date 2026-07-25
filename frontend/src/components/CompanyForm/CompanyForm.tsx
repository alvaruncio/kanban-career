import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { companySchema, type CompanyFormData } from '../../models'
import { useI18nStore } from '../../stores'
import { InputForm } from '../InputForm/InputForm'
import { TextareaForm } from '../TextareaForm/TextareaForm'

interface Props {
  defaultValues?: Partial<CompanyFormData>
  onSubmit: (data: CompanyFormData) => Promise<void>
  isSubmitting: boolean
  submitLabel: string
  cancelLabel: string
  onCancel: () => void
  serverError: string | null
}

export function CompanyForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel,
  cancelLabel,
  onCancel,
  serverError,
}: Props) {
  const { t } = useI18nStore()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      website: '',
      linkedinUrl: '',
      description: '',
      ...defaultValues,
    },
  })

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-md">
      {serverError && (
        <div className="bg-error-container text-error font-body-sm text-body-sm px-md py-sm rounded-lg" role="alert">
          {serverError}
        </div>
      )}

      <InputForm
        name="name"
        control={control}
        label={t.companies.name}
        error={errors.name}
      />

      <InputForm
        name="website"
        control={control}
        label={t.companies.website}
        type="url"
        placeholder="https://..."
        error={errors.website}
      />

      <InputForm
        name="linkedinUrl"
        control={control}
        label={t.companies.linkedinUrl}
        type="url"
        placeholder="https://linkedin.com/..."
        error={errors.linkedinUrl}
      />

      <TextareaForm
        name="description"
        control={control}
        label={t.companies.description}
        error={errors.description}
        rows={4}
      />

      <div className="flex items-center gap-md pt-sm border-t border-outline-variant">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? t.companies.saving : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="font-label-md text-label-md text-on-surface-variant border border-outline-variant rounded-lg px-4 py-2 hover:bg-surface-container-low transition-colors active:scale-95 disabled:opacity-50"
        >
          {cancelLabel}
        </button>
      </div>
    </form>
  )
}
