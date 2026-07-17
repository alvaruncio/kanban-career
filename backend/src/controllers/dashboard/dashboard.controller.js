import { DashboardService } from '../../services/index.js'

export class DashboardController {
  static async getMetrics(req, res) {
    const userId = req.user.id
    const month = req.query.month || undefined
    const data = await DashboardService.getMetrics(userId, month)
    return res.json(data)
  }
}
