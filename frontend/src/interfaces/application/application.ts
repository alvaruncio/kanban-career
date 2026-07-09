export const APPLICATION_STATUS = {
  APPLIED: 'APPLIED',
  INTERVIEW: 'INTERVIEW',
  OFFER: 'OFFER',
  HIRED: 'HIRED',
  REJECTED: 'REJECTED',
} as const
export type ApplicationStatus = (typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS]

export const APPLICATION_CATEGORY = {
  FRONTEND: 'FRONTEND',
  BACKEND: 'BACKEND',
  FULL_STACK: 'FULL_STACK',
} as const
export type ApplicationCategory = (typeof APPLICATION_CATEGORY)[keyof typeof APPLICATION_CATEGORY]

export const APPLICATION_SOURCE = {
  LINKEDIN: 'LINKEDIN',
  INFOJOBS: 'INFOJOBS',
  INDEED: 'INDEED',
  TECNOEMPLEO: 'TECNOEMPLEO',
  COMPANY_WEBSITE: 'COMPANY_WEBSITE',
  REFERRAL: 'REFERRAL',
  OTHER: 'OTHER',
} as const
export type ApplicationSource = (typeof APPLICATION_SOURCE)[keyof typeof APPLICATION_SOURCE]

export interface CreateApplicationDTO {
  jobTitle: string
  offerUrl: string
  companyId: string
  category: ApplicationCategory
  source: ApplicationSource
  applicationDate: string
  jobDescription?: string | null
  notes?: string | null
}

export interface Application {
  id: string
  jobTitle: string
  jobDescription: string
  offerUrl: string
  companyId: string
  userId: number
  status: ApplicationStatus
  category: ApplicationCategory
  applicationDate: string
  source: ApplicationSource
  notes?: string | null
  createdAt: string
  updatedAt: string
}

export interface ApplicationKanbanDTO extends Application {
  company: {
    id: string
    name: string
    website?: string | null
  }
}

export interface ApplicationsState {
  applications: ApplicationKanbanDTO[]
  isLoading: boolean
  error: string | null
  fetchApplications: () => Promise<void>
  addApplication: (app: CreateApplicationDTO) => Promise<void>
  updateApplication: (id: string, data: Partial<Application>) => Promise<void>
  deleteApplication: (id: string) => Promise<void>
}
