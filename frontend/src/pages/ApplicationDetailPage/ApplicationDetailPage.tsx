import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { useI18nStore, useApplicationsStore, useCompaniesStore } from '../../stores'
import { ApplicationService } from '../../services'
import {
  InputForm,
  SelectForm,
  TextareaForm,
  PageMeta,
  LoadingSkeleton,
} from '../../components'
import {
  APPLICATION_STATUS,
  APPLICATION_CATEGORY,
  APPLICATION_SOURCE,
} from '../../interfaces'
import type { ApplicationKanbanDTO, ApplicationStatus, ApplicationCategory, ApplicationSource } from '../../interfaces'

const categoryValues = Object.values(APPLICATION_CATEGORY) as [string, ...string[]]
const sourceValues = Object.values(APPLICATION_SOURCE) as [string, ...string[]]
const statusValues = Object.values(APPLICATION_STATUS) as [string, ...string[]]

const detailEditSchema = z.object({
  jobTitle: z.string().min(1, 'El título es obligatorio'),
  companyId: z.string().min(1, 'Selecciona una empresa'),
  offerUrl: z.string().url('URL no válida').min(1, 'La URL es obligatoria'),
  status: z.enum(statusValues, { error: 'Selecciona un estado' }),
  category: z.enum(categoryValues, { error: 'Selecciona una categoría' }),
  source: z.enum(sourceValues, { error: 'Selecciona una fuente' }),
  applicationDate: z.string().min(1, 'La fecha es obligatoria'),
  jobDescription: z.string().optional(),
  notes: z.string().optional(),
})

type DetailEditFormData = z.infer<typeof detailEditSchema>

function screamingSnakeToCamel(str: string): string {
  return str.toLowerCase().replace(/_([a-z])/g, (_, c) => c.toUpperCase())
}

