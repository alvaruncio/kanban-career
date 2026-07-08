export interface Company {
  id: string
  name: string
  website: string | null
  description: string | null
  linkedinUrl: string | null
  userId: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface CompaniesState {
  companies: Company[]
  isLoading: boolean
  error: string | null
  fetchCompanies: () => Promise<void>
}
