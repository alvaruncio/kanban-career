import { beforeEach, vi, it, expect } from 'vitest'

const { mockRepo } = vi.hoisted(() => ({
  mockRepo: {
    findMany: vi.fn(),
    count: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    softDelete: vi.fn(),
  },
}))

const { mockBcrypt } = vi.hoisted(() => ({
  mockBcrypt: {
    hash: vi.fn((pwd) => `$2b$12$${pwd}`),
    compare: vi.fn(),
  },
}))

vi.mock('../../repositories/index.js', () => ({
  UserRepository: mockRepo,
}))

vi.mock('bcrypt', () => ({ default: mockBcrypt }))

beforeEach(() => {
  vi.clearAllMocks()
  vi.resetModules()
})

// --- getAll ---

it('should return paginated users with filters', async () => {
  const users = [{ id: 1, name: 'Alice', email: 'alice@test.com', role: 'USER' }]
  mockRepo.findMany.mockResolvedValue(users)
  mockRepo.count.mockResolvedValue(1)

  const { UserService } = await import('./user.service.js')
  const result = await UserService.getAll({ name: 'Ali', role: 'USER', limit: 10, offset: 0 })

  expect(mockRepo.findMany).toHaveBeenCalledWith(
    { deletedAt: null, name: { contains: 'Ali', mode: 'insensitive' }, role: 'USER' },
    { skip: 0, take: 10, orderBy: { createdAt: 'desc' } }
  )
  expect(mockRepo.count).toHaveBeenCalledWith(
    { deletedAt: null, name: { contains: 'Ali', mode: 'insensitive' }, role: 'USER' }
  )
  expect(result).toEqual({ data: users, total: 1 })
})

it('should return all users when no filters provided', async () => {
  const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
  mockRepo.findMany.mockResolvedValue(users)
  mockRepo.count.mockResolvedValue(2)

  const { UserService } = await import('./user.service.js')
  const result = await UserService.getAll({})

  expect(mockRepo.findMany).toHaveBeenCalledWith(
    { deletedAt: null },
    { skip: 0, take: 10, orderBy: { createdAt: 'desc' } }
  )
  expect(result.data).toHaveLength(2)
  expect(result.total).toBe(2)
})

// --- getById ---

it('should return user by id when found', async () => {
  const user = { id: 1, name: 'Alice', email: 'alice@test.com' }
  mockRepo.findById.mockResolvedValue(user)

  const { UserService } = await import('./user.service.js')
  const result = await UserService.getById(1)

  expect(mockRepo.findById).toHaveBeenCalledWith(1)
  expect(result).toEqual(user)
})

it('should return null when user not found', async () => {
  mockRepo.findById.mockResolvedValue(null)

  const { UserService } = await import('./user.service.js')
  const result = await UserService.getById(999)

  expect(result).toBeNull()
})

// --- create ---

it('should hash password and create user with default role', async () => {
  const input = { name: 'Alice', email: 'alice@test.com', password: 'secret123' }
  const created = { id: 1, name: 'Alice', email: 'alice@test.com', role: 'USER', password: '$2b$12$secret123' }
  mockRepo.create.mockResolvedValue(created)

  const { UserService } = await import('./user.service.js')
  const result = await UserService.create(input)

  expect(mockBcrypt.hash).toHaveBeenCalledWith('secret123', 12)
  expect(mockRepo.create).toHaveBeenCalledWith({
    name: 'Alice',
    email: 'alice@test.com',
    password: '$2b$12$secret123',
    role: 'USER',
  })
  expect(result).toEqual(created)
})

it('should use provided role when creating user', async () => {
  const input = { name: 'Admin', email: 'admin@test.com', password: 'pwd', role: 'ADMIN' }
  mockRepo.create.mockResolvedValue({ id: 2, ...input })

  const { UserService } = await import('./user.service.js')
  await UserService.create(input)

  expect(mockRepo.create).toHaveBeenCalledWith(
    expect.objectContaining({ role: 'ADMIN' })
  )
})

// --- update ---

it('should update user fields and hash password when provided', async () => {
  const input = { name: 'Alice Updated', password: 'newsecret' }
  const updated = { id: 1, name: 'Alice Updated', password: '$2b$12$newsecret' }
  mockRepo.update.mockResolvedValue(updated)

  const { UserService } = await import('./user.service.js')
  const result = await UserService.update(1, input)

  expect(mockBcrypt.hash).toHaveBeenCalledWith('newsecret', 12)
  expect(mockRepo.update).toHaveBeenCalledWith(1, {
    name: 'Alice Updated',
    password: '$2b$12$newsecret',
  })
  expect(result).toEqual(updated)
})

it('should update only provided fields', async () => {
  const input = { email: 'new@test.com' }
  mockRepo.update.mockResolvedValue({ id: 1, email: 'new@test.com' })

  const { UserService } = await import('./user.service.js')
  await UserService.update(1, input)

  expect(mockRepo.update).toHaveBeenCalledWith(1, { email: 'new@test.com' })
  expect(mockBcrypt.hash).not.toHaveBeenCalled()
})

// --- delete ---

it('should soft delete user', async () => {
  mockRepo.softDelete.mockResolvedValue({ id: 1, deletedAt: new Date() })

  const { UserService } = await import('./user.service.js')
  await UserService.delete(1)

  expect(mockRepo.softDelete).toHaveBeenCalledWith(1)
})
