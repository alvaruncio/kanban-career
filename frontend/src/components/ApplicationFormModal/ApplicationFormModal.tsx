import { useState, useEffect } from 'react'
import { Modal } from '../Modal/Modal'
import { ApplicationForm } from '../ApplicationForm/ApplicationForm'
import { useI18nStore, useApplicationsStore, useCompaniesStore } from '../../stores'

interface Props {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function ApplicationFormModal({ open, onClose, onSuccess }: Props) {
  const { t } = useI18nStore()
  const { addApplication } = useApplicationsStore()
  const { companies, fetchCompanies } = useCompaniesStore()
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open && companies.length === 0) {
      fetchCompanies()
    }
  }, [open, companies.length, fetchCompanies])

  const handleSubmit = async (data: Parameters<typeof addApplication>[0]) => {
    setServerError('')
    setIsSubmitting(true)
    try {
      await addApplication(data)
      onSuccess?.()
      onClose()
    } catch (err) {
      setServerError((err as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={t.applicationForm.title}>
      <ApplicationForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel={t.applicationForm.submit}
        cancelLabel={t.applicationForm.cancel}
        onCancel={onClose}
        companies={companies}
        serverError={serverError}
      />
    </Modal>
  )
}