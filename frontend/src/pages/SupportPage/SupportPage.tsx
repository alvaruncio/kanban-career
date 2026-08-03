import { useI18nStore } from '../../stores'
import { PageMeta, LegalDocument } from '../../components'

export default function SupportPage() {
  const { t } = useI18nStore()
  const content = t.legal.support

  return (
    <>
      <PageMeta title={content.title} description={content.description} />
      <LegalDocument content={content}>
        <h2 className="font-headline-md text-headline-md text-on-surface mb-md">{content.faqTitle}</h2>
        <div className="space-y-sm mb-lg">
          {content.faq.map((item) => (
            <details key={item.heading} name="faq" className="group bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
              <summary className="flex items-center justify-between gap-md cursor-pointer list-none p-lg font-body-md text-body-md font-semibold text-on-surface hover:bg-surface-container-low transition-colors [&::-webkit-details-marker]:hidden">
                {item.heading}
                <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant transition-transform duration-200 group-open:rotate-180">
                  expand_more
                </span>
              </summary>
              <div className="grid grid-rows-[0fr] group-open:grid-rows-[1fr] transition-[grid-template-rows] duration-200 ease-out">
                <div className="overflow-hidden min-h-0">
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed px-lg pb-lg">{item.body}</p>
                </div>
              </div>
            </details>
          ))}
        </div>
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-md">{content.contactTitle}</h2>
          <ul className="space-y-md">
            <li className="flex items-center gap-md">
              <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant">mail</span>
              <span className="font-body-md text-body-md text-on-surface-variant">{content.emailLabel}:{' '}</span>
              <a href={`mailto:${content.contactEmail}`} className="text-primary hover:underline">
                {content.contactEmail}
              </a>
            </li>
            <li className="flex items-center gap-md">
              <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant">schedule</span>
              <span className="font-body-md text-body-md text-on-surface-variant">
                {content.hoursLabel}: {content.hoursValue}
              </span>
            </li>
            <li className="flex items-center gap-md">
              <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant">bolt</span>
              <span className="font-body-md text-body-md text-on-surface-variant">
                {content.responseLabel}: {content.responseValue}
              </span>
            </li>
          </ul>
        </section>
      </LegalDocument>
    </>
  )
}
