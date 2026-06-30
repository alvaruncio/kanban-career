export interface Translation {
  nav: Record<string, string>
  footer: Record<string, string>
  hero: Record<string, string>
  pricing: Record<string, string>
  login: Record<string, string>
  register: Record<string, string>
  dashboard: Record<string, string>
  kanban: Record<string, string>
  language: Record<string, string>
  common: {
    loading: string
    notFoundTitle: string
    notFoundDescription: string
    backToHome: string
  }
}

export type Locale = 'es' | 'en'
