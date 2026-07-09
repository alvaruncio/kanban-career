import { ApplicationRepository } from '../../repositories'
import type { ApplicationKanbanDTO } from '../../interfaces'
import type { ApplicationFormData } from '../../models'

export class ApplicationService {
  static async getKanbanApplications(): Promise<ApplicationKanbanDTO[]> {
    return ApplicationRepository.findAll()
  }

  static async create(data: ApplicationFormData): Promise<ApplicationKanbanDTO> {
    return ApplicationRepository.create(data)
  }
}