import { useI18nStore } from '../../stores'
import { PageMeta, LegalDocument } from '../../components'

export default function PrivacyPage() {
  const { t } = useI18nStore()
  const content = t.legal.privacy

  return (
    <>
      <PageMeta title={content.title} description={content.description} />
      <LegalDocument content={content} />
    </>
  )
}
