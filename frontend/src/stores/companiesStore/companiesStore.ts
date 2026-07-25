import { create } from 'zustand'
import { CompanyService } from '../../services'
import type { CompaniesState, CreateCompanyDTO, UpdateCompanyDTO } from '../../interfaces'

export const useCompaniesStore = create<CompaniesState>((set) => ({
  companies: [],
  company: null,
  isLoading: false,
  error: null,

  fetchCompanies: async () => {
    set({ isLoading: true, error: null })
    try {
      const data = await CompanyService.getAll()
      set({ companies: data, isLoading: false })
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false })
    }
  },

  getById: async (id: string) => {
    set({ company: null, isLoading: true, error: null })
    try {
      const data = await CompanyService.getById(id)
      set({ company: data, isLoading: false })
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false })
    }
  },

  updateCompany: async (id: string, data: UpdateCompanyDTO) => {
    set({ isLoading: true, error: null })
    try {
      const updated = await CompanyService.update(id, data)
      set(state => ({
        company: updated,
        companies: state.companies.map(c => c.id === id ? updated : c),
        isLoading: false,
      }))
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false })
    }
  },

  createCompany: async (data: CreateCompanyDTO) => {
    set({ isLoading: true, error: null })
    try {
      const created = await CompanyService.create(data)
      set(state => ({
        companies: [...state.companies, created],
        isLoading: false,
      }))
      return created
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false })
      throw err
    }
  },
}))