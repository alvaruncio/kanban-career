import { useI18nStore } from '../../stores'
import { PageMeta, LegalDocument } from '../../components'

export default function TermsPage() {
  const { t } = useI18nStore()
  const content = t.legal.terms

  return (
    <>
      <PageMeta title={content.title} description={content.description} />
      <LegalDocument content={content} />
    </>
  )
}
