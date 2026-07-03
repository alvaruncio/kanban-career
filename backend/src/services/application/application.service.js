import { ApplicationRepository } from '../../repositories/application/application.repository.js'

export class ApplicationService {
  static async getAll(userId) {
    return ApplicationRepository.findAllByUserId(userId)
  }
}
