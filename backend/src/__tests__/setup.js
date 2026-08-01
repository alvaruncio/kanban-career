import { vi } from 'vitest'

const { mockLogger, mockPino } = vi.hoisted(() => {
  const logger = {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    trace: vi.fn(),
    fatal: vi.fn(),
    child: vi.fn(() => logger),
    level: 'info',
  }

  const pino = vi.fn((opts) => {
    logger.level = opts?.level || 'info'
    return logger
  })
  pino.transport = vi.fn(() => ({
    write: vi.fn(),
    on: vi.fn(),
  }))

  return { mockLogger: logger, mockPino: pino }
})

vi.mock('@prisma/client', () => {
  class PrismaClient {
    constructor() {}
  }
  return { PrismaClient }
})

vi.mock('pino', () => ({ default: mockPino }))

vi.mock('pino-http', () => {
  const middleware = vi.fn((req, _res, next) => {
    req.log = mockLogger
    mockLogger.info({ req: { method: req.method, url: req.url } }, 'request completed')
    next()
  })
  return { default: vi.fn(() => middleware) }
})
