import { CompanyService } from '../../services/company/company.service.js'

export class CompanyController {
  static async getAll(req, res) {
    const userId = req.user.id
    const data = await CompanyService.getAll(userId)
    return res.json(data)
  }
}
