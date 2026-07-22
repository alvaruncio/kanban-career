import { prisma } from '../../shared/index.js'

export class AuthRepository {
  static async findByEmail(email) {
    return prisma.user.findUnique({ where: { email } })
  }

  static async findById(id, select) {
    return prisma.user.findUnique({ where: { id }, ...(select && { select }) })
  }

  static async create(data) {
    return prisma.user.create({ data })
  }

  static async update(id, data) {
    return prisma.user.update({ where: { id }, data })
  }
}
