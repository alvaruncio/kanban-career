import { ApplicationService } from '../../services/index.js'

export class ApplicationController {
  static async getAll(req, res) {
    const userId = req.user.id
    const data = await ApplicationService.getAll(userId)
    return res.json(data)
  }
}
