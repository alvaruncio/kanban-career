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

  static async getById(req, res) {
    const userId = req.user.id
    const { id } = req.params
    const company = await CompanyService.getById(id, userId)
    if (!company) {
      return res.status(404).json({ error: 'Compañía no encontrada' })
    }
    return res.json(company)
  }

  static async update(req, res) {
    const userId = req.user.id
    const { id } = req.params
    const company = await CompanyService.update(id, userId, req.body)
    if (!company) {
      return res.status(404).json({ error: 'Compañía no encontrada' })
    }
    return res.json(company)
  }
}
