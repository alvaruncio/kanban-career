import { create } from 'zustand'
import { CompanyService } from '../services/CompanyService'
import type { CompaniesState } from '../interfaces/company'

export const useCompaniesStore = create<CompaniesState>((set) => ({
  companies: [],
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
}))
