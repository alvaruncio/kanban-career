import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { applicationSchema, type ApplicationFormData } from '../../models'
import { useI18nStore } from '../../stores'
import { InputForm } from '../InputForm/InputForm'
import { SelectForm } from '../SelectForm/SelectForm'
import { TextareaForm } from '../TextareaForm/TextareaForm'
import { APPLICATION_CATEGORY, APPLICATION_SOURCE } from '../../interfaces'
import type { Company } from '../../interfaces'

interface Props {
  defaultValues?: Partial<ApplicationFormData>
  onSubmit: (data: ApplicationFormData) => Promise<void>
  isSubmitting: boolean
  submitLabel: string
  cancelLabel: string
  onCancel: () => void
  companies: Company[]
  serverError: string
}

const formatLabel = (value: string) =>
  value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())

const categoryOptions = Object.values(APPLICATION_CATEGORY).map(v => ({
  value: v,
  label: formatLabel(v),
}))

const sourceOptions = Object.values(APPLICATION_SOURCE).map(v => ({
  value: v,
  label: formatLabel(v),
}))

export function ApplicationForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel,
  cancelLabel,
  onCancel,
  companies,
  serverError,
}: Props) {
  const { t } = useI18nStore()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      jobTitle: '',
      offerUrl: '',
      companyId: '',
      category: '' as ApplicationFormData['category'],
      source: '' as ApplicationFormData['source'],
      applicationDate: '',
      jobDescription: '',
      notes: '',
      ...defaultValues,
    },
  })

  const companyOptions = companies.map(c => ({
    value: c.id,
    label: c.name,
  }))

  return (
    <form className="flex flex-col gap-md p-lg" onSubmit={handleSubmit(onSubmit)} noValidate>
      {serverError && (
        <div className="bg-error-container text-on-error-container font-body-sm text-body-sm p-sm rounded-lg" role="alert">
          {serverError}
        </div>
      )}

      <InputForm
        name="jobTitle"
        control={control}
        label="Título del trabajo *"
        placeholder="Frontend Developer"
        error={errors.jobTitle}
      />

      <SelectForm
        name="companyId"
        control={control}
        label="Compañía *"
        options={companyOptions}
        placeholder={t.applicationForm.companyPlaceholder}
        error={errors.companyId}
      />

      <InputForm
        name="offerUrl"
        control={control}
        label="URL de la oferta *"
        type="url"
        placeholder="https://careers.google.com/..."
        error={errors.offerUrl}
      />

      <div className="grid grid-cols-2 gap-md">
        <SelectForm
          name="category"
          control={control}
          label="Categoría *"
          options={categoryOptions}
          placeholder={t.applicationForm.categoryPlaceholder}
          error={errors.category}
        />
        <SelectForm
          name="source"
          control={control}
          label="Fuente *"
          options={sourceOptions}
          placeholder={t.applicationForm.sourcePlaceholder}
          error={errors.source}
        />
      </div>

      <InputForm
        name="applicationDate"
        control={control}
        label="Fecha de aplicación *"
        type="date"
        error={errors.applicationDate}
      />

      <TextareaForm
        name="jobDescription"
        control={control}
        label={t.applicationForm.jobDescriptionLabel}
        placeholder={t.applicationForm.jobDescriptionPlaceholder}
        error={errors.jobDescription}
        rows={4}
      />

      <TextareaForm
        name="notes"
        control={control}
        label={t.applicationForm.notes}
        placeholder={t.applicationForm.notesPlaceholder}
        error={errors.notes}
        rows={3}
      />

      <div className="flex justify-end gap-md pt-sm border-t border-outline-variant">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 font-label-md text-label-md text-on-surface-variant border border-outline-variant rounded-lg hover:bg-surface-container transition-all"
        >
          {cancelLabel}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 font-label-md text-label-md text-on-primary bg-primary rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? t.common.loading : submitLabel}
        </button>
      </div>
    </form>
  )
}