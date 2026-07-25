import { api } from '../../services'
import type { Company, CreateCompanyDTO, UpdateCompanyDTO } from '../../interfaces'

export class CompanyRepository {
  static async findAll(): Promise<Company[]> {
    return api.get<Company[]>('/companies')
  }

  static async findById(id: string): Promise<Company> {
    return api.get<Company>(`/companies/${id}`)
  }

  static async update(id: string, data: UpdateCompanyDTO): Promise<Company> {
    return api.patch<Company>(`/companies/${id}`, data)
  }

  static async create(data: CreateCompanyDTO): Promise<Company> {
    return api.post<Company>('/companies', data)
  }
}