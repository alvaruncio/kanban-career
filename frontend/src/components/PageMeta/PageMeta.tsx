import { Helmet } from 'react-helmet-async'

const BASE_TITLE = 'KanbanCareer'

export function PageMeta({ title, description }: { title: string; description?: string }) {
  const fullTitle = `${title} | ${BASE_TITLE}`
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
    </Helmet>
  )
}