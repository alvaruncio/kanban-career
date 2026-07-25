import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18nStore, useCompaniesStore } from '../../stores'
import { PageMeta, LoadingSkeleton } from '../../components'
import { CreateCompanyModal } from '../../components/companies'
import type { Company } from '../../interfaces'

export default function CompaniesPage() {
  const { t } = useI18nStore()
  const navigate = useNavigate()
  const { companies, isLoading, error, fetchCompanies } = useCompaniesStore()
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchCompanies()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreated = () => {
    setShowCreateModal(false)
    fetchCompanies()
  }

  return (
    <>
      <PageMeta title={t.companies.title} description={t.companies.pageDescription} />

      <div className="max-w-7xl mx-auto px-gutter py-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-lg">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">
              {t.companies.title}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
              {t.companies.pageDescription}
            </p>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && companies.length === 0 && (
          <LoadingSkeleton />
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-md">
            <div className="bg-error-container text-error font-body-md text-body-md px-lg py-md rounded-lg" role="alert">
              {t.companies.fetchError}
            </div>
            <button
              type="button"
              onClick={fetchCompanies}
              className="font-label-md text-label-md bg-primary text-on-primary px-4 py-2 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors active:scale-95"
            >
              {t.companies.retry}
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && companies.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-md">
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              {t.companies.noCompanies}
            </p>
          </div>
        )}

        {/* Card grid */}
        {!isLoading && !error && companies.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
            {companies.map((company: Company) => (
              <button
                key={company.id}
                type="button"
                onClick={() => navigate(`/companies/${company.id}`)}
                className="text-left bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm p-lg hover:shadow-md hover:border-primary transition-shadow transition-colors active:scale-[0.99]"
              >
                <h3 className="font-headline-md text-headline-md text-on-surface mb-sm">
                  {company.name}
                </h3>
                {company.description && (
                  <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2 mb-sm">
                    {company.description}
                  </p>
                )}
                {company.website && (
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    {company.website}
                  </p>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* FAB — New company */}
      <button
        type="button"
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-lg right-lg z-40 flex items-center gap-2 bg-primary text-on-primary font-label-md text-label-md px-5 py-3 rounded-full shadow-lg hover:bg-primary-container hover:text-on-primary-container transition-colors active:scale-95"
      >
        <span className="material-symbols-outlined text-xl">add</span>
        {t.companies.newCompany}
      </button>

      {/* Create modal */}
      <CreateCompanyModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={handleCreated}
      />
    </>
  )
}
