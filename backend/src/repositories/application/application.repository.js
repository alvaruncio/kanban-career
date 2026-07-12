import { prisma } from '../../shared/index.js'

export class ApplicationRepository {
  static async findById(id) {
    return prisma.application.findUnique({ where: { id } })
  }

  static async findAllByUserId(userId) {
    return prisma.application.findMany({
      where: { userId },
      include: {
        company: {
          select: { id: true, name: true, website: true },
        },
      },
      orderBy: { applicationDate: 'desc' },
    })
  }

  static async create(data) {
    return prisma.application.create({ data })
  }

  static async update(id, data) {
    return prisma.application.update({
      where: { id },
      data,
      include: {
        company: {
          select: { id: true, name: true, website: true },
        },
      },
    })
  }
}
