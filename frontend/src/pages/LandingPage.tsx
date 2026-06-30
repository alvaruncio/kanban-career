import { usePageMeta } from '../hooks/usePageMeta'
import HeroSection from '../components/HeroSection'
import PricingSection from '../components/PricingSection'

export default function LandingPage() {
  const pageMeta = usePageMeta(
    'El Jira para tu búsqueda de empleo',
    'Organiza tu búsqueda de empleo con KanbanCareer. Gestiona candidaturas, empresas y entrevistas en un tablero kanban tipo CRM.',
  )

  return (
    <>
      {pageMeta}
      <HeroSection />
      <PricingSection />
    </>
  )
}
