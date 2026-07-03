import { CompanyRepository } from '../repositories/CompanyRepository'

export class CompanyService {
  static async getAll() {
    return CompanyRepository.findAll()
  }
}