export default function ApplicationDetailPage() {
  const { t } = useI18nStore()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { updateApplication } = useApplicationsStore()
  const companiesStore = useCompaniesStore()

  const [application, setApplication] = useState<ApplicationKanbanDTO | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Fetch companies on mount
  useEffect(() => {
    if (companiesStore.companies.length === 0) {
      companiesStore.fetchCompanies()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DetailEditFormData>({
    resolver: zodResolver(detailEditSchema),
    defaultValues: {
      jobTitle: '',
      companyId: '',
      offerUrl: '',
      status: '' as DetailEditFormData['status'],
      category: '' as DetailEditFormData['category'],
      source: '' as DetailEditFormData['source'],
      applicationDate: '',
      jobDescription: '',
      notes: '',
    },
  })

  const fetchApplication = useCallback(async () => {
    if (!id) return
    setIsLoading(true)
    setFetchError(null)
    try {
      const app = await ApplicationService.getById(id)
      setApplication(app)
    } catch {
      setFetchError(t.applicationDetail.notFound)
    } finally {
      setIsLoading(false)
    }
  }, [id, t.applicationDetail.notFound])

  useEffect(() => {
    fetchApplication()
  }, [fetchApplication])

  useEffect(() => {
    if (application && isEditing) {
      reset({
        jobTitle: application.jobTitle,
        companyId: application.companyId,
        offerUrl: application.offerUrl,
        status: application.status,
        category: application.category,
        source: application.source,
        applicationDate: application.applicationDate,
        jobDescription: application.jobDescription ?? '',
        notes: application.notes ?? '',
      })
    }
  }, [application, isEditing, reset])

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  useEffect(() => {
    if (saveError) {
      const timer = setTimeout(() => setSaveError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [saveError])

  const handleEdit = () => {
    setIsEditing(true)
    setSuccessMessage(null)
    setSaveError(null)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setSuccessMessage(null)
    setSaveError(null)
  }

  const handleSave = async (data: DetailEditFormData) => {
    if (!id) return
    setIsSaving(true)
    setSuccessMessage(null)
    setSaveError(null)
    try {
      await updateApplication(id, {
        ...data,
        status: data.status as ApplicationStatus,
        category: data.category as ApplicationCategory,
        source: data.source as ApplicationSource,
      })
      // Re-fetch to get fresh data from server
      const updated = await ApplicationService.getById(id)
      setApplication(updated)
      setSuccessMessage(t.applicationDetail.saved)
      setIsEditing(false)
    } catch {
      setSaveError(t.applicationDetail.saveError)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <LoadingSkeleton />

  if (fetchError || !application) {
    return (
      <>
        <PageMeta title={t.applicationDetail.notFound} description="" />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="font-body-md text-body-md text-error mb-md">
              {fetchError ?? t.applicationDetail.notFound}
            </p>
            <button
              onClick={() => navigate('/kanban')}
              className="font-label-md text-label-md text-primary hover:underline transition-colors"
            >
              {t.applicationDetail.backToKanban}
            </button>
          </div>
        </div>
      </>
    )
  }

  const td = t.applicationDetail

  const statusOptions = Object.values(APPLICATION_STATUS).map(v => ({
    value: v,
    label: td.statuses[screamingSnakeToCamel(v) as keyof typeof td.statuses],
  }))

  const categoryOptions = Object.values(APPLICATION_CATEGORY).map(v => ({
    value: v,
    label: td.categories[screamingSnakeToCamel(v) as keyof typeof td.categories],
  }))

  const sourceOptions = Object.values(APPLICATION_SOURCE).map(v => ({
    value: v,
    label: td.sources[screamingSnakeToCamel(v) as keyof typeof td.sources],
  }))

  const companyOptions = companiesStore.companies.map(c => ({
    value: c.id,
    label: c.name,
  }))

  const statusBadgeColors: Record<string, string> = {
    APPLIED: 'bg-primary-container text-primary',
    INTERVIEW: 'bg-tertiary-container text-tertiary',
    OFFER: 'bg-secondary-container text-secondary',
    HIRED: 'bg-secondary-fixed-dim text-on-secondary-fixed',
    REJECTED: 'bg-error-container text-error',
  }

  const statusBadgeClass = statusBadgeColors[application.status] ?? 'bg-surface-container text-on-surface-variant'

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString()
  }

  return (
    <>
      <PageMeta title={`${application.jobTitle} — ${application.company.name}`} description={td.subtitle} />
      <div className="max-w-3xl w-full mx-auto px-6 space-y-lg">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-md">
            <button
              onClick={() => navigate('/kanban')}
              className="flex items-center gap-1 text-on-surface-variant hover:text-on-surface transition-colors font-label-md"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              {td.backToKanban}
            </button>
          </div>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">edit</span>
              {td.edit}
            </button>
          )}
        </div>

        {/* Title section */}
        <div>
          <div className="flex items-center gap-md mb-xs">
            <h1 className="font-headline-lg text-headline-lg text-on-surface">{application.jobTitle}</h1>
            <span className={`text-xs font-label-sm px-xs py-[2px] rounded-full ${statusBadgeClass}`}>
{td.statuses[screamingSnakeToCamel(application.status) as keyof typeof td.statuses]}
            </span>
          </div>
          <p className="font-body-lg text-body-lg text-on-surface-variant">{application.company.name}</p>
        </div>

        {/* Success/Error messages */}
        {successMessage && (
          <div className="bg-secondary-container text-secondary font-body-md text-body-md px-lg py-md rounded-lg" role="alert">
            {successMessage}
          </div>
        )}

        {saveError && (
          <div className="bg-error-container text-error font-body-md text-body-md px-lg py-md rounded-lg" role="alert">
            {saveError}
          </div>
        )}

        {/* Edit mode */}
        {isEditing ? (
          <form noValidate onSubmit={handleSubmit(handleSave)} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg space-y-md">
            <InputForm
              name="jobTitle"
              control={control}
              label={td.jobTitle}
              error={errors.jobTitle}
            />

            <SelectForm
              name="companyId"
              control={control}
              label={td.companyName}
              options={companyOptions}
              placeholder={td.selectCompany}
              error={errors.companyId}
            />

            <SelectForm
              name="status"
              control={control}
              label={td.status}
              options={statusOptions}
              error={errors.status}
            />

            <div className="grid grid-cols-2 gap-md">
              <SelectForm
                name="category"
                control={control}
                label={td.category}
                options={categoryOptions}
                error={errors.category}
              />
              <SelectForm
                name="source"
                control={control}
                label={td.source}
                options={sourceOptions}
                error={errors.source}
              />
            </div>

            <InputForm
              name="applicationDate"
              control={control}
              label={td.applicationDate}
              type="date"
              error={errors.applicationDate}
            />

            <InputForm
              name="offerUrl"
              control={control}
              label={td.offerUrl}
              type="url"
              placeholder="https://..."
              error={errors.offerUrl}
            />

            <TextareaForm
              name="jobDescription"
              control={control}
              label={td.jobDescription}
              error={errors.jobDescription}
              rows={4}
            />

            <TextareaForm
              name="notes"
              control={control}
              label={td.notes}
              error={errors.notes}
              rows={3}
            />

            <div className="flex items-center gap-md pt-sm border-t border-outline-variant">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? td.saving : td.save}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="font-label-md text-label-md text-on-surface-variant border border-outline-variant rounded-lg px-4 py-2 hover:bg-surface-container-low transition-colors active:scale-95 disabled:opacity-50"
              >
                {td.cancel}
              </button>
            </div>
          </form>
        ) : (
          /* View mode */
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg space-y-lg">
            {/* Job Title */}
            <ViewField label={td.jobTitle} value={application.jobTitle} />

            {/* Company */}
            <ViewField label={td.companyName} value={application.company.name} />

            {/* Status */}
            <ViewField
              label={td.status}
              value={td.statuses[screamingSnakeToCamel(application.status) as keyof typeof td.statuses]}
            />

            {/* Category & Source */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <ViewField
                label={td.category}
                value={td.categories[screamingSnakeToCamel(application.category) as keyof typeof td.categories]}
              />
              <ViewField
                label={td.source}
                value={td.sources[screamingSnakeToCamel(application.source) as keyof typeof td.sources]}
              />
            </div>

            {/* Application Date */}
            <ViewField label={td.applicationDate} value={formatDate(application.applicationDate)} />

            {/* Offer URL */}
            <ViewField label={td.offerUrl}>
              {application.offerUrl ? (
                <a
                  href={application.offerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-body-md"
                >
                  {application.offerUrl}
                </a>
              ) : (
                <span className="text-on-surface-variant">—</span>
              )}
            </ViewField>

            {/* Job Description */}
            <ViewField label={td.jobDescription}>
              <p className="font-body-md text-body-md text-on-surface whitespace-pre-wrap">
                {application.jobDescription || '—'}
              </p>
            </ViewField>

            {/* Notes */}
            <ViewField label={td.notes}>
              <p className="font-body-md text-body-md text-on-surface whitespace-pre-wrap">
                {application.notes || '—'}
              </p>
            </ViewField>

            {/* Divider */}
            <hr className="border-outline-variant" />

            {/* Timestamps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <ViewField label={td.createdAt} value={formatDate(application.createdAt)} />
              <ViewField label={td.updatedAt} value={formatDate(application.updatedAt)} />
            </div>
          </div>
        )}

        {/* Back to Kanban */}
        <div className="pb-lg">
          <button
            onClick={() => navigate('/kanban')}
            className="flex items-center gap-1 font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            {td.backToKanban}
          </button>
        </div>
      </div>
    </>
  )
}

function ViewField({
  label,
  value,
  children,
}: {
  label: string
  value?: string
  children?: React.ReactNode
}) {
  return (
    <div>
      <p className="font-label-md text-label-sm text-on-surface-variant mb-xs">{label}</p>
      {children ?? (
        <p className="font-body-md text-body-md text-on-surface">{value || '—'}</p>
      )}
    </div>
  )
}
