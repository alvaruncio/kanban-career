import { api } from '../../services'
import type { ApplicationKanbanDTO } from '../../interfaces'
import type { ApplicationFormData } from '../../models'

export class ApplicationRepository {
  static async findAll(): Promise<ApplicationKanbanDTO[]> {
    return api.get<ApplicationKanbanDTO[]>('/applications')
  }

  static async findById(id: string): Promise<ApplicationKanbanDTO> {
    return api.get<ApplicationKanbanDTO>(`/applications/${id}`)
  }

  static async findByCompanyId(companyId: string): Promise<ApplicationKanbanDTO[]> {
    return api.get<ApplicationKanbanDTO[]>('/applications', { params: { companyId } })
  }

  static async create(data: ApplicationFormData): Promise<ApplicationKanbanDTO> {
    return api.post<ApplicationKanbanDTO>('/applications', data)
  }
}