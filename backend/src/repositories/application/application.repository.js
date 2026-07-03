import prisma from '../../shared/prisma.js'

export class ApplicationRepository {
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
}
