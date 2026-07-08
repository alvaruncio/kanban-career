import { ApplicationRepository } from '../../repositories'

export class ApplicationService {
  static async getKanbanApplications() {
    return ApplicationRepository.findAll()
  }
}