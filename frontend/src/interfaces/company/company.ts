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

export interface CreateCompanyDTO {
  name: string
  website?: string
  linkedinUrl?: string
  description?: string
}

export interface UpdateCompanyDTO {
  name?: string
  website?: string
  linkedinUrl?: string
  description?: string
}

export interface CompaniesState {
  companies: Company[]
  company: Company | null
  isLoading: boolean
  error: string | null
  fetchCompanies: () => Promise<void>
  getById: (id: string) => Promise<void>
  updateCompany: (id: string, data: UpdateCompanyDTO) => Promise<void>
  createCompany: (data: CreateCompanyDTO) => Promise<Company>
}
