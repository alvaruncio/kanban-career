import { ApplicationRepository } from '../../repositories/index.js'

export class ApplicationService {
  static async getAll(userId) {
    return ApplicationRepository.findAllByUserId(userId)
  }

  static async create({ userId, ...input }) {
    return ApplicationRepository.create({
      ...input,
      userId,
      status: 'APPLIED',
    })
  }

  static async deleteApplication(id, userId) {
    const existing = await ApplicationRepository.findById(id)
    if (!existing || existing.userId !== userId) {
      return null
    }
    return ApplicationRepository.deleteById(id)
  }

  static async update(id, userId, data) {
    const existing = await ApplicationRepository.findById(id)
    if (!existing || existing.userId !== userId) {
      return null
    }
    return ApplicationRepository.update(id, data)
  }
}
