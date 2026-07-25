import { CompanyRepository } from '../../repositories'
import type { Company, CreateCompanyDTO, UpdateCompanyDTO } from '../../interfaces'

export class CompanyService {
  static async getAll(): Promise<Company[]> {
    return CompanyRepository.findAll()
  }

  static async getById(id: string): Promise<Company> {
    return CompanyRepository.findById(id)
  }

  static async update(id: string, data: UpdateCompanyDTO): Promise<Company> {
    return CompanyRepository.update(id, data)
  }

  static async create(data: CreateCompanyDTO): Promise<Company> {
    return CompanyRepository.create(data)
  }
}