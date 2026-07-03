import { CompanyRepository } from '../../repositories/company/company.repository.js'

export class CompanyService {
  static async getAll(userId) {
    return CompanyRepository.findAllByUserId(userId)
  }
}
