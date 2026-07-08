import { api } from '../../services'
import type { Company } from '../../interfaces'

export class CompanyRepository {
  static async findAll(): Promise<Company[]> {
    return api.get<Company[]>('/companies')
  }
}