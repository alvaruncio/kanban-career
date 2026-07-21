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

  static async deleteById(id) {
    return prisma.application.delete({ where: { id } })
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

  static _buildMonthFilter(month) {
    if (!month) return undefined

    const [year, monthNum] = month.split('-').map(Number)
    const firstDay = new Date(year, monthNum - 1, 1)
    const lastDay = new Date(year, monthNum, 0, 23, 59, 59, 999)

    return {
      applicationDate: {
        gte: firstDay,
        lte: lastDay,
      },
    }
  }

  static async getStatusCounts(userId, month) {
    return prisma.application.groupBy({
      by: ['status'],
      _count: true,
      where: { userId, ...ApplicationRepository._buildMonthFilter(month) },
    })
  }

  static async getMonthlyCounts(userId, month) {
    return prisma.application.findMany({
      where: { userId, ...ApplicationRepository._buildMonthFilter(month) },
      select: { applicationDate: true },
    })
  }

  static async getSourceCounts(userId, month) {
    return prisma.application.groupBy({
      by: ['source'],
      _count: true,
      where: { userId, ...ApplicationRepository._buildMonthFilter(month) },
    })
  }

  static async getCategoryCounts(userId, month) {
    return prisma.application.groupBy({
      by: ['category'],
      _count: true,
      where: { userId, ...ApplicationRepository._buildMonthFilter(month) },
    })
  }

  static async getRecentApplications(userId, month, limit = 10) {
    return prisma.application.findMany({
      where: { userId, ...ApplicationRepository._buildMonthFilter(month) },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        company: {
          select: { name: true },
        },
      },
    })
  }
}
