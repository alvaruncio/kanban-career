import { api } from '../services/api'
import type { ApplicationKanbanDTO } from '../interfaces/application'

export class ApplicationRepository {
  static async findAll(): Promise<ApplicationKanbanDTO[]> {
    return api.get<ApplicationKanbanDTO[]>('/applications')
  }
}
