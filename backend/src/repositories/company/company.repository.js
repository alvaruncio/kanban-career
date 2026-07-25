import { prisma } from '../../shared/index.js'

export class CompanyRepository {
  static async findAllByUserId(userId) {
    return prisma.company.findMany({
      where: { userId, deletedAt: null },
      orderBy: { name: 'asc' },
    })
  }

  static async findById(id) {
    return prisma.company.findFirst({
      where: { id, deletedAt: null },
    })
  }

  static async create(data) {
    return prisma.company.create({ data })
  }

  static async update(id, data) {
    return prisma.company.update({
      where: { id },
      data,
    })
  }
}
