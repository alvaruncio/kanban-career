import { MetricsRepository } from '../../repositories'
import type { DashboardMetrics } from '../../interfaces'

export class MetricsService {
  static async getDashboard(month?: string | null): Promise<DashboardMetrics> {
    return MetricsRepository.getDashboard(month)
  }
}
