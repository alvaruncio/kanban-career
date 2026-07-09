import { ApplicationRepository } from '../../repositories'
import type { CreateApplicationDTO, ApplicationKanbanDTO } from '../../interfaces'

export class ApplicationService {
  static async getKanbanApplications(): Promise<ApplicationKanbanDTO[]> {
    return ApplicationRepository.findAll()
  }

  static async create(data: CreateApplicationDTO): Promise<ApplicationKanbanDTO> {
    return ApplicationRepository.create(data)
  }
}