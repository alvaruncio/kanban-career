import { useI18nStore } from '../stores/i18nStore'
import PricingCard from './PricingCard'

export default function PricingSection() {
  const { t } = useI18nStore()

  return (
    <section className="max-w-7xl mx-auto px-gutter py-xl flex flex-col items-center" id="pricing">
      <div className="text-center mb-lg">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">{t.pricing.title}</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[42rem] mx-auto mt-2">{t.pricing.description}</p>
      </div>
      <div className="flex flex-col md:flex-row gap-lg w-full justify-center">
        <PricingCard title={t.pricing.freePlan}>
          <div className="text-center">
            <span className="material-symbols-outlined text-[2.5rem] text-on-surface-variant">construction</span>
            <p className="font-body-md text-body-md text-on-surface-variant mt-sm">{t.pricing.inDevelopment}</p>
          </div>
        </PricingCard>
        <PricingCard title={t.pricing.proPlan} recommended recommendedLabel={t.pricing.recommended}>
          <div className="text-center">
            <span className="material-symbols-outlined text-[2.5rem] text-on-surface-variant">construction</span>
            <p className="font-body-md text-body-md text-on-surface-variant mt-sm">{t.pricing.inDevelopment}</p>
          </div>
        </PricingCard>
      </div>
    </section>
  )
}
