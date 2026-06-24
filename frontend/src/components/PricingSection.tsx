export default function PricingSection() {
  return (
    <section className="max-w-7xl mx-auto px-gutter py-xl flex flex-col items-center" id="pricing">
      <div className="text-center mb-lg">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Planes</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[42rem] mx-auto mt-2">Estamos definiendo la estructura de membresías. Pronto tendrás más detalles.</p>
      </div>
      <div className="flex flex-col md:flex-row gap-lg w-full justify-center">
        <div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm flex flex-col relative">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-1">Plan Gratis</h3>
          <div className="flex-1 flex items-center justify-center py-xl">
            <div className="text-center">
              <span className="material-symbols-outlined text-[2.5rem] text-on-surface-variant">construction</span>
              <p className="font-body-md text-body-md text-on-surface-variant mt-sm">En desarrollo</p>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-surface-container-lowest border-2 border-primary rounded-xl p-lg shadow-md flex flex-col relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-on-primary font-label-sm text-label-sm px-3 py-1 rounded-full">
            Recomendado
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-1">Plan Pro</h3>
          <div className="flex-1 flex items-center justify-center py-xl">
            <div className="text-center">
              <span className="material-symbols-outlined text-[2.5rem] text-on-surface-variant">construction</span>
              <p className="font-body-md text-body-md text-on-surface-variant mt-sm">En desarrollo</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
