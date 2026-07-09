import { CompanyRepository } from '../../repositories/index.js'

export class CompanyService {
  static async getAll(userId) {
    return CompanyRepository.findAllByUserId(userId)
  }
}
