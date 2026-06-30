import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import { useI18nStore } from '../stores/i18nStore'

export default function NotFoundPage() {
  const { t } = useI18nStore()
  const pageMeta = usePageMeta(t.common.notFoundTitle, t.common.notFoundDescription)

  return (
    <>
      {pageMeta}
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center px-gutter py-xl w-full max-w-[32rem]">
          <p className="font-mono-sm text-mono-sm text-primary font-semibold mb-sm">404</p>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-md">
            {t.common.notFoundTitle}
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mb-lg">
            {t.common.notFoundDescription}
          </p>
          <Link
            to="/"
            className="inline-flex bg-primary text-on-primary font-label-md text-label-md px-lg py-md rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-all shadow-md active:scale-95"
          >
            {t.common.backToHome}
          </Link>
        </div>
      </div>
    </>
  )
}
