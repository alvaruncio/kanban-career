import { ApplicationService } from '../../services/index.js'

export class ApplicationController {
  static async getAll(req, res) {
    const userId = req.user.id
    const data = await ApplicationService.getAll(userId)
    return res.json(data)
  }

  static async create(req, res) {
    const userId = req.user.id
    const application = await ApplicationService.create({ userId, ...req.body })
    return res.status(201).json(application)
  }

  static async delete(req, res) {
    const userId = req.user.id
    const { id } = req.params
    const deleted = await ApplicationService.deleteApplication(id, userId)
    if (!deleted) {
      return res.status(404).json({ error: 'Candidatura no encontrada' })
    }
    return res.status(204).send()
  }

  static async update(req, res) {
    const userId = req.user.id
    const { id } = req.params
    const application = await ApplicationService.update(id, userId, req.body)
    if (!application) {
      return res.status(404).json({ error: 'Candidatura no encontrada' })
    }
    return res.json(application)
  }
}
