import { ApplicationRepository } from '../../repositories/index.js'

export class DashboardService {
  static async getMetrics(userId, month) {
    const [statusCounts, monthlyDates, sourceCounts, categoryCounts, recentApplications] =
      await Promise.all([
        ApplicationRepository.getStatusCounts(userId, month),
        ApplicationRepository.getMonthlyCounts(userId, month),
        ApplicationRepository.getSourceCounts(userId, month),
        ApplicationRepository.getCategoryCounts(userId, month),
        ApplicationRepository.getRecentApplications(userId, month),
      ])

    const totalApplications = statusCounts.reduce((sum, s) => sum + s._count, 0)

    const appliedCount = statusCounts.find(s => s.status === 'APPLIED')?._count ?? 0
    const interviewCount = statusCounts.find(s => s.status === 'INTERVIEW')?._count ?? 0
    const offerCount = statusCounts.find(s => s.status === 'OFFER')?._count ?? 0
    const hiredCount = statusCounts.find(s => s.status === 'HIRED')?._count ?? 0
    const rejectedCount = statusCounts.find(s => s.status === 'REJECTED')?._count ?? 0

    const activeApplications = appliedCount + interviewCount + offerCount
    const pendingInterviews = interviewCount
    const offersReceived = offerCount
    const totalWithResponse = interviewCount + offerCount + hiredCount + rejectedCount
    const responseRate = totalApplications > 0
      ? Number(((totalWithResponse / totalApplications) * 100).toFixed(1))
      : 0

    const byStatus = statusCounts.map(s => ({
      status: s.status,
      count: s._count,
      percentage: totalApplications > 0 ? Number(((s._count / totalApplications) * 100).toFixed(1)) : 0,
    }))

    const monthlyMap = {}
    for (const app of monthlyDates) {
      const d = new Date(app.applicationDate)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      monthlyMap[key] = (monthlyMap[key] || 0) + 1
    }
    const byMonth = Object.entries(monthlyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([monthKey, count]) => ({ month: monthKey, count }))

    const bySource = sourceCounts.map(s => ({
      source: s.source,
      count: s._count,
      percentage: totalApplications > 0 ? Number(((s._count / totalApplications) * 100).toFixed(1)) : 0,
    }))

    const byCategory = categoryCounts.map(c => ({
      category: c.category,
      count: c._count,
      percentage: totalApplications > 0 ? Number(((c._count / totalApplications) * 100).toFixed(1)) : 0,
    }))

    const maxCount = statusCounts.reduce((max, s) => Math.max(max, s._count), 0)
    const statusOrder = ['APPLIED', 'INTERVIEW', 'OFFER', 'HIRED']
    const conversionFunnel = statusOrder
      .map(stage => {
        const entry = statusCounts.find(s => s.status === stage)
        if (!entry) return null
        return {
          stage: entry.status,
          count: entry._count,
          rate: maxCount > 0 ? Number(((entry._count / maxCount) * 100).toFixed(1)) : 0,
        }
      })
      .filter(Boolean)

    return {
      totalApplications,
      activeApplications,
      pendingInterviews,
      offersReceived,
      hiredCount,
      rejectedCount,
      responseRate,
      byStatus,
      byMonth,
      bySource,
      byCategory,
      conversionFunnel,
      recentApplications: recentApplications.map(app => ({
        id: app.id,
        jobTitle: app.jobTitle,
        companyName: app.company.name,
        status: app.status,
        createdAt: app.createdAt,
      })),
    }
  }
}
