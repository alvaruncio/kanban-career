import { beforeEach, vi, it, expect } from 'vitest'

const { mockRepo } = vi.hoisted(() => ({
  mockRepo: {
    findById: vi.fn(),
    findByEmail: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
  },
}))

const { mockJwt } = vi.hoisted(() => ({
  mockJwt: {
    verify: vi.fn(),
    sign: vi.fn(() => 'new-token'),
  },
}))

vi.mock('../../repositories/index.js', () => ({
  AuthRepository: mockRepo,
}))

const { mockBcrypt } = vi.hoisted(() => ({
  mockBcrypt: {
    hash: vi.fn(() => '$2b$12$newhashedpassword'),
    compare: vi.fn(() => true),
  },
}))

vi.mock('bcrypt', () => ({ default: mockBcrypt }))

vi.mock('jsonwebtoken', () => ({ default: mockJwt }))

beforeEach(() => {
  vi.clearAllMocks()
  vi.resetModules()
})

it('should log refresh attempt and success events', async () => {
  mockRepo.findById.mockResolvedValue({
    id: 1,
    name: 'Test',
    email: 'test@test.com',
    role: 'USER',
    avatarUrl: null,
  })
  mockJwt.verify.mockReturnValue({ id: 1 })

  const shared = await import('../../shared/index.js')
  const { AuthService } = await import('./auth.service.js')

  await AuthService.refresh('test-refresh-token')

  expect(shared.logger.info).toHaveBeenCalledWith(
    { event: 'auth:refresh:attempt', userId: 1 }
  )
  expect(shared.logger.info).toHaveBeenCalledWith(
    { event: 'auth:refresh:success', userId: 1 }
  )
})

it('should log password update event without passwords', async () => {
  const now = new Date()
  mockRepo.findById.mockResolvedValue({
    id: 1,
    name: 'Test',
    email: 'test@test.com',
    role: 'USER',
    password: '$2b$12$hashedpassword',
    createdAt: now,
  })
  mockRepo.update.mockResolvedValue({
    id: 1,
    name: 'Test',
    email: 'test@test.com',
    role: 'USER',
    createdAt: now,
  })

  const shared = await import('../../shared/index.js')
  const { AuthService } = await import('./auth.service.js')

  await AuthService.updatePassword(1, {
    currentPassword: 'old-secret',
    newPassword: 'new-secret',
  })

  expect(shared.logger.info).toHaveBeenCalledWith(
    { event: 'auth:password:updated', userId: 1 }
  )

  const logCall = shared.logger.info.mock.calls.find(
    (call) => call[0]?.event === 'auth:password:updated'
  )
  expect(logCall).toBeDefined()
  if (logCall) {
    const payload = JSON.stringify(logCall[0])
    expect(payload).not.toContain('currentPassword')
    expect(payload).not.toContain('newPassword')
    expect(payload).not.toContain('old-secret')
    expect(payload).not.toContain('new-secret')
  }
})
