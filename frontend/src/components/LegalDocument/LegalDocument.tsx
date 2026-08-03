import type { ReactNode } from 'react'
import type { LegalPageContent } from '../../locales'

interface LegalDocumentProps {
  content: LegalPageContent
  children?: ReactNode
}

function TocNav({ content, className }: { content: LegalPageContent; className?: string }) {
  return (
    <nav aria-label={content.tocTitle} className={className}>
      <h2 className="font-headline-md text-headline-md text-on-surface mb-md">{content.tocTitle}</h2>
      <ol className="space-y-sm">
        {content.chapters.map((chapter) => (
          <li key={chapter.id}>
            <a
              href={`#${chapter.id}`}
              className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors rounded-sm focus-visible:ring-2 focus-visible:ring-primary outline-none"
            >
              {chapter.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function LegalDocument({ content, children }: LegalDocumentProps) {
  return (
    <div className="max-w-7xl mx-auto px-gutter py-xl">
      <div className="lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-xl">
        <aside className="hidden lg:block">
          <TocNav content={content} className="lg:sticky lg:top-20" />
        </aside>
        <div className="max-w-3xl">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-md">{content.title}</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant mb-lg">{content.effectiveDate}</p>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg">{content.description}</p>

          <section aria-labelledby="intro-heading" className="mb-xl">
            <h2 id="intro-heading" className="font-headline-md text-headline-md text-on-surface mb-md">
              {content.intro.heading}
            </h2>
            <div className="space-y-md">
              {content.intro.summaryPoints.map((point) => (
                <p key={point.term} className="font-body-md text-body-md text-on-surface leading-relaxed">
                  <strong className="font-semibold">{point.term}</strong> {point.text}
                </p>
              ))}
            </div>
          </section>

          <TocNav content={content} className="lg:hidden mb-xl" />

          <div className="space-y-xl">
            {content.chapters.map((chapter) => (
              <section key={chapter.id} id={chapter.id} aria-labelledby={`${chapter.id}-heading`} className="scroll-mt-24">
                <h2 id={`${chapter.id}-heading`} className="font-headline-md text-headline-md text-on-surface mb-md">
                  {chapter.title}
                </h2>
                {chapter.intro?.map((paragraph) => (
                  <p key={paragraph} className="font-body-md text-body-md text-on-surface leading-relaxed mb-md">
                    {paragraph}
                  </p>
                ))}
                {chapter.subsections?.map((subsection) => (
                  <div key={subsection.title} className="mb-md">
                    <h3 className="font-body-lg text-body-lg font-semibold text-on-surface mb-sm">{subsection.title}</h3>
                    {subsection.body.map((paragraph) => (
                      <p key={paragraph} className="font-body-md text-body-md text-on-surface leading-relaxed mb-sm">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ))}
                {chapter.body?.map((paragraph) => (
                  <p key={paragraph} className="font-body-md text-body-md text-on-surface leading-relaxed mb-md">
                    {paragraph}
                  </p>
                ))}
                {chapter.list && (
                  <ul className="list-disc pl-md space-y-sm">
                    {chapter.list.map((item) => (
                      <li key={item} className="font-body-md text-body-md text-on-surface leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {children && <div className="mt-xl">{children}</div>}
        </div>
      </div>
    </div>
  )
}
