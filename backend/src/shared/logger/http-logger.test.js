import { beforeEach, vi, it, expect } from 'vitest'

beforeEach(() => {
  vi.clearAllMocks()
  vi.resetModules()
})

it('should export httpLogger as a middleware function', async () => {
  const { httpLogger } = await import('./http-logger.js')
  expect(typeof httpLogger).toBe('function')
  expect(httpLogger).toHaveLength(3)
})

it('should attach logger from pino-http options', async () => {
  const { httpLogger } = await import('./http-logger.js')
  const req = { method: 'GET', url: '/test' }
  const res = { statusCode: 200 }
  const next = vi.fn()

  httpLogger(req, res, next)

  expect(next).toHaveBeenCalled()
  expect(req.log).toBeDefined()
})

it('should use customLogLevel based on status code', async () => {
  const pinoHttpModule = await import('pino-http')
  const pinoHttp = pinoHttpModule.default

  await import('./http-logger.js')

  expect(pinoHttp).toHaveBeenCalled()
  const options = pinoHttp.mock.calls[0][0]
  expect(options).toHaveProperty('logger')
  expect(options).toHaveProperty('customLogLevel')

  const { customLogLevel } = options

  expect(customLogLevel({}, { statusCode: 500 }, undefined)).toBe('error')
  expect(customLogLevel({}, { statusCode: 401 }, undefined)).toBe('warn')
  expect(customLogLevel({}, { statusCode: 404 }, undefined)).toBe('warn')
  expect(customLogLevel({}, { statusCode: 200 }, undefined)).toBe('info')
  expect(customLogLevel({}, { statusCode: 302 }, undefined)).toBe('info')
})
