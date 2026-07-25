import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18nStore, useCompaniesStore } from '../../../stores'
import { Modal } from '../../Modal/Modal'
import { CompanyForm } from '../../CompanyForm/CompanyForm'

interface Props {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

export function CreateCompanyModal({ open, onClose, onCreated }: Props) {
  const { t } = useI18nStore()
  const navigate = useNavigate()
  const { createCompany } = useCompaniesStore()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const handleSubmit = async (data: { name: string; website?: string; linkedinUrl?: string; description?: string }) => {
    setIsSubmitting(true)
    setServerError(null)
    try {
      const created = await createCompany({
        name: data.name,
        website: data.website || undefined,
        linkedinUrl: data.linkedinUrl || undefined,
        description: data.description || undefined,
      })
      onClose()
      onCreated()
      navigate(`/companies/${created.id}`)
    } catch (err) {
      setServerError((err as Error).message || t.companies.saveError)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title={t.companies.create}>
      <div className="px-lg pb-lg">
        <CompanyForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          serverError={serverError}
          submitLabel={t.companies.save}
          cancelLabel={t.companies.cancel}
          onCancel={handleClose}
        />
      </div>
    </Modal>
  )
}
