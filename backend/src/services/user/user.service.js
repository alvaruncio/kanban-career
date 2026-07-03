import bcrypt from 'bcrypt'
import { UserRepository } from '../../repositories/user/user.repository.js'
import { DEFAULTS } from '../../shared/constants.js'

export class UserService {
  static async getAll({ name, email, role, limit = DEFAULTS.LIMIT_PAGINATION, offset = DEFAULTS.LIMIT_OFFSET }) {
    const where = { deletedAt: null }

    if (name) where.name = { contains: name, mode: 'insensitive' }
    if (email) where.email = { contains: email, mode: 'insensitive' }
    if (role) where.role = role

    const [data, total] = await Promise.all([
      UserRepository.findMany(where, { skip: offset, take: limit, orderBy: { createdAt: 'desc' } }),
      UserRepository.count(where),
    ])

    return { data, total }
  }

  static async getById(id) {
    return UserRepository.findById(id)
  }

  static async create(input) {
    const hashedPassword = await bcrypt.hash(input.password, DEFAULTS.SALT_ROUNDS)

    return UserRepository.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: input.role ?? 'USER',
    })
  }

  static async update(id, input) {
    const data = {}

    if (input.name !== undefined) data.name = input.name
    if (input.email !== undefined) data.email = input.email
    if (input.role !== undefined) data.role = input.role
    if (input.password !== undefined) {
      data.password = await bcrypt.hash(input.password, DEFAULTS.SALT_ROUNDS)
    }
    return UserRepository.update(id, data)
  }

  static async delete(id) {
    return UserRepository.softDelete(id)
  }
}
