# Service Pattern

Services handle **business logic and use-case orchestration**. They coordinate repositories, external services, cache, and third-party APIs. No `req`/`res` access, no direct Prisma calls.

```js
import { JobRepository } from '../repositories/job/job.repository.js'

export class JobService {
  static async getAll({ text, title, level, limit = 10, technology, offset = 0 }) {
    const where = {}

    if (text) {
      where.OR = [
        { titulo: { contains: text, mode: 'insensitive' } },
        { descripcion: { contains: text, mode: 'insensitive' } },
      ]
    }

    if (technology) {
      where.data = { path: ['technology'], equals: technology }
    }

    const [data, total] = await Promise.all([
      JobRepository.findMany(where, { skip: offset, take: limit }),
      JobRepository.count(where),
    ])

    return { data, total }
  }

  static async getById(id) {
    return JobRepository.findById(id)
  }

  static async create(input) {
    return JobRepository.create(input)
  }
}
```
