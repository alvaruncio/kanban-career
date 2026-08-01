import { beforeEach, vi, it, expect } from 'vitest'

beforeEach(() => {
  vi.clearAllMocks()
  vi.resetModules()
})

it('should log register start and completion events', async () => {
  const { AuthService } = await import('../../services/index.js')

  AuthService.register = vi.fn().mockResolvedValue({
    accessToken: 'test-token',
    refreshToken: 'test-refresh',
    cookieOptions: {},
    user: { id: 1, name: 'Test', email: 'test@test.com' },
  })

  const { AuthController } = await import('./auth.controller.js')

  const req = {
    body: { email: 'test@test.com', name: 'Test', password: 'secret123' },
    log: { info: vi.fn() },
  }
  const res = {
    cookie: vi.fn().mockReturnThis(),
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  }

  await AuthController.register(req, res)

  expect(req.log.info).toHaveBeenCalledWith(
    { event: 'auth:register:start', email: 'test@test.com' }
  )
  expect(req.log.info).toHaveBeenCalledWith(
    { event: 'auth:register:complete', userId: 1 }
  )
})

it('should log login attempt event', async () => {
  const { AuthService } = await import('../../services/index.js')

  AuthService.login = vi.fn().mockResolvedValue({
    accessToken: 'test-token',
    refreshToken: 'test-refresh',
    cookieOptions: {},
    user: { id: 2, name: 'User', email: 'user@test.com' },
  })

  const { AuthController } = await import('./auth.controller.js')

  const req = {
    body: { email: 'user@test.com', password: 'secret123' },
    log: { info: vi.fn() },
  }
  const res = {
    cookie: vi.fn().mockReturnThis(),
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  }

  await AuthController.login(req, res)

  expect(req.log.info).toHaveBeenCalledWith(
    { event: 'auth:login:attempt', email: 'user@test.com' }
  )
})

it('should not log password or tokens', async () => {
  const { AuthService } = await import('../../services/index.js')

  AuthService.register = vi.fn().mockResolvedValue({
    accessToken: 'test-token',
    refreshToken: 'test-refresh',
    cookieOptions: {},
    user: { id: 1, name: 'Test', email: 'test@test.com' },
  })
  AuthService.login = vi.fn().mockResolvedValue({
    accessToken: 'test-token',
    refreshToken: 'test-refresh',
    cookieOptions: {},
    user: { id: 2, name: 'User', email: 'user@test.com' },
  })

  const { AuthController } = await import('./auth.controller.js')

  const registerReq = {
    body: { email: 'test@test.com', name: 'Test', password: 'secret123' },
    log: { info: vi.fn() },
  }
  const loginReq = {
    body: { email: 'user@test.com', password: 'secret123' },
    log: { info: vi.fn() },
  }
  const res = {
    cookie: vi.fn().mockReturnThis(),
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  }

  await AuthController.register(registerReq, res)
  await AuthController.login(loginReq, res)

  const allLogCalls = [
    ...registerReq.log.info.mock.calls,
    ...loginReq.log.info.mock.calls,
  ]
  const allLogArgs = allLogCalls.map((call) => JSON.stringify(call[0]))

  const forbiddenPatterns = ['password', 'token', 'secret123']
  for (const pattern of forbiddenPatterns) {
    for (const args of allLogArgs) {
      expect(args.toLowerCase()).not.toContain(pattern)
    }
  }
})
