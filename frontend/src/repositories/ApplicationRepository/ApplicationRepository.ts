import { api } from '../../services'
import type { ApplicationKanbanDTO } from '../../interfaces'

export class ApplicationRepository {
  static async findAll(): Promise<ApplicationKanbanDTO[]> {
    return api.get<ApplicationKanbanDTO[]>('/applications')
  }
}