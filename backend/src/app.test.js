import { beforeEach, vi, it, expect } from 'vitest'

beforeEach(() => {
  vi.clearAllMocks()
  vi.resetModules()
})

it('should register httpLogger as the first middleware', async () => {
  const supertest = (await import('supertest')).default
  const pinoHttpModule = await import('pino-http')
  const pinoHttp = pinoHttpModule.default
  const appModule = await import('./app.js')
  const app = appModule.default

  const res = await supertest(app).get('/health')

  expect(res.status).toBe(200)

  const middleware = pinoHttp.mock.results[0].value
  expect(middleware).toHaveBeenCalled()

  const stack = app.router.stack
  expect(stack.length).toBeGreaterThan(0)
  expect(stack[0].handle).toBe(middleware)
})

it('should return 200 with a log entry for GET /health', async () => {
  const supertest = (await import('supertest')).default
  const appModule = await import('./app.js')
  const app = appModule.default

  const res = await supertest(app).get('/health')
  expect(res.status).toBe(200)
  expect(res.body).toHaveProperty('status', 'ok')

  const shared = await import('./shared/index.js')
  expect(shared.logger.info).toHaveBeenCalled()
})

it('should return 200 for GET /', async () => {
  const supertest = (await import('supertest')).default
  const appModule = await import('./app.js')
  const app = appModule.default

  const res = await supertest(app).get('/')
  expect(res.status).toBe(200)
})

it('should log errors via req.log.error and return a formatted 500 response', async () => {
  const express = (await import('express')).default
  const supertest = (await import('supertest')).default
  const shared = await import('./shared/index.js')
  const { httpLogger } = shared
  const { errorHandler } = await import('./app.js')
  const _consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

  const testApp = express()
  testApp.use(httpLogger)
  testApp.get('/boom', () => {
    throw new Error('boom')
  })
  testApp.use(errorHandler)

  const res = await supertest(testApp).get('/boom')

  expect(res.status).toBe(500)
  expect(res.body).toHaveProperty('error', 'boom')
  expect(shared.logger.error).toHaveBeenCalled()
})
