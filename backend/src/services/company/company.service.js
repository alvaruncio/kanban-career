import { CompanyRepository } from '../../repositories/index.js'

export class CompanyService {
  static async getAll(userId) {
    return CompanyRepository.findAllByUserId(userId)
  }

  static async create(userId, data) {
    return CompanyRepository.create({ ...data, userId })
  }

  static async getById(id, userId) {
    const company = await CompanyRepository.findById(id)
    if (!company || company.userId !== userId) {
      return null
    }
    return company
  }

  static async update(id, userId, data) {
    const company = await CompanyRepository.findById(id)
    if (!company || company.userId !== userId) {
      return null
    }
    return CompanyRepository.update(id, data)
  }
}
