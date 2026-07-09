import { api } from '../../services'
import type { ApplicationKanbanDTO, CreateApplicationDTO } from '../../interfaces'

export class ApplicationRepository {
  static async findAll(): Promise<ApplicationKanbanDTO[]> {
    return api.get<ApplicationKanbanDTO[]>('/applications')
  }

  static async create(data: CreateApplicationDTO): Promise<ApplicationKanbanDTO> {
    return api.post<ApplicationKanbanDTO>('/applications', data)
  }
}