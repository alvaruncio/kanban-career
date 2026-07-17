import { api } from '../../services'
import type { DashboardMetrics } from '../../interfaces'

export class MetricsRepository {
  static async getDashboard(month?: string | null): Promise<DashboardMetrics> {
    const endpoint = month ? `/dashboard/metrics?month=${month}` : '/dashboard/metrics'
    return api.get<DashboardMetrics>(endpoint)
  }
}
