import { useI18nStore, useCompaniesStore } from '../../stores'
import { Modal } from '../Modal/Modal'
import { ApplicationForm } from '../ApplicationForm/ApplicationForm'
import type { ApplicationFormData } from '../../models'

interface Props {
  open: boolean
  onClose: () => void
  onSubmit: (data: ApplicationFormData) => Promise<void>
  isSubmitting: boolean
  serverError: string
}

export function ApplicationFormModal({ open, onClose, onSubmit, isSubmitting, serverError }: Props) {
  const { t } = useI18nStore()
  const { companies } = useCompaniesStore()

  return (
    <Modal open={open} onClose={onClose} title={t.applicationForm.title}>
      <ApplicationForm
        onSubmit={onSubmit}
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