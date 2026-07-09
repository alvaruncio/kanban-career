export interface Translation {
  nav: Record<string, string>
  footer: Record<string, string>
  hero: Record<string, string>
  pricing: Record<string, string>
  login: Record<string, string> & { invalidCredentials: string }
  register: {
    title: string
    subtitle: string
    name: string
    namePlaceholder: string
    email: string
    emailPlaceholder: string
    nameMinLength: string
    emailRequired: string
    emailInvalid: string
    password: string
    passwordRequired: string
    passwordMinLength: string
    passwordUppercase: string
    passwordLowercase: string
    passwordNumber: string
    passwordSymbol: string
    confirmPassword: string
    confirmPasswordMismatch: string
    submit: string
    submitting: string
    hasAccount: string
    login: string
  }
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
  applicationForm: {
    title: string
    submit: string
    cancel: string
    companyPlaceholder: string
    categoryPlaceholder: string
    sourcePlaceholder: string
    jobDescriptionLabel: string
    jobDescriptionPlaceholder: string
    notes: string
    notesPlaceholder: string
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
