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
  dashboard: {
    title: string
    totalApplications: string
    activeApplications: string
    pendingInterviews: string
    offersReceived: string
    responseRate: string
    upcomingInterviews: string
    noInterviews: string
    recentActivity: string
    activityDescription: string
    pageDescription: string
    monthlyEvolution: string
    statusDistribution: string
    conversionFunnel: string
    bySource: string
    byCategory: string
    noData: string
    noActivity: string
    errorLoading: string
    allMonths: string
  }
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
  profile: {
    title: string
    subtitle: string
    edit: string
    cancel: string
    save: string
    saving: string
    name: string
    email: string
    bio: string
    bioPlaceholder: string
    linkedinUrl: string
    website: string
    phone: string
    avatarUrl: string
    notSet: string
    passwordSection: string
    currentPassword: string
    newPassword: string
    confirmPassword: string
    changePassword: string
    changingPassword: string
    passwordSuccess: string
    profileSaved: string
    emailInvalid: string
    urlInvalid: string
    avatarFallbackText: string
  }
  applicationDetail: {
    title: string
    subtitle: string
    edit: string
    cancel: string
    save: string
    saving: string
    backToKanban: string
    jobTitle: string
    companyName: string
    selectCompany: string
    status: string
    category: string
    source: string
    applicationDate: string
    offerUrl: string
    jobDescription: string
    notes: string
    createdAt: string
    updatedAt: string
    saved: string
    saveError: string
    fetchError: string
    notFound: string
    statuses: {
      applied: string
      interview: string
      offer: string
      hired: string
      rejected: string
    }
    sources: {
      linkedin: string
      infojobs: string
      indeed: string
      tecnoempleo: string
      companyWebsite: string
      referral: string
      other: string
    }
    categories: {
      frontend: string
      backend: string
      fullStack: string
    }
  }
  common: {
    loading: string
    notFoundTitle: string
    notFoundDescription: string
    backToHome: string
  }
}

export type Locale = 'es' | 'en'
