import { CompanyService } from '../../services/index.js'

export class CompanyController {
  static async getAll(req, res) {
    const userId = req.user.id
    const data = await CompanyService.getAll(userId)
    return res.json(data)
  }

  static async create(req, res) {
    const userId = req.user.id
    const company = await CompanyService.create(userId, req.body)
    return res.status(201).json(company)
  }
}
