import { beforeEach, vi, it, expect } from 'vitest'

beforeEach(() => {
  vi.unstubAllEnvs()
  vi.clearAllMocks()
  vi.resetModules()
})

it('should respect PINO_LOG_LEVEL env var', async () => {
  vi.stubEnv('PINO_LOG_LEVEL', 'debug')
  const { logger } = await import('./logger.js')
  expect(logger.level).toBe('debug')
})

it('should default to info when PINO_LOG_LEVEL is not set', async () => {
  const { logger } = await import('./logger.js')
  expect(logger.level).toBe('info')
})

it('should configure dual transport in development', async () => {
  vi.stubEnv('NODE_ENV', 'development')
  const pinoModule = await import('pino')
  await import('./logger.js')
  const defaultExport = pinoModule.default
  expect(defaultExport).toHaveBeenCalled()
  expect(defaultExport.transport).toHaveBeenCalled()
  const transportCall = defaultExport.transport.mock.calls[0][0]
  expect(transportCall.targets).toHaveLength(2)
  expect(transportCall.targets[0].target).toBe('pino/file')
  expect(transportCall.targets[1].target).toBe('pino-pretty')
})

it('should log to stdout without transport in production', async () => {
  vi.stubEnv('NODE_ENV', 'production')
  vi.clearAllMocks()
  vi.resetModules()
  const pinoModule = await import('pino')
  await import('./logger.js')
  const defaultExport = pinoModule.default
  expect(defaultExport.transport).not.toHaveBeenCalled()
  expect(defaultExport).toHaveBeenCalled()
})

it('should export logger and httpLogger from the barrel', async () => {
  const shared = await import('../index.js')
  expect(shared.logger).toBeDefined()
  expect(typeof shared.httpLogger).toBe('function')
})
