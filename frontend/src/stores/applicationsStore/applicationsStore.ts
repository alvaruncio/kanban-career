import { create } from 'zustand'
import { ApplicationService, api } from '../../services'
import type { ApplicationKanbanDTO, ApplicationsState, CreateApplicationDTO } from '../../interfaces'

export const useApplicationsStore = create<ApplicationsState>((set) => ({
  applications: [],
  isLoading: false,
  error: null,

  fetchApplications: async () => {
    set({ isLoading: true, error: null })
    try {
      const data = await ApplicationService.getKanbanApplications()
      set({ applications: data, isLoading: false })
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false })
    }
  },

  addApplication: async (app: CreateApplicationDTO) => {
    set({ isLoading: true, error: null })
    try {
      const data = await ApplicationService.create(app)
      set(state => ({ applications: [...state.applications, data], isLoading: false }))
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false })
    }
  },

  updateApplication: async (id, data) => {
    set({ isLoading: true, error: null })
    try {
      const updated = await api.patch<ApplicationKanbanDTO>(`/applications/${id}`, data)
      set(state => ({
        applications: state.applications.map(a => a.id === id ? updated : a),
        isLoading: false,
      }))
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false })
    }
  },

  deleteApplication: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await api.delete(`/applications/${id}`)
      set(state => ({
        applications: state.applications.filter(a => a.id !== id),
        isLoading: false,
      }))
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false })
    }
  },
}))