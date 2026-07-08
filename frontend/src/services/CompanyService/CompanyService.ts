import { CompanyRepository } from '../../repositories'

export class CompanyService {
  static async getAll() {
    return CompanyRepository.findAll()
  }
}