import prisma from '../../shared/prisma.js'

export class CompanyRepository {
  static async findAllByUserId(userId) {
    return prisma.company.findMany({
      where: { userId, deletedAt: null },
      orderBy: { name: 'asc' },
    })
  }
}
