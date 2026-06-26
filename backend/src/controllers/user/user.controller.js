import { UserService } from '../../services/user/user.service.js'
import { DEFAULTS } from '../../shared/constants.js'

export class UserController {
  static async getAll(req, res) {
    const { name, email, role } = req.query
    const limit = Number(req.query.limit) || DEFAULTS.LIMIT_PAGINATION
    const offset = Number(req.query.offset) || DEFAULTS.LIMIT_OFFSET

    const result = await UserService.getAll({ name, email, role, limit, offset })

    return res.json({ ...result, limit, offset })
  }

  static async getById(req, res) {
    const id = Number(req.params.id)
    const user = await UserService.getById(id)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const { password, ...userWithoutPassword } = user
    return res.json(userWithoutPassword)
  }

  static async create(req, res) {
    const newUser = await UserService.create(req.body)

    const { password, ...userWithoutPassword } = newUser
    return res.status(201).json(userWithoutPassword)
  }

  static async update(req, res) {
    const id = Number(req.params.id)
    const user = await UserService.getById(id)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const updated = await UserService.update(id, req.body)

    const { password, ...userWithoutPassword } = updated
    return res.json(userWithoutPassword)
  }

  static async delete(req, res) {
    const id = Number(req.params.id)
    const user = await UserService.getById(id)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    await UserService.delete(id)

    return res.status(204).send()
  }
}
