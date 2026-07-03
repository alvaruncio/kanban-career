# Repository Pattern

Repositories handle **only** database queries and persistence operations via Prisma. No business logic, validations, permissions, or transformations.

```js
import prisma from '../shared/prisma.js'

export class UserRepository {
  static async findMany(where, { skip, take, orderBy }) {
    return prisma.user.findMany({ where, skip, take, orderBy })
  }

  static async count(where) {
    return prisma.user.count({ where })
  }

  static async findById(id) {
    return prisma.user.findFirst({ where: { id, deletedAt: null } })
  }

  static async create(data) {
    return prisma.user.create({ data })
  }

  static async update(id, data) {
    return prisma.user.update({ where: { id }, data })
  }

  static async softDelete(id) {
    return prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }
}
```
