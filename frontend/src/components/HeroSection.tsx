import { useI18nStore } from '../stores/i18nStore'

export default function HeroSection() {
  const { t } = useI18nStore()

  return (
    <section className="max-w-7xl mx-auto px-gutter pt-xl pb-2xl grid grid-cols-1 lg:grid-cols-2 items-center gap-2xl">
      <div className="flex-1 space-y-lg">
        <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight">
          {t.hero.title} <span className="text-primary">{t.hero.titleAccent}</span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
          {t.hero.subtitle}
        </p>
        <form className="flex flex-col sm:flex-row gap-sm max-w-[28rem] w-full" onSubmit={e => e.preventDefault()}>
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" aria-hidden="true">mail</span>
            <label htmlFor="hero-email" className="sr-only">{t.hero.emailLabel}</label>
            <input
              id="hero-email"
              className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
              placeholder={t.hero.emailPlaceholder}
              required
              type="email"
            />
          </div>
          <button
            className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-all shadow-md active:scale-95 whitespace-nowrap"
            type="submit"
          >
            {t.hero.startFree}
          </button>
        </form>
        <p className="font-label-sm text-label-sm text-on-surface-variant">{t.hero.noCard}</p>
      </div>
      <div className="flex-1 w-full relative">
        <div className="relative bg-surface-container-low border border-outline-variant rounded-xl shadow-lg p-md overflow-hidden" style={{ minHeight: 420 }}>
          <div className="absolute inset-0 bg-gradient-to-br from-surface-bright/50 to-surface-dim/20 pointer-events-none" />
          <div className="flex gap-md h-full overflow-x-auto relative z-10 pb-2">
            <div className="w-64 flex-shrink-0 flex flex-col gap-sm">
              <div className="flex items-center gap-2 px-2 pb-2 border-b border-outline-variant/50">
                <span className="w-2 h-2 rounded-full bg-outline" aria-hidden="true" />
                <span className="font-label-md text-label-md text-on-surface">{t.hero.columnSaved} <span className="text-on-surface-variant ml-1">12</span></span>
              </div>
              <div className="bg-surface-container-lowest p-sm rounded-lg border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow">
                <span className="font-label-sm text-label-sm bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded">Data Scientist</span>
                <h4 className="font-body-md text-body-md font-semibold mb-1 mt-2">AI Dynamics</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Remoto</p>
              </div>
              <div className="bg-surface-container-lowest p-sm rounded-lg border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow">
                <span className="font-label-sm text-label-sm bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded">Product Manager</span>
                <h4 className="font-body-md text-body-md font-semibold mb-1 mt-2">FinTech Labs</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Barcelona</p>
              </div>
            </div>
            <div className="w-64 flex-shrink-0 flex flex-col gap-sm">
              <div className="flex items-center gap-2 px-2 pb-2 border-b border-outline-variant/50">
                <span className="w-2 h-2 rounded-full bg-outline" aria-hidden="true" />
                <span className="font-label-md text-label-md text-on-surface">{t.hero.columnApplied} <span className="text-on-surface-variant ml-1">8</span></span>
              </div>
              <div className="bg-surface-container-lowest p-sm rounded-lg border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow">
                <span className="font-label-sm text-label-sm bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded">Frontend Dev</span>
                <h4 className="font-body-md text-body-md font-semibold mb-1 mt-2">TechCorp Inc.</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Madrid, España</p>
              </div>
              <div className="bg-surface-container-lowest p-sm rounded-lg border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow">
                <span className="font-label-sm text-label-sm bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded">UX Designer</span>
                <h4 className="font-body-md text-body-md font-semibold mb-1 mt-2">DesignStudio</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Híbrido</p>
              </div>
            </div>
            <div className="w-64 flex-shrink-0 flex flex-col gap-sm">
              <div className="flex items-center gap-2 px-2 pb-2 border-b border-outline-variant/50">
                <span className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
                <span className="font-label-md text-label-md text-on-surface">{t.hero.columnInterview} <span className="text-on-surface-variant ml-1">4</span></span>
              </div>
              <div className="bg-surface-container-lowest p-sm rounded-lg border border-primary/30 shadow-sm ring-1 ring-primary/10 hover:shadow-md transition-shadow">
                <span className="font-label-sm text-label-sm bg-primary-container text-on-primary-container px-2 py-0.5 rounded">Fullstack</span>
                <h4 className="font-body-md text-body-md font-semibold mb-1 mt-2">Innovate LLC</h4>
                <div className="flex items-center gap-1 text-primary mt-2">
                  <span className="material-symbols-outlined text-sm" aria-hidden="true">event</span>
                  <span className="font-label-sm text-label-sm">{t.hero.today}, 16:00</span>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-sm rounded-lg border border-primary/30 shadow-sm ring-1 ring-primary/10 hover:shadow-md transition-shadow">
                <span className="font-label-sm text-label-sm bg-primary-container text-on-primary-container px-2 py-0.5 rounded">Backend Dev</span>
                <h4 className="font-body-md text-body-md font-semibold mb-1 mt-2">API Solutions</h4>
                <div className="flex items-center gap-1 text-primary mt-2">
                  <span className="material-symbols-outlined text-sm" aria-hidden="true">event</span>
                  <span className="font-label-sm text-label-sm">Mié, 10:30</span>
                </div>
              </div>
            </div>
            <div className="w-64 flex-shrink-0 flex flex-col gap-sm">
              <div className="flex items-center gap-2 px-2 pb-2 border-b border-outline-variant/50">
                <span className="w-2 h-2 rounded-full bg-secondary" aria-hidden="true" />
                <span className="font-label-md text-label-md text-on-surface">{t.hero.columnOffer} <span className="text-on-surface-variant ml-1">2</span></span>
              </div>
              <div className="bg-surface-container-lowest p-sm rounded-lg border border-secondary/30 shadow-sm bg-gradient-to-br from-secondary/5 to-transparent hover:shadow-md transition-shadow">
                <span className="font-label-sm text-label-sm bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded">Tech Lead</span>
                <h4 className="font-body-md text-body-md font-semibold mb-1 mt-2">Global Solutions</h4>
                <p className="font-body-sm text-body-sm text-secondary font-medium">{t.hero.offerReceived}</p>
              </div>
              <div className="bg-surface-container-lowest p-sm rounded-lg border border-secondary/30 shadow-sm hover:shadow-md transition-shadow">
                <span className="font-label-sm text-label-sm bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded">Mobile Dev</span>
                <h4 className="font-body-md text-body-md font-semibold mb-1 mt-2">AppWorks</h4>
                <p className="font-body-sm text-body-sm text-secondary font-medium">{t.hero.offerPending}</p>
              </div>
            </div>
            <div className="w-64 flex-shrink-0 flex flex-col gap-sm">
              <div className="flex items-center gap-2 px-2 pb-2 border-b border-outline-variant/50">
                <span className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
                <span className="font-label-md text-label-md text-on-surface">{t.hero.columnAccepted} <span className="text-on-surface-variant ml-1">1</span></span>
              </div>
              <div className="bg-surface-container-lowest p-sm rounded-lg border border-outline-variant/30 shadow-sm opacity-70 hover:shadow-md transition-shadow">
                <span className="font-label-sm text-label-sm bg-primary-container text-on-primary-container px-2 py-0.5 rounded">Senior Designer</span>
                <h4 className="font-body-md text-body-md font-semibold mb-1 mt-2">NextGen Apps</h4>
                <p className="font-body-sm text-body-sm text-primary font-medium">{t.hero.acceptedCelebration}</p>
              </div>
            </div>
            <div className="w-64 flex-shrink-0 flex flex-col gap-sm">
              <div className="flex items-center gap-2 px-2 pb-2 border-b border-outline-variant/50">
                <span className="w-2 h-2 rounded-full bg-error" aria-hidden="true" />
                <span className="font-label-md text-label-md text-on-surface">{t.hero.columnRejected} <span className="text-on-surface-variant ml-1">5</span></span>
              </div>
              <div className="bg-surface-container-lowest p-sm rounded-lg border border-outline-variant/30 shadow-sm opacity-50 hover:shadow-md transition-shadow">
                <span className="font-label-sm text-label-sm bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded">Backend Dev</span>
                <h4 className="font-body-md text-body-md font-semibold mb-1 mt-2">Old School Corp</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{t.hero.rejectedNoMatch}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1 mt-3" aria-hidden="true">
          <span className="w-2 h-2 rounded-full bg-outline-variant" />
          <span className="w-6 h-1.5 rounded-full bg-primary" />
          <span className="w-2 h-2 rounded-full bg-outline-variant" />
          <span className="w-2 h-2 rounded-full bg-outline-variant" />
          <span className="w-2 h-2 rounded-full bg-outline-variant" />
          <span className="text-label-sm text-label-sm text-outline-variant ml-2">{t.hero.scrollMore}</span>
        </div>
      </div>
    </section>
  )
}
