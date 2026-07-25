import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useI18nStore, useCompaniesStore } from '../../stores'
import { ApplicationService } from '../../services'
import { PageMeta, LoadingSkeleton, CompanyForm } from '../../components'
import type { ApplicationKanbanDTO } from '../../interfaces'

export default function CompanyDetailPage() {
  const { t } = useI18nStore()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { company, isLoading, error, getById, updateCompany } = useCompaniesStore()

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [relatedApplications, setRelatedApplications] = useState<ApplicationKanbanDTO[] | null>(null)
  const [relatedAppsLoading, setRelatedAppsLoading] = useState(true)
  const [relatedAppsError, setRelatedAppsError] = useState<string | null>(null)

  // Fetch company on mount/id change (A→B stale data guard: store resets company to null)
  useEffect(() => {
    if (!id) return
    getById(id)
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch related applications
  useEffect(() => {
    if (!id) return
    setRelatedAppsLoading(true)
    setRelatedAppsError(null)
    ApplicationService.getByCompanyId(id)
      .then(apps => {
        setRelatedApplications(apps)
        setRelatedAppsLoading(false)
      })
      .catch(() => {
        setRelatedAppsError(t.companies.fetchError)
        setRelatedAppsLoading(false)
      })
  }, [id, t.companies.fetchError])

  // Auto-dismiss flash messages
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

  const handleSave = async (data: { name: string; website?: string; linkedinUrl?: string; description?: string }) => {
    if (!id) return
    setIsSaving(true)
    setSuccessMessage(null)
    setSaveError(null)
    try {
      await updateCompany(id, {
        name: data.name,
        website: data.website || undefined,
        linkedinUrl: data.linkedinUrl || undefined,
        description: data.description || undefined,
      })
      setSuccessMessage(t.companies.saved)
      setIsEditing(false)
    } catch {
      setSaveError(t.companies.saveError)
    } finally {
      setIsSaving(false)
    }
  }

  // Loading state (A→B guard: isLoading is true while company is being fetched)
  if (isLoading && !company) {
    return <LoadingSkeleton />
  }

  // Error / not found state
  if (error || !company) {
    return (
      <>
        <PageMeta title={t.common.notFoundTitle} description="" />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="font-body-md text-body-md text-error mb-md">
              {error ?? t.common.notFoundTitle}
            </p>
            <button
              onClick={() => navigate('/companies')}
              className="font-label-md text-label-md text-primary hover:underline transition-colors"
            >
              {t.companies.backToCompanies}
            </button>
          </div>
        </div>
      </>
    )
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString()
  }

  const cd = t.companies

  return (
    <>
      <PageMeta title={`${company.name} — ${cd.title}`} description="" />
      <div className="max-w-3xl w-full mx-auto px-gutter space-y-lg py-xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/companies')}
            className="flex items-center gap-1 text-on-surface-variant hover:text-on-surface transition-colors font-label-md"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            {cd.backToCompanies}
          </button>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">edit</span>
              {cd.edit}
            </button>
          )}
        </div>

        {/* Title */}
        <h1 className="font-headline-lg text-headline-lg text-on-surface">
          {company.name}
        </h1>

        {/* Flash messages */}
        {successMessage && (
          <div className="bg-secondary-container text-secondary font-body-md text-body-md px-lg py-md rounded-lg" role="alert">
            {successMessage}
          </div>
        )}

        {/* Edit mode */}
        {isEditing ? (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
            <CompanyForm
              defaultValues={{
                name: company.name,
                website: company.website ?? '',
                linkedinUrl: company.linkedinUrl ?? '',
                description: company.description ?? '',
              }}
              onSubmit={handleSave}
              isSubmitting={isSaving}
              serverError={saveError}
              submitLabel={cd.save}
              cancelLabel={cd.cancel}
              onCancel={handleCancel}
            />
          </div>
        ) : (
          /* View mode */
          <>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg space-y-lg">
              <ViewField label={cd.name} value={company.name} />

              <ViewField label={cd.website}>
                {company.website ? (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-body-md"
                  >
                    {company.website}
                  </a>
                ) : (
                  <span className="text-on-surface-variant">—</span>
                )}
              </ViewField>

              <ViewField label={cd.linkedinUrl}>
                {company.linkedinUrl ? (
                  <a
                    href={company.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-body-md"
                  >
                    {company.linkedinUrl}
                  </a>
                ) : (
                  <span className="text-on-surface-variant">—</span>
                )}
              </ViewField>

              <ViewField label={cd.description}>
                <p className="font-body-md text-body-md text-on-surface whitespace-pre-wrap">
                  {company.description || '—'}
                </p>
              </ViewField>

              <hr className="border-outline-variant" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <ViewField label={cd.createdAt} value={formatDate(company.createdAt)} />
                <ViewField label={cd.updatedAt} value={formatDate(company.updatedAt)} />
              </div>
            </div>

            {/* Related Applications Section */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-md">
                {cd.relatedApplications}
              </h2>

              {relatedAppsLoading && (
                <div className="flex items-center justify-center py-lg">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {relatedAppsError && !relatedAppsLoading && (
                <p className="font-body-md text-body-md text-error">
                  {relatedAppsError}
                </p>
              )}

              {!relatedAppsLoading && !relatedAppsError && relatedApplications && relatedApplications.length === 0 && (
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {cd.noRelatedApplications}
                </p>
              )}

              {!relatedAppsLoading && !relatedAppsError && relatedApplications && relatedApplications.length > 0 && (
                <div className="space-y-sm">
                  {relatedApplications.map((app) => (
                    <Link
                      key={app.id}
                      to={`/application/${app.id}`}
                      className="flex items-center justify-between p-md rounded-lg border border-outline-variant bg-surface-container-lowest hover:border-primary hover:shadow-sm transition-colors transition-shadow"
                    >
                      <div className="flex items-center gap-md">
                        <span className="font-body-md text-body-md text-on-surface">
                          {app.jobTitle}
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          {app.company?.name ?? ''}
                        </span>
                      </div>
                      <span className="font-label-sm text-label-sm px-xs py-[2px] rounded-full bg-primary-container text-primary">
                        {app.status}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
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
