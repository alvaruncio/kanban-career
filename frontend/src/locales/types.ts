export interface Translation {
  nav: Record<string, string>
  footer: Record<string, string>
  hero: Record<string, string>
  pricing: Record<string, string>
  login: Record<string, string>
  register: Record<string, string>
  dashboard: Record<string, string>
  kanban: {
    title: string
    subtitle: string
    addApplication: string
    searchPlaceholder: string
    filterBy: string
    company: string
    createCard: string
    viewOffer: string
    columnApplied: string
    columnInterview: string
    columnOffer: string
    columnHired: string
    columnRejected: string
    dragHere: string
    months: {
      all: string
    }
    companies: {
      all: string
    }
    categories: {
      frontend: string
      backend: string
      fullStack: string
    }
    timeAgo: {
      today: string
      yesterday: string
      tomorrow: string
      daysAgo: string
      weekAgo: string
    }
  }
  language: Record<string, string>
  common: {
    loading: string
    notFoundTitle: string
    notFoundDescription: string
    backToHome: string
  }
}

export type Locale = 'es' | 'en'
