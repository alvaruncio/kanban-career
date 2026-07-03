import { api } from '../services/api'
import type { Company } from '../interfaces/company'

export class CompanyRepository {
  static async findAll(): Promise<Company[]> {
    return api.get<Company[]>('/companies')
  }
}
