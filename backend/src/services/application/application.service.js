import { ApplicationRepository } from '../../repositories/index.js'

export class ApplicationService {
  static async getAll(userId) {
    return ApplicationRepository.findAllByUserId(userId)
  }
}
