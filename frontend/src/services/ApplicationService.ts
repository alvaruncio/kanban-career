import { ApplicationRepository } from '../repositories/ApplicationRepository'

export class ApplicationService {
  static async getKanbanApplications() {
    return ApplicationRepository.findAll()
  }
}
