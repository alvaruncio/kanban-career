import { HeroSection, PricingSection, PageMeta } from '../../components'

export default function LandingPage() {

  return (
    <>
      <PageMeta title="El Jira para tu búsqueda de empleo" description="Organiza tu búsqueda de empleo con KanbanCareer. Gestiona candidaturas, empresas y entrevistas en un tablero kanban tipo CRM." />
      <HeroSection />
      <PricingSection />
    </>
  )
}